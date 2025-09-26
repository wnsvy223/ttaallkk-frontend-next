"use client";

import { useSidebar } from "@/context/SidebarContext";
import { RightSidebarProvider, useRightSidebar } from "@/context/RightSidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import AppSidebarRight from "@/layout/AppSidebarRight";
import Backdrop from "@/layout/Backdrop";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RightSidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </RightSidebarProvider>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Left Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      
      {/* Main Content Area - 오른쪽 사이드바에 따라 여백 조정 */}
      <MainContentWrapper>
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </MainContentWrapper>
      
      {/* Right Sidebar */}
      <AppSidebarRight />
    </div>
  );
}

function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { isRightSidebarOpen } = useRightSidebar();

  // Dynamic class for main content margin based on left sidebar state
  const leftMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  // Dynamic class for main content margin based on right sidebar state
  const rightMargin = isRightSidebarOpen ? "lg:mr-[256px]" : "mr-0";

  return (
    <div className={`flex-1 transition-all duration-300 ease-in-out ${leftMargin} ${rightMargin}`}>
      {children}
    </div>
  );
}