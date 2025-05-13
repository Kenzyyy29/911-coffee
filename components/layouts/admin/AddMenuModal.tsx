"use client";

import {useRef, useState} from "react";
import {motion} from "framer-motion";
import {FiX, FiUpload} from "react-icons/fi";
import {Tax} from "@/lib/types/tax";
import {Menu} from "@/lib/types/menu";
import {uploadImage} from "@/lib/utils/uploadImage";
import Image from "next/image";

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
 const initialFormData = {
  name: "",
  description: "",
  price: 0,
  taxIds: [] as string[],
  outletId: outletId,
  imageUrl: "",
  isAvailable: true,
  category: "",
 };

 const [formData, setFormData] = useState(initialFormData);
 const [uploading, setUploading] = useState(false);
 const fileInputRef = useRef<HTMLInputElement>(null);

 const handleUpload = async () => {
  const file = fileInputRef.current?.files?.[0];
  if (!file) return;

  try {
   setUploading(true);
   const blob = await uploadImage(file);

   setFormData({
    ...formData,
    imageUrl: blob.url,
   });
  } catch (error) {
   if (error instanceof Error) {
    alert(error.message);
   } else {
    alert("Upload failed with unknown error");
   }
  } finally {
   setUploading(false);
  }
 };

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

 const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const {value, checked} = e.target;
  setFormData((prev) => {
   if (checked) {
    return {
     ...prev,
     taxIds: [...prev.taxIds, value],
    };
   } else {
    return {
     ...prev,
     taxIds: prev.taxIds.filter((id) => id !== value),
    };
   }
  });
 };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name || !formData.price || formData.taxIds.length === 0) {
   alert("Please fill all required fields");
   return;
  }

  const menuData = {
   name: formData.name,
   description: formData.description,
   price: Number(formData.price),
   taxIds: formData.taxIds,
   outletId: outletId,
   imageUrl: formData.imageUrl || "",
   isAvailable: Boolean(formData.isAvailable),
   category: formData.category,
  };

  onSubmit(menuData);
  setFormData(initialFormData);
  if (fileInputRef.current) {
   fileInputRef.current.value = "";
  }
 };

 if (!isOpen) return null;

 return (
  <motion.div
   initial={{opacity: 0}}
   animate={{opacity: 1}}
   exit={{opacity: 0}}
   className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
   <motion.div
    initial={{scale: 0.9, y: 20}}
    animate={{scale: 1, y: 0}}
    className="bg-white rounded-xl shadow-xl w-full max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto">
    <div className="flex justify-between items-center sticky top-0 bg-white border-b p-4 z-10">
     <h2 className="text-xl font-semibold text-gray-800">Add New Menu</h2>
     <button
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700 transition-colors"
      aria-label="Close modal">
      <FiX size={24} />
     </button>
    </div>

    <form
     onSubmit={handleSubmit}
     className="p-4 md:p-6">
     <div className="space-y-4">
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
        Category *
       </label>
       <input
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
        placeholder="e.g., Main Course, Beverage, Dessert"
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
        Taxes *
       </label>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {taxes.map((tax) => (
         <div
          key={tax.id}
          className="flex items-center">
          <input
           type="checkbox"
           id={`tax-${tax.id}`}
           value={tax.id}
           checked={formData.taxIds.includes(tax.id)}
           onChange={handleTaxChange}
           className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
          />
          <label
           htmlFor={`tax-${tax.id}`}
           className="ml-2 block text-sm text-gray-700">
           {tax.name} ({tax.rate}%)
          </label>
         </div>
        ))}
       </div>
      </div>

      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Menu Image
       </label>
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
       />
       <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
        <FiUpload className="mr-2" />
        {uploading ? "Uploading..." : "Upload Image"}
       </button>
       {formData.imageUrl && (
        <div className="mt-2 flex justify-center">
         <Image
          src={formData.imageUrl}
          alt="Preview"
          width={320}
          height={160}
          className="max-w-full h-auto max-h-40 object-contain rounded-lg"
         />
        </div>
       )}
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

     <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
      <button
       type="button"
       onClick={onClose}
       className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
       Cancel
      </button>
      <button
       type="submit"
       className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
       Add Menu
      </button>
     </div>
    </form>
   </motion.div>
  </motion.div>
 );
};

export default AddMenuModal;
