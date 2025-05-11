"use client";
import {motion} from "framer-motion";
import {FiX} from "react-icons/fi";
import {Career} from "@/lib/types/career";
import {useEffect, useState} from "react";

interface CareerModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSubmit: (data: Omit<Career, "id" | "createdAt" | "updatedAt">) => void;
 career: Career | null;
}

const CareerModal = ({isOpen, onClose, onSubmit, career}: CareerModalProps) => {
 const [formData, setFormData] = useState<
  Omit<Career, "id" | "createdAt" | "updatedAt">
 >({
  title: "",
  description: "",
  outlet: "",
  requirements: [],
  responsibilities: [],
  employmentType: "FULL_TIME",
  isActive: true,
  salaryRange: "",
 });

 useEffect(() => {
  if (career) {
   setFormData({
    title: career.title,
    description: career.description,
    outlet: career.outlet,
    requirements: career.requirements,
    responsibilities: career.responsibilities,
    employmentType: career.employmentType,
    isActive: career.isActive,
    salaryRange: career.salaryRange || "",
   });
  } else {
   setFormData({
    title: "",
    description: "",
    outlet: "",
    requirements: [],
    responsibilities: [],
    employmentType: "FULL_TIME",
    isActive: true,
    salaryRange: "",
   });
  }
 }, [career]);

 const handleChange = (
  e: React.ChangeEvent<
   HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
 ) => {
  const {name, value, type} = e.target;
  const checked =
   type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

  setFormData((prev) => ({
   ...prev,
   [name]: type === "checkbox" ? checked : value,
  }));
 };

 const handleArrayChange = (
  field: "requirements" | "responsibilities",
  value: string,
  index: number
 ) => {
  setFormData((prev) => {
   const newArray = [...prev[field]];
   newArray[index] = value;
   return {...prev, [field]: newArray};
  });
 };

 const addArrayItem = (field: "requirements" | "responsibilities") => {
  setFormData((prev) => ({
   ...prev,
   [field]: [...prev[field], ""],
  }));
 };

 const removeArrayItem = (
  field: "requirements" | "responsibilities",
  index: number
 ) => {
  setFormData((prev) => ({
   ...prev,
   [field]: prev[field].filter((_, i) => i !== index),
  }));
 };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  onSubmit(formData);
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
    className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
    <div className="p-6">
     <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-800">
       {career ? "Edit Career" : "Add New Career"}
      </h2>
      <button
       onClick={onClose}
       className="text-gray-500 hover:text-gray-700">
       <FiX size={24} />
      </button>
     </div>

     <form
      onSubmit={handleSubmit}
      className="space-y-4">
      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Title
       </label>
       <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        required
       />
      </div>

      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Outlet
       </label>
       <input
        type="text"
        name="outlet"
        value={formData.outlet}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        required
       />
      </div>
      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Jenis Pekerjaan
       </label>
       <select
        name="employmentType"
        value={formData.employmentType}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        required>
        <option value="FULL_TIME">Full-time</option>
        <option value="PART_TIME">Part-time</option>
        <option value="CONTRACT">Kontrak</option>
        <option value="INTERNSHIP">Magang</option>
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
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        required
       />
      </div>

      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Requirements
       </label>
       {formData.requirements.map((item, index) => (
        <div
         key={index}
         className="flex mb-2">
         <input
          type="text"
          value={item}
          onChange={(e) =>
           handleArrayChange("requirements", e.target.value, index)
          }
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          required
         />
         <button
          type="button"
          onClick={() => removeArrayItem("requirements", index)}
          className="ml-2 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200">
          Remove
         </button>
        </div>
       ))}
       <button
        type="button"
        onClick={() => addArrayItem("requirements")}
        className="mt-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
        Add Requirement
       </button>
      </div>

      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Responsibilities
       </label>
       {formData.responsibilities.map((item, index) => (
        <div
         key={index}
         className="flex mb-2">
         <input
          type="text"
          value={item}
          onChange={(e) =>
           handleArrayChange("responsibilities", e.target.value, index)
          }
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          required
         />
         <button
          type="button"
          onClick={() => removeArrayItem("responsibilities", index)}
          className="ml-2 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200">
          Remove
         </button>
        </div>
       ))}
       <button
        type="button"
        onClick={() => addArrayItem("responsibilities")}
        className="mt-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
        Add Responsibility
       </button>
      </div>

      {/* Tambahkan Salary Range */}
      <div>
       <label className="block text-sm font-medium text-gray-700 mb-1">
        Range Gaji (opsional)
       </label>
       <input
        type="text"
        name="salaryRange"
        value={formData.salaryRange}
        onChange={handleChange}
        placeholder="Contoh: Rp 5.000.000 - Rp 8.000.000"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
       />
      </div>

      <div className="flex items-center">
       <input
        type="checkbox"
        name="isActive"
        checked={formData.isActive}
        onChange={handleChange}
        className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
       />
       <label className="ml-2 block text-sm text-gray-700">Active</label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
       <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
        Cancel
       </button>
       <button
        type="submit"
        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
        {career ? "Update" : "Create"}
       </button>
      </div>
     </form>
    </div>
   </motion.div>
  </motion.div>
 );
};

export default CareerModal;
