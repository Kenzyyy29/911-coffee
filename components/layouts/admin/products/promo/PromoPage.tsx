"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import {
 FiPlus,
 FiEdit2,
 FiTrash2,
 FiImage,
 FiCoffee,
 FiArrowLeft,
} from "react-icons/fi";
import {useOutlets} from "@/lib/hooks/useOutlets";
import {usePromo} from "@/lib/hooks/usePromo";
import {
 Promo,
 PromoCategory,
 normalizeCategory,
 promoCategories,
} from "@/lib/types/promo";
import Image from "next/image";
import AddPromo from "./AddPromo";
import EditPromoModal from "./EditPromoModal";
import DeletePromoModal from "./DeletePromoModal";
import {formatPrice} from "@/lib/utils/formatPrice";

const PromoPage = () => {
 const [selectedOutlet, setSelectedOutlet] = useState<string>("");
 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [promoToDelete, setPromoToDelete] = useState<string | null>(null);
 const [currentPromo, setCurrentPromo] = useState<Promo | null>(null);
 const [selectedCategory, setSelectedCategory] = useState<
  PromoCategory | "All"
 >("All");
 const {promos, loading, addPromo, updatePromo, deletePromo} =
  usePromo(selectedOutlet);
 const {outlets} = useOutlets();

 const filteredPromos =
  selectedCategory === "All"
   ? promos
   : promos.filter(
      (promo) => normalizeCategory(promo.category) === selectedCategory
     );

 const handleAddPromo = () => {
  if (!selectedOutlet) {
   alert("Please select an outlet first");
   return;
  }
  setIsAddModalOpen(true);
 };

 const handleEditPromo = (promo: Promo) => {
  setCurrentPromo(promo);
  setIsEditModalOpen(true);
 };

 const handleDeletePromo = (id: string) => {
  setPromoToDelete(id);
  setIsDeleteModalOpen(true);
 };

 const handleConfirmDelete = async () => {
  if (promoToDelete) {
   await deletePromo(promoToDelete);
   setIsDeleteModalOpen(false);
   setPromoToDelete(null);
  }
 };

 const handleAddSubmit = async (promoData: Omit<Promo, "id" | "createdAt">) => {
  try {
   await addPromo(promoData);
   setIsAddModalOpen(false);
  } catch (error) {
   console.error("Error adding promo:", error);
  }
 };

 const handleEditSubmit = async (
  promoData: Omit<Promo, "id" | "createdAt">
 ) => {
  try {
   if (currentPromo) {
    await updatePromo(currentPromo.id, promoData);
    setIsEditModalOpen(false);
   }
  } catch (error) {
   console.error("Error updating promo:", error);
  }
 };

 if (!selectedOutlet) {
  return (
   <div className="min-h-screen p-4 md:p-8 bg-white dark:bg-onyx1">
    <motion.div
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     className="max-w-6xl mx-auto rounded-lg">
     <h1 className="text-2xl font-bold text-onyx1 dark:text-white mb-6">
      Pilih Outlet
     </h1>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {outlets.map((outlet) => (
       <motion.div
        key={outlet.id}
        whileHover={{scale: 1.03}}
        whileTap={{scale: 0.98}}
        onClick={() => setSelectedOutlet(outlet.id)}
        className="p-4 sm:p-6 border border-onyx1 dark:border-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
        <h3 className="font-medium text-onyx1 dark:text-white">
         {outlet.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
         {outlet.address || "No address provided"}
        </p>
       </motion.div>
      ))}
     </div>
    </motion.div>
   </div>
  );
 }

 const currentOutlet = outlets.find((o) => o.id === selectedOutlet);

 return (
  <div className="min-h-screen bg-white dark:bg-onyx1">
   <motion.div
    initial={{opacity: 0, y: -20}}
    animate={{opacity: 1, y: 0}}
    className="max-w-7xl mx-auto">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
     <button
      onClick={() => setSelectedOutlet("")}
      className="flex items-center text-onyx1 dark:text-white">
      <FiArrowLeft className="mr-2" />
      Kembali ke Outlets
     </button>
     <motion.button
      onClick={handleAddPromo}
      className="flex items-center bg-onyx1 dark:bg-onyx2 text-white px-4 py-2 rounded-lg hover:bg-onyx2 dark:hover:bg-onyx2/90 transition-colors w-full sm:w-auto justify-center">
      <FiPlus className="mr-2" />
      Add Promo
     </motion.button>
    </div>

    <div className="mb-6">
     <h1 className="text-2xl font-bold text-onyx1 dark:text-white text-center md:text-start">
      {currentOutlet?.name} Promo
     </h1>
    </div>

    {/* Filter Section */}
    <div className="mb-6">
     <div className="grid grid-cols-1 md:grid-cols-4 gap-2 space-x-2 overflow-x-auto pb-2">
      <button
       onClick={() => setSelectedCategory("All")}
       className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap max-w-[375px] ${
        selectedCategory === "All"
         ? "bg-onyx1 dark:bg-onyx2 text-white"
         : "bg-gray-100 dark:bg-onyx2 text-onyx1 dark:text-white hover:bg-gray-200 dark:hover:bg-onyx3"
       } transition-colors`}>
       All Categories
      </button>
      {Object.keys(promoCategories).map((category) => (
       <button
        key={category}
        onClick={() => setSelectedCategory(category as PromoCategory)}
        className={`px-4 py-2 rounded-full text-sm font-medium max-w-[375px] whitespace-nowrap ${
         selectedCategory === category
          ? "bg-onyx1 dark:bg-onyx2 text-white"
          : "bg-gray-100 dark:bg-onyx2 text-onyx1 dark:text-white hover:bg-gray-200 dark:hover:bg-onyx3"
        } transition-colors`}>
        {category}
       </button>
      ))}
     </div>
    </div>

    <div className="bg-white dark:bg-onyx2 rounded-xl shadow-sm overflow-hidden">
     {loading ? (
      <div className="p-8 text-center text-gray-500">Loading promo...</div>
     ) : filteredPromos.length === 0 ? (
      <div className="p-8 text-center text-gray-500">
       <FiCoffee className="mx-auto text-4xl mb-4 text-gray-300" />
       <p>
        No promos found{" "}
        {selectedCategory !== "All" ? `for ${selectedCategory} category` : ""}
       </p>
       <button
        onClick={handleAddPromo}
        className="mt-4 text-onyx1 dark:text-white underline hover:text-gray-600 transition-colors">
        Add a new promo
       </button>
      </div>
     ) : (
      <div className="overflow-y-auto max-h-[70dvh] max-w-[375px] md:max-w-full">
       <table className="w-full divide-y divide-gray-200 dark:divide-onyx1">
        <thead className="bg-white dark:bg-onyx2">
         <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Image
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Name
          </th>
          <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Category
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Price
          </th>
          <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Status
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Actions
          </th>
         </tr>
        </thead>
        <tbody className="bg-white dark:bg-onyx2 divide-y divide-gray-200 dark:divide-onyx1">
         {filteredPromos.map((promo) => (
          <motion.tr
           key={promo.id}
           initial={{opacity: 0}}
           animate={{opacity: 1}}
           className="hover:bg-gray-50 dark:hover:bg-onyx3 transition-colors">
           <td className="px-4 py-4 whitespace-nowrap">
            {promo.imageUrl ? (
             <div className="flex-shrink-0 h-10 w-10">
              <Image
               width={40}
               height={40}
               src={promo.imageUrl}
               alt={promo.name}
               className="h-10 w-10 rounded-full object-cover"
              />
             </div>
            ) : (
             <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <FiImage className="text-gray-400" />
             </div>
            )}
           </td>
           <td className="px-4 py-4">
            <div className="text-sm font-medium text-onyx1 dark:text-white">
             {promo.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
             {promo.description}
            </div>
           </td>
           <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap">
            <div className="text-sm text-onyx1 dark:text-white capitalize">
             {promo.category}
            </div>
           </td>
           <td className="px-4 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-onyx1 dark:text-white">
             {formatPrice(promo.price)}
            </div>
           </td>
           <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap">
            <span
             className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              promo.isActive
               ? "bg-green-100 text-green-800"
               : "bg-red-100 text-red-800"
             }`}>
             {promo.isActive ? "Active" : "Inactive"}
            </span>
           </td>
           <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex space-x-4">
             <button
              onClick={() => handleEditPromo(promo)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Edit promo">
              <FiEdit2 />
             </button>
             <button
              onClick={() => handleDeletePromo(promo.id)}
              className="text-red-600 hover:text-red-900 transition-colors"
              aria-label="Delete promo">
              <FiTrash2 />
             </button>
            </div>
           </td>
          </motion.tr>
         ))}
        </tbody>
       </table>
      </div>
     )}
    </div>
   </motion.div>

   <AddPromo
    isOpen={isAddModalOpen}
    onClose={() => setIsAddModalOpen(false)}
    onSubmit={handleAddSubmit}
    outletId={selectedOutlet}
   />
   {currentPromo && (
    <EditPromoModal
     isOpen={isEditModalOpen}
     onClose={() => setIsEditModalOpen(false)}
     onSubmit={handleEditSubmit}
     currentPromo={currentPromo}
     outletId={selectedOutlet}
    />
   )}
   <DeletePromoModal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    onConfirm={handleConfirmDelete}
    promoName={promos.find((p) => p.id === promoToDelete)?.name}
    isLoading={loading}
   />
  </div>
 );
};

export default PromoPage;
