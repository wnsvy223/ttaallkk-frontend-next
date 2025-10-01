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
  removeMessage: (index: number) => void;
  clearMessages: () => void;
  updateMessage: (index: number, message: MessageData) => void;
  resetDividerMessage: () => void;
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

    resetDividerMessage: () => set((state) => {
      const { item, filteredList } = findDividerItem(state.messageList);
      if (!item) {
        return state;
      }
      return { messageList: [item, ...filteredList] };
    })
  }));
};