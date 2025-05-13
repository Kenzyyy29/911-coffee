// components/MenuRecommendations.tsx
"use client";

import {motion} from "framer-motion";
import {FaUtensils} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import {Menu} from "@/lib/types/menu";
import { formatPrice } from "@/lib/utils/formatPrice";

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
  <div className="mt-12">
   <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
    <FaUtensils className="text-black" /> You Might Also Like
   </h3>
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {recommendations
     .filter((menu) => menu.id !== currentMenuId)
     .slice(0, 3)
     .map((menu) => (
      <motion.div
       key={menu.id}
       whileHover={{y: -5}}
       className="bg-white rounded-xl shadow-md overflow-hidden">
       <Link href={`/menu/${menu.id}?outlet=${outletId}`}>
        <div className="relative h-40 w-full">
         {menu.imageUrl ? (
          <Image
           src={menu.imageUrl}
           alt={menu.name}
           fill
           className="object-contain"
          />
         ) : (
          <div className="bg-gray-200 h-full w-full flex items-center justify-center">
           <FaUtensils className="text-3xl text-gray-400" />
          </div>
         )}
        </div>
        <div className="p-4">
         <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-800">{menu.name}</h3>
          <span className="font-bold text-black">
           {formatPrice(menu.price)}
          </span>
         </div>
        </div>
       </Link>
      </motion.div>
     ))}
   </div>
  </div>
 );
};
