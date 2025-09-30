import { create } from 'zustand';
import { findDividerItem } from '@/utils/utils';

// 채팅창 컴포넌트 스토어
interface ChatState {
  isChatActive: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isChatActive: false, // 초기 상태는 닫혀 있음
  openChat: () => set({ isChatActive: true }),
  closeChat: () => set({ isChatActive: false }),
  toggleChat: () => set((state) => ({ isChatActive: !state.isChatActive })),
}));


// 채팅창 메시지 데이터 스토어
interface MessageStore {
  messageList: MessageData[];
  setMessageList: (messages: MessageData[] | ((prev: MessageData[]) => MessageData[])) => void;
  addMessage: (message: MessageData) => void;
  removeMessage: (index: number) => void;
  clearMessages: () => void;
  updateMessage: (index: number, message: MessageData) => void;
  resetDividerMessage: () => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messageList: [{
    type: 'systemMessage',
    isDividerMessage: true
  }],
  
   setMessageList: (messages) => set((state) => ({ 
    messageList: typeof messages === 'function' ? messages(state.messageList) : messages 
  })),
  
  addMessage: (message) => set((state) => ({ 
    messageList: [...state.messageList, message] 
  })),
  
  removeMessage: (index) => set((state) => ({ 
    messageList: state.messageList.filter((_, i) => i !== index) 
  })),
  
  clearMessages: () => set({ messageList: [] }),
  
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