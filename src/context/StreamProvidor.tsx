"use client"

import { useState, createContext, SetStateAction, Dispatch, useContext } from 'react';
import moment from 'moment'; // Moment
import { useRTC } from './RTCMultiConnectionContext';
import { useMessageStore } from '@/store/ChatStore';
import initHark from '@/lib/Hark/Hark';


type StreamContextType = {
    useStream: () => void,
    connection: RTCMultiConnection | null,
    handleDisconnectRTC: () => void,
    participants: ParticipantEventData[],
    setParticipants: Dispatch<SetStateAction<ParticipantEventData[]>>,
    muteStates: Record<string, boolean>,
    setMuteStates: Dispatch<SetStateAction<Record<string, boolean>>>,
    isConversation: boolean,
    setIsConversation: Dispatch<SetStateAction<boolean>>
};

export const StreamContext = createContext<StreamContextType | null>(null);

// RTCMultiConnection의 스트림 데이터 및 이벤트 접근을 위한 커스텀 훅
export const useStream = () => {
    const context = useContext(StreamContext);
      if (!context) throw new Error("useMessage must be used within MessageProvider");
      return context;
}

export function StreamProvider({ children }: { children: React.ReactNode }) {
    const { connection } = useRTC();
    const { setMessageList, resetDividerMessage} = useMessageStore();
    const [ participants, setParticipants ] = useState<ParticipantEventData[]>([]);
    const [ muteStates, setMuteStates ] = useState<Record<string, boolean>>({});
    const [ isConversation, setIsConversation ] = useState<boolean>(false);

    // 음성대화 연결 해제
    const handleDisconnectRTC = () => {
        if(connection){
            connection.isInitiator = false; // 대화종료 시 방장구분값 false로 초기화
            connection.attachStreams.forEach((stream: MediaStream) => {
                stream.getTracks().forEach(track => {
                    track.stop();
                }); // 미디어 스트림 제거
            });
            connection.getAllParticipants().forEach((pid) => {
                connection.disconnectWith(pid); // 연결된 참가자들과 연결해제
            });
            connection.getSocket((socket) => {
                socket.emit('leave-room'); // 대화종료 소켓 이벤트 서버로 전달
            });
            setIsConversation(false);
        }
    }

    if(connection){
      // 참가자 퇴장 시 메시지 상태값 업데이트
        connection.onleave = (event: ConnectionLeaveEvent): void => {
            const systemMessage: MessageData = {
                type: 'systemMessage',
                text: `${event?.extra?.displayName}님이 방을 나갔습니다.`,
                displayName: connection?.extra?.displayName,
                profileUrl: connection?.extra?.profileUrl,
                timeStamp: moment()
                };
            resetDividerMessage();
            setMessageList((message: MessageData[]) => [...message, systemMessage]);
        };

        // 스트림 시작
        connection.onstream = (event: ParticipantEventData) => {
            setParticipants((p) => [...p, event]);
            setIsConversation(true);
            initHark({
                stream: event.stream,
                event,
                connection
            });
            setMuteStates(prev => ({
                ...prev,
                [event.userid]: event.extra?.isAudioMuted ?? false,
            }));
            if (event.userid !== connection.userid) {
                const systemMessage = {
                    type: 'systemMessage',
                    text: `${event?.extra?.displayName}님이 방에 참가했습니다.`,
                    displayName: connection?.extra?.displayName,
                    profileUrl: connection?.extra?.profileUrl,
                    timeStamp: moment()
                };
                setMessageList((message) => [...message, systemMessage]);
            }
        };

        // 스트림 종료
        connection.onstreamended = (event: ParticipantEventData) => {
            setParticipants((p) => p.filter((user) => user.userid !== event.userid));
        };
        
        // Mute 이벤트
        connection.onmute = (e: MuteEvent) => {
            setMuteStates(prev => ({
                ...prev,
                [e.userid]: true,
            }));
            if (e.userid === connection.userid) {
                connection.extra.isAudioMuted = true;
                connection.updateExtraData();
            }
        };

        // UnMute 이벤트
        connection.onunmute = (e: MuteEvent) => {
            setMuteStates(prev => ({
                ...prev,
                [e.userid]: false,
            }));
            if (e.userid === connection.userid) {
                connection.extra.isAudioMuted = false;
                connection.updateExtraData();
            }
        };
    }


    return (
        <StreamContext.Provider
            value={{
                useStream,
                connection,
                handleDisconnectRTC,
                participants,
                setParticipants,
                muteStates,
                setMuteStates,
                isConversation,
                setIsConversation
            }}
            >
            {children}
        </StreamContext.Provider>
    );
};
