"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {
 FiPlus,
 FiEdit2,
 FiTrash2,
 FiImage,
 FiCoffee,
 FiArrowLeft,
 FiAlertTriangle,
 FiX,
} from "react-icons/fi";
import {FaFilter} from "react-icons/fa";
import {useOutlets} from "@/lib/hooks/useOutlets";
import {useMenu} from "@/lib/hooks/useMenu";
import {useTaxes} from "@/lib/hooks/useTaxes";
import {Menu} from "@/lib/types/menu";
import Image from "next/image";
import {uploadImage} from "@/lib/utils/uploadImage";
import {formatPrice} from "@/lib/utils/formatPrice";
import { Tax } from "@/lib/types/tax";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import FileUpload from "@/components/ui/FileUpload";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

const AddMenu = ({
 isOpen,
 onClose,
 onSubmit,
 taxes,
 outletId,
}: {
 isOpen: boolean;
 onClose: () => void;
 onSubmit: (menuData: Omit<Menu, "id" | "createdAt">) => void;
 taxes: Tax[];
 outletId: string;
}) => {
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
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  if (!formData.name || !formData.price) {
   // Removed taxIds validation
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
 };

 return (
  <Modal
   isOpen={isOpen}
   onClose={onClose}
   title="Add New Menu"
   maxWidth="lg">
   <form onSubmit={handleSubmit}>
    <div className="space-y-4">
     <Input
      label="Menu Name"
      name="name"
      value={formData.name}
      onChange={handleChange}
      required
     />

     <Input
      label="Category"
      name="category"
      value={formData.category}
      onChange={handleChange}
      required
      placeholder="e.g., Main Course, Beverage, Dessert"
     />

     <Textarea
      label="Description"
      name="description"
      value={formData.description}
      onChange={handleChange}
      rows={3}
     />

     <Input
      label="Base Price (IDR)"
      type="number"
      name="price"
      value={formData.price}
      onChange={handleChange}
      min="0"
      step="0.01"
      required
     />

     <div>
      <label className="block text-sm font-medium text-onyx1 dark:text-white mb-1">
       Taxes {/* Removed * indicator */}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
       {taxes.map((tax) => (
        <Checkbox
         key={tax.id}
         id={`tax-${tax.id}`}
         value={tax.id}
         checked={formData.taxIds.includes(tax.id)}
         onChange={handleTaxChange}
         label={`${tax.name} (${tax.rate}%)`}
        />
       ))}
      </div>
     </div>

     <FileUpload
      label="Menu Image"
      onFileChange={async (file) => {
       if (file) await handleUpload(file);
      }}
      uploading={uploading}
      previewUrl={formData.imageUrl}
     />

     <Checkbox
      name="isAvailable"
      id="isAvailable"
      checked={formData.isAvailable}
      onChange={handleChange}
      label="Available for purchase"
     />
    </div>

    <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
     <Button
      type="button"
      onClick={onClose}
      variant="outline">
      Cancel
     </Button>
     <Button
      type="submit"
      variant="primary">
      Add Menu
     </Button>
    </div>
   </form>
  </Modal>
 );
};

