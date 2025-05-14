"use client";

import PopularMenus from "./PopularMenus";
import {motion} from "framer-motion";
import {useOutlets} from "@/lib/hooks/useOutlets";
import {useState} from "react";

const DashboardPage = () => {
 const [selectedOutlet, setSelectedOutlet] = useState<string>("");
 const {outlets} = useOutlets();

 if (!selectedOutlet) {
  return (
   <div className="min-h-screen p-4 md:p-8 bg-white dark:bg-onyx1">
    <motion.div
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     className="max-w-6xl mx-auto rounded-lg">
     <h1 className="text-2xl font-bold text-onyx1 dark:text-white mb-6">
      Pilih Outlet
     </h1>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {outlets.map((outlet) => (
       <motion.div
        key={outlet.id}
        whileHover={{scale: 1.03}}
        whileTap={{scale: 0.98}}
        onClick={() => setSelectedOutlet(outlet.id)}
        className="p-4 sm:p-6 border border-onyx1 dark:border-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
        <h3 className="font-medium text-onyx1 dark:text-white">
         {outlet.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
         {outlet.address || "No address provided"}
        </p>
       </motion.div>
      ))}
     </div>
    </motion.div>
   </div>
  );
 }

 const currentOutlet = outlets.find((o) => o.id === selectedOutlet);

 return (
  <div className="">
   <motion.div
    initial={{opacity: 0, y: 20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.5}}
    className="max-w-7xl mx-auto space-y-5">
    <div className="flex justify-between items-center">
     <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
      Dashboard Overview - {currentOutlet?.name}
     </h1>
     <button
      onClick={() => setSelectedOutlet("")}
      className="flex items-center text-onyx1 dark:text-white">
      Ganti Outlet
     </button>
    </div>

    <PopularMenus outletId={selectedOutlet} />

    {/* You can add more analytics components here */}
   </motion.div>
  </div>
 );
};

export default DashboardPage;
