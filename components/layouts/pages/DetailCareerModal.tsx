import {motion} from "framer-motion";
import {FiX, FiMapPin, FiClock, FiDollarSign} from "react-icons/fi";
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
   className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
   <motion.div
    initial={{scale: 0.95, y: 20}}
    animate={{scale: 1, y: 0}}
    className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
    <div className="p-6">
     <div className="flex justify-between items-start mb-4">
      <div>
       <h2 className="text-2xl font-bold text-gray-800">{career.title}</h2>
       <div className="flex items-center mt-2 text-gray-600">
        <FiMapPin className="mr-1" />
        <span>{career.outlet}</span>
       </div>
      </div>
      <button
       onClick={onClose}
       className="text-gray-500 hover:text-gray-700 p-1">
       <FiX size={24} />
      </button>
     </div>

     <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="flex items-center text-gray-700">
       <FiClock className="mr-2" />
       <span>{getEmploymentTypeLabel()}</span>
      </div>
      {career.salaryRange && (
       <div className="flex items-center text-gray-700">
        <FiDollarSign className="mr-2" />
        <span>{career.salaryRange}</span>
       </div>
      )}
     </div>

     <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
       Deskripsi Pekerjaan
      </h3>
      <p className="text-gray-700 whitespace-pre-line">{career.description}</p>
     </div>

     <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
       Tanggung Jawab
      </h3>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
       {career.responsibilities.map((item, index) => (
        <li key={index}>{item}</li>
       ))}
      </ul>
     </div>

     <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Persyaratan</h3>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
       {career.requirements.map((item, index) => (
        <li key={index}>{item}</li>
       ))}
      </ul>
     </div>

     <div className="pt-4 border-t border-gray-200">
      <button className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors">
       Lamar Sekarang
      </button>
     </div>
    </div>
   </motion.div>
  </motion.div>
 );
};

export default DetailCareerModal;
