"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import {FiX, FiUpload} from "react-icons/fi";
import {Tax} from "@/lib/types/tax";
import {Menu} from "@/lib/types/menu";

interface AddMenuModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSubmit: (menuData: Omit<Menu, "id" | "createdAt">) => void;
 taxes: Tax[];
 outletId: string;
}

const AddMenuModal = ({
 isOpen,
 onClose,
 onSubmit,
 taxes,
 outletId,
}: AddMenuModalProps) => {
 const [formData, setFormData] = useState({
  name: "",
  description: "",
  price: 0,
  taxId: "",
  outletId: outletId,
  imageUrl: "",
  isAvailable: true,
 });

 const handleChange = (
  e: React.ChangeEvent<
   HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >
 ) => {
  const {name, value, type} = e.target;
  const checked = (e.target as HTMLInputElement).checked;

  setFormData({
   ...formData,
   [name]: type === "checkbox" ? checked : value,
  });
 };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name || !formData.price || !formData.taxId) {
   alert("Please fill all required fields");
   return;
  }

  const menuData = {
   name: formData.name,
   description: formData.description,
   price: Number(formData.price),
   taxId: formData.taxId,
   outletId: outletId,
   imageUrl: formData.imageUrl || "",
   isAvailable: Boolean(formData.isAvailable),
  };

  onSubmit(menuData);
 };

 if (!isOpen) return null;

 return (
  <motion.div
   initial={{opacity: 0}}
   animate={{opacity: 1}}
   exit={{opacity: 0}}
   className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
   <motion.div
    initial={{scale: 0.9, y: 20}}
    animate={{scale: 1, y: 0}}
    className="bg-white rounded-xl shadow-xl w-full max-w-md">
    <div className="flex justify-between items-center border-b p-4">
     <h2 className="text-xl font-semibold text-gray-800">Add New Menu</h2>
     <button
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700">
      <FiX size={24} />
     </button>
    </div>
    <form
     onSubmit={handleSubmit}
     className="p-6">
     <div className="space-y-4">
      {/* Form fields remain the same as in original */}
      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Menu Name *
       </label>
       <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
       />
      </div>

      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Description
       </label>
       <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={3}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
       />
      </div>

      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Base Price (IDR) *
       </label>
       <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        min="0"
        step="0.01"
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
       />
      </div>

      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Tax *
       </label>
       <select
        name="taxId"
        value={formData.taxId}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500">
        <option value="">Select Tax</option>
        {taxes.map((tax) => (
         <option
          key={tax.id}
          value={tax.id}>
          {tax.name} ({tax.rate}%)
         </option>
        ))}
       </select>
      </div>

      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Image URL
       </label>
       <div className="flex items-center">
        <input
         type="text"
         name="imageUrl"
         value={formData.imageUrl}
         onChange={handleChange}
         placeholder="https://example.com/image.jpg"
         className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
         type="button"
         className="ml-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
         <FiUpload />
        </button>
       </div>
      </div>

      <div className="flex items-center">
       <input
        type="checkbox"
        name="isAvailable"
        id="isAvailable"
        checked={formData.isAvailable}
        onChange={handleChange}
        className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
       />
       <label
        htmlFor="isAvailable"
        className="ml-2 block text-sm text-gray-700">
        Available for purchase
       </label>
      </div>
     </div>

     <div className="mt-6 flex justify-end space-x-3">
      <button
       type="button"
       onClick={onClose}
       className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
       Cancel
      </button>
      <button
       type="submit"
       className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
       Add Menu
      </button>
     </div>
    </form>
   </motion.div>
  </motion.div>
 );
};

export default AddMenuModal;
