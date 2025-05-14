"use client";

import {useState, useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {
 FaFire,
 FaSpinner,
 FaChartLine,
 FaCalendarAlt,
 FaUndo,
} from "react-icons/fa";
import {FiTrendingUp, FiClock} from "react-icons/fi";
import {db} from "@/lib/firebase/init";
import {
 collection,
 query,
 orderBy,
 limit,
 onSnapshot,
 where,
 updateDoc,
 doc,
} from "firebase/firestore";

interface PopularMenu {
 id: string;
 name: string;
 clickCount: number;
 price: number;
 category?: string;
 lastClicked?: string;
 taxIds?: string[];
}

interface PopularMenusProps {
 outletId: string;
}

const PopularMenus = ({outletId}: PopularMenusProps) => {
 const [popularMenus, setPopularMenus] = useState<PopularMenu[]>([]);
 const [loading, setLoading] = useState(true);
 const [timeRange, setTimeRange] = useState<"all" | "week" | "month">("all");
 const [resetting, setResetting] = useState(false);

 useEffect(() => {
  if (!outletId) {
   setPopularMenus([]);
   setLoading(false);
   return;
  }

  setLoading(true);
  let q;

  if (timeRange === "week") {
   const oneWeekAgo = new Date();
   oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
   q = query(
    collection(db, "menus"),
    where("outletId", "==", outletId),
    where("clickCount", ">", 0),
    where("lastClicked", ">=", oneWeekAgo.toISOString()),
    orderBy("lastClicked", "desc"),
    limit(5)
   );
  } else if (timeRange === "month") {
   const oneMonthAgo = new Date();
   oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
   q = query(
    collection(db, "menus"),
    where("outletId", "==", outletId),
    where("clickCount", ">", 0),
    where("lastClicked", ">=", oneMonthAgo.toISOString()),
    orderBy("lastClicked", "desc"),
    limit(5)
   );
  } else {
   q = query(
    collection(db, "menus"),
    where("outletId", "==", outletId),
    where("clickCount", ">", 0),
    orderBy("clickCount", "desc"),
    limit(5)
   );
  }

  const unsubscribe = onSnapshot(
   q,
   (snapshot) => {
    const menusData: PopularMenu[] = [];
    snapshot.forEach((doc) => {
     const data = doc.data();
     menusData.push({
      id: doc.id,
      name: data.name,
      clickCount: data.clickCount || 0,
      price: data.price,
      category: data.category,
      lastClicked: data.lastClicked,
      taxIds: data.taxIds || [],
     });
    });
    setPopularMenus(menusData);
    setLoading(false);
   },
   (error) => {
    console.error("Error listening to menu updates:", error);
    setLoading(false);
   }
  );

  return () => unsubscribe();
 }, [timeRange, outletId]);

 const resetMenuCounts = async () => {
  if (
   !outletId ||
   !window.confirm("Reset semua hitungan menu populer untuk outlet ini?")
  )
   return;

  setResetting(true);
  try {
   const promises = popularMenus.map((menu) =>
    updateDoc(doc(db, "menus", menu.id), {
     clickCount: 0,
     lastClicked: null,
    })
   );
   await Promise.all(promises);
   setPopularMenus([]);
  } catch (error) {
   console.error("Error resetting menu counts:", error);
  } finally {
   setResetting(false);
  }
 };

 const timeRangeLabels = {
  all: "Semua Waktu",
  week: "Minggu Ini",
  month: "Bulan Ini",
 };

 const timeRangeIcons = {
  all: <FiClock className="mr-1" />,
  week: <FaCalendarAlt className="mr-1" />,
  month: <FaChartLine className="mr-1" />,
 };

 return (
  <div className="bg-white dark:bg-onyx2 rounded-xl shadow-lg p-4">
   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
    <div className="flex items-center gap-2">
     <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
      <FaFire className="text-lg" />
     </div>
     <div>
      <h2 className="text-lg font-bold text-gray-800 dark:text-white">
       Menu Populer
      </h2>
     </div>
    </div>

    <div className="flex items-center gap-2">
     <div className="flex gap-1">
      {(["all", "week", "month"] as const).map((range) => (
       <motion.button
        key={range}
        whileHover={{scale: 1.05}}
        whileTap={{scale: 0.95}}
        onClick={() => setTimeRange(range)}
        className={`flex items-center px-2 py-1 rounded-full text-xs ${
         timeRange === range
          ? "bg-orange-500 text-white"
          : "bg-gray-100 dark:bg-onyx3 text-gray-700 dark:text-gray-300"
        }`}>
        {timeRangeIcons[range]}
        {timeRangeLabels[range]}
       </motion.button>
      ))}
     </div>

     <motion.button
      onClick={resetMenuCounts}
      whileHover={{scale: 1.05}}
      whileTap={{scale: 0.95}}
      disabled={resetting || popularMenus.length === 0}
      className={`flex items-center px-2 py-1 rounded-full text-xs ${
       resetting || popularMenus.length === 0
        ? "bg-gray-300 dark:bg-onyx4 text-gray-500 cursor-not-allowed"
        : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
      }`}>
      <FaUndo className="mr-1" />
      {resetting ? "Resetting..." : "Reset"}
     </motion.button>
    </div>
   </div>

   {loading ? (
    <div className="flex justify-center py-4">
     <motion.div
      animate={{rotate: 360}}
      transition={{repeat: Infinity, duration: 1, ease: "linear"}}>
      <FaSpinner className="text-xl text-orange-500" />
     </motion.div>
    </div>
   ) : popularMenus.length === 0 ? (
    <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
     Tidak ada data menu populer
    </div>
   ) : (
    <div className="overflow-x-auto">
     <table className="w-full">
      <thead>
       <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-onyx3">
        <th className="pb-2 pl-2">#</th>
        <th className="pb-2">Menu</th>
        <th className="pb-2 text-right pr-2">Views</th>
       </tr>
      </thead>
      <tbody>
       <AnimatePresence>
        {popularMenus.map((menu, index) => {
         return (
          <motion.tr
           key={menu.id}
           initial={{opacity: 0}}
           animate={{opacity: 1}}
           exit={{opacity: 0}}
           className="hover:bg-gray-50 dark:hover:bg-onyx3 transition-colors">
           <td className="py-2 pl-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            {index + 1}
           </td>
           <td className="py-2">
            <div className="text-sm font-medium text-gray-800 dark:text-white">
             {menu.name}
            </div>
            {menu.category && (
             <div className="text-xs text-gray-500 dark:text-gray-400">
              {menu.category}
             </div>
            )}
           </td>
           <td className="py-2 text-right pr-2">
            <div className="flex items-center justify-end gap-1 text-orange-500">
             <FiTrendingUp className="text-xs" />
             <span className="text-sm">{menu.clickCount}x</span>
            </div>
           </td>
          </motion.tr>
         );
        })}
       </AnimatePresence>
      </tbody>
     </table>
    </div>
   )}
  </div>
 );
};

export default PopularMenus;