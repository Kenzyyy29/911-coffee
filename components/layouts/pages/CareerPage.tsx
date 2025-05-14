// CareerPage.tsx
"use client";
import {motion} from "framer-motion";
import {
 FiBriefcase,
 FiArrowRight,
 FiClock,
 FiMapPin,
 FiSearch,
 FiFilter,
 FiLoader,
} from "react-icons/fi";
import {useCareer} from "@/lib/hooks/useCareer";
import {Career} from "@/lib/types/career";
import {useState} from "react";
import DetailCareerModal from "./DetailCareerModal";

const CareerPage = () => {
 const {careers, loading, error} = useCareer();
 const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
 const [isDetailOpen, setIsDetailOpen] = useState(false);
 const [searchTerm, setSearchTerm] = useState("");
 const [employmentFilter, setEmploymentFilter] = useState<string>("ALL");

 const handleViewDetail = (career: Career) => {
  setSelectedCareer(career);
  setIsDetailOpen(true);
 };

 const filteredCareers = careers
  .filter((c) => c.isActive)
  .filter(
   (c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.outlet.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter(
   (c) => employmentFilter === "ALL" || c.employmentType === employmentFilter
  );

 if (loading)
  return (
   <div className="min-h-screen flex items-center justify-center">
    <motion.div
     animate={{rotate: 360}}
     transition={{repeat: Infinity, duration: 1, ease: "linear"}}
     className="text-blue-600">
     <FiLoader size={32} />
    </motion.div>
   </div>
  );

 if (error)
  return (
   <motion.div
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    className="min-h-screen flex items-center justify-center text-red-500">
    <div className="text-center max-w-md p-6 bg-red-50 rounded-lg">
     <h2 className="text-xl font-bold mb-2">Error loading careers</h2>
     <p>{error}</p>
     <button
      onClick={() => window.location.reload()}
      className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors">
      Try Again
     </button>
    </div>
   </motion.div>
  );

 return (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
   <motion.div
    initial={{opacity: 0, y: 20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.5}}
    className="max-w-6xl mx-auto">
    <div className="text-center mb-12">
     <motion.h1
      initial={{scale: 0.95}}
      animate={{scale: 1}}
      transition={{delay: 0.2}}
      className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
      <motion.span
       initial={{rotate: -30, y: -5}}
       animate={{rotate: 0, y: 0}}
       transition={{type: "spring", stiffness: 300}}
       className="inline-block mr-3">
       <FiBriefcase className="text-blue-600" />
      </motion.span>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
       Karir Bersama Kami
      </span>
     </motion.h1>
     <motion.p
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{delay: 0.4}}
      className="text-lg text-gray-600 max-w-2xl mx-auto">
      Temukan kesempatan karir yang sesuai dengan keahlian Anda dan bergabunglah
      dengan tim profesional kami
     </motion.p>
    </div>

    <motion.div
     initial={{opacity: 0, y: 10}}
     animate={{opacity: 1, y: 0}}
     transition={{delay: 0.3}}
     className="mb-8 bg-white p-4 rounded-xl shadow-sm">
     <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="text-gray-400" />
       </div>
       <input
        type="text"
        placeholder="Cari lowongan..."
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
       />
      </div>
      <div className="relative w-full md:w-48">
       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiFilter className="text-gray-400" />
       </div>
       <select
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
        value={employmentFilter}
        onChange={(e) => setEmploymentFilter(e.target.value)}>
        <option value="ALL">Semua Tipe</option>
        <option value="FULL_TIME">Full-time</option>
        <option value="PART_TIME">Part-time</option>
        <option value="CONTRACT">Kontrak</option>
        <option value="INTERNSHIP">Magang</option>
       </select>
      </div>
     </div>
    </motion.div>

    <div className="space-y-6">
     {filteredCareers.map((career, index) => (
      <motion.div
       key={career.id}
       initial={{opacity: 0, y: 20}}
       animate={{opacity: 1, y: 0}}
       transition={{duration: 0.3, delay: index * 0.05}}
       whileHover={{scale: 1.01}}
       className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all">
       <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
         <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
           {career.title}
          </h2>
          <div className="flex flex-wrap items-center text-gray-600 mb-2 gap-3">
           <span className="inline-flex items-center">
            <FiMapPin className="mr-1" />
            {career.outlet}
           </span>
           <span className="inline-flex items-center">
            <FiClock className="mr-1" />
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
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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

     {filteredCareers.length === 0 && (
      <motion.div
       initial={{opacity: 0}}
       animate={{opacity: 1}}
       className="text-center py-12 bg-white rounded-xl shadow-sm">
       <div className="max-w-md mx-auto">
        <FiSearch
         size={48}
         className="mx-auto text-gray-400 mb-4"
        />
        <h3 className="text-xl font-medium text-gray-900 mb-2">
         Tidak ada lowongan yang ditemukan
        </h3>
        <p className="text-gray-500">
         Coba ubah kriteria pencarian atau filter Anda
        </p>
       </div>
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
