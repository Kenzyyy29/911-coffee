// components/AuthInput.tsx
import {motion} from "framer-motion";
import {InputHTMLAttributes} from "react";
import {FiAlertCircle} from "react-icons/fi";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
 icon: React.ReactNode;
 error?: string;
}

export default function AuthInput({icon, error, ...props}: AuthInputProps) {
 return (
  <div className="mb-4">
   <motion.div
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
     {icon}
    </div>
    <input
     className={`w-full pl-10 pr-3 py-2 bg-gray-800 border ${
      error ? "border-red-500" : "border-gray-700"
     } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
     {...props}
    />
    {error && (
     <motion.div
      initial={{opacity: 0, x: 10}}
      animate={{opacity: 1, x: 0}}
      className="absolute inset-y-0 right-0 pr-3 flex items-center">
      <FiAlertCircle className="text-red-500" />
     </motion.div>
    )}
   </motion.div>
   {error && (
    <motion.p
     initial={{opacity: 0, y: -10}}
     animate={{opacity: 1, y: 0}}
     className="mt-1 text-sm text-red-500">
     {error}
    </motion.p>
   )}
  </div>
 );
}
