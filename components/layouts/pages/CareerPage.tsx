"use client";
import {motion} from "framer-motion";
import {FiBriefcase, FiArrowRight, FiClock, FiMapPin} from "react-icons/fi";
import {useCareer} from "@/lib/hooks/useCareer";
import {Career} from "@/lib/types/career";
import {useState} from "react";
import DetailCareerModal from "./DetailCareerModal";

const CareerPage = () => {
 const {careers, loading, error} = useCareer();
 const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
 const [isDetailOpen, setIsDetailOpen] = useState(false);

 const handleViewDetail = (career: Career) => {
  setSelectedCareer(career);
  setIsDetailOpen(true);
 };

 if (loading)
  return <div className="text-center py-12">Memuat lowongan...</div>;
 if (error)
  return <div className="text-center py-12 text-red-500">Error: {error}</div>;

 return (
  <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
   <motion.div
    initial={{opacity: 0, y: 20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.5}}
    className="max-w-4xl mx-auto">
    <div className="text-center mb-12">
     <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
      <FiBriefcase className="mr-3" /> Karir Bersama Kami
     </h1>
     <p className="text-lg text-gray-600">
      Temukan kesempatan karir yang sesuai dengan keahlian Anda
     </p>
    </div>

    <div className="space-y-6">
     {careers
      .filter((c) => c.isActive)
      .map((career) => (
       <motion.div
        key={career.id}
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3}}
        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
        <div className="p-6">
         <div className="flex justify-between items-start">
          <div>
           <h2 className="text-xl font-bold text-gray-800 mb-1">
            {career.title}
           </h2>
           <div className="flex items-center text-gray-600 mb-2">
            <FiMapPin className="mr-1" />
            <span className="mr-3">{career.outlet}</span>
            <FiClock className="mr-1" />
            <span>
             {career.employmentType === "FULL_TIME" && "Full-time"}
             {career.employmentType === "PART_TIME" && "Part-time"}
             {career.employmentType === "CONTRACT" && "Kontrak"}
             {career.employmentType === "INTERNSHIP" && "Magang"}
            </span>
           </div>
          </div>
          <motion.button
           whileHover={{scale: 1.05}}
           whileTap={{scale: 0.95}}
           onClick={() => handleViewDetail(career)}
           className="flex items-center text-blue-600 hover:text-blue-800">
           Lihat Detail <FiArrowRight className="ml-1" />
          </motion.button>
         </div>

         <p className="text-gray-700 mt-3 mb-4 line-clamp-2">
          {career.description}
         </p>

         <div className="mt-4">
          <h3 className="font-medium text-gray-900 mb-2">Persyaratan:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
           {career.requirements.slice(0, 3).map((req, i) => (
            <li key={i}>{req}</li>
           ))}
           {career.requirements.length > 3 && (
            <li className="text-gray-500">
             +{career.requirements.length - 3} persyaratan lainnya
            </li>
           )}
          </ul>
         </div>
        </div>
       </motion.div>
      ))}

     {careers.filter((c) => c.isActive).length === 0 && (
      <motion.div
       initial={{opacity: 0}}
       animate={{opacity: 1}}
       className="text-center py-12 bg-white rounded-xl shadow-sm">
       <p className="text-gray-500">Tidak ada lowongan tersedia saat ini</p>
      </motion.div>
     )}
    </div>
   </motion.div>
   <DetailCareerModal
    isOpen={isDetailOpen}
    onClose={() => setIsDetailOpen(false)}
    career={selectedCareer}
   />
  </div>
 );
};

export default CareerPage;
