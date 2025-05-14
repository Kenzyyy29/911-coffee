// DetailCareerModal.tsx
import {motion} from "framer-motion";
import {
 FiX,
 FiMapPin,
 FiClock,
 FiDollarSign,
 FiCheckCircle,
 FiSend,
 FiBookmark,
} from "react-icons/fi";
import {Career} from "@/lib/types/career";

interface DetailCareerModalProps {
 isOpen: boolean;
 onClose: () => void;
 career: Career | null;
}

const DetailCareerModal = ({
 isOpen,
 onClose,
 career,
}: DetailCareerModalProps) => {
 if (!isOpen || !career) return null;

 const getEmploymentTypeLabel = () => {
  switch (career.employmentType) {
   case "FULL_TIME":
    return "Full-time";
   case "PART_TIME":
    return "Part-time";
   case "CONTRACT":
    return "Kontrak";
   case "INTERNSHIP":
    return "Magang";
   default:
    return career.employmentType;
  }
 };

 return (
  <motion.div
   initial={{opacity: 0}}
   animate={{opacity: 1}}
   exit={{opacity: 0}}
   className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
   onClick={onClose}>
   <motion.div
    initial={{scale: 0.95, y: 20}}
    animate={{scale: 1, y: 0}}
    exit={{scale: 0.95, y: 20}}
    className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
    onClick={(e) => e.stopPropagation()}>
    <div className="p-6">
     <div className="flex justify-between items-start mb-4">
      <div>
       <motion.h2
        initial={{opacity: 0, y: -10}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.1}}
        className="text-2xl font-bold text-gray-800">
        {career.title}
       </motion.h2>
       <motion.div
        initial={{opacity: 0, y: -10}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.15}}
        className="flex items-center mt-2 text-gray-600">
        <FiMapPin className="mr-1" />
        <span>{career.outlet}</span>
       </motion.div>
      </div>
      <motion.button
       whileHover={{rotate: 90}}
       whileTap={{scale: 0.9}}
       onClick={onClose}
       className="text-gray-500 hover:text-gray-700 p-1">
       <FiX size={24} />
      </motion.button>
     </div>

     <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{delay: 0.2}}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
       <FiClock className="mr-2 text-blue-600" />
       <span>{getEmploymentTypeLabel()}</span>
      </div>
      {career.salaryRange && (
       <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
        <FiDollarSign className="mr-2 text-green-600" />
        <span>{career.salaryRange}</span>
       </div>
      )}
     </motion.div>

     <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{delay: 0.25}}
      className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
       <FiCheckCircle className="mr-2 text-blue-600" />
       Deskripsi Pekerjaan
      </h3>
      <div className="bg-gray-50 p-4 rounded-lg">
       <p className="text-gray-700 whitespace-pre-line">{career.description}</p>
      </div>
     </motion.div>

     <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{delay: 0.3}}
      className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
       <FiCheckCircle className="mr-2 text-blue-600" />
       Tanggung Jawab
      </h3>
      <ul className="bg-gray-50 p-4 rounded-lg space-y-2 text-gray-700">
       {career.responsibilities.map((item, index) => (
        <li
         key={index}
         className="flex items-start">
         <span className="inline-block mr-2 mt-1 w-1.5 h-1.5 rounded-full bg-blue-600"></span>
         {item}
        </li>
       ))}
      </ul>
     </motion.div>

     <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{delay: 0.35}}
      className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
       <FiCheckCircle className="mr-2 text-blue-600" />
       Persyaratan
      </h3>
      <ul className="bg-gray-50 p-4 rounded-lg space-y-2 text-gray-700">
       {career.requirements.map((item, index) => (
        <li
         key={index}
         className="flex items-start">
         <span className="inline-block mr-2 mt-1 w-1.5 h-1.5 rounded-full bg-blue-600"></span>
         {item}
        </li>
       ))}
      </ul>
     </motion.div>

     <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{delay: 0.4}}
      className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
      <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
       <FiSend />
       Lamar Sekarang
      </button>
      <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors">
       <FiBookmark />
       Simpan Lowongan
      </button>
     </motion.div>
    </div>
   </motion.div>
  </motion.div>
 );
};

export default DetailCareerModal;
