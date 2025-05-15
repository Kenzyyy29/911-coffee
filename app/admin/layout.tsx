"use client";

import Sidebar from "@/components/layouts/admin/Sidebar";
import {useEffect, useState} from "react";

export default function AdminLayout({children}: {children: React.ReactNode}) {
 const [isMobile, setIsMobile] = useState(false);
 const [sidebarOpen, setSidebarOpen] = useState(false);

 useEffect(() => {
  const handleResize = () => {
   const mobile = window.innerWidth < 1024;
   setIsMobile(mobile);
   if (!mobile) {
    setSidebarOpen(true);
   } else {
    setSidebarOpen(false);
   }
  };

  handleResize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
 }, []);

 return (
  <div className="flex min-h-[100dvh] bg-white dark:bg-onyx1 text-black dark:text-white">
   <Sidebar
    isMobile={isMobile}
    sidebarOpen={sidebarOpen}
    setSidebarOpen={setSidebarOpen}
   />

   <main
    className={`
          flex-1 transition-all duration-300 min-h-[100dvh]
          ${sidebarOpen && isMobile ? "ml-0" : ""}
          ${!isMobile ? "ml-[280px]" : ""}
        `}>
    <div className="max-w-full overflow-y-auto ">{children}</div>
   </main>
  </div>
 );
}
