"use client"

import { useState, createContext, SetStateAction, Dispatch, useContext } from 'react';
import moment from 'moment'; // Moment
import { useRTC } from './RTCMultiConnectionContext';
import { useChatStore, useMessageStore } from '@/context/ChatStoreContext';
import { chunkSize } from '@/utils/const';

type MessageContextType = {
    useMessage: () => void,
    connection: RTCMultiConnection | null,
    speak: SpeakData | undefined,
    setSpeak: Dispatch<SetStateAction<SpeakData | undefined>>
    unReadMessageCount: number,
    setUnReadMessageCount: Dispatch<SetStateAction<number>>,
    setSystemMessage: (event: ConnectionLeaveEvent) => void
    sendMultipleFile: (files: File[]) => void
};

interface FileInfo {
    name: string;
    size: number;
    type: string;
    lastModifiedDate: string;
    uuid: string;
    userid: string;
    remoteUserId: string;
}


export const MessageContext = createContext<MessageContextType | null>(null);

// RTCMultiConnection의 데이터채널 메시지 데이터 및 이벤트 접근을 위한 커스텀 훅
export const useMessage = () => {
    const context = useContext(MessageContext);
      if (!context) throw new Error("useMessage must be used within MessageProvider");
      return context;
}

export function MessageProvider({ children }: { children: React.ReactNode }) {
    const { connection } = useRTC();
    const [ speak, setSpeak ] = useState<SpeakData | undefined>();
    const [ unReadMessageCount, setUnReadMessageCount ] = useState<number>(0);
    const addMessage = useMessageStore((state) => state.addMessage);
    const resetDividerMessage = useMessageStore((state) => state.resetDividerMessage);
    const addFileMessage = useMessageStore((state) => state.addFileMessage);
    const isChatActive = useChatStore((state) => state.isChatActive);
    const [ progressFileUuid, setProgressFileUuid ] = useState('');

    const setSystemMessage = (event: ConnectionLeaveEvent): void => {
        const systemMessage: MessageData = {
            type: 'systemMessage',
            text: `${event?.extra?.displayName}님이 방을 나갔습니다.`,
            displayName: connection?.extra?.displayName,
            profileUrl: connection?.extra?.profileUrl,
            timeStamp: moment()
        };
        resetDividerMessage();
        addMessage(systemMessage);
    };

    // 파일 공유 시작 메시지 세팅
    const OnFileShareStart = (file: any) => {
        if(connection){
            const extra = connection.getExtraData(file.userid);
            const fileMessage = {
                type: 'textMessage',
                text:
                    connection?.userid === file.userid
                    ? `파일 전송중...`
                    : `${extra.displayName}님이 파일 전송중...`,
                userid: file.userid,
                displayName: extra.displayName,
                profileUrl: extra.profileUrl,
                file
            };
            resetDividerMessage();
            addFileMessage(fileMessage);
            // console.log('파일 공유 시작:', file);
        }
    };

    // 파일 공유 종료 메시지 세팅
    const  OnFileShareEnd = (file: any) => {
        if(connection){
            const extra = connection.getExtraData(file.userid);
            const fileMessage = {
                type: 'textMessage',
                text: file?.name,
                userid: file.userid,
                displayName: extra.displayName,
                profileUrl: extra.profileUrl,
                file
            };
            resetDividerMessage();
            addFileMessage(fileMessage);
            if (!isChatActive && file.extra.userid !== connection.userid) {
                setUnReadMessageCount((count) => count + 1);
            }
            // 파일 공유 종료 시 현재 진행 중인 파일 UUID 초기화
            if (progressFileUuid === file.uuid) {
                setProgressFileUuid('');
            }
            // console.log('파일 공유 종료:', file.uuid);
        }
    }

    // 파일 공유 진행 상태 세팅
    const OnFileShareProgress = (file: any) => {
        const progress = file.currentPosition >= file.maxChunks - 1
            ? 100
            : Math.round((file.currentPosition * 100) / file.maxChunks);
        // React 상태 업데이트 없이 DOM 직접 조작
        const progressBars = document.querySelectorAll(`[data-file-uuid="${file.uuid}"]`);
        progressBars.forEach((progressBar) => {
        // LinearProgress의 내부 bar 요소 찾아서 직접 width 조정
        const barElement = progressBar.querySelector('.MuiLinearProgress-bar') as HTMLElement;
        if (barElement) {
            barElement.style.transform = `translateX(-${100 - progress}%)`;
        }
        });
        // console.log('파일 공유 진행중:', progress, '%');
    }

     // 데이터 채널 전송 관리 함수
    const sendAsync = (channel: RTCDataChannel, data: string): Promise<void> =>
        new Promise((resolve, reject) => {
            try {
                if (channel.bufferedAmount < channel.bufferedAmountLowThreshold) {
                    channel.send(data);
                    resolve();
                } else {
                    // 버퍼가 가득 찬 경우 bufferedamountlow 이벤트 대기
                    const onBufferLow = () => {
                        channel.removeEventListener("bufferedamountlow", onBufferLow);
                        try {
                            channel.send(data);
                            resolve();
                        } catch (error) {
                            console.error("Send error:", error);
                            reject(error);
                        }
                    };
                    channel.addEventListener("bufferedamountlow", onBufferLow);
                }
            } catch (error) {
                console.error("Send error:", error);
                reject(error);
            }
    });

    // 병렬 데이터 채널 파일 전송 함수
    const sendMultipleFile = (files: File[]): void => {
        if(connection){
            connection.getAllParticipants().forEach((remoteUserId) => {
            files.forEach((file) => {
                const channel = connection.peers[remoteUserId].createDataChannel("Parallel", {});
                channel.bufferedAmountLowThreshold = chunkSize; // 16KB 같은 임계값
                channel.addEventListener("open", async () => {
                    const uuid = (Math.random() * 100).toString().replace(/\./g, "");
                    const lastModifiedDate = new Date(file.lastModified).toString() || new Date().toString();
                    try {
                        // 파일 메타데이터 전송
                        const fileInfo: FileInfo = {
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            lastModifiedDate,
                            uuid,
                            userid: connection.userid,
                            remoteUserId,
                        };

                        await sendAsync(
                            channel,
                            JSON.stringify({
                                messageType: "fileInfo",
                                data: fileInfo,
                            })
                        );

                        // 로컬 피어용 전송 시작 이벤트 호출
                        connection.onFileStart({
                            currentPosition: 0,
                            extra: {
                                chunkSize: connection.chunkSize,
                                userid: connection.userid,
                                displayName: connection.extra.displayName,
                                profileUrl: connection.extra.profileUrl,
                            },
                            lastModifiedDate,
                            maxChunks: Math.ceil(file.size / connection.chunkSize),
                            name: file.name,
                            remoteUserId,
                            size: file.size,
                            start: true,
                            type: file.type,
                            userid: connection.userid,
                            uuid
                        });

                        const reader = new FileReader();
                        let chunkIndex = 0;
                        const maxChunks = Math.ceil(file.size / chunkSize);

                        const sendNextChunk = (start: number) => {
                        const end = Math.min(start + chunkSize, file.size);
                        const blob = file.slice(start, end);

                        reader.onload = async (e: ProgressEvent<FileReader>) => {
                            const chunk = e.target?.result as ArrayBuffer;
                            const chunkData = JSON.stringify({
                                messageType: "fileChunk",
                                fileName: file.name,
                                chunkIndex,
                                maxChunks,
                                data: Array.from(new Uint8Array(chunk)),
                                uuid,
                                remoteUserId,
                                userid: connection.userid,
                                size: file.size,
                                type: file.type,
                                lastModifiedDate,
                            });

                            try {
                                await sendAsync(channel, chunkData);

                                // 로컬 피어용 전송 진행 이벤트 호출
                                connection.onFileProgress({
                                    uuid,
                                    lastModifiedDate,
                                    type: file.type,
                                    userid: connection.userid,
                                    remoteUserId,
                                    maxChunks,
                                    currentPosition: chunkIndex});

                                chunkIndex += 1;
                                if (end < file.size) {
                                    sendNextChunk(end);
                                } else {
                                    // 로컬 피어용 전송 종료 이벤트 호출
                                    connection.onFileEnd({
                                        end: true,
                                        extra: {
                                        chunkSize: connection.chunkSize,
                                        userid: connection.userid,
                                        displayName: connection.extra.displayName,
                                        profileUrl: connection.extra.profileUrl,
                                        },
                                        lastModifiedDate,
                                        maxChunks,
                                        name: file.name,
                                        remoteUserId,
                                        url: URL.createObjectURL(file),
                                        userid: connection.userid,
                                        uuid,
                                        type: file.type,
                                    });
                                }
                            } catch (error) {
                                console.error("Send error while sending chunk:", error);
                            }
                        };

                            reader.readAsArrayBuffer(blob);
                        };

                        sendNextChunk(0);
                    } catch (error) {
                        console.error("File transfer error:", error);
                    }
                });
            });
        });
        }
    };

    if(connection){
        // 데이터 채널 메시지 수신 이벤트
        connection.onmessage = (event: ConnectionEventData): void => {
            switch (event.data.type) {
            case 'speaking':
                setSpeak(event.data as SpeakData);
                break;
            case 'silence':
                setSpeak(event.data as SpeakData);
                break;
            case 'textMessage':
                resetDividerMessage();
                addMessage(event.data);
                if(!isChatActive){
                    setUnReadMessageCount((count) => count + 1);
                }
                break;
            default:
            }
        }

        // 상대방과 data channel 닫힐 시 대화상태값 초기화
        connection.onclose = () => {
            setSpeak({});
        };

         // 파일 공유 시작 이벤트
        // : 파일 데이터를 메시지 데이터 배열에 추가
        connection.onFileStart = (file) => {
            OnFileShareStart(file);
        };

        // 파일 공유 진행상황 이벤트
        // : 업로드 진행상황 업데이트
        connection.onFileProgress = (file) => {
            OnFileShareProgress(file);
        };

        // 파일 공유 완료 이벤트
        // : onFileStart에서 추가한 배열 요소중 uuid값이 같은(동일한 파일)요소 제거 후 새로운 데이터를 메시지 데이터 배열에 추가
        // : 파일 공유 완료이벤트 수신 시 채팅창 활성화 X + 보낸 사람이 아닐 경우에 읽지않은 메시지 카운트 값 증가
        connection.onFileEnd = (file) => {
            OnFileShareEnd(file);
        };
    }


    return (
        <MessageContext.Provider
            value={{
                useMessage,
                connection,
                speak,
                setSpeak,
                unReadMessageCount,
                setUnReadMessageCount,
                setSystemMessage,
                sendMultipleFile
            }}
            >
            {children}
        </MessageContext.Provider>
    );
};
