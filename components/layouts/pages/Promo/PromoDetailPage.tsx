// /PromoDetailPage.tsx
"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {FaTag, FaArrowLeft, FaSpinner} from "react-icons/fa";
import Image from "next/image";
import {usePromo} from "@/lib/hooks/usePromo";
import {useParams, useSearchParams, useRouter} from "next/navigation";
import {PromoRecommendations} from "./PromoRecomendations";
import {Promo} from "@/lib/types/promo";
import {formatPrice} from "@/lib/utils/formatPrice";

const PromoDetailPage = () => {
 const params = useParams();
 const searchParams = useSearchParams();
 const router = useRouter();
 const promoId = params.id as string;
 const outletId = searchParams.get("outlet") || "";

 const {promos, loading} = usePromo(outletId);
 const [currentPromo, setCurrentPromo] = useState<Promo | null>(null);
 const [recommendations, setRecommendations] = useState<Promo[]>([]);

 // Get random recommendations
 const getRandomRecommendations = (
  allPromos: Promo[],
  currentId: string,
  count = 3
 ) => {
  const filtered = allPromos.filter((promo) => promo.id !== currentId);
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
 };

 useEffect(() => {
  if (promos.length > 0) {
   const foundPromo = promos.find((promo) => promo.id === promoId);
   setCurrentPromo(foundPromo || null);
   setRecommendations(getRandomRecommendations(promos, promoId));
  }
 }, [promos, promoId]);

 if (loading) {
  return (
   <div className="min-h-screen flex items-center justify-center">
    <FaSpinner className="animate-spin text-4xl text-onyx1 dark:text-white" />
   </div>
  );
 }

 if (!currentPromo) {
  return (
   <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-onyx1">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">
     Promo not found
    </h2>
    <button
     onClick={() => router.push(`/promo?outlet=${outletId}`)}
     className="px-6 py-2 bg-black text-white rounded-lg hover:bg-black transition-colors">
     Back to Promos
    </button>
   </div>
  );
 }

 return (
  <div className="min-h-[100dvh] bg-white dark:bg-onyx1 px-4 py-6 sm:p-6 md:p-8">
   <div className="max-w-6xl mx-auto">
    {/* Back button */}
    <motion.div
     initial={{opacity: 0, y: -20}}
     animate={{opacity: 1, y: 0}}
     className="mb-6">
     <button
      onClick={() => router.push(`/promo?outlet=${outletId}`)}
      className="inline-flex items-center gap-2 text-onyx1 dark:text-white dark:hover:text-white/90 hover:text-black transition-colors">
      <FaArrowLeft /> Back to Promos
     </button>
    </motion.div>

    {/* Promo Detail */}
    <motion.div
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     transition={{duration: 0.5}}
     className="bg-white dark:bg-onyx2 rounded-xl shadow-md overflow-hidden flex flex-col lg:flex-row w-full">
     {/* Promo Image - Responsive sizing */}
     <div className="relative h-64 sm:h-80 md:h-96 lg:h-auto lg:w-1/2 xl:w-[60%]">
      {currentPromo.imageUrl ? (
       <Image
        src={currentPromo.imageUrl}
        alt={currentPromo.name}
        fill
        className="object-contain"
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
       />
      ) : (
       <div className="bg-white dark:bg-onyx2 h-full w-full flex items-center justify-center">
        <FaTag className="text-5xl text-gray-400" />
       </div>
      )}
     </div>

     {/* Promo Content */}
     <div className="p-4 sm:p-6 md:p-8 w-full lg:w-1/2 xl:w-[40%]">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 w-full">
       <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-onyx1 dark:text-white">
         {currentPromo.name}
        </h1>
        {currentPromo.category && (
         <span className="inline-block mt-2 px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm rounded-full">
          {currentPromo.category}
         </span>
        )}
       </div>
       <div className="text-left sm:text-right">
        <p className="text-2xl font-bold text-onyx1 dark:text-white">
         {formatPrice(currentPromo.price)}
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
         Harga promo khusus
        </p>
       </div>
      </div>

      {/* Description */}
      <div className="mt-6">
       <h3 className="text-lg font-semibold text-onyx1 dark:text-white mb-2">
        Deskripsi
       </h3>
       <p className="text-gray-600 dark:text-gray-400">
        {currentPromo.description || "No description available."}
       </p>
      </div>

      {/* Time Range */}
      <div className="mt-6">
       <h3 className="text-lg font-semibold text-onyx1 dark:text-white mb-2">
        Waktu Promo
       </h3>
       <p className="text-gray-600 dark:text-gray-400">
        {promoCategories[currentPromo.category]?.timeRange || "All day"}
       </p>
      </div>

      {/* Additional Info */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
       <div>
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
         Status
        </h4>
        <p
         className={`mt-1 font-medium ${
          currentPromo.isActive
           ? "text-green-600 dark:text-green-400"
           : "text-red-600 dark:text-red-400"
         }`}>
         {currentPromo.isActive ? "Active" : "Inactive"}
        </p>
       </div>
      </div>
     </div>
    </motion.div>

    {/* Recommendations */}
    {recommendations.length > 0 && (
     <div className="mt-12">
      <PromoRecommendations
       recommendations={recommendations}
       currentPromoId={currentPromo.id}
       outletId={outletId}
      />
     </div>
    )}
   </div>
  </div>
 );
};

export default PromoDetailPage;
