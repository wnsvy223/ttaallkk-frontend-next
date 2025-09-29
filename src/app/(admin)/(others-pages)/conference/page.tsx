import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import Link from 'next/link'

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Conference() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Conference" pathname={"/Confernce"} />
        <div className="mx-auto w-full max-w-[630px] text-center">
            <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                음성대화
            </h3>
            <div className="flex flex-col justify-center gap-8 p-8 sm:flex-row sm:items-center sm:gap-16 sm:py-6">
                 <Link href="/conference/publicroom" className="group">
                  <div className="mx-auto max-w-sm items-center gap-x-4 rounded-xl bg-white hover:bg-sky-500 p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
                    <div>
                        <div className="text-xl font-medium text-black dark:text-white group-hover:text-white">공개 대화방</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-white">새로운 유저와 대화를 시작하세요.</p>
                    </div>
                  </div>
                </Link>
                <Link href="/conference/privateroom" className="group">
                  <div className="mx-auto max-w-sm items-center gap-x-4 rounded-xl bg-white hover:bg-emerald-500 p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
                    <div>
                      <div className="text-xl font-medium text-black dark:text-white group-hover:text-white">비밀 대화방</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-white">친구들과 비밀 대화를 시작하세요.</p>
                    </div>
                  </div>
                </Link>
            </div>
        </div>
    </div>
  );
}
