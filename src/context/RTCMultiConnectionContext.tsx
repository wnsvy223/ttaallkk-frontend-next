"use client"

import { useState, useEffect, createContext } from 'react';
import { socketUrl, chunkSize, defaultMaxParticipantsAllowed } from '@/utils/const';
import moment, { Moment } from 'moment'; // Moment
import initHark from '@/lib/Hark/Hark';


const RTCMultiConnectionContext = createContext<RTCContextType>({
    connection: null,
    isConversation: false,
    participants: []
});

function RTCMultiConnectionProvider({ children }: { children: React.ReactNode }) {
    const [connection, setConnection] = useState<RTCMultiConnection | null>(null);
    const [participants, setParticipants] = useState<ParticipantEventData[]>([]);
    const [speak, setSpeak] = useState<SpeakData>();
    const [messageList, setMessageList] = useState<MessageData[]>([]);
    const [unReadMessageCount, setUnReadMessageCount] = useState<number>(0);
    const [isConversation, setIsConversation] = useState<boolean>(false);
    

    useEffect(() => {
        let connection: RTCMultiConnection;
        (async () => {
            const RTCMultiConnection = require('@/lib/RTCMultiConnection/RTCMultiConnection');
            connection = new RTCMultiConnection();
            connection.socketURL = socketUrl;
            connection.autoCreateMediaElement = false; // 미디어 엘리먼트 자동생성 X(default media element의 경우 unmute시 echo 이슈)
            connection.enableFileSharing = true; // 파일 공유 세팅
            connection.chunkSize = chunkSize; // ChunkSize(기본값 - 16KB)
            connection.autoSaveToDisk = false; // to make sure file-saver dialog is not invoked.
            connection.maxParticipantsAllowed = defaultMaxParticipantsAllowed; // limit participants allowed

            // Set video directions and media types
            connection.session = {
                video: false,
                audio: true,
                data: true
            };

            // Choose front or back camera, set resolutions, choose camera/microphone by device-id etc.
            connection.mediaConstraints = {
                video: false,
                audio: {
                    echoCancellation: true
                }
            };

            connection.bandwidth = {
                audio: 50, // 50 kbps
                video: 256, // 256 kbps
                screen: 300 // 300 kbps
                // audio : audio bitrates. Minimum 6 kbps and maximum 510 kbps
                // video : video framerates. Minimum 100 kbps; maximum 2000 kbps
                // screen : screen framerates. Minimum 300 kbps; maximum 4000 kbps
            };

            connection.processSdp = (sdp: unknown) => sdp; // return unchanged SDP

            connection.sdpConstraints = {
              mandatory: {
                  OfferToReceiveAudio: true,
                  OfferToReceiveVideo: true,
                  VoiceActivityDetection: true,
                  IceRestart: true
              },
              optional: []
            };

            // set ice server (ignore default STUN+TURN servers)
            connection.iceServers = [];

            // stun server
            connection.iceServers.push({
              urls: [
                  'stun:stun.l.google.com:19302',
                  'stun:stun.l.google.com:19302?transport=udp',
                  'stun:stun1.l.google.com:19302',
                  'stun:stun2.l.google.com:19302'
              ]
            });

            // turn server
            connection.iceServers.push({
                // own viagenie turn server
                urls: 'turn:numb.viagenie.ca',
                username: 'wnsvy223@naver.com',
                credential: 'dlsvygud223@'
            });

            connection.iceServers.push({
                // muazkh viagenie turn server
                urls: 'turn:numb.viagenie.ca',
                username: 'webrtc@live.com',
                credential: 'muazkh'
            });

            // webrtc data channel을 통해 넘어오는 이벤트 메시지 수신(대화상태값 및 텍스트 메시지)
            connection.onmessage = (event: ConnectionEventData): void => {
                switch (event.data.type) {
                case 'speaking':
                    setSpeak(event.data as SpeakData);
                    break;
                case 'silence':
                    setSpeak(event.data as SpeakData);
                    break;
                case 'textMessage':
                    resetDividerPosition();
                    setMessageList((message: MessageData[]) => [...message, event.data as MessageData]);
                    break;
                default:
                }
            }

            // 상대방과 data channel 닫힐 시 대화상태값 초기화
            connection.onclose = () => {
                setSpeak({});
            };

            // 참가자 퇴장 시 메시지 상태값 업데이트
            connection.onleave = (event: ConnectionLeaveEvent): void => {
                const systemMessage: MessageData = {
                    type: 'systemMessage',
                    text: `${event?.extra?.displayName}님이 방을 나갔습니다.`,
                    displayName: connection?.extra?.displayName,
                    profileUrl: connection?.extra?.profileUrl,
                    timeStamp: moment()
                    };
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
                setIsConversation(false);
            };
        
            // connection 상태변수 세팅
            setConnection(connection);

            // 디바이더 아이템 위치 0번 인덱스 위치로 리셋
            function resetDividerPosition() {
                setMessageList((prevMessageList) => {
                    const { item, filteredList } = findDividerItem(prevMessageList);
                    if (!item) {
                        return prevMessageList;
                    }
                    return [item, ...filteredList];
                });
            }
            
            // 디바이더 아이템 찾기
            function findDividerItem(list: any[]) {
                const dividerIndex = list?.findIndex((data: { isDividerMessage: boolean; }) => data?.isDividerMessage === true);
                if (dividerIndex === -1) {
                    return { item: null, filteredList: list };
                }
                const item = list[dividerIndex];
                const filteredList = list.filter((_: any, index: any) => index !== dividerIndex);
                return { item, filteredList };
            }

            // 음성대화 연결 해제
            const handleDisconnectRTC = () => {
                /*
                connection.isInitiator = false; // 대화종료 시 방장구분값 false로 초기화
                connection.attachStreams.forEach((stream) => {
                    stream.stop(); // 미디어 스트림 제거
                });
                connection.getAllParticipants().forEach((pid) => {
                    connection.disconnectWith(pid); // 연결된 참가자들과 연결해제
                });
                connection.getSocket((socket) => {
                    socket.emit('leave-room'); // 대화종료 소켓 이벤트 서버로 전달
                });
                */
            };
        })();
        
        return () => {
            if (connection) {
                connection.closeSocket();
            }
        };
    }, []);

    return (
    <RTCMultiConnectionContext.Provider 
        value={{ 
            connection: connection,
            isConversation: isConversation,
            participants: participants
        }}>
      {children}
    </RTCMultiConnectionContext.Provider>
  );
};


export { RTCMultiConnectionContext, RTCMultiConnectionProvider }