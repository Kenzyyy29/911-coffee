"use client";
import {signOut} from "next-auth/react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {motion, AnimatePresence} from "framer-motion";
import {FaSignOutAlt, FaBox, FaStore, FaUser} from "react-icons/fa";
import {IoIosArrowDropright, IoIosArrowDropleft} from "react-icons/io";
import {MdDashboard} from "react-icons/md";
import {useState} from "react";
import {FaGear, FaPencil} from "react-icons/fa6";

interface SidebarProps {
 isMobile: boolean;
 sidebarOpen: boolean;
 setSidebarOpen: (open: boolean) => void;
}

const adminLinks = [
 {name: "Dashboard", path: "/admin/dashboard", icon: <MdDashboard />},
 {name: "Outlets", path: "/admin/dashboard/outlets", icon: <FaStore />},
 {
  name: "Produk",
  path: "/admin/dashboard/products/menu",
  icon: <FaBox />,
  subItems: [
   {
    name: "Menu",
    path: "/admin/dashboard/products/menu",
   },
   {
    name: "Promo",
    path: "/admin/dashboard/products/promo",
   },
   {
    name: "Bundling",
    path: "/admin/dashboard/products/bundling",
   },
   {
    name: "Taxes",
    path: "/admin/dashboard/products/taxes",
   },
  ],
 },
 {
  name: "Rekruitmen",
  path: "/admin/dashboard/career",
  icon: <FaUser />,
 },
 {
  name: "Blog",
  path: "/admin/dashboard/blog",
  icon: <FaPencil />,
 },
 {
  name: "Settings",
  path: "/admin/dashboard/settings/profile",
  icon: <FaGear />,
 },
];

export default function Sidebar({
 isMobile,
 sidebarOpen,
 setSidebarOpen,
}: SidebarProps) {
 const pathname = usePathname();
 const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
  {}
 );
 
 const toggleItemExpand = (path: string) => {
  setExpandedItems((prev) => {
   const newState = Object.keys(prev).reduce((acc, key) => {
    acc[key] = false;
    return acc;
   }, {} as Record<string, boolean>);

   return {
    ...newState,
    [path]: !prev[path],
   };
  });
 };

 const isActive = (path: string) => {
  if (path === "/admin/dashboard") {
   return pathname === path;
  }
  return pathname.startsWith(path);
 };

 const handleLinkClick = (path: string, hasSubItems: boolean) => {
  if (isMobile && !hasSubItems) {
   setSidebarOpen(false);
  }
 };

 return (
  <>
   {/* Mobile pull-out tab when sidebar is closed */}
   {isMobile && !sidebarOpen && (
    <motion.button
     className="fixed left-0 top-1/2 -translate-y-1/2 z-30 bg-onyx1 text-white p-2 rounded-full shadow-lg"
     onClick={() => setSidebarOpen(true)}
     initial={{x: 0}}
     animate={{x: 0}}
     whileHover={{x: 5}}
     transition={{type: "spring", stiffness: 300, damping: 20}}>
     <IoIosArrowDropright className="text-xl" />
    </motion.button>
   )}

   <AnimatePresence>
    {(sidebarOpen || !isMobile) && (
     <motion.div
      initial={isMobile ? {x: -280} : {x: 0}}
      animate={isMobile ? {x: sidebarOpen ? 0 : -280} : {x: 0}}
      exit={isMobile ? {x: -280} : {x: 0}}
      transition={{type: "spring", stiffness: 300, damping: 30}}
      className={`fixed left-0 top-0 h-full w-[280px] bg-onyx1 text-white p-5 flex flex-col rounded-r-xl shadow-xl z-40`}>
      
      {/* Mobile close button */}
      {isMobile && (
       <motion.button
        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-onyx1 text-white p-1 rounded-full shadow-lg border-2 border-white z-50"
        onClick={() => setSidebarOpen(false)}
        whileHover={{scale: 1.1}}
        whileTap={{scale: 0.9}}>
        <IoIosArrowDropleft className="text-xl" />
       </motion.button>
      )}

      <style jsx global>{`
       .sidebar-scroll {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.4) rgba(255, 255, 255, 0.1);
        overflow-y: overlay;
       }
       .sidebar-scroll::-webkit-scrollbar {
        width: 6px;
        height: 6px;
       }
       .sidebar-scroll::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 3px;
        margin-top: 10px;
        margin-bottom: 10px;
       }
       .sidebar-scroll::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.4);
        border-radius: 3px;
        border: 1px solid rgba(255, 255, 255, 0.1);
       }
       .sidebar-scroll::-webkit-scrollbar-thumb:hover {
        background-color: rgba(255, 255, 255, 0.6);
       }
       .sidebar-scroll::-webkit-scrollbar-corner {
        background: transparent;
       }
      `}</style>

      <div className="flex flex-col w-full h-full">
       {/* Scrollable menu area */}
       <div className="flex-1 sidebar-scroll pr-1">
        <Link
         href="/"
         onClick={() => isMobile && setSidebarOpen(false)}>
         <motion.h1
          className="text-3xl mb-6 text-white text-center italic font-bold"
          style={{fontFamily: "'Raleway', `sans-serif`"}}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 0.1}}>
          911 COFFEE
         </motion.h1>
        </Link>

        <ul className="flex flex-col gap-2 w-full">
         {adminLinks.map((link) => (
          <li
           key={link.path}
           className="overflow-visible">
           <div className="flex flex-col">
            <Link
             href={link.path}
             className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:text-black transition-all ${
              isActive(link.path) ? "bg-white text-black font-medium" : ""
             }`}
             onClick={(e) => {
              if (link.subItems) {
               e.preventDefault();
               toggleItemExpand(link.path);
              }
              handleLinkClick(link.path, !!link.subItems);
             }}>
             <span className="text-xl min-w-[24px] flex justify-center">
              {link.icon}
             </span>
             <motion.span 
              className="flex-1 text-left"
              initial={{opacity: 0, x: -10}}
              animate={{opacity: 1, x: 0}}
              transition={{delay: 0.1}}>
              {link.name}
             </motion.span>
             {link.subItems && (
              <motion.span
               animate={{
                rotate: expandedItems[link.path] ? 90 : 0,
               }}>
               <IoIosArrowDropright />
              </motion.span>
             )}
            </Link>

            {link.subItems && expandedItems[link.path] && (
             <motion.ul
              initial={{opacity: 0, height: 0}}
              animate={{opacity: 1, height: "auto"}}
              exit={{opacity: 0, height: 0}}
              className="ml-8 pl-3 border-l-2 border-white">
              {link.subItems.map((subItem) => (
               <li
                key={subItem.path}
                className="py-1.5">
                <Link
                 href={subItem.path}
                 className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-white hover:text-black ${
                  pathname === subItem.path
                   ? "bg-white text-black font-medium"
                   : "text-white"
                 }`}
                 onClick={() => handleLinkClick(subItem.path, false)}>
                 <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                 {subItem.name}
                </Link>
               </li>
              ))}
             </motion.ul>
            )}
           </div>
          </li>
         ))}
        </ul>
       </div>

       {/* Fixed footer */}
       <div className="w-full pt-4 pb-2">
        <motion.button
         onClick={() => signOut()}
         className="flex items-center gap-3 bg-white hover:bg-white/90 text-black w-full py-2.5 px-4 rounded-lg cursor-pointer transition-colors"
         whileHover={{scale: 1.02}}
         whileTap={{scale: 0.98}}
         initial={{opacity: 0, y: 10}}
         animate={{opacity: 1, y: 0}}
         transition={{delay: 0.2}}>
         <FaSignOutAlt />
         <span>Keluar</span>
        </motion.button>
       </div>
      </div>
     </motion.div>
    )}
   </AnimatePresence>

   {/* Overlay for mobile */}
   {isMobile && sidebarOpen && (
    <motion.div
     className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
     onClick={() => setSidebarOpen(false)}
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     exit={{opacity: 0}}
    />
   )}
  </>
 );
}