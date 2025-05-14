// app/components/dashboard/PopularMenus.tsx
"use client";

import {useState, useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {FaUtensils, FaFire, FaSpinner} from "react-icons/fa";
import {FiTrendingUp} from "react-icons/fi";
import {formatPrice} from "@/lib/utils/formatPrice";
import {db} from "@/lib/firebase/init";
import {
 collection,
 query,
 orderBy,
 limit,
 onSnapshot,
 where,
} from "firebase/firestore";

interface PopularMenu {
 id: string;
 name: string;
 clickCount: number;
 price: number;
 category?: string;
 lastClicked?: string;
}

const PopularMenus = () => {
 const [popularMenus, setPopularMenus] = useState<PopularMenu[]>([]);
 const [loading, setLoading] = useState(true);
 const [timeRange, setTimeRange] = useState<"all" | "week" | "month">("all");

 useEffect(() => {
  setLoading(true);

  // Buat query berdasarkan timeRange
  let q;
  if (timeRange === "week") {
   const oneWeekAgo = new Date();
   oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
   q = query(
    collection(db, "menus"),
    orderBy("lastClicked", "desc"),
    where("lastClicked", ">=", oneWeekAgo.toISOString()),
    limit(10)
   );
  } else if (timeRange === "month") {
   const oneMonthAgo = new Date();
   oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
   q = query(
    collection(db, "menus"),
    orderBy("lastClicked", "desc"),
    where("lastClicked", ">=", oneMonthAgo.toISOString()),
    limit(10)
   );
  } else {
   // All time - sort by clickCount
   q = query(collection(db, "menus"), orderBy("clickCount", "desc"), limit(10));
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

  // Cleanup function
  return () => unsubscribe();
 }, [timeRange]);

 
 // Animation variants
 const container = {
  hidden: {opacity: 0},
  show: {
   opacity: 1,
   transition: {
    staggerChildren: 0.1,
   },
  },
 };

 const item = {
  hidden: {opacity: 0, y: 20},
  show: {opacity: 1, y: 0},
 };

 return (
  <div className="bg-white dark:bg-onyx2 rounded-xl shadow-lg p-6">
   {/* Header */}
   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
    <div className="flex items-center gap-3">
     <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
      <FaFire className="text-xl" />
     </div>
     <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
       Menu Populer
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
       Menu yang paling sering dilihat pelanggan
      </p>
     </div>
    </div>

    <div className="flex gap-2">
     <button
      onClick={() => setTimeRange("all")}
      className={`px-3 py-1 rounded-full text-sm ${
       timeRange === "all"
        ? "bg-orange-500 text-white"
        : "bg-gray-100 dark:bg-onyx3 text-gray-700 dark:text-gray-300"
      }`}>
      Semua
     </button>
     <button
      onClick={() => setTimeRange("month")}
      className={`px-3 py-1 rounded-full text-sm ${
       timeRange === "month"
        ? "bg-orange-500 text-white"
        : "bg-gray-100 dark:bg-onyx3 text-gray-700 dark:text-gray-300"
      }`}>
      Bulan Ini
     </button>
     <button
      onClick={() => setTimeRange("week")}
      className={`px-3 py-1 rounded-full text-sm ${
       timeRange === "week"
        ? "bg-orange-500 text-white"
        : "bg-gray-100 dark:bg-onyx3 text-gray-700 dark:text-gray-300"
      }`}>
      Minggu Ini
     </button>
    </div>
   </div>

   {/* Content */}
   {loading ? (
    <div className="flex justify-center py-12">
     <FaSpinner className="animate-spin text-2xl text-orange-500" />
    </div>
   ) : popularMenus.length === 0 ? (
    <div className="text-center py-8">
     <p className="text-gray-500 dark:text-gray-400">Tidak ada data tersedia</p>
    </div>
   ) : (
    <motion.div
     variants={container}
     initial="hidden"
     animate="show"
     className="grid grid-cols-1 gap-4">
     <AnimatePresence>
      {popularMenus.map((menu, index) => (
       <motion.div
        key={menu.id}
        variants={item}
        className="bg-white dark:bg-onyx3 rounded-lg p-4 border-b border-gray-100 dark:border-onyx4">
        <div className="flex items-start justify-between">
         <div className="flex items-center gap-4">
          <div className="flex-shrink-0 bg-orange-100 dark:bg-onyx4 text-orange-500 w-10 h-10 rounded-full flex items-center justify-center">
           <span className="font-bold">{index + 1}</span>
          </div>
          <div>
           <h3 className="font-semibold text-gray-800 dark:text-white">
            {menu.name}
           </h3>
           {menu.category && (
            <span className="text-xs bg-gray-100 dark:bg-onyx2 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full mt-1 inline-block">
             {menu.category}
            </span>
           )}
          </div>
         </div>

         <div className="text-right">
          <div className="flex items-center gap-1 text-orange-500 justify-end">
           <FiTrendingUp className="text-sm" />
           <span className="text-sm font-medium">{menu.clickCount}x</span>
          </div>
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">
           {formatPrice(menu.price)}
          </div>
         </div>
        </div>
       </motion.div>
      ))}
     </AnimatePresence>
    </motion.div>
   )}
  </div>
 );
};

export default PopularMenus;
