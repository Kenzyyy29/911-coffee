// components/AuthFormContainer.tsx
import {motion} from "framer-motion";
import {ReactNode} from "react";

export default function AuthFormContainer({
 children,
 title,
}: {
 children: ReactNode;
 title: string;
}) {
 return (
  <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
   <motion.div
    initial={{opacity: 0, y: 20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.5}}
    className="w-full max-w-md bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800">
    <div className="p-1 bg-gradient-to-r from-purple-600 to-blue-500"></div>
    <div className="p-8">
     <div className="flex justify-center mb-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
       {title}
      </h2>
     </div>
     {children}
    </div>
   </motion.div>
  </div>
 );
}
