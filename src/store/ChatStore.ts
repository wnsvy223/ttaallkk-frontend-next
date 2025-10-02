import { createStore } from 'zustand/vanilla';
import { findDividerItem } from '@/utils/utils';


// 채팅창 컴포넌트 스토어 타입
interface ChatState {
  isChatActive: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

// 채팅창 스토어 생성 함수
export const createChatStore = () => {
  return createStore<ChatState>((set) => ({
    isChatActive: false,
    openChat: () => set({ isChatActive: true }),
    closeChat: () => set({ isChatActive: false }),
    toggleChat: () => set((state) => ({ isChatActive: !state.isChatActive })),
  }));
};

// 메시지 스토어 타입
interface MessageStore {
  messageList: MessageData[];
  addMessage: (message: MessageData) => void;
  addFileMessage: (fileMessage: MessageData) => void;
  removeMessage: (index: number) => void;
  clearMessages: () => void;
  updateMessage: (index: number, message: MessageData) => void;
  resetDividerMessage: () => void;
  setDividerPosition: (unReadCount: number) => void
}

// 메시지 스토어 생성 함수
export const createMessageStore = () => {
  return createStore<MessageStore>((set) => ({
    messageList: [{
      type: 'systemMessage',
      isDividerMessage: true
    }],
    
    addMessage: (message) => set((state) => ({
      messageList: [...state.messageList, message]
    })),
    
    addFileMessage: (fileMessage: MessageData) =>
      set((state) => {
        const filtered = state.messageList.filter(
          (data) => data?.file?.uuid !== fileMessage?.file?.uuid
        );
        return {
          messageList: [...filtered, fileMessage],
        };
      }),
    
    removeMessage: (index) => set((state) => ({ 
      messageList: state.messageList.filter((_, i) => i !== index) 
    })),
    
    clearMessages: () => set({ 
      messageList: [{
        type: 'systemMessage',
        isDividerMessage: true
      }] 
    }),
    
    updateMessage: (index, message) => set((state) => ({
      messageList: state.messageList.map((msg, i) => i === index ? message : msg)
    })),

    // 디바이더 아이템 위치 변경(읽지않은 메시지 목록중 첫 요소 해당하는 인덱스)
    setDividerPosition: (unReadCount) => set((state) => {{
      const { item, filteredList } = findDividerItem(state.messageList);
      if (!item) {
        return state;
      }
      const insertPosition = Math.max(0, filteredList.length - unReadCount);
      return {
        messageList: [
          ...filteredList.slice(0, insertPosition),
          item,
          ...filteredList.slice(insertPosition)
        ]
      };
    }}),

    // 디바이더 아이템 위치 리스트 맨 앞 위치로 리셋
    resetDividerMessage: () => set((state) => {
      const { item, filteredList } = findDividerItem(state.messageList);
      if (!item) {
        return state;
      }
      return { messageList: [item, ...filteredList] };
    })
  }));
};