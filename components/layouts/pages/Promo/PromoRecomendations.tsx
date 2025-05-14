// /PromoRecommendations.tsx
"use client";

import {motion} from "framer-motion";
import {FaTag} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import {Promo} from "@/lib/types/promo";
import {formatPrice} from "@/lib/utils/formatPrice";

interface PromoRecomendationsProps {
 recommendations: Promo[];
 currentPromoId: string;
 outletId: string;
}

export const PromoRecomendations = ({
 recommendations,
 currentPromoId,
 outletId,
}: PromoRecomendationsProps) => {
 if (recommendations.length === 0) return null;

 return (
  <div className="mt-12 px-4 sm:px-0">
   <div className="max-w-6xl mx-auto">
    <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
     <span className="p-2 bg-black dark:bg-white text-white dark:text-onyx1 rounded-full">
      <FaTag className="text-lg" />
     </span>
     <span className="text-onyx1 dark:text-white">Promo Lainnya</span>
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
     {recommendations
      .filter((promo) => promo.id !== currentPromoId)
      .slice(0, 3)
      .map((promo) => (
       <motion.div
        key={promo.id}
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
        whileHover={{y: -5}}
        transition={{duration: 0.3}}
        className="bg-white dark:bg-onyx2 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
        <Link
         href={`/promo/${promo.id}?outlet=${outletId}`}
         className="block h-full">
         {/* Image Container with Padding */}
         <div className="relative h-48 w-full bg-white dark:bg-onyx2 p-4">
          {/* Added padding here */}
          <div className="relative h-full w-full">
           {/* Nested container for image */}
           {promo.imageUrl ? (
            <Image
             src={promo.imageUrl}
             alt={promo.name}
             fill
             className="object-contain"
             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
           ) : (
            <div className="bg-white dark:bg-onyx2 h-full w-full flex items-center justify-center rounded-lg">
             <FaTag className="text-4xl text-gray-400" />
            </div>
           )}
          </div>
         </div>

         <div className="p-5">
          <div className="flex justify-between items-start gap-3">
           <h3 className="font-bold text-onyx1 dark:text-white text-lg line-clamp-2">
            {promo.name}
           </h3>
           <span className="font-bold text-onyx1 dark:text-white whitespace-nowrap pl-2">
            {formatPrice(promo.price)}
           </span>
          </div>

          {promo.category && (
           <span className="inline-block mt-3 px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded-full">
            {promo.category}
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
