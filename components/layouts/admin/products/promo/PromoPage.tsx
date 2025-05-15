"use client";

import {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import {
 FiPlus,
 FiEdit2,
 FiTrash2,
 FiImage,
 FiCoffee,
 FiArrowLeft,
 FiX,
 FiUpload,
 FiAlertTriangle,
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
import {formatPrice} from "@/lib/utils/formatPrice";
import Button from "@/components/ui/Button";
import { uploadImage } from "@/lib/utils/uploadImage";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import FileUpload from "@/components/ui/FileUpload";
import Checkbox from "@/components/ui/Checkbox";

interface AddPromoProps {
 isOpen: boolean;
 onClose: () => void;
 onSubmit: (promoData: Omit<Promo, "id" | "createdAt">) => void;
 outletId: string;
}

const initialFormData = (outletId: string) => ({
 name: "",
 description: "",
 price: 0,
 outletId: outletId,
 imageUrl: "",
 isActive: true,
 category: "sarapan & ngopi pagi" as PromoCategory,
});

const AddPromo = ({
 isOpen,
 onClose,
 onSubmit,
 outletId,
}: AddPromoProps) => {
 const [formData, setFormData] = useState(initialFormData(outletId));
 const [uploading, setUploading] = useState(false);

 useEffect(() => {
  if (isOpen) {
   setFormData(initialFormData(outletId));
  }
 }, [isOpen, outletId]);

 const handleUpload = async (file: File | null) => {
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
 };

 const categoryOptions = [
  {value: "sarapan & ngopi pagi", label: "Sarapan & Ngopi Pagi"},
  {value: "makan siang", label: "Makan Siang"},
  {value: "ngopi sore", label: "Ngopi Sore"},
 ];

 return (
  <Modal
   isOpen={isOpen}
   onClose={onClose}
   title="Add New Promo"
   maxWidth="lg">
   <form onSubmit={handleSubmit}>
    <div className="space-y-4">
     <Input
      label="Promo Name"
      name="name"
      value={formData.name}
      onChange={handleChange}
      required
     />

     <Select
      label="Category"
      name="category"
      value={formData.category}
      onChange={handleChange}
      options={categoryOptions}
      required
     />

     <Textarea
      label="Description"
      name="description"
      value={formData.description}
      onChange={handleChange}
      rows={3}
     />

     <Input
      label="Price (IDR)"
      type="number"
      name="price"
      value={formData.price || ""}
      onChange={handleChange}
      min="0"
      step="0.01"
      required
     />

     <FileUpload
      label="Promo Image"
      onFileChange={handleUpload}
      uploading={uploading}
      previewUrl={formData.imageUrl}
     />

     <Checkbox
      name="isActive"
      id="isActive"
      checked={formData.isActive}
      onChange={handleChange}
      label="Active Promo"
     />
    </div>

    <div className="mt-6 flex justify-end space-x-3">
     <Button
      type="button"
      onClick={onClose}
      variant="outline">
      Cancel
     </Button>
     <Button
      type="submit"
      variant="primary">
      Add Promo
     </Button>
    </div>
   </form>
  </Modal>
 );
};

interface EditPromoModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSubmit: (promoData: Omit<Promo, "id" | "createdAt">) => void;
 currentPromo: Promo;
 outletId: string;
}

const EditPromoModal = ({
 isOpen,
 onClose,
 onSubmit,
 currentPromo,
 outletId,
}: EditPromoModalProps) => {
 const [formData, setFormData] = useState({
  name: currentPromo.name,
  description: currentPromo.description,
  price: currentPromo.price,
  outletId: outletId,
  imageUrl: currentPromo.imageUrl,
  isActive: currentPromo.isActive,
  category: currentPromo.category as PromoCategory,
 });
 const [uploading, setUploading] = useState(false);
 const fileInputRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
  if (currentPromo) {
   setFormData({
    name: currentPromo.name,
    description: currentPromo.description,
    price: currentPromo.price,
    outletId: outletId,
    imageUrl: currentPromo.imageUrl,
    isActive: currentPromo.isActive,
    category: currentPromo.category as PromoCategory,
   });
  }
 }, [currentPromo, outletId]);

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
     <h2 className="text-xl font-semibold text-gray-800">Edit Promo</h2>
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
        value={formData.price}
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
       Update Promo
      </button>
     </div>
    </form>
   </motion.div>
  </motion.div>
 );
};

