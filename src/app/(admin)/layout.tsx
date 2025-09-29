"use client";

import React, { useState, useEffect } from "react";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import AppSidebarRight from "@/layout/AppSidebarRight";
import Backdrop from "@/layout/Backdrop";
import { useSidebar } from "@/context/SidebarContext";
import { useRTC } from "@/context/RTCMultiConnectionContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutContent>{children}</AdminLayoutContent>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { isConversation } = useRTC();
  const [ openRightSideBar, setOpenRightSideBar ] = useState(false); // 우측 사이드바 open 상태

  // 오른쪽 사이드바 토글
  const toggleRightSidebar = () => {
    setOpenRightSideBar(!openRightSideBar);
  };

  // 음성대화 연결되면 오른쪽 사이드바 활성화
  useEffect(() => {
    if (isConversation) {
      setOpenRightSideBar(true);
    } else {
      setOpenRightSideBar(false);
    }
    return () => setOpenRightSideBar(false);
  }, [isConversation]);

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Right Position Sidebar */}
      <AppSidebarRight isOpen={openRightSideBar} onCloseRightSideBar={() => setOpenRightSideBar(false)}/>
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader onToggleRightSidebar={toggleRightSidebar} />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}