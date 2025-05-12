// /components/bundling/DeleteBundlingModal.tsx
import {motion} from "framer-motion";
import {FiX} from "react-icons/fi";
import {Bundling} from "@/lib/types/bundling";

interface DeleteBundlingModalProps {
 isOpen: boolean;
 onClose: () => void;
 onConfirm: () => void;
 bundling?: Bundling | null ;
}

const DeleteBundlingModal = ({
 isOpen,
 onClose,
 onConfirm,
 bundling,
}: DeleteBundlingModalProps) => {
 if (!isOpen) return null;

 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
   <motion.div
    initial={{opacity: 0, scale: 0.9}}
    animate={{opacity: 1, scale: 1}}
    exit={{opacity: 0, scale: 0.9}}
    className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
    <div className="flex justify-between items-center mb-4">
     <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
     <button
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700">
      <FiX size={24} />
     </button>
    </div>

    <p className="text-gray-700 mb-6">
     Are you sure you want to delete the bundling
     <span className="font-semibold">"{bundling?.name}"</span>? This action
     cannot be undone.
    </p>

    <div className="flex justify-end space-x-3">
     <motion.button
      whileHover={{scale: 1.05}}
      whileTap={{scale: 0.95}}
      onClick={onClose}
      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
      Cancel
     </motion.button>
     <motion.button
      whileHover={{scale: 1.05}}
      whileTap={{scale: 0.95}}
      onClick={onConfirm}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
      Delete
     </motion.button>
    </div>
   </motion.div>
  </div>
 );
};

export default DeleteBundlingModal;
