// /components/ui/ConfirmationModal.tsx
"use client";

import {motion, AnimatePresence} from "framer-motion";
import {FiAlertTriangle, FiX} from "react-icons/fi";

interface DeleteOutletModalProps {
 isOpen: boolean;
 onClose: () => void;
 onConfirm: () => void;
 title: string;
 description: string;
 confirmText?: string;
 cancelText?: string;
}

const DeleteOutletModal = ({
 isOpen,
 onClose,
 onConfirm,
 title,
 description,
 confirmText = "Delete",
 cancelText = "Cancel",
}: DeleteOutletModalProps) => {
 return (
  <AnimatePresence>
   {isOpen && (
    <motion.div
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     exit={{opacity: 0}}
     className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
     <motion.div
      initial={{scale: 0.9, y: 20}}
      animate={{scale: 1, y: 0}}
      exit={{scale: 0.9, y: 20}}
      className="w-full max-w-md rounded-xl bg-white shadow-xl">
      <div className="p-6">
       <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
         <div className="rounded-full bg-red-100 p-2">
          <FiAlertTriangle className="h-5 w-5 text-red-600" />
         </div>
         <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <button
         onClick={onClose}
         className="text-gray-400 hover:text-gray-500">
         <FiX className="h-5 w-5" />
        </button>
       </div>

       <div className="mt-4">
        <p className="text-sm text-gray-500">{description}</p>
       </div>

       <div className="mt-6 flex justify-end gap-3">
        <button
         type="button"
         onClick={onClose}
         className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
         {cancelText}
        </button>
        <button
         type="button"
         onClick={() => {
          onConfirm();
          onClose();
         }}
         className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
         {confirmText}
        </button>
       </div>
      </div>
     </motion.div>
    </motion.div>
   )}
  </AnimatePresence>
 );
};

export default DeleteOutletModal;
