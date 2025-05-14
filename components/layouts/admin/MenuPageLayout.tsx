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
} from "react-icons/fi";
import {useOutlets} from "@/lib/hooks/useOutlets";
import {useMenu} from "@/lib/hooks/useMenu";
import {useTaxes} from "@/lib/hooks/useTaxes";
import {Menu} from "@/lib/types/menu";
import Image from "next/image";
import AddMenuModal from "./AddMenuModal";
import EditMenuModal from "./EditMenuModal";
import DeleteMenuModal from "./DeleteMenuModal";
import {formatPrice} from "@/lib/utils/formatPrice";

const MenuPageLayout = () => {
 const [selectedOutlet, setSelectedOutlet] = useState<string>("");
 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [menuToDelete, setMenuToDelete] = useState<string | null>(null);
 const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
 const {menus, loading, error} = useMenu(selectedOutlet);
 const {outlets} = useOutlets();
 const {
  loading: menusLoading,
  addMenu,
  updateMenu,
  deleteMenu,
 } = useMenu(selectedOutlet);
 const {taxes} = useTaxes();

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
     <motion.button
      onClick={handleAddMenu}
      whileHover={{scale: 1.03}}
      whileTap={{scale: 0.98}}
      className="flex items-center bg-onyx1 dark:bg-onyx2 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto justify-center">
      <FiPlus className="mr-2" />
      Add Menu
     </motion.button>
    </div>

    <div className="mb-6">
     <h1 className="text-2xl font-bold text-onyx1 dark:text-white text-center md:text-start">
      {currentOutlet?.name} Menu
     </h1>
    </div>

    <div className="bg-white dark:bg-onyx1 rounded-xl shadow-sm overflow-hidden">
     {menusLoading ? (
      <div className="p-8 text-center text-gray-500">Loading menus...</div>
     ) : menus.length === 0 ? (
      <div className="p-8 text-center text-gray-500">
       <FiCoffee className="mx-auto text-4xl mb-4 text-gray-300" />
       <p>No menus found for this outlet</p>
       <button
        onClick={handleAddMenu}
        className="mt-4 text-gray-800 underline hover:text-gray-600 transition-colors">
        Add your first menu
       </button>
      </div>
     ) : (
      <div className="overflow-y-auto max-h-[70dvh]">
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
         {menus.map((menu) => {
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

   <AddMenuModal
    isOpen={isAddModalOpen}
    onClose={() => setIsAddModalOpen(false)}
    onSubmit={handleAddSubmit}
    taxes={taxes}
    outletId={selectedOutlet}
   />
   {currentMenu && (
    <EditMenuModal
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

export default MenuPageLayout;