interface DeletePromoModalProps {
 isOpen: boolean;
 onClose: () => void;
 onConfirm: () => void;
 promoName?: string;
 isLoading?: boolean;
}

const DeletePromoModal = ({
 isOpen,
 onClose,
 onConfirm,
 promoName,
 isLoading,
}: DeletePromoModalProps) => {
 if (!isOpen) return null;

 return (
  <motion.div
   initial={{opacity: 0}}
   animate={{opacity: 1}}
   exit={{opacity: 0}}
   className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
   <motion.div
    initial={{scale: 0.9, y: 20}}
    animate={{scale: 1, y: 0}}
    className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
    <div className="p-6">
     <div className="flex justify-between items-start">
      <div className="flex items-center">
       <FiAlertTriangle className="text-red-500 text-2xl mr-2" />
       <h3 className="text-lg font-medium text-gray-900">Delete Promo</h3>
      </div>
      <Button
      type="button"
       onClick={onClose}
       className="text-gray-400 hover:text-gray-500">
       <FiX className="text-xl" />
      </Button>
     </div>

     <div className="mt-4">
      <p className="text-gray-600">
       Are you sure you want to delete{" "}
       <span className="font-semibold">{promoName || "this promo"}</span>? This
       action cannot be undone.
      </p>
     </div>

     <div className="mt-6 flex justify-end space-x-3">
      <Button
       type="button"
       onClick={onClose}
       disabled={isLoading}
       className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50">
       Cancel
      </Button>
      <Button
       type="button"
       onClick={onConfirm}
       disabled={isLoading}
       className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center">
       {isLoading ? (
        "Deleting..."
       ) : (
        <>
         <FiTrash2 className="mr-2" />
         Delete
        </>
       )}
      </Button>
     </div>
    </div>
   </motion.div>
  </motion.div>
 );
};

interface PinVerificationModalProps {
 isOpen: boolean;
 onClose: () => void;
 onVerify: (pin: string) => Promise<boolean>; // Now returns a boolean
 outletName: string;
}

