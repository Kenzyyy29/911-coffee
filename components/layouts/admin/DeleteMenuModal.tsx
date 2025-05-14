import {motion} from "framer-motion";
import {FiAlertTriangle, FiTrash2, FiX} from "react-icons/fi";

interface DeleteMenuModalProps {
 isOpen: boolean;
 onClose: () => void;
 onConfirm: () => void;
 menuName?: string;
 isLoading?: boolean;
}

const DeleteMenuModal = ({
 isOpen,
 onClose,
 onConfirm,
 menuName,
 isLoading,
}: DeleteMenuModalProps) => {
 if (!isOpen) return null;

 return (
  <motion.div
   initial={{opacity: 0}}
   animate={{opacity: 1}}
   exit={{opacity: 0}}
   className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
   <motion.div
    initial={{scale: 0.9, y: 20}}
    animate={{scale: 1, y: 0}}
    className="bg-white dark:bg-onyx2 rounded-lg shadow-xl w-full max-w-md mx-4">
    <div className="p-4 md:p-6">
     <div className="flex justify-between items-start">
      <div className="flex items-center">
       <FiAlertTriangle className="text-red-500 text-2xl mr-2" />
       <h3 className="text-lg font-medium text-onyx1 dark:text-white">Delete Menu Item</h3>
      </div>
      <button
       onClick={onClose}
       className="text-gray-400 hover:text-gray-500 transition-colors"
       aria-label="Close modal">
       <FiX className="text-xl" />
      </button>
     </div>

     <div className="mt-4">
      <p className="text-gray-600 dark:text-gray-400">
       Are you sure you want to delete{" "}
       <span className="font-semibold">{menuName || "this menu item"}</span>?
       This action cannot be undone.
      </p>
     </div>

     <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
      <button
       type="button"
       onClick={onClose}
       disabled={isLoading}
       className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors">
       Cancel
      </button>
      <button
       type="button"
       onClick={onConfirm}
       disabled={isLoading}
       className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center transition-colors">
       {isLoading ? (
        "Deleting..."
       ) : (
        <>
         <FiTrash2 className="mr-2" />
         Delete
        </>
       )}
      </button>
     </div>
    </div>
   </motion.div>
  </motion.div>
 );
};

export default DeleteMenuModal;
