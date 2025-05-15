// components/ui/Modal.tsx
import React from "react";
import {motion} from "framer-motion";
import {FiX} from "react-icons/fi";

interface ModalProps {
 isOpen: boolean;
 onClose: () => void;
 title: string;
 children: React.ReactNode;
 maxWidth?: "sm" | "md" | "lg" | "xl";
}

const Modal: React.FC<ModalProps> = ({
 isOpen,
 onClose,
 title,
 children,
 maxWidth = "md",
}) => {
 if (!isOpen) return null;

 const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
 };

 return (
  <motion.div
   initial={{opacity: 0}}
   animate={{opacity: 1}}
   exit={{opacity: 0}}
   className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
   <motion.div
    initial={{scale: 0.9, y: 20}}
    animate={{scale: 1, y: 0}}
    className={`bg-white dark:bg-onyx2 rounded-xl shadow-xl w-full ${maxWidthClasses[maxWidth]} md:max-h-[90vh] max-h-[80vh] overflow-y-auto`}>
    <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-onyx2 border-b p-4 z-10">
     <h2 className="text-xl font-semibold text-onyx1 dark:text-white">
      {title}
     </h2>
     <button
      onClick={onClose}
      className="text-gray-500 hover:text-onyx1 dark:text-white transition-colors"
      aria-label="Close modal">
      <FiX size={24} />
     </button>
    </div>
    <div className="p-4 md:p-6">{children}</div>
   </motion.div>
  </motion.div>
 );
};

export default Modal;