const EditMenu = ({
 isOpen,
 onClose,
 onSubmit,
 taxes,
 currentMenu,
 outletId,
}: {
 isOpen: boolean;
 onClose: () => void;
 onSubmit: (menuData: Omit<Menu, "id" | "createdAt">) => void;
 taxes: Tax[];
 currentMenu: Menu;
 outletId: string;
}) => {
 const [formData, setFormData] = useState({
  name: currentMenu.name,
  description: currentMenu.description,
  price: currentMenu.price,
  taxIds: currentMenu.taxIds || [],
  outletId: outletId,
  imageUrl: currentMenu.imageUrl,
  isAvailable: currentMenu.isAvailable,
  category: currentMenu.category || "",
 });

 const [uploading, setUploading] = useState(false);

 useEffect(() => {
  if (currentMenu) {
   setFormData({
    name: currentMenu.name,
    description: currentMenu.description,
    price: currentMenu.price,
    taxIds: currentMenu.taxIds || [],
    outletId: outletId,
    imageUrl: currentMenu.imageUrl,
    isAvailable: currentMenu.isAvailable,
    category: currentMenu.category || "",
   });
  }
 }, [currentMenu, outletId]);

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
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  if (!formData.name || !formData.price) {
   // Removed taxIds validation
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
 };

 return (
  <Modal
   isOpen={isOpen}
   onClose={onClose}
   title="Edit Menu"
   maxWidth="lg">
   <form onSubmit={handleSubmit}>
    <div className="space-y-4">
     <Input
      label="Menu Name"
      name="name"
      value={formData.name}
      onChange={handleChange}
      required
     />

     <Input
      label="Category"
      name="category"
      value={formData.category}
      onChange={handleChange}
      required
      placeholder="e.g., Main Course, Beverage, Dessert"
     />

     <Textarea
      label="Description"
      name="description"
      value={formData.description}
      onChange={handleChange}
      rows={3}
     />

     <Input
      label="Base Price (IDR)"
      type="number"
      name="price"
      value={formData.price}
      onChange={handleChange}
      min="0"
      step="0.01"
      required
     />

     <div>
      <label className="block text-sm font-medium text-onyx1 dark:text-white mb-1">
       Taxes {/* Removed * indicator */}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
       {taxes.map((tax) => (
        <Checkbox
         key={tax.id}
         id={`tax-${tax.id}`}
         value={tax.id}
         checked={formData.taxIds.includes(tax.id)}
         onChange={handleTaxChange}
         label={`${tax.name} (${tax.rate}%)`}
        />
       ))}
      </div>
     </div>

     <FileUpload
      label="Menu Image"
      onFileChange={handleUpload}
      uploading={uploading}
      previewUrl={formData.imageUrl}
      buttonText="Upload New Image"
     />

     <Checkbox
      name="isAvailable"
      id="isAvailable"
      checked={formData.isAvailable}
      onChange={handleChange}
      label="Available for purchase"
     />
    </div>

    <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
     <Button
      type="button"
      onClick={onClose}
      variant="outline">
      Cancel
     </Button>
     <Button
      type="submit"
      variant="primary">
      Update Menu
     </Button>
    </div>
   </form>
  </Modal>
 );
};

