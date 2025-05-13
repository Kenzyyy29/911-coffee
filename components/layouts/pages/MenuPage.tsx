"use client";

import {useState, useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {
 FaStore,
 FaUtensils,
 FaSearch,
 FaSpinner,
 FaArrowLeft,
} from "react-icons/fa";
import {useOutlets} from "@/lib/hooks/useOutlets";
import {useMenu} from "@/lib/hooks/useMenu";
import {useTaxes} from "@/lib/hooks/useTaxes";
import {Menu} from "@/lib/types/menu";
import {Outlet} from "@/lib/types/outlet";
import Image from "next/image";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {formatPrice} from "@/lib/utils/formatPrice";

const MenuPage = () => {
 const searchParams = useSearchParams();
 const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
 const [searchTerm, setSearchTerm] = useState("");
 const [selectedCategory, setSelectedCategory] = useState<string>("All");
 const {outlets, loading: outletsLoading} = useOutlets();
 const {menus, loading: menusLoading} = useMenu(selectedOutlet?.id || "");
 const {taxes} = useTaxes();

 // Check for outlet ID in URL params on initial load
 useEffect(() => {
  const outletId = searchParams.get("outlet");
  if (outletId && outlets.length > 0) {
   const outlet = outlets.find((o) => o.id === outletId);
   if (outlet) setSelectedOutlet(outlet);
  }
 }, [outlets, searchParams]);

 // Calculate total price with taxes
 const calculateTotalPrice = (menu: Menu) => {
  if (!menu.taxIds || menu.taxIds.length === 0) return menu.price;

  const applicableTaxes = taxes.filter((tax) => menu.taxIds.includes(tax.id));
  const totalTaxRate = applicableTaxes.reduce((sum, tax) => sum + tax.rate, 0);

  return menu.price * (1 + totalTaxRate / 100);
 };

 // Get unique categories from menus
 const categories = [
  "All",
  ...new Set(menus.map((menu) => menu.category).filter(Boolean)),
 ];

 const filteredMenus = menus.filter((menu) => {
  const matchesSearch = menu.name
   .toLowerCase()
   .includes(searchTerm.toLowerCase());
  const matchesCategory =
   selectedCategory === "All" || menu.category === selectedCategory;
  return matchesSearch && matchesCategory;
 });

 const handleBackToOutlets = () => {
  setSelectedOutlet(null);
  setSearchTerm("");
  setSelectedCategory("All");
 };

 // Function to get outlet image path
  const getOutletImage = (outletId: string) => {
   try {
    // Try to require the image (helps with build-time checking)
    require(`@/public/outlets/${outletId}.jpg`);
    return `/outlets/${outletId}.jpg`;
   } catch (e) {
    return `/outlets/default.jpeg`; 
   }
  };

 return (
  <div className="min-h-[100dvh] p-4 md:p-8 bg-white dark:bg-onyx1">
   <motion.div
    initial={{opacity: 0, y: -20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.5}}
    className="max-w-6xl mx-auto">
    {/* Header */}
    <div className="flex items-center gap-4 mb-6 ">
     {selectedOutlet && (
      <motion.button
       whileHover={{scale: 1.05}}
       whileTap={{scale: 0.95}}
       onClick={handleBackToOutlets}
       className="p-2 rounded-full bg-white shadow-md text-gray-600 hover:bg-gray-100 transition-colors ">
       <FaArrowLeft className="text-lg" />
      </motion.button>
     )}
     <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2 dark:text-white">
      {selectedOutlet ? `${selectedOutlet.name} Menu` : "Our Outlets"}
     </h1>
    </div>

    {/* Outlet Selection */}
    {!selectedOutlet && (
     <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{delay: 0.2}}
      className=" rounded-xl shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-onyx1 dark:text-white">
       <FaStore className="text-onyx1 dark:text-white" /> Pilih Outlet
      </h2>
      {outletsLoading ? (
       <div className="flex justify-center py-8">
        <FaSpinner className="animate-spin text-2xl text-onyx1 dark:text-white" />
       </div>
      ) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {outlets.map((outlet) => (
         <motion.div
          key={outlet.id}
          whileHover={{scale: 1.03}}
          whileTap={{scale: 0.98}}
          className="border rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition-colors flex flex-col"
          onClick={() => setSelectedOutlet(outlet)}>
          <div className="relative h-40 w-full mb-3 rounded-md overflow-hidden">
           <Image
            src={getOutletImage(outlet.id)}
            alt={outlet.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
           />
          </div>
          <h3 className="font-medium text-onyx1 dark:text-white">
           {outlet.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{outlet.address}</p>
         </motion.div>
        ))}
       </div>
      )}
     </motion.div>
    )}

    {/* Menu Section */}
    {selectedOutlet && (
     <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{delay: 0.3}}>
      {/* Outlet Info */}
      <motion.div
       initial={{opacity: 0, y: -10}}
       animate={{opacity: 1, y: 0}}
       transition={{duration: 0.3}}
       className="bg-white dark:bg-onyx2 rounded-xl shadow-md p-6 mb-8">
       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-4">
         <div className="relative h-20 w-20 min-w-[80px] rounded-md overflow-hidden">
          <Image
           src={getOutletImage(selectedOutlet.id)}
           alt={selectedOutlet.name}
           fill
           className="object-cover"
           sizes="80px"
          />
         </div>
         <div>
          <h2 className="text-xl font-semibold text-onyx1 dark:text-white">
           {selectedOutlet.name}
          </h2>
          <p className="text-gray-500">{selectedOutlet.address}</p>
         </div>
        </div>
       </div>
      </motion.div>

      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-onyx2 rounded-xl shadow-md p-6 mb-8">
       {/* Search Bar */}
       <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
         <FaSearch className="text-gray-400" />
        </div>
        <input
         type="text"
         placeholder="Search menu items..."
         className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
        />
       </div>

       {/* Category Filter */}
       {categories.length > 1 && (
        <div>
         <h3 className="text-sm font-medium text-onyx1 dark:text-white mb-2">
          Categories
         </h3>
         <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
           <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
             selectedCategory === category
              ? "bg-onyx1 text-white"
              : "bg-gray-200 text-gray-500 hover:bg-gray-300"
            }`}>
            {category}
           </button>
          ))}
         </div>
        </div>
       )}
      </div>

      {/* Menu Items */}
      {menusLoading ? (
       <div className="flex justify-center py-12">
        <FaSpinner className="animate-spin text-3xl text-black dark:text-white" />
       </div>
      ) : filteredMenus.length === 0 ? (
       <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        className="text-center py-12 bg-white dark:bg-onyx1 rounded-xl shadow-sm">
        <p className="text-gray-500">
         {searchTerm || selectedCategory !== "All"
          ? "No menu items match your search criteria"
          : "No menu items available at this outlet"}
        </p>
       </motion.div>
      ) : (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
         {filteredMenus.map((menu) => (
          <Link
           key={menu.id}
           href={`/menu/${menu.id}?outlet=${selectedOutlet.id}`}
           passHref>
           <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, scale: 0.9}}
            transition={{duration: 0.3}}
            whileHover={{y: -5}}
            className="bg-white dark:bg-onyx2 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full bg-white dark:bg-onyx2 p-4">
             <div className="relative h-full w-full">
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
            <div className="p-4">
             <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-onyx1 dark:text-white">
               {menu.name}
              </h3>
              <span className="font-bold text-onyx1 dark:text-white">
               {formatPrice(calculateTotalPrice(menu))}
              </span>
             </div>
             {menu.category && (
              <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
               {menu.category}
              </span>
             )}
             <p className="text-gray-500 mt-2 line-clamp-2">
              {menu.description}
             </p>
             <div className="mt-4 flex justify-between items-center">
              <span
               className={`px-2 py-1 rounded text-xs font-medium ${
                menu.isAvailable
                 ? "bg-green-100 text-green-800"
                 : "bg-red-100 text-red-800"
               }`}>
               {menu.isAvailable ? "Available" : "Unavailable"}
              </span>
             </div>
            </div>
           </motion.div>
          </Link>
         ))}
        </AnimatePresence>
       </div>
      )}
     </motion.div>
    )}
   </motion.div>
  </div>
 );
};

export default MenuPage;
