"use client";

import {useState, useEffect, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {
 FaStore,
 FaUtensils,
 FaSearch,
 FaSpinner,
 FaArrowLeft,
 FaFilter,
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
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const MenuPage = () => {
 const searchParams = useSearchParams();
 const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
 const [searchTerm, setSearchTerm] = useState("");
 const [selectedCategory, setSelectedCategory] = useState<string>("All");
 const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
 const {outlets, loading: outletsLoading} = useOutlets();
 const {menus, loading: menusLoading} = useMenu(selectedOutlet?.id || "");
 const {taxes} = useTaxes();
 const swiperRefs = useRef<{[key: string]: any}>({});

 useEffect(() => {
  const outletId = searchParams.get("outlet");
  if (outletId && outlets.length > 0) {
   const outlet = outlets.find((o) => o.id === outletId);
   if (outlet) setSelectedOutlet(outlet);
  }
 }, [outlets, searchParams]);

 const calculateTotalPrice = (menu: Menu) => {
  if (!menu?.taxIds || menu.taxIds.length === 0) return menu?.price || 0;

  const applicableTaxes = taxes.filter((tax) => menu.taxIds.includes(tax.id));
  let totalPrice = menu.price;

  applicableTaxes.forEach((tax) => {
   totalPrice *= 1 + tax.rate / 100;
  });

  return totalPrice;
 };

 const categories = [
  "All",
  ...new Set(
   [...menus]
    .sort(
     (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .map((menu) => menu.category)
    .filter(Boolean)
  ),
 ];

 const filteredMenus = menus.filter((menu) => {
  const matchesSearch = menu.name
   .toLowerCase()
   .includes(searchTerm.toLowerCase());
  const matchesCategory =
   selectedCategory === "All" || menu.category === selectedCategory;
  return matchesSearch && matchesCategory;
 });

 const groupedMenus = categories
  .filter((cat) => cat !== "All")
  .map((category) => ({
   category,
   menus: filteredMenus
    .filter((menu) => menu.category === category)
    .sort(
     (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    ),
  }))
  .filter((group) => group.menus.length > 0)
  .sort((a, b) => {
   const oldestA = a.menus[0]?.createdAt || 0;
   const oldestB = b.menus[0]?.createdAt || 0;
   return new Date(oldestA).getTime() - new Date(oldestB).getTime();
  });

 const handleBackToOutlets = () => {
  setSelectedOutlet(null);
  setSearchTerm("");
  setSelectedCategory("All");
 };

 const getOutletImage = (outletId: string) => {
  try {
   return `/outlets/${outletId}.jpg`;
  } catch {
   return `/outlets/default.jpeg`;
  }
 };

 return (
  <div className="min-h-[100dvh] p-4 md:p-8 bg-gray-50 dark:bg-onyx1">
   <motion.div
    initial={{opacity: 0, y: -20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.5}}
    className="max-w-6xl mx-auto">
    {/* Header */}
    <div className="flex items-center gap-4 mb-6">
     {selectedOutlet && (
      <motion.button
       whileHover={{scale: 1.05}}
       whileTap={{scale: 0.95}}
       onClick={handleBackToOutlets}
       className="p-2 rounded-full bg-white dark:bg-onyx2 shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-onyx3 transition-colors">
       <FaArrowLeft className="text-lg" />
      </motion.button>
     )}
     <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2 dark:text-white">
      {selectedOutlet ? `${selectedOutlet.name} Menu` : "Menu Kami"}
     </h1>
    </div>

    {/* Outlet Selection */}
    {!selectedOutlet && (
     <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{delay: 0.2}}>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-onyx1 dark:text-white pb-0">
       <FaStore className="text-onyx1 dark:text-white" /> Pilih Outlet
      </h2>
      {outletsLoading ? (
       <div className="flex justify-center py-8">
        <FaSpinner className="animate-spin text-2xl text-onyx1 dark:text-white" />
       </div>
      ) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
        {outlets.map((outlet) => (
         <motion.div
          key={outlet.id}
          whileHover={{scale: 1.03}}
          whileTap={{scale: 0.98}}
          className="border rounded-lg p-4 bg-white dark:bg-onyx2 cursor-pointer hover:bg-blue-50 dark:hover:bg-onyx3 transition-colors flex flex-col border-gray-200 dark:border-onyx3"
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
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
           {outlet.address}
          </p>
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
          <p className="text-gray-500 dark:text-gray-400">
           {selectedOutlet.address}
          </p>
         </div>
        </div>
        <div className="flex gap-2">
         <motion.button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center text-onyx1 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-onyx3 transition-colors">
          <FaFilter className="mr-2" />
          Filter
         </motion.button>
        </div>
       </div>
      </motion.div>

      {/* Current filter indicator */}
      {selectedCategory !== "All" && (
       <div className="mb-4">
        <span className="text-sm text-onyx1 dark:text-white">
         Showing category:{" "}
         <span className="font-medium">{selectedCategory}</span>
        </span>
       </div>
      )}

      {/* Search Section */}
      <div className="bg-white dark:bg-onyx2 rounded-xl shadow-md p-6 mb-8">
       <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
         <FaSearch className="text-gray-400" />
        </div>
        <input
         type="text"
         placeholder="Search Menu..."
         className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-onyx3 focus:outline-none focus:ring-2 focus:ring-onyx1 focus:border-transparent bg-white dark:bg-onyx2 text-gray-800 dark:text-white"
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
        />
       </div>
      </div>

      {/* Menu Items */}
      {menusLoading ? (
       <div className="flex justify-center py-12 bg-white dark:bg-onyx2 rounded-xl shadow-sm">
        <FaSpinner className="animate-spin text-3xl text-black dark:text-white" />
       </div>
      ) : filteredMenus.length === 0 ? (
       <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        className="text-center py-12 bg-white dark:bg-onyx2 rounded-xl shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">
         {searchTerm || selectedCategory !== "All"
          ? "No menu items match your search criteria"
          : "No menu items available at this outlet"}
        </p>
       </motion.div>
      ) : selectedCategory === "All" ? (
       // Swipeable category sections when "All" is selected
       <div className="space-y-8">
        {groupedMenus.map(({category, menus: categoryMenus}) => (
         <div
          key={category}
          className="space-y-4 relative">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
           {category}
          </h2>

          <div className="relative">
           <Swiper
            modules={[Navigation]}
            navigation={{
             prevEl: `.prev-${category}`,
             nextEl: `.next-${category}`,
            }}
            spaceBetween={24}
            slidesPerView={1.2}
            breakpoints={{
             640: {
              slidesPerView: 2.2,
             },
             768: {
              slidesPerView: 2.5,
             },
             1024: {
              slidesPerView: 3.2,
             },
            }}
            onSwiper={(swiper) => {
             swiperRefs.current[category] = swiper;
            }}
            className="px-2">
            {categoryMenus.map((menu) => (
             <SwiperSlide key={menu.id}>
              <Link
               href={`/menu/${menu.id}?outlet=${selectedOutlet.id}`}
               passHref>
               <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, scale: 0.9}}
                transition={{duration: 0.3}}
                whileHover={{y: -5}}
                className="h-full bg-white dark:bg-onyx2 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
                    <FaUtensils className="text-4xl text-gray-400 dark:text-gray-600" />
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
                 <p className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                  {menu.description}
                 </p>
                 <div className="mt-4 flex justify-between items-center">
                  <span
                   className={`px-2 py-1 rounded text-xs font-medium ${
                    menu.isAvailable
                     ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                     : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                   }`}>
                   {menu.isAvailable ? "Available" : "Unavailable"}
                  </span>
                 </div>
                </div>
               </motion.div>
              </Link>
             </SwiperSlide>
            ))}
           </Swiper>

           {/* Navigation buttons */}
           {categoryMenus.length > 2 && (
            <>
             <button
              className={`prev-${category} absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-onyx2 shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-onyx3 transition-colors -ml-4`}
              aria-label={`Previous ${category} menus`}>
              &lt;
             </button>
             <button
              className={`next-${category} absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-onyx2 shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-onyx3 transition-colors -mr-4`}
              aria-label={`Next ${category} menus`}>
              &gt;
             </button>
            </>
           )}
          </div>
         </div>
        ))}
       </div>
      ) : (
       // Grid layout when a specific category is selected
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
                <FaUtensils className="text-4xl text-gray-400 dark:text-gray-600" />
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
              <span className="inline-block mt-1 px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded-full">
               {menu.category}
              </span>
             )}
             <p className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
              {menu.description}
             </p>
             <div className="mt-4 flex justify-between items-center">
              <span
               className={`px-2 py-1 rounded text-xs font-medium ${
                menu.isAvailable
                 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                 : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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

   {/* Filter Modal */}
   {isFilterModalOpen && (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
     <motion.div
      initial={{opacity: 0, scale: 0.9}}
      animate={{opacity: 1, scale: 1}}
      className="bg-white dark:bg-onyx2 rounded-lg p-6 w-full max-w-md max-h-[90dvh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
       <h3 className="text-lg font-medium text-onyx1 dark:text-white">
        Filter by Category
       </h3>
       <button
        onClick={() => setIsFilterModalOpen(false)}
        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        &times;
       </button>
      </div>

      <div className="space-y-2">
       <button
        onClick={() => {
         setSelectedCategory("All");
         setIsFilterModalOpen(false);
        }}
        className={`w-full text-left px-4 py-2 rounded-lg ${
         selectedCategory === "All"
          ? "bg-onyx1 dark:bg-white dark:text-onyx1 text-white"
          : "bg-gray-100 dark:bg-onyx2 text-onyx1 dark:text-white hover:bg-gray-200 dark:hover:bg-onyx1"
        } transition-colors`}>
        All Categories
       </button>

       {Array.from(new Set(menus.map((menu) => menu.category))).map(
        (category) => (
         <button
          key={category}
          onClick={() => {
           setSelectedCategory(category);
           setIsFilterModalOpen(false);
          }}
          className={`w-full text-left px-4 py-2 rounded-lg ${
           selectedCategory === category
            ? "bg-onyx1 dark:bg-white dark:text-onyx1 text-white"
            : "bg-gray-100 dark:bg-onyx2 text-onyx1 dark:text-white hover:bg-gray-200 dark:hover:bg-onyx1"
          } transition-colors`}>
          {category}
         </button>
        )
       )}
      </div>
     </motion.div>
    </div>
   )}
  </div>
 );
};

export default MenuPage;