// DeleteMenuModal Component (Integrated)
const DeleteMenuModal = ({
 isOpen,
 onClose,
 onConfirm,
 menuName,
 isLoading,
}: {
 isOpen: boolean;
 onClose: () => void;
 onConfirm: () => void;
 menuName?: string;
 isLoading?: boolean;
}) => {
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
    <div className="p-4 md:p-6">
     <div className="flex justify-between items-start">
      <div className="flex items-center">
       <FiAlertTriangle className="text-red-500 text-2xl mr-2" />
       <h3 className="text-lg font-medium text-onyx1 dark:text-white">
        Delete Menu Item
       </h3>
      </div>
      <button
       onClick={onClose}
       className="text-gray-400 hover:text-gray-500 transition-colors"
       aria-label="Close modal">
       <FiX className="text-xl" />
      </button>
     </div>

     <div className="mt-4">
      <p className="text-gray-600 dark:text-gray-400">
       Are you sure you want to delete{" "}
       <span className="font-semibold">{menuName || "this menu item"}</span>?
       This action cannot be undone.
      </p>
     </div>

     <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
      <Button
       type="button"
       onClick={onClose}
       disabled={isLoading}
       variant="outline">
       Cancel
      </Button>
      <Button
       type="button"
       onClick={onConfirm}
       disabled={isLoading}
       variant="primary">
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

const MenuPageLayout = () => {
 const [selectedOutlet, setSelectedOutlet] = useState<string>("");
 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
 const [menuToDelete, setMenuToDelete] = useState<string | null>(null);
 const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
 const [selectedCategory, setSelectedCategory] = useState<string>("All");
 const {menus, loading, error} = useMenu(selectedOutlet);
 const {outlets} = useOutlets();
 const {
  loading: menusLoading,
  addMenu,
  updateMenu,
  deleteMenu,
 } = useMenu(selectedOutlet);
 const {taxes} = useTaxes();

 // Filter menus based on selected category
 const filteredMenus =
  selectedCategory === "All"
   ? menus
   : menus.filter((menu) => menu.category === selectedCategory);

 useEffect(() => {
  console.log("Current Outlet:", selectedOutlet);
  console.log("Menus Data:", menus);
  console.log("Loading State:", loading);
  console.log("Error State:", error);
 }, [selectedOutlet, menus, loading, error]);

 const handleAddMenu = () => {
  if (!selectedOutlet) {
   alert("Please select an outlet first");
   return;
  }
  setIsAddModalOpen(true);
 };

 const handleEditMenu = (menu: Menu) => {
  setCurrentMenu(menu);
  setIsEditModalOpen(true);
 };

 const handleDeleteMenu = (id: string) => {
  setMenuToDelete(id);
  setIsDeleteModalOpen(true);
 };

 const handleConfirmDelete = async () => {
  if (menuToDelete) {
   await deleteMenu(menuToDelete);
   setIsDeleteModalOpen(false);
   setMenuToDelete(null);
  }
 };

 const handleAddSubmit = async (menuData: Omit<Menu, "id" | "createdAt">) => {
  try {
   await addMenu({
    ...menuData,
    outletId: selectedOutlet,
   });
   setIsAddModalOpen(false);
  } catch (error) {
   console.error("Error adding menu:", error);
  }
 };

 const handleEditSubmit = async (menuData: Omit<Menu, "id" | "createdAt">) => {
  try {
   if (currentMenu) {
    await updateMenu(currentMenu.id, menuData);
    setIsEditModalOpen(false);
   }
  } catch (error) {
   console.error("Error updating menu:", error);
  }
 };

 // Function to calculate total price including all taxes
 const calculateTotalPrice = (menu: Menu) => {
  if (!menu.taxIds || menu.taxIds.length === 0) {
   return menu.price;
  }

  const applicableTaxes = taxes.filter((tax) => menu.taxIds.includes(tax.id));
  let totalPrice = menu.price;

  // Apply each tax sequentially (compound)
  applicableTaxes.forEach((tax) => {
   totalPrice *= 1 + tax.rate / 100;
  });

  return totalPrice;
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
        onClick={() => setSelectedOutlet(outlet.id)}
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
   </div>
  );
 }

 const currentOutlet = outlets.find((o) => o.id === selectedOutlet);

 return (
  <div className="max-h-[100dvh]">
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
     <div className="flex gap-2 w-full sm:w-auto">
      <motion.button
       onClick={() => setIsFilterModalOpen(true)}
       className="flex items-center text-onyx1 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-onyx3 transition-colors justify-center">
       <FaFilter className="mr-2" />
       Filter
      </motion.button>
      <motion.button
       onClick={handleAddMenu}
       className="flex items-center bg-onyx1 dark:bg-onyx2 text-white px-4 py-2 rounded-lg hover:bg-onyx2 dark:hover:bg-onyx2/90 transition-colors w-full sm:w-auto justify-center">
       <FiPlus className="mr-2" />
       Add Menu
      </motion.button>
     </div>
    </div>

    <div className="mb-6">
     <h1 className="text-2xl font-bold text-onyx1 dark:text-white text-center md:text-start">
      {currentOutlet?.name} Menu
     </h1>
    </div>

    {/* Current filter indicator */}
    {selectedCategory !== "All" && (
     <div className="mb-4">
      <span className="text-sm text-onyx1 dark:text-white">
       Showing category: <span className="font-medium">{selectedCategory}</span>
      </span>
     </div>
    )}

    <div className="bg-white dark:bg-onyx1 rounded-xl shadow-sm overflow-hidden">
     {menusLoading ? (
      <div className="p-8 text-center text-gray-500">Loading menus...</div>
     ) : filteredMenus.length === 0 ? (
      <div className="p-8 text-center text-gray-500">
       <FiCoffee className="mx-auto text-4xl mb-4 text-gray-300" />
       <p>
        No menus found{" "}
        {selectedCategory !== "All" ? `in ${selectedCategory} category` : ""}
       </p>
       <button
        onClick={handleAddMenu}
        className="mt-4 text-gray-800 underline hover:text-gray-600 transition-colors">
        Add a new menu
       </button>
      </div>
     ) : (
      <div className="overflow-y-auto max-h-[70dvh] md:max-h-[60dvh]">
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
          <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
           Base Price
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
         {filteredMenus.map((menu) => {
          const totalPrice = calculateTotalPrice(menu);

          return (
           <motion.tr
            key={menu.id}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="hover:bg-gray-50">
            <td className="px-4 py-4 whitespace-nowrap">
             {menu.imageUrl ? (
              <div className="flex-shrink-0 h-10 w-10">
               <Image
                width={40}
                height={40}
                src={menu.imageUrl}
                alt={menu.name}
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
              {menu.name}
             </div>
            </td>
            <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap">
             <div className="text-sm text-onyx1 dark:text-white">
              {menu.category}
             </div>
            </td>
            <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap">
             <div className="text-sm text-onyx1 dark:text-white">
              {formatPrice(menu.price)}
             </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap">
             <div className="text-sm font-medium text-onyx1 dark:text-white">
              {formatPrice(totalPrice)}
             </div>
            </td>
            <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap">
             <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
               menu.isAvailable
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              }`}>
              {menu.isAvailable ? "Available" : "Unavailable"}
             </span>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
             <div className="flex space-x-4">
              <button
               onClick={() => handleEditMenu(menu)}
               className="text-gray-600 dark:text-gray-500 hover:text-gray-900 transition-colors"
               aria-label="Edit menu">
               <FiEdit2 />
              </button>
              <button
               onClick={() => handleDeleteMenu(menu.id)}
               className="text-red-600 hover:text-red-900 transition-colors"
               aria-label="Delete menu">
               <FiTrash2 />
              </button>
             </div>
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

   {/* Filter Modal */}
   {isFilterModalOpen && (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
     <motion.div
      initial={{opacity: 0, scale: 0.9}}
      animate={{opacity: 1, scale: 1}}
      className="bg-white dark:bg-onyx2 rounded-lg p-6 w-full max-w-md max-h-[90dvh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
       <h3 className="text-lg font-medium text-onyx1 dark:text-white">
        Filter by Category
       </h3>
       <button
        onClick={() => setIsFilterModalOpen(false)}
        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl">
        <FiX />
       </button>
      </div>

      <div className="space-y-2">
       <button
        onClick={() => {
         setSelectedCategory("All");
         setIsFilterModalOpen(false);
        }}
        className={`w-full text-left px-4 py-2 rounded-lg ${
         selectedCategory === "All"
          ? "bg-onyx1 dark:bg-white dark:text-onyx1 text-white"
          : "bg-gray-100 dark:bg-onyx2 text-onyx1 dark:text-white hover:bg-gray-200 dark:hover:bg-onyx1"
        } transition-colors`}>
        All Categories
       </button>

       {Array.from(new Set(menus.map((menu) => menu.category))).map(
        (category) => (
         <button
          key={category}
          onClick={() => {
           setSelectedCategory(category);
           setIsFilterModalOpen(false);
          }}
          className={`w-full text-left px-4 py-2 rounded-lg ${
           selectedCategory === category
            ? "bg-onyx1 dark:bg-white dark:text-onyx1 text-white"
            : "bg-gray-100 dark:bg-onyx2 text-onyx1 dark:text-white hover:bg-gray-200 dark:hover:bg-onyx1"
          } transition-colors`}>
          {category}
         </button>
        )
       )}
      </div>
     </motion.div>
    </div>
   )}

   <AddMenu
    isOpen={isAddModalOpen}
    onClose={() => setIsAddModalOpen(false)}
    onSubmit={handleAddSubmit}
    taxes={taxes}
    outletId={selectedOutlet}
   />
   {currentMenu && (
    <EditMenu
     isOpen={isEditModalOpen}
     onClose={() => setIsEditModalOpen(false)}
     onSubmit={handleEditSubmit}
     taxes={taxes}
     currentMenu={currentMenu}
     outletId={selectedOutlet}
    />
   )}
   <DeleteMenuModal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    onConfirm={handleConfirmDelete}
    menuName={menus.find((m) => m.id === menuToDelete)?.name}
    isLoading={menusLoading}
   />
  </div>
 );
};

export default MenuPageLayout