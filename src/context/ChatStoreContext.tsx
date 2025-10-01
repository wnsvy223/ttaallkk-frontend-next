'use client';

import { createContext, useContext, useRef, ReactNode } from 'react';
import { useStore } from 'zustand';
import { createChatStore, createMessageStore } from '@/store/ChatStore';

// 스토어 타입 정의
type ChatStore = ReturnType<typeof createChatStore>;
type MessageStore = ReturnType<typeof createMessageStore>;

// Context 생성
const ChatStoreContext = createContext<ChatStore | null>(null);
const MessageStoreContext = createContext<MessageStore | null>(null);

// Provider Props 타입
interface StoreProviderProps {
  children: ReactNode;
}

// Provider 컴포넌트
export function ChatStoreProvider({ children }: StoreProviderProps) {
  const chatStoreRef = useRef<ChatStore | null>(null);
  const messageStoreRef = useRef<MessageStore | null>(null);
  
  if (!chatStoreRef.current) {
    chatStoreRef.current = createChatStore();
  }
  
  if (!messageStoreRef.current) {
    messageStoreRef.current = createMessageStore();
  }

  return (
    <ChatStoreContext.Provider value={chatStoreRef.current}>
      <MessageStoreContext.Provider value={messageStoreRef.current}>
        {children}
      </MessageStoreContext.Provider>
    </ChatStoreContext.Provider>
  );
}

// Custom Hooks
export function useChatStore<T>(
  selector: (state: ReturnType<ChatStore['getState']>) => T
): T {
  const store = useContext(ChatStoreContext);
  if (!store) {
    throw new Error('useChatStore must be used within StoreProvider');
  }
  return useStore(store, selector);
}

export function useMessageStore<T>(
  selector: (state: ReturnType<MessageStore['getState']>) => T
): T {
  const store = useContext(MessageStoreContext);
  if (!store) {
    throw new Error('useMessageStore must be used within StoreProvider');
  }
  return useStore(store, selector);
}