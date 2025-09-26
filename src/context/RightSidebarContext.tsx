"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RightSidebarContextType {
  isRightSidebarOpen: boolean;
  toggleRightSidebar: () => void;
  setRightSidebarOpen: (isOpen: boolean) => void;
}

const RightSidebarContext = createContext<RightSidebarContextType | undefined>(undefined);

interface RightSidebarProviderProps {
  children: ReactNode;
}

export const RightSidebarProvider: React.FC<RightSidebarProviderProps> = ({ children }) => {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  const setRightSidebarOpen = (isOpen: boolean) => {
    setIsRightSidebarOpen(isOpen);
  };

  return (
    <RightSidebarContext.Provider
      value={{
        isRightSidebarOpen,
        toggleRightSidebar,
        setRightSidebarOpen,
      }}
    >
      {children}
    </RightSidebarContext.Provider>
  );
};

export const useRightSidebar = (): RightSidebarContextType => {
  const context = useContext(RightSidebarContext);
  if (context === undefined) {
    throw new Error('useRightSidebar must be used within a RightSidebarProvider');
  }
  return context;
};