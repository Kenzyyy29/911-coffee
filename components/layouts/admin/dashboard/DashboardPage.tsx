// app/admin/dashboard/page.tsx
"use client";

import PopularMenus from "./PopularMenus";
import {motion} from "framer-motion";

const DashboardPage = () => {
 return (
  <div className="p-6">
   <motion.div
    initial={{opacity: 0, y: 20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.5}}
    className="max-w-7xl mx-auto space-y-8">
    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
     Dashboard Overview
    </h1>

    <PopularMenus />

    {/* You can add more analytics components here */}
   </motion.div>
  </div>
 );
};

export default DashboardPage;
