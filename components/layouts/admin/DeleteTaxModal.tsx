// components/ui/DeleteTaxModal.tsx
"use client";

import {motion} from "framer-motion";

interface DeleteTaxModalProps {
 isOpen: boolean;
 onClose: () => void;
 onConfirm: () => void;
 title: string;
 message: string;
}

const DeleteTaxModal = ({
 isOpen,
 onClose,
 onConfirm,
 title,
 message,
}: DeleteTaxModalProps) => {
 if (!isOpen) return null;

 return (
  <motion.div
   initial={{opacity: 0}}
   animate={{opacity: 1}}
   exit={{opacity: 0}}
   className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
   <motion.div
    initial={{scale: 0.9, opacity: 0}}
    animate={{scale: 1, opacity: 1}}
    exit={{scale: 0.9, opacity: 0}}
    className="bg-white rounded-xl shadow-lg w-full max-w-md">
    <div className="p-6">
     <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
     <p className="text-gray-600 mb-6">{message}</p>

     <div className="flex justify-end space-x-3">
      <motion.button
       onClick={onClose}
       whileHover={{scale: 1.05}}
       whileTap={{scale: 0.95}}
       className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
       Cancel
      </motion.button>
      <motion.button
       onClick={() => {
        onConfirm();
        onClose();
       }}
       whileHover={{scale: 1.05}}
       whileTap={{scale: 0.95}}
       className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
       Confirm
      </motion.button>
     </div>
    </div>
   </motion.div>
  </motion.div>
 );
};

export default DeleteTaxModal;
