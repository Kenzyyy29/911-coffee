// /app/admin/dashboard/products/bundling/BundlingPage.tsx
"use client";

import {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import {
 FiPlus,
 FiEdit2,
 FiTrash2,
 FiArrowLeft,
 FiPackage,
 FiX,
} from "react-icons/fi";
import {useBundling} from "@/lib/hooks/useBundling";
import {useOutlets} from "@/lib/hooks/useOutlets";
import {useTaxes} from "@/lib/hooks/useTaxes";
import {useMenu} from "@/lib/hooks/useMenu";
import Image from "next/image";
import AddBundling from "./AddBundling";
import EditBundlingModal from "./EditBundlingModal";
import DeleteBundlingModal from "./DeleteBundlingModal";
import {Bundling} from "@/lib/types/bundling";
import Button from "@/components/ui/Button";

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

  // Only allow numeric input
  if (!/^\d*$/.test(value)) return;

  const newPin = [...pin];
  newPin[index] = value;
  setPin(newPin);
  setError("");

  // Move to next input if a digit was entered
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
     // Reset PIN and focus first input
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

const BundlingPage = () => {
 const [selectedOutletId, setSelectedOutletId] = useState<string>("");
 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [selectedBundling, setSelectedBundling] = useState<Bundling | null>(
  null
 );

 const {
  bundlings,
  loading,
  error,
  addBundling,
  updateBundling,
  deleteBundling,
 } = useBundling(selectedOutletId);
 const {outlets} = useOutlets();
 const {taxes} = useTaxes();
 const {menus} = useMenu(selectedOutletId);
 const currentOutlet = outlets.find((outlet) => outlet.id === selectedOutletId);

 const [pinModalOpen, setPinModalOpen] = useState(false);
 const [selectedOutletName, setSelectedOutletName] = useState("");
 const [selectedOutlet, setSelectedOutlet] = useState<string>("");

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

 const handleAddBundling = async (
  bundlingData: Omit<Bundling, "id" | "createdAt">
 ) => {
  try {
   await addBundling(bundlingData);
   setIsAddModalOpen(false);
  } catch (error) {
   console.error("Error adding bundling:", error);
  }
 };

 const handleEditBundling = async (
  id: string,
  bundlingData: Partial<Bundling>
 ) => {
  try {
   await updateBundling(id, bundlingData);
   setIsEditModalOpen(false);
  } catch (error) {
   console.error("Error updating bundling:", error);
  }
 };

 const handleDeleteBundling = async () => {
  if (!selectedBundling) return;
  try {
   await deleteBundling(selectedBundling.id);
   setIsDeleteModalOpen(false);
  } catch (error) {
   console.error("Error deleting bundling:", error);
  }
 };

 const openEditModal = (bundling: Bundling) => {
  setSelectedBundling(bundling);
  setIsEditModalOpen(true);
 };

 const openDeleteModal = (bundling: Bundling) => {
  setSelectedBundling(bundling);
  setIsDeleteModalOpen(true);
 };

 // Function to calculate total price including all taxes
 const calculateTotalPrice = (bundling: Bundling) => {
  if (!bundling.taxIds || bundling.taxIds.length === 0) {
   return bundling.price;
  }

  const applicableTaxes = taxes.filter((tax) =>
   bundling.taxIds.includes(tax.id)
  );
  const totalTaxRate = applicableTaxes.reduce((sum, tax) => sum + tax.rate, 0);
  return bundling.price * (1 + totalTaxRate / 100);
 };

 // Function to get tax names for display
 const getTaxNames = (bundling: Bundling) => {
  if (!bundling.taxIds || bundling.taxIds.length === 0) {
   return "";
  }

  const applicableTaxes = taxes.filter((tax) =>
   bundling.taxIds.includes(tax.id)
  );
  return applicableTaxes.map((tax) => `${tax.name} (${tax.rate}%)`).join(", ");
 };

 // Function to get included menu names
 const getMenuNames = (bundling: Bundling) => {
  if (!bundling.menuIds || bundling.menuIds.length === 0) {
   return "";
  }

  const includedMenus = menus.filter((menu) =>
   bundling.menuIds.includes(menu.id)
  );
  return includedMenus.map((menu) => menu.name).join(", ");
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

 return (
  <div className="max-h-[100dvh] overflow-y-auto p-4 md:p-6">
   <motion.div
    initial={{opacity: 0, y: -20}}
    animate={{opacity: 1, y: 0}}
    className="max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-6">
     <button
      onClick={() => setSelectedOutletId("")}
      className="flex items-center text-gray-600 hover:text-gray-800">
      <FiArrowLeft className="mr-2" />
      Back to Outlets
     </button>
     <motion.button
      onClick={() => setIsAddModalOpen(true)}
      className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
      <FiPlus className="mr-2" />
      Add Bundling
     </motion.button>
    </div>

    <div className="mb-6">
     <h1 className="text-2xl font-bold text-gray-800">
      {currentOutlet?.name} Bundlings
     </h1>
     <p className="text-gray-600">
      Manage all bundling packages for this outlet
     </p>
    </div>

    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
     {loading ? (
      <div className="p-8 text-center text-gray-500">Loading bundlings...</div>
     ) : error ? (
      <div className="p-8 text-center text-red-500">{error}</div>
     ) : bundlings.length === 0 ? (
      <div className="p-8 text-center text-gray-500">
       <FiPackage className="mx-auto text-4xl mb-4 text-gray-300" />
       <p>No bundlings found for this outlet</p>
       <button
        onClick={() => setIsAddModalOpen(true)}
        className="mt-4 text-gray-800 underline hover:text-gray-600">
        Create your first bundling
       </button>
      </div>
     ) : (
      <div className="overflow-x-auto">
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
           Included Menus
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Base Price
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Price After Tax
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
         {bundlings.map((bundling) => {
          const totalPrice = calculateTotalPrice(bundling);
          const taxNames = getTaxNames(bundling);
          const menuNames = getMenuNames(bundling);

          return (
           <motion.tr
            key={bundling.id}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
             {bundling.imageUrl ? (
              <Image
               width={40}
               height={40}
               src={bundling.imageUrl}
               alt={bundling.name}
               className="h-10 w-10 rounded-md object-cover"
              />
             ) : (
              <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
               <FiPackage className="text-gray-400" />
              </div>
             )}
            </td>
            <td className="px-6 py-4">
             <div className="text-sm font-medium text-gray-900">
              {bundling.name}
             </div>
             <div className="text-sm text-gray-500 mt-1">
              {bundling.description}
             </div>
            </td>
            <td className="px-6 py-4">
             <div className="text-sm text-gray-900">{menuNames || "-"}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
             <div className="text-sm text-gray-900">
              {new Intl.NumberFormat("id-ID", {
               style: "currency",
               currency: "IDR",
              }).format(bundling.price)}
             </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
             <div className="text-sm text-gray-900">
              {new Intl.NumberFormat("id-ID", {
               style: "currency",
               currency: "IDR",
              }).format(totalPrice)}
              {taxNames && (
               <span className="text-xs text-gray-500 ml-1">
                (incl. {taxNames})
               </span>
              )}
             </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
             <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
               bundling.isAvailable
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              }`}>
              {bundling.isAvailable ? "Available" : "Unavailable"}
             </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
             <button
              onClick={() => openEditModal(bundling)}
              className="text-gray-600 hover:text-gray-900 mr-4">
              <FiEdit2 />
             </button>
             <button
              onClick={() => openDeleteModal(bundling)}
              className="text-red-600 hover:text-red-900">
              <FiTrash2 />
             </button>
            </td>
           </motion.tr>
          );
         })}
        </tbody>
       </table>
      </div>
     )}
    </div>
   </motion.div>

   {/* Modals */}
   <AddBundling
    isOpen={isAddModalOpen}
    onClose={() => setIsAddModalOpen(false)}
    onSubmit={handleAddBundling}
    taxes={taxes}
    menus={menus}
    outletId={selectedOutletId}
   />

   <EditBundlingModal
    isOpen={isEditModalOpen}
    onClose={() => setIsEditModalOpen(false)}
    onSubmit={handleEditBundling}
    bundling={selectedBundling}
    taxes={taxes}
    menus={menus}
   />

   <DeleteBundlingModal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    onConfirm={handleDeleteBundling}
    bundling={selectedBundling} // Kirim seluruh objek bundling
   />
  </div>
 );
};

export default BundlingPage;
