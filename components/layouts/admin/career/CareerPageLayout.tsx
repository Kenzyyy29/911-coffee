"use client";
import {motion} from "framer-motion";
import {FiPlus, FiEdit2, FiTrash2, FiBriefcase} from "react-icons/fi";
import {useCareer} from "@/lib/hooks/useCareer";
import {useState} from "react";
import AddCareer from "./AddCareer";
import {Career} from "@/lib/types/career";
import DeleteCareerModal from "./DeleteCareerModal";

const CareerPageLayout = () => {
 const {careers, loading, error, addCareer, updateCareer, deleteCareer} =
  useCareer();
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [currentCareer, setCurrentCareer] = useState<Career | null>(null);
 const [careerToDelete, setCareerToDelete] = useState<string | null>(null);

 const handleAdd = () => {
  setCurrentCareer(null);
  setIsModalOpen(true);
 };

 const handleEdit = (career: Career) => {
  setCurrentCareer(career);
  setIsModalOpen(true);
 };

 const handleDeleteClick = (id: string) => {
  setCareerToDelete(id);
  setIsDeleteModalOpen(true);
 };

 const handleDeleteConfirm = async () => {
  if (careerToDelete) {
   await deleteCareer(careerToDelete);
   setIsDeleteModalOpen(false);
   setCareerToDelete(null);
  }
 };

 const handleSubmit = async (
  careerData: Omit<Career, "id" | "createdAt" | "updatedAt">
 ) => {
  if (currentCareer) {
   await updateCareer(currentCareer.id!, careerData);
  } else {
   await addCareer(careerData);
  }
  setIsModalOpen(false);
 };

 if (loading) return <div className="text-center py-8">Loading...</div>;
 if (error)
  return <div className="text-center py-8 text-red-500">Error: {error}</div>;

 return (
  <div className="max-h-[100dvh]">
   <motion.div
    initial={{opacity: 0, y: -20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.3}}
    className="max-w-6xl mx-auto">
    <div className="flex justify-between items-center mb-8">
     <h1 className="text-3xl font-bold text-gray-800 flex items-center">
      <FiBriefcase className="mr-2" /> Career Management
     </h1>
     <motion.button
      whileHover={{scale: 1.05}}
      whileTap={{scale: 0.95}}
      onClick={handleAdd}
      className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center">
      <FiPlus className="mr-2" /> Add Career
     </motion.button>
    </div>

    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
     <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
       <thead className="bg-gray-100">
        <tr>
         <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
          Title
         </th>
         <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
          Outlet
         </th>
         <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
          Jenis
         </th>
         <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
          Status
         </th>
         <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
          Actions
         </th>
        </tr>
       </thead>
       <tbody className="bg-white divide-y divide-gray-200">
        {careers.map((career) => (
         <motion.tr
          key={career.id}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.3}}
          className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
           {career.title}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
           {career.outlet}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
           {career.employmentType === "FULL_TIME" && "Full-time"}
           {career.employmentType === "PART_TIME" && "Part-time"}
           {career.employmentType === "CONTRACT" && "Kontrak"}
           {career.employmentType === "INTERNSHIP" && "Magang"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
           <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
             career.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
            }`}>
            {career.isActive ? "Active" : "Inactive"}
           </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
           <div className="flex space-x-2">
            <motion.button
             whileHover={{scale: 1.1}}
             whileTap={{scale: 0.9}}
             onClick={() => handleEdit(career)}
             className="text-gray-600 hover:text-gray-900">
             <FiEdit2 />
            </motion.button>
            <motion.button
             whileHover={{scale: 1.1}}
             whileTap={{scale: 0.9}}
             onClick={() => handleDeleteClick(career.id!)}
             className="text-gray-600 hover:text-red-600">
             <FiTrash2 />
            </motion.button>
           </div>
          </td>
         </motion.tr>
        ))}
       </tbody>
      </table>
     </div>
    </div>
   </motion.div>
   <DeleteCareerModal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    onConfirm={handleDeleteConfirm}
    title="Delete Career Position"
    description="Are you sure you want to delete this career position? This action cannot be undone."
   />

   <AddCareer
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onSubmit={handleSubmit}
    career={currentCareer}
   />
  </div>
 );
};

export default CareerPageLayout;
