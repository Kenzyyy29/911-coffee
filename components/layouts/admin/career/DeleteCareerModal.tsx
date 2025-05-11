import {motion} from "framer-motion";
import {FiAlertTriangle, FiX, FiTrash2} from "react-icons/fi";

interface DeleteCareerModalProps {
 isOpen: boolean;
 onClose: () => void;
 onConfirm: () => void;
 title: string;
 description?: string;
}

const DeleteCareerModal = ({
 isOpen,
 onClose,
 onConfirm,
 title,
 description = "This action cannot be undone.",
}: DeleteCareerModalProps) => {
 if (!isOpen) return null;

 return (
  <motion.div
   initial={{opacity: 0}}
   animate={{opacity: 1}}
   exit={{opacity: 0}}
   className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
   <motion.div
    initial={{scale: 0.9, y: 20}}
    animate={{scale: 1, y: 0}}
    className="bg-white rounded-xl shadow-lg w-full max-w-md">
    <div className="p-6">
     <div className="flex justify-between items-start mb-4">
      <div className="flex items-center">
       <FiAlertTriangle
        className="text-red-500 mr-2"
        size={24}
       />
       <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      <button
       onClick={onClose}
       className="text-gray-500 hover:text-gray-700">
       <FiX size={24} />
      </button>
     </div>

     <p className="text-gray-600 mb-6">{description}</p>

     <div className="flex justify-end space-x-3">
      <button
       onClick={onClose}
       className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
       Cancel
      </button>
      <button
       onClick={onConfirm}
       className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center">
       <FiTrash2 className="mr-2" />
       Delete
      </button>
     </div>
    </div>
   </motion.div>
  </motion.div>
 );
};

export default DeleteCareerModal;
