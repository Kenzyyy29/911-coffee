//TaxesPageLayout.tsx
"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import {FiPlus, FiEdit2, FiTrash2, FiPercent, FiInfo} from "react-icons/fi";
import {useTaxes} from "@/lib/hooks/useTaxes";
import TaxFormModal from "./TaxFormModal";
import DeleteTaxModal from "./DeleteTaxModal";
import {Tax} from "@/lib/types/tax";

const TaxesPageLayout = () => {
 const {taxes, loading, error, addTax, updateTax, deleteTax} = useTaxes();
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [currentTax, setCurrentTax] = useState<Tax | null>(null);
 const [isEditing, setIsEditing] = useState(false);

 const handleAddTax = () => {
  setCurrentTax(null);
  setIsEditing(false);
  setIsModalOpen(true);
 };

 const handleEditTax = (tax: Tax) => {
  setCurrentTax(tax);
  setIsEditing(true);
  setIsModalOpen(true);
 };

 const handleDeleteClick = (tax: Tax) => {
  setCurrentTax(tax);
  setIsDeleteModalOpen(true);
 };

 const handleDeleteConfirm = async () => {
  if (currentTax?.id) {
   await deleteTax(currentTax.id);
   setIsDeleteModalOpen(false);
  }
 };

 const handleSubmit = async (taxData: Omit<Tax, "id" | "createdAt">) => {
  if (isEditing && currentTax?.id) {
   await updateTax(currentTax.id, taxData);
  } else {
   await addTax(taxData);
  }
  setIsModalOpen(false);
 };

 const containerVariants = {
  hidden: {opacity: 0},
  visible: {
   opacity: 1,
   transition: {
    staggerChildren: 0.1,
   },
  },
 };

 const itemVariants = {
  hidden: {y: 20, opacity: 0},
  visible: {
   y: 0,
   opacity: 1,
   transition: {
    duration: 0.5,
   },
  },
 };

 return (
  <div className="h-[100dvh] p-4 md:p-8 bg-white dark:bg-onyx1">
   <motion.div
    initial={{opacity: 0, y: -20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.3}}
    className="max-w-6xl mx-auto rounded-lg">
    <div className="max-w-6xl mx-auto rounded-lg flex justify-between items-center">
     <h1 className="text-2xl font-bold text-onyx1 dark:text-white mb-6">
      Tax Management
     </h1>
     <motion.button
      onClick={handleAddTax}
      className="flex items-center gap-2 bg-onyx1 dark:bg-onyx2 text-white px-4 py-2 rounded-lg hover:bg-onyx2 dark:hover:bg-onyx2/90 transition-colors mb-6">
      <FiPlus /> Add Tax
     </motion.button>
    </div>

    {error && (
     <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 mb-6">
      {error}
     </motion.div>
    )}

    {loading && !taxes.length ? (
     <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800 dark:border-gray-300"></div>
     </div>
    ) : (
     <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-onyx1 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-hidden">
       <table className="min-w-full divide-y divide-gray-200 dark:divide-onyx1">
        <thead className="bg-white dark:bg-onyx2">
         <tr>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-onyx1 dark:text-white">
           Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-onyx1 dark:text-white">
           Rate
          </th>
          <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-onyx1 dark:text-white">
           Status
          </th>
          <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-onyx1 dark:text-white">
           Description
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-onyx1 dark:text-white">
           Actions
          </th>
         </tr>
        </thead>
        <tbody className="bg-white dark:bg-onyx2 divide-y divide-gray-200 dark:divide-onyx1">
         {taxes.map((tax) => (
          <motion.tr
           key={tax.id}
           variants={itemVariants}
           className="hover:bg-gray-50 dark:hover:bg-onyx3">
           <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-onyx1 dark:text-white">
             {tax.name}
            </div>
           </td>
           <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-onyx1 dark:text-white flex items-center">
             <FiPercent className="mr-1" /> {tax.rate}%
            </div>
           </td>
           <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
            <span
             className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              tax.isActive
               ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
               : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
             }`}>
             {tax.isActive ? "Active" : "Inactive"}
            </span>
           </td>
           <td className="hidden md:table-cell px-6 py-4">
            <div className="text-sm text-onyx1 dark:text-white">
             {tax.description || (
              <span className="text-gray-400 dark:text-gray-500 flex items-center">
               <FiInfo className="mr-1" /> No description
              </span>
             )}
            </div>
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex justify-end space-x-2">
             <motion.button
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.9}}
              onClick={() => handleEditTax(tax)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Edit">
              <FiEdit2 />
             </motion.button>
             <motion.button
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.9}}
              onClick={() => handleDeleteClick(tax)}
              className="text-red-600 hover:text-red-900 dark:hover:text-red-400 transition-colors"
              aria-label="Delete">
              <FiTrash2 />
             </motion.button>
            </div>
           </td>
          </motion.tr>
         ))}
        </tbody>
       </table>
      </div>
     </motion.div>
    )}
   </motion.div>

   <TaxFormModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onSubmit={handleSubmit}
    tax={currentTax}
    isEditing={isEditing}
   />

   <DeleteTaxModal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    onConfirm={handleDeleteConfirm}
    title="Delete Tax"
    message={`Are you sure you want to delete "${currentTax?.name}" tax?`}
   />
  </div>
 );
};

export default TaxesPageLayout;
