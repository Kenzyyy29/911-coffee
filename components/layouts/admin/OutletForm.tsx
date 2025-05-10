"use client";

import {motion} from "framer-motion";
import {FiX} from "react-icons/fi";
import {Outlet} from "@/lib/types/outlet";
import {useState} from "react";

interface OutletFormProps {
 onSubmit: (data: Omit<Outlet, "id" | "createdAt">) => void;
 onCancel: () => void;
 initialData?: Outlet | null;
}

const OutletForm = ({onSubmit, onCancel, initialData}: OutletFormProps) => {
 const [formData, setFormData] = useState<Omit<Outlet, "id" | "createdAt">>({
  name: initialData?.name || "",
  address: initialData?.address || "",
  phone: initialData?.phone || "",
 });

 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
 ) => {
  const {name, value} = e.target;
  setFormData((prev) => ({...prev, [name]: value}));
 };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  onSubmit(formData);
 };

 return (
  <motion.div
   initial={{opacity: 0}}
   animate={{opacity: 1}}
   exit={{opacity: 0}}
   className="bg-white rounded-xl shadow-lg p-6 mb-6">
   <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold text-gray-800">
     {initialData ? "Edit Outlet" : "Add New Outlet"}
    </h2>
    <button
     onClick={onCancel}
     className="text-gray-500 hover:text-gray-700"
     aria-label="Close form">
     <FiX size={24} />
    </button>
   </div>

   <form
    onSubmit={handleSubmit}
    className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
     <div>
      <label
       htmlFor="name"
       className="block text-sm font-medium text-gray-700 mb-1">
       Name *
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

     <div>
      <label
       htmlFor="phone"
       className="block text-sm font-medium text-gray-700 mb-1">
       Phone *
      </label>
      <input
       type="tel"
       id="phone"
       name="phone"
       value={formData.phone}
       onChange={handleChange}
       required
       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
      />
     </div>

     <div className="md:col-span-2">
      <label
       htmlFor="address"
       className="block text-sm font-medium text-gray-700 mb-1">
       Address *
      </label>
      <input
       type="text"
       id="address"
       name="address"
       value={formData.address}
       onChange={handleChange}
       required
       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
      />
     </div>
    </div>

    <div className="flex justify-end space-x-3 pt-4">
     <motion.button
      whileHover={{scale: 1.03}}
      whileTap={{scale: 0.97}}
      type="button"
      onClick={onCancel}
      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
      Cancel
     </motion.button>
     <motion.button
      whileHover={{scale: 1.03}}
      whileTap={{scale: 0.97}}
      type="submit"
      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700">
      {initialData ? "Update Outlet" : "Add Outlet"}
     </motion.button>
    </div>
   </form>
  </motion.div>
 );
};

export default OutletForm;