const PinVerificationModal = ({
 isOpen,
 onClose,
 onVerify,
 outletName,
}: PinVerificationModalProps) => {
 const [pin, setPin] = useState<string[]>(new Array(4).fill(""));
 const [activeIndex, setActiveIndex] = useState(0);
 const [error, setError] = useState("");
 const [isVerifying, setIsVerifying] = useState(false);
 const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

 useEffect(() => {
  if (isOpen) {
   setPin(new Array(4).fill(""));
   setActiveIndex(0);
   setError("");
   inputRefs.current = inputRefs.current.slice(0, 4);
   setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }
 }, [isOpen]);

 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  index: number
 ) => {
  const value = e.target.value;

  if (!/^\d*$/.test(value)) return;

  const newPin = [...pin];
  newPin[index] = value;
  setPin(newPin);
  setError("");

  if (value && index < 3) {
   setActiveIndex(index + 1);
   setTimeout(() => inputRefs.current[index + 1]?.focus(), 10);
  }
 };

 const handleKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  index: number
 ) => {
  if (e.key === "Backspace" && !pin[index] && index > 0) {
   // Move to previous input on backspace if current is empty
   setActiveIndex(index - 1);
   setTimeout(() => inputRefs.current[index - 1]?.focus(), 10);
  }
 };

 const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  e.preventDefault();
  const pasteData = e.clipboardData.getData("text/plain").slice(0, 4);
  if (/^\d+$/.test(pasteData)) {
   const newPin = [...pin];
   for (let i = 0; i < pasteData.length && i < 4; i++) {
    newPin[i] = pasteData[i];
   }
   setPin(newPin);
   const lastFilledIndex = Math.min(pasteData.length - 1, 3);
   setActiveIndex(lastFilledIndex);
   setTimeout(() => inputRefs.current[lastFilledIndex]?.focus(), 10);
  }
 };

 const handleSubmit = async () => {
  const enteredPin = pin.join("");
  if (enteredPin.length === 4) {
   setIsVerifying(true);
   try {
    const isValid = await onVerify(enteredPin);
    if (!isValid) {
     setError("Invalid PIN. Please try again.");
     setPin(new Array(4).fill(""));
     setActiveIndex(0);
     setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
   } finally {
    setIsVerifying(false);
   }
  } else {
   setError("Please enter a 4-digit PIN");
  }
 };

 if (!isOpen) return null;

 return (
  <motion.div
   initial={{opacity: 0}}
   animate={{opacity: 1}}
   exit={{opacity: 0}}
   className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
   <motion.div
    initial={{scale: 0.9, y: 20}}
    animate={{scale: 1, y: 0}}
    className="bg-white dark:bg-onyx2 rounded-lg shadow-xl w-full max-w-md mx-4">
    <div className="p-6">
     <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium text-onyx1 dark:text-white">
       Enter PIN for {outletName}
      </h3>
      <button
       onClick={onClose}
       className="text-gray-400 hover:text-gray-500 transition-colors"
       aria-label="Close modal">
       <FiX className="text-xl" />
      </button>
     </div>

     <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
      Please enter the 4-digit PIN to access this outlet.
     </p>

     <div className="flex justify-center space-x-3 mb-6">
      {pin.map((digit, index) => (
       <motion.div
        key={index}
        whileTap={{scale: 0.95}}
        className="w-14 h-14">
        <input
         ref={(el) => {
          inputRefs.current[index] = el; // Just assign, don't return
         }}
         type="text"
         inputMode="numeric"
         maxLength={1}
         value={digit}
         onChange={(e) => handleChange(e, index)}
         onKeyDown={(e) => handleKeyDown(e, index)}
         onPaste={handlePaste}
         onFocus={() => setActiveIndex(index)}
         className={`w-full h-full text-center text-xl font-medium rounded-lg border-2 ${
          activeIndex === index
           ? "border-primary dark:border-primary-dark"
           : "border-gray-300 dark:border-onyx1"
         } bg-transparent focus:outline-none`}
        />
       </motion.div>
      ))}
     </div>

     {error && (
      <motion.p
       initial={{opacity: 0, y: -10}}
       animate={{opacity: 1, y: 0}}
       className="text-red-500 text-sm text-center mb-4">
       {error}
      </motion.p>
     )}

     <div className="flex justify-end gap-3 dark:text-white text-onyx1">
      <Button
       type="button"
       onClick={onClose}
       variant="outline">
       Cancel
      </Button>
      <Button
       type="button"
       onClick={handleSubmit}
       variant="primary"
       isLoading={isVerifying}>
       Verify
      </Button>
     </div>
    </div>
   </motion.div>
  </motion.div>
 );
};

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
 const [pinModalOpen, setPinModalOpen] = useState(false);
 const [selectedOutletName, setSelectedOutletName] = useState("");
 const [selectedOutletId, setSelectedOutletId] = useState<string>("");

 const handleOutletSelect = (outletId: string, outletName: string) => {
  setSelectedOutletId(outletId);
  setSelectedOutletName(outletName);
  setPinModalOpen(true);
 };

 const verifyPin = async (enteredPin: string) => {
  let correctPin = "";
  const outletLower = selectedOutletName.toLowerCase();

  if (outletLower.includes("tasik")) {
   correctPin = process.env.NEXT_PUBLIC_OUTLET_PIN_TASIK || "";
  } else if (outletLower.includes("dago")) {
   correctPin = process.env.NEXT_PUBLIC_OUTLET_PIN_DAGO || "";
  } else if (outletLower.includes("garut")) {
   correctPin = process.env.NEXT_PUBLIC_OUTLET_PIN_GARUT || "";
  }

  if (enteredPin === correctPin) {
   setSelectedOutlet(selectedOutletId);
   setPinModalOpen(false);
   return true;
  }
  return false;
 };

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
        onClick={() => handleOutletSelect(outlet.id, outlet.name)}
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

    <PinVerificationModal
     isOpen={pinModalOpen}
     onClose={() => setPinModalOpen(false)}
     onVerify={verifyPin}
     outletName={selectedOutletName}
    />
   </div>
  );
 }

 const currentOutlet = outlets.find((o) => o.id === selectedOutlet);

 return (
  <div className="min-h-screen bg-white dark:bg-onyx1 p-4 md:p-6">
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
