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
import {Promo} from "@/lib/types/promo";
import Image from "next/image";
import AddPromoModal from "./AddPromoModal";
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
 const {promos, loading, addPromo, updatePromo, deletePromo} =
  usePromo(selectedOutlet);
 const {outlets} = useOutlets();

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
   <div className="max-h-[100dvh] w-full overflow-hidden">
    <motion.div
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     className="mx-auto bg-white text-center p-6">
     <h1 className="text-2xl font-bold text-gray-800 mb-6">Select an Outlet</h1>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {outlets.map((outlet) => (
       <motion.div
        key={outlet.id}
        whileHover={{scale: 1.03}}
        whileTap={{scale: 0.98}}
        onClick={() => setSelectedOutlet(outlet.id)}
        className="p-6 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
        <h3 className="font-medium text-gray-900">{outlet.name}</h3>
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
  <div className="max-h-[100dvh] overflow-y-auto">
   <motion.div
    initial={{opacity: 0, y: -20}}
    animate={{opacity: 1, y: 0}}
    className="max-w-7xl mx-auto p-6">
    <div className="flex justify-between items-center mb-6">
     <button
      onClick={() => setSelectedOutlet("")}
      className="flex items-center text-gray-600 hover:text-gray-800">
      <FiArrowLeft className="mr-2" />
      Back to Outlets
     </button>
     <motion.button
      onClick={handleAddPromo}
      whileHover={{scale: 1.05}}
      whileTap={{scale: 0.95}}
      className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
      <FiPlus className="mr-2" />
      Add Promo
     </motion.button>
    </div>

    <div className="mb-6">
     <h1 className="text-2xl font-bold text-gray-800">
      {currentOutlet?.name} Promos
     </h1>
    </div>

    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
     {loading ? (
      <div className="p-8 text-center text-gray-500">Loading promos...</div>
     ) : promos.length === 0 ? (
      <div className="p-8 text-center text-gray-500">
       <FiCoffee className="mx-auto text-4xl mb-4 text-gray-300" />
       <p>No promos found for this outlet</p>
       <button
        onClick={handleAddPromo}
        className="mt-4 text-gray-800 underline hover:text-gray-600">
        Add your first promo
       </button>
      </div>
     ) : (
      <div className="overflow-y-auto">
       <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
         <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Image
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Category
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Price
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Actions
          </th>
         </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
         {promos.map((promo) => (
          <motion.tr
           key={promo.id}
           initial={{opacity: 0}}
           animate={{opacity: 1}}
           whileHover={{backgroundColor: "rgba(0, 0, 0, 0.02)"}}
           className="transition-colors">
           <td className="px-6 py-4 whitespace-nowrap">
            {promo.imageUrl ? (
             <Image
              width={40}
              height={40}
              src={promo.imageUrl}
              alt={promo.name}
              className="h-10 w-10 rounded-full object-cover"
             />
            ) : (
             <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <FiImage className="text-gray-400" />
             </div>
            )}
           </td>
           <td className="px-6 py-4">
            <div className="text-sm font-medium text-gray-900">
             {promo.name}
            </div>
            <div className="text-sm text-gray-500 mt-1">
             {promo.description}
            </div>
           </td>
           <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900 capitalize">
             {promo.category}
            </div>
           </td>
           <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">
             {formatPrice(promo.price)}
            </div>
           </td>
           <td className="px-6 py-4 whitespace-nowrap">
            <span
             className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              promo.isActive
               ? "bg-green-100 text-green-800"
               : "bg-red-100 text-red-800"
             }`}>
             {promo.isActive ? "Active" : "Inactive"}
            </span>
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button
             onClick={() => handleEditPromo(promo)}
             className="text-gray-600 hover:text-gray-900 mr-4">
             <FiEdit2 />
            </button>
            <button
             onClick={() => handleDeletePromo(promo.id)}
             className="text-red-600 hover:text-red-900">
             <FiTrash2 />
            </button>
           </td>
          </motion.tr>
         ))}
        </tbody>
       </table>
      </div>
     )}
    </div>
   </motion.div>

   <AddPromoModal
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
