"use client";
import React, { useContext, useEffect } from 'react';
import { Home, User, Settings, Mail, Bell, ChevronRight, Mic, UserPlus,  MessageCircleMore } from 'lucide-react';
import { useRightSidebar } from '../context/RightSidebarContext';
import { useSidebar } from '@/context/SidebarContext';
import { RTCMultiConnectionContext } from '@/context/RTCMultiConnectionContext';
import Avatar from '@/components/ui/avatar/Avatar';
import AvatarText from '@/components/ui/avatar/AvatarText';
import Badge from '@/components/ui/badge/Badge';
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";

const AppSidebarRight: React.FC = () => {
    const { isRightSidebarOpen, toggleRightSidebar, setRightSidebarOpen } = useRightSidebar();
    const { isMobileOpen } = useSidebar();
    const { participants } = useContext(RTCMultiConnectionContext);

    return (
        <>
        {/* 오버레이 - 모바일에서만 사이드바 외부 클릭 시 닫기 */}
        {isRightSidebarOpen && (
            <div
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
            onClick={toggleRightSidebar}
            />
        )}

        {/* 사이드바 - 오버레이 방식 */}
        <div
            className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-1xl transform transition-transform duration-300 ease-in-out z-30 ${
            isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            {/* 사이드바 헤더 */}
            <div className="p-5">
                <div className="flex items-center justify-between">
                    <button
                        onClick={toggleRightSidebar}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                        <Mic className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                        <UserPlus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                        <MessageCircleMore className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                </div>
            </div>

            {/* 사이드바 메뉴 */}
            <nav className="p-4">
                <div className="p-5 border border-gray-300 rounded-2xl dark:border-gray-800 lg:p-6">
                    {participants.map((event) => (
                        event.extra.profileUrl === '' ?
                        <div className="p-2 m-2 border border-gray-500 rounded-2xl dark:border-gray-800"  key={event.userid}>
                            <AvatarText name={event.extra.displayName}/>
                        </div>
                        : 
                        <div className="p-2 m-2 border border-gray-500 rounded-2xl dark:border-gray-800"  key={event.userid}>
                            <Avatar src={event.extra.profileUrl} size="medium" />
                        </div>
                    ))}
                </div>
            </nav>

            {/* 사이드바 푸터 */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
                </div>
                <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">사용자명</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">user@example.com</p>
                </div>
            </div>
            </div>
        </div>
        </>
    );
};

export default AppSidebarRight;