"use client";

import {motion} from "framer-motion";
import {FaUtensils} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import {Menu} from "@/lib/types/menu";
import {formatPrice} from "@/lib/utils/formatPrice";

interface MenuRecommendationsProps {
 recommendations: Menu[];
 currentMenuId: string;
 outletId: string;
}

export const MenuRecommendations = ({
 recommendations,
 currentMenuId,
 outletId,
}: MenuRecommendationsProps) => {
 if (recommendations.length === 0) return null;

 return (
  <div className="mt-12 px-4 sm:px-0">
   <div className="max-w-6xl mx-auto">
    <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
     <span className="p-2 bg-black dark:bg-white text-white dark:text-onyx1 rounded-full">
      <FaUtensils className="text-lg" />
     </span>
     <span className="text-onyx1 dark:text-white">Kamu Mungkin Suka</span>
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
     {recommendations
      .filter((menu) => menu.id !== currentMenuId)
      .slice(0, 3)
      .map((menu) => (
       <motion.div
        key={menu.id}
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
        whileHover={{y: -5}}
        transition={{duration: 0.3}}
        className="bg-white dark:bg-onyx2 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
        <Link
         href={`/menu/${menu.id}?outlet=${outletId}`}
         className="block h-full">
         {/* Image Container with Padding */}
         <div className="relative h-48 w-full bg-white dark:bg-onyx2 p-4">
          {/* Added padding here */}
          <div className="relative h-full w-full">
           {/* Nested container for image */}
           {menu.imageUrl ? (
            <Image
             src={menu.imageUrl}
             alt={menu.name}
             fill
             className="object-contain"
             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
           ) : (
            <div className="bg-white dark:bg-onyx2 h-full w-full flex items-center justify-center rounded-lg">
             <FaUtensils className="text-4xl text-gray-400" />
            </div>
           )}
          </div>
         </div>

         <div className="p-5">
          <div className="flex justify-between items-start gap-3">
           <h3 className="font-bold text-onyx1 dark:text-white text-lg line-clamp-2">
            {menu.name}
           </h3>
           <span className="font-bold text-onyx1 dark:text-white whitespace-nowrap pl-2">
            {formatPrice(menu.price)}
           </span>
          </div>

          {menu.category && (
           <span className="inline-block mt-3 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            {menu.category}
           </span>
          )}
         </div>
        </Link>
       </motion.div>
      ))}
    </div>
   </div>
  </div>
 );
};
