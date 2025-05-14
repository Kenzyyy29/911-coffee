"use client";

import {useRef, useState, useEffect} from "react";
import {motion} from "framer-motion";
import {FiX, FiUpload} from "react-icons/fi";
import {Promo, PromoCategory} from "@/lib/types/promo";
import {uploadImage} from "@/lib/utils/uploadImage";
import Image from "next/image";

interface AddPromoModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSubmit: (promoData: Omit<Promo, "id" | "createdAt">) => void;
 outletId: string;
}

const AddPromoModal = ({
 isOpen,
 onClose,
 onSubmit,
 outletId,
}: AddPromoModalProps) => {
 const initialFormData = {
  name: "",
  description: "",
  price: 0,
  outletId: outletId,
  imageUrl: "",
  isActive: true,
  category: "sarapan & ngopi pagi" as PromoCategory,
 };

 const [formData, setFormData] = useState(initialFormData);
 const [uploading, setUploading] = useState(false);
 const fileInputRef = useRef<HTMLInputElement>(null);

 // Reset form when modal opens/closes
 useEffect(() => {
  if (isOpen) {
   setFormData(initialFormData);
   if (fileInputRef.current) {
    fileInputRef.current.value = "";
   }
  }
 }, [isOpen, outletId]);

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

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name || !formData.price) {
   alert("Please fill all required fields");
   return;
  }

  const promoData = {
   name: formData.name,
   description: formData.description,
   price: Number(formData.price),
   outletId: outletId,
   imageUrl: formData.imageUrl || "",
   isActive: Boolean(formData.isActive),
   category: formData.category,
  };

  onSubmit(promoData);
  // Reset form after submit
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
   className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
   <motion.div
    initial={{scale: 0.9, y: 20}}
    animate={{scale: 1, y: 0}}
    className="bg-white rounded-xl shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
    <div className="flex justify-between items-center border-b p-4">
     <h2 className="text-xl font-semibold text-gray-800">Add New Promo</h2>
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
      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Promo Name *
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
       <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500">
        <option value="sarapan & ngopi pagi">Sarapan & Ngopi Pagi</option>
        <option value="makan siang">Makan Siang</option>
        <option value="ngopi sore">Ngopi Sore</option>
       </select>
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
        Price (IDR) *
       </label>
       <input
        type="number"
        name="price"
        value={formData.price || ""}
        onChange={handleChange}
        min="0"
        step="0.01"
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
       />
      </div>

      <div>
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
        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
        <FiUpload className="mr-2" />
        {uploading ? "Uploading..." : "Upload Image"}
       </button>
       {formData.imageUrl && (
        <div className="mt-2">
         <Image
          src={formData.imageUrl}
          alt="Preview"
          width={320}
          height={160}
          className="max-w-full h-auto rounded-lg border border-gray-200"
         />
        </div>
       )}
      </div>

      <div className="flex items-center">
       <input
        type="checkbox"
        name="isActive"
        id="isActive"
        checked={formData.isActive}
        onChange={handleChange}
        className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
       />
       <label
        htmlFor="isActive"
        className="ml-2 block text-sm text-gray-700">
        Active Promo
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
       Add Promo
      </button>
     </div>
    </form>
   </motion.div>
  </motion.div>
 );
};

export default AddPromoModal;
