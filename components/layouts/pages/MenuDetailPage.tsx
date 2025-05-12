// app/menu/[id]/page.tsx
"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {FaUtensils, FaArrowLeft, FaSpinner} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import {useMenu} from "@/lib/hooks/useMenu";
import {useTaxes} from "@/lib/hooks/useTaxes";

import {useParams, useSearchParams} from "next/navigation";
import {MenuRecommendations} from "@/components/layouts/pages/MenuRecomendations";
import {Menu} from "@/lib/types/menu";

const MenuDetailPage = () => {
 const params = useParams();
 const searchParams = useSearchParams();
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

  return (menu.price * (1 + totalTaxRate / 100)).toFixed(2);
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

   // Get 3 random recommendations excluding current menu
   setRecommendations(getRandomRecommendations(menus, menuId));
  }
 }, [menus, menuId]);

 if (loading) {
  return (
   <div className="min-h-screen flex items-center justify-center">
    <FaSpinner className="animate-spin text-4xl text-orange-500" />
   </div>
  );
 }

 if (!currentMenu) {
  return (
   <div className="min-h-screen flex flex-col items-center justify-center p-4">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Menu not found</h2>
    <Link
     href={`/menu?outlet=${outletId}`}
     className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
     Back to Menu
    </Link>
   </div>
  );
 }

 return (
  <div className="min-h-[100dvh] bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
   <div className="max-w-4xl mx-auto">
    {/* Back button */}
    <motion.div
     initial={{opacity: 0, y: -20}}
     animate={{opacity: 1, y: 0}}
     className="mb-6">
     <Link
      href={`/menu?outlet=${outletId}`}
      className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors">
      <FaArrowLeft /> Back to Menu
     </Link>
    </motion.div>

    {/* Menu Detail */}
    <motion.div
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     transition={{duration: 0.5}}
     className="bg-white rounded-xl shadow-md overflow-hidden">
     {/* Menu Image */}
     <div className="relative h-64 md:h-80 w-full">
      {currentMenu.imageUrl ? (
       <Image
        src={currentMenu.imageUrl}
        alt={currentMenu.name}
        fill
        className="object-cover"
        priority
       />
      ) : (
       <div className="bg-gray-200 h-full w-full flex items-center justify-center">
        <FaUtensils className="text-5xl text-gray-400" />
       </div>
      )}
     </div>

     {/* Menu Content */}
     <div className="p-6 md:p-8">
      <div className="flex justify-between items-start">
       <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
         {currentMenu.name}
        </h1>
        {currentMenu.category && (
         <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
          {currentMenu.category}
         </span>
        )}
       </div>
       <div className="text-right">
        <p className="text-2xl font-bold text-orange-500">
         IDR {calculateTotalPrice(currentMenu)}
        </p>
       </div>
      </div>

      {/* Description */}
      <div className="mt-6">
       <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
       <p className="text-gray-600">
        {currentMenu.description || "No description available."}
       </p>
      </div>

      {/* Additional Info */}
      <div className="mt-8 grid grid-cols-2 gap-4">
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
     <MenuRecommendations
      recommendations={recommendations}
      currentMenuId={currentMenu.id}
      outletId={outletId}
     />
    )}
   </div>
  </div>
 );
};

export default MenuDetailPage;
