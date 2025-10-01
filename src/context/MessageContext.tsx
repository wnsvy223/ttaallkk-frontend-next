"use client"

import { useState, createContext, SetStateAction, Dispatch, useContext } from 'react';
import moment from 'moment'; // Moment
import { useRTC } from './RTCMultiConnectionContext';
import { useChatStore, useMessageStore } from '@/context/ChatStoreContext';


type MessageContextType = {
    useMessage: () => void,
    connection: RTCMultiConnection | null,
    speak: SpeakData | undefined,
    setSpeak: Dispatch<SetStateAction<SpeakData | undefined>>
    unReadMessageCount: number,
    setUnReadMessageCount: Dispatch<SetStateAction<number>>,
    setSystemMessage: (event: ConnectionLeaveEvent) => void
};

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
    const isChatActive = useChatStore((state) => state.isChatActive);

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
                setSystemMessage
            }}
            >
            {children}
        </MessageContext.Provider>
    );
};
