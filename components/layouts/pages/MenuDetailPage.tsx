"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {FaUtensils, FaArrowLeft, FaSpinner} from "react-icons/fa";
import Image from "next/image";
import {useMenu} from "@/lib/hooks/useMenu";
import {useTaxes} from "@/lib/hooks/useTaxes";
import {useParams, useSearchParams, useRouter} from "next/navigation";
import {MenuRecommendations} from "@/components/layouts/pages/MenuRecomendations";
import {Menu} from "@/lib/types/menu";
import {formatPrice} from "@/lib/utils/formatPrice";

const MenuDetailPage = () => {
 const params = useParams();
 const searchParams = useSearchParams();
 const router = useRouter();
 const menuId = params.id as string;
 const outletId = searchParams.get("outlet") || "";

 const {menus, loading} = useMenu(outletId);
 const {taxes} = useTaxes();
 const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
 const [recommendations, setRecommendations] = useState<Menu[]>([]);

 // Calculate total price with taxes
 const calculateTotalPrice = (menu: Menu) => {
  if (!menu?.taxIds || menu.taxIds.length === 0) return menu?.price || 0;

  const applicableTaxes = taxes.filter((tax) => menu.taxIds.includes(tax.id));
  const totalTaxRate = applicableTaxes.reduce((sum, tax) => sum + tax.rate, 0);

  return menu.price * (1 + totalTaxRate / 100);
 };

 // Get random recommendations
 const getRandomRecommendations = (
  allMenus: Menu[],
  currentId: string,
  count = 3
 ) => {
  const filtered = allMenus.filter((menu) => menu.id !== currentId);
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
 };

 useEffect(() => {
  if (menus.length > 0) {
   const foundMenu = menus.find((menu) => menu.id === menuId);
   setCurrentMenu(foundMenu || null);
   setRecommendations(getRandomRecommendations(menus, menuId));
  }
 }, [menus, menuId]);

 if (loading) {
  return (
   <div className="min-h-screen flex items-center justify-center">
    <FaSpinner className="animate-spin text-4xl text-onyx1 dark:text-white" />
   </div>
  );
 }

 if (!currentMenu) {
  return (
   <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-onyx1">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Menu not found</h2>
    <button
     onClick={() => router.push(`/menu?outlet=${outletId}`)}
     className="px-6 py-2 bg-black text-white rounded-lg hover:bg-black transition-colors">
     Back to Menu
    </button>
   </div>
  );
 }

 return (
  <div className="min-h-[100dvh]bg-white dark:bg-onyx1 px-4 py-6 sm:p-6 md:p-8">
   <div className="max-w-6xl mx-auto">
    {/* Back button */}
    <motion.div
     initial={{opacity: 0, y: -20}}
     animate={{opacity: 1, y: 0}}
     className="mb-6">
     <button
      onClick={() => router.push(`/menu?outlet=${outletId}`)}
      className="inline-flex items-center gap-2 text-onyx1 dark:text-white dark:hover:text-white/90 hover:text-black transition-colors">
      <FaArrowLeft /> Back to Menu
     </button>
    </motion.div>

    {/* Menu Detail */}
    <motion.div
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     transition={{duration: 0.5}}
     className="bg-white dark:bg-onyx2 rounded-xl shadow-md overflow-hidden flex flex-col lg:flex-row w-full">
     {/* Menu Image - Responsive sizing */}
     <div className="relative h-64 sm:h-80 md:h-96 lg:h-auto lg:w-1/2 xl:w-[60%]">
      {currentMenu.imageUrl ? (
       <Image
        src={currentMenu.imageUrl}
        alt={currentMenu.name}
        fill
        className="object-contain"
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
       />
      ) : (
       <div className="bg-white dark:bg-onyx2 h-full w-full flex items-center justify-center">
        <FaUtensils className="text-5xl text-gray-400" />
       </div>
      )}
     </div>

     {/* Menu Content */}
     <div className="p-4 sm:p-6 md:p-8 w-full lg:w-1/2 xl:w-[40%]">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 w-full">
       <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-onyx1 dark:text-white">
         {currentMenu.name}
        </h1>
        {currentMenu.category && (
         <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
          {currentMenu.category}
         </span>
        )}
       </div>
       <div className="text-left sm:text-right">
        <p className="text-2xl font-bold text-onyx1 dark:text-white">
         {formatPrice(calculateTotalPrice(currentMenu))}
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
         Harga sudah termasuk Pajak
        </p>
       </div>
      </div>

      {/* Description */}
      <div className="mt-6">
       <h3 className="text-lg font-semibold text-onyx1 dark:text-white mb-2">
        Deskripsi
       </h3>
       <p className="text-gray-600 dark:text-gray-400">
        {currentMenu.description || "No description available."}
       </p>
      </div>

      {/* Additional Info */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
       <div>
        <h4 className="text-sm font-medium text-gray-500">Availability</h4>
        <p
         className={`mt-1 font-medium ${
          currentMenu.isAvailable ? "text-green-600" : "text-red-600"
         }`}>
         {currentMenu.isAvailable ? "In Stock" : "Out of Stock"}
        </p>
       </div>
      </div>
     </div>
    </motion.div>

    {/* Recommendations */}
    {recommendations.length > 0 && (
     <div className="mt-12">
      <MenuRecommendations
       recommendations={recommendations}
       currentMenuId={currentMenu.id}
       outletId={outletId}
      />
     </div>
    )}
   </div>
  </div>
 );
};

export default MenuDetailPage;
