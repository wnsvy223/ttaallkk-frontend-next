"use client"

import { useState, useEffect, useContext, createContext } from 'react';
import { socketUrl, chunkSize, defaultMaxParticipantsAllowed } from '@/utils/const';
import RTCMultiConnectionModule from '@/lib/RTCMultiConnection/RTCMultiConnection.js';


const RTCMultiConnectionContext = createContext<RTCContextType | null>(null);

// RTCMultiConnection의 connection 인스턴스 접근을 위한 커스텀 훅
export const useRTC = () => {
  const context = useContext(RTCMultiConnectionContext);
  if (!context) throw new Error("useRTC must be used within RTCProvider");
  return context;
};

// RTCMultiConnection 컨텍스트 프로바이더
function RTCMultiConnectionProvider({ children }: { children: React.ReactNode }) {
    const [ connection, setConnection ] = useState<RTCMultiConnection | null>(null);
    
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const RTCMultiConnection = (RTCMultiConnectionModule as any).default || RTCMultiConnectionModule; // ES5모둘인 RTCMultiConnection을 ES6 import 위한 설정
        const connection = new RTCMultiConnection();
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
        
        // connection 인스턴스 참조값 상태 업데이트
        setConnection(connection);
    }, []);

    return (
    <RTCMultiConnectionContext.Provider 
        value={{ 
            connection: connection,
            useRTC: useRTC,
        }}>
      {children}
    </RTCMultiConnectionContext.Provider>
  );
};


export { RTCMultiConnectionContext, RTCMultiConnectionProvider }