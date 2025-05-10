// /app/admin/dashboard/outlets/Layout.tsx
"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import {FiPlus, FiEdit2, FiTrash2} from "react-icons/fi";
import {useOutlets} from "@/lib/hooks/useOutlets";
import OutletForm from "./OutletForm";
import {Outlet} from "@/lib/types/outlet";
import DeleteOutletModal from "./DeleteOutletModal";

const OutletsLayout = () => {
 const {outlets, loading, error, addOutlet, updateOutlet, deleteOutlet} =
  useOutlets();
 const [isFormOpen, setIsFormOpen] = useState(false);
 const [editingOutlet, setEditingOutlet] = useState<Outlet | null>(null);
 const [deleteModalOpen, setDeleteModalOpen] = useState(false);
 const [outletToDelete, setOutletToDelete] = useState<string | null>(null);

 const handleSubmit = async (data: Omit<Outlet, "id" | "createdAt">) => {
  try {
   if (editingOutlet) {
    await updateOutlet(editingOutlet.id, data);
   } else {
    await addOutlet(data);
   }
   setIsFormOpen(false);
   setEditingOutlet(null);
  } catch (err) {
   console.error("Error saving outlet:", err);
  }
 };

 const handleEdit = (outlet: Outlet) => {
  setEditingOutlet(outlet);
  setIsFormOpen(true);
 };

 const handleDeleteClick = (id: string) => {
  setOutletToDelete(id);
  setDeleteModalOpen(true);
 };

 const confirmDelete = async () => {
  if (outletToDelete) {
   await deleteOutlet(outletToDelete);
   setOutletToDelete(null);
   setDeleteModalOpen(false);
  }
 };

 return (
  <div className="[100dvh]">
   <motion.div
    initial={{opacity: 0, y: -20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.3}}
    className=" mx-auto">
    <div className="flex justify-between items-center mb-8">
     <h1 className="text-3xl font-bold text-gray-800">Manage Outlets</h1>
     <motion.button
      whileHover={{scale: 1.05}}
      whileTap={{scale: 0.95}}
      onClick={() => {
       setEditingOutlet(null);
       setIsFormOpen(true);
      }}
      className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition-colors">
      <FiPlus /> Add Outlet
     </motion.button>
    </div>

    {isFormOpen && (
     <motion.div
      initial={{opacity: 0, height: 0}}
      animate={{opacity: 1, height: "auto"}}
      exit={{opacity: 0, height: 0}}
      transition={{duration: 0.3}}
      className="mb-8">
      <OutletForm
       onSubmit={handleSubmit}
       onCancel={() => {
        setIsFormOpen(false);
        setEditingOutlet(null);
       }}
       initialData={editingOutlet}
      />
     </motion.div>
    )}

    {loading && !outlets.length ? (
     <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
     </div>
    ) : error ? (
     <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
      <p>{error}</p>
     </div>
    ) : (
     <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{delay: 0.2}}
      className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-y-auto">
       <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-800 text-white">
         <tr>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
           Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
           Address
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
           Phone
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
           Actions
          </th>
         </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
         {outlets.map((outlet) => (
          <motion.tr
           key={outlet.id}
           initial={{opacity: 0}}
           animate={{opacity: 1}}
           transition={{duration: 0.3}}
           className="hover:bg-gray-50">
           <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
             <div className="text-sm font-medium text-gray-900">
              {outlet.name}
             </div>
            </div>
           </td>
           <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-500 line-clamp-1">
             {outlet.address}
            </div>
           </td>
           <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-500">{outlet.phone}</div>
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex justify-end space-x-2">
             <motion.button
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.9}}
              onClick={() => handleEdit(outlet)}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Edit">
              <FiEdit2 />
             </motion.button>
             <motion.button
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.9}}
              onClick={() => handleDeleteClick(outlet.id)}
              className="text-red-600 hover:text-red-900"
              aria-label="Delete">
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
   <DeleteOutletModal
    isOpen={deleteModalOpen}
    onClose={() => setDeleteModalOpen(false)}
    onConfirm={confirmDelete}
    title="Delete Outlet"
    description="Are you sure you want to delete this outlet? This action cannot be undone."
    confirmText="Delete Outlet"
    cancelText="Cancel"
   />
  </div>
 );
};

export default OutletsLayout;
