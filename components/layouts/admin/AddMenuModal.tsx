"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiX, FiUpload } from "react-icons/fi";
import { Tax } from "@/lib/types/tax";
import { Menu } from "@/lib/types/menu";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/init";

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
    taxIds: [] as string[],
    outletId: outletId,
    imageUrl: "",
    isAvailable: true,
    category: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Firebase Storage
      const storageRef = ref(storage, `menu-images/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          alert("Failed to upload image");
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData({ ...formData, imageUrl: downloadURL });
          setIsUploading(false);
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || formData.taxIds.length === 0 || !formData.category) {
      alert("Please fill all required fields");
      return;
    }

    const menuData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      taxIds: formData.taxIds,
      outletId: outletId,
      imageUrl: formData.imageUrl,
      isAvailable: Boolean(formData.isAvailable),
      category: formData.category,
    };

    onSubmit(menuData);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold text-gray-800">Add New Menu</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
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
              <div className="space-y-2">
                {taxes.map((tax) => (
                  <div key={tax.id} className="flex items-center">
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
                      className="ml-2 block text-sm text-gray-700"
                    >
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
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={isUploading}
                >
                  <FiUpload className="mr-2" />
                  {isUploading ? "Uploading..." : "Upload Image"}
                </button>
                {isUploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                    <div className="h-32 w-32 rounded-md overflow-hidden border border-gray-200">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                )}
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
                className="ml-2 block text-sm text-gray-700"
              >
                Available for purchase
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              disabled={isUploading}
            >
              Add Menu
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddMenuModal;