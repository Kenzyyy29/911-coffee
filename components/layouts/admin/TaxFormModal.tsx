// app/admin/dashboard/products/taxes/components/TaxFormModal.tsx
"use client";

import {motion} from "framer-motion";
import {FiX, FiPercent, FiInfo} from "react-icons/fi";
import {Tax} from "@/lib/types/tax";
import {useState, useEffect} from "react";

interface TaxFormModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSubmit: (taxData: Omit<Tax, "id" | "createdAt">) => void;
 tax?: Tax | null;
 isEditing: boolean;
}

const TaxFormModal = ({
 isOpen,
 onClose,
 onSubmit,
 tax,
 isEditing,
}: TaxFormModalProps) => {
 const [formData, setFormData] = useState<Omit<Tax, "id" | "createdAt">>({
  name: "",
  rate: 0,
  description: "",
  isActive: true,
 });

 useEffect(() => {
  if (tax) {
   setFormData({
    name: tax.name,
    rate: tax.rate || 0, // Ensure rate is never undefined
    description: tax.description || "",
    isActive: tax.isActive,
   });
  } else {
   setFormData({
    name: "",
    rate: 0,
    description: "",
    isActive: true,
   });
  }
 }, [tax]);

 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
 ) => {
  const {name, value, type} = e.target as HTMLInputElement;
  const checked =
   type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

  setFormData((prev) => ({
   ...prev,
   [name]:
    type === "checkbox"
     ? checked
     : type === "number"
     ? value === ""
       ? 0
       : parseFloat(value)
     : value,
  }));
 };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  onSubmit(formData);
 };

 if (!isOpen) return null;

 return (
  <motion.div
   initial={{opacity: 0}}
   animate={{opacity: 1}}
   exit={{opacity: 0}}
   className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
   <motion.div
    initial={{y: -50, opacity: 0}}
    animate={{y: 0, opacity: 1}}
    exit={{y: 50, opacity: 0}}
    className="bg-white rounded-xl shadow-lg w-full max-w-md">
    <div className="flex justify-between items-center border-b border-gray-200 p-4">
     <h3 className="text-lg font-semibold text-gray-800">
      {isEditing ? "Edit Tax" : "Add New Tax"}
     </h3>
     <button
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700">
      <FiX size={24} />
     </button>
    </div>

    <form
     onSubmit={handleSubmit}
     className="p-6">
     <div className="mb-4">
      <label
       htmlFor="name"
       className="block text-sm font-medium text-gray-700 mb-1">
       Tax Name
      </label>
      <input
       type="text"
       id="name"
       name="name"
       value={formData.name}
       onChange={handleChange}
       required
       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
      />
     </div>

     <div className="mb-4">
      <label
       htmlFor="rate"
       className="block text-sm font-medium text-gray-700 mb-1">
       Tax Rate (%)
      </label>
      <div className="relative">
       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiPercent className="text-gray-400" />
       </div>
       <input
        type="number"
        id="rate"
        name="rate"
        value={formData.rate.toString()} // Convert to string to avoid NaN
        onChange={handleChange}
        min="0"
        max="100"
        step="0.01"
        required
        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
       />
      </div>
     </div>

     <div className="mb-4">
      <label
       htmlFor="description"
       className="block text-sm font-medium text-gray-700 mb-1">
       Description (Optional)
      </label>
      <div className="relative">
       <div className="absolute inset-y-0 left-0 pl-3 pt-2 flex items-start pointer-events-none">
        <FiInfo className="text-gray-400" />
       </div>
       <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={3}
        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
       />
      </div>
     </div>

     <div className="mb-6">
      <label className="flex items-center">
       <input
        type="checkbox"
        name="isActive"
        checked={formData.isActive}
        onChange={handleChange}
        className="h-4 w-4 text-gray-800 focus:ring-gray-800 border-gray-300 rounded"
       />
       <span className="ml-2 text-sm text-gray-700">Active</span>
      </label>
     </div>

     <div className="flex justify-end space-x-3">
      <motion.button
       type="button"
       onClick={onClose}
       whileHover={{scale: 1.05}}
       whileTap={{scale: 0.95}}
       className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
       Cancel
      </motion.button>
      <motion.button
       type="submit"
       whileHover={{scale: 1.05}}
       whileTap={{scale: 0.95}}
       className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800">
       {isEditing ? "Update Tax" : "Add Tax"}
      </motion.button>
     </div>
    </form>
   </motion.div>
  </motion.div>
 );
};

export default TaxFormModal;
