"use client";

import {motion} from "framer-motion";
import {FiAlertTriangle, FiTrash2, FiX} from "react-icons/fi";

interface DeletePromoModalProps {
 isOpen: boolean;
 onClose: () => void;
 onConfirm: () => void;
 promoName?: string;
 isLoading?: boolean;
}

const DeletePromoModal = ({
 isOpen,
 onClose,
 onConfirm,
 promoName,
 isLoading,
}: DeletePromoModalProps) => {
 if (!isOpen) return null;

 return (
  <motion.div
   initial={{opacity: 0}}
   animate={{opacity: 1}}
   exit={{opacity: 0}}
   className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
   <motion.div
    initial={{scale: 0.9, y: 20}}
    animate={{scale: 1, y: 0}}
    className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
    <div className="p-6">
     <div className="flex justify-between items-start">
      <div className="flex items-center">
       <FiAlertTriangle className="text-red-500 text-2xl mr-2" />
       <h3 className="text-lg font-medium text-gray-900">Delete Promo</h3>
      </div>
      <button
       onClick={onClose}
       className="text-gray-400 hover:text-gray-500">
       <FiX className="text-xl" />
      </button>
     </div>

     <div className="mt-4">
      <p className="text-gray-600">
       Are you sure you want to delete{" "}
       <span className="font-semibold">{promoName || "this promo"}</span>? This
       action cannot be undone.
      </p>
     </div>

     <div className="mt-6 flex justify-end space-x-3">
      <button
       type="button"
       onClick={onClose}
       disabled={isLoading}
       className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50">
       Cancel
      </button>
      <button
       type="button"
       onClick={onConfirm}
       disabled={isLoading}
       className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center">
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

export default DeletePromoModal;
