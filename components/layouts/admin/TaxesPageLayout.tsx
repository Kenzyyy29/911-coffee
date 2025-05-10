"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import {
 FiPlus,
 FiEdit2,
 FiTrash2,
 FiPercent,
 FiInfo,
} from "react-icons/fi";
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
  <div className="max-h-[100dvh]">
   <motion.div
    initial={{opacity: 0, y: -20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.5}}
    className="w-full mx-auto">
    <div className="flex justify-between items-center mb-8">
     <h1 className="text-3xl font-bold text-gray-800">Tax Management</h1>
     <motion.button
      onClick={handleAddTax}
      className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition-colors">
      <FiPlus /> Add Tax
     </motion.button>
    </div>

    {error && (
     <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      {error}
     </motion.div>
    )}

    {loading && !taxes.length ? (
     <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
     </div>
    ) : (
     <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-y-auto">
       <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-800 text-white">
         <tr>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
           Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
           Rate
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
           Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
           Description
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
           Actions
          </th>
         </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
         {taxes.map((tax) => (
          <motion.tr
           key={tax.id}
           variants={itemVariants}
           whileHover={{backgroundColor: "rgba(0, 0, 0, 0.02)"}}
           className="hover:bg-gray-50">
           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {tax.name}
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
            <FiPercent className="mr-1" /> {tax.rate}%
           </td>
           <td className="px-6 py-4 whitespace-nowrap">
            <span
             className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              tax.isActive
               ? "bg-green-100 text-green-800"
               : "bg-red-100 text-red-800"
             }`}>
             {tax.isActive ? "Active" : "Inactive"}
            </span>
           </td>
           <td className="px-6 py-4 text-sm text-gray-500">
            {tax.description || (
             <span className="text-gray-400 flex items-center">
              <FiInfo className="mr-1" /> No description
             </span>
            )}
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex justify-end space-x-2">
             <motion.button
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.9}}
              onClick={() => handleEditTax(tax)}
              className="text-gray-600 hover:text-gray-900">
              <FiEdit2 />
             </motion.button>
             <motion.button
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.9}}
              onClick={() => handleDeleteClick(tax)}
              className="text-red-600 hover:text-red-900">
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
