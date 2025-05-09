// components/AuthButton.tsx
import {motion} from "framer-motion";
import {ButtonHTMLAttributes} from "react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
 loading?: boolean;
}

export default function AuthButton({
 children,
 loading,
 ...props
}: AuthButtonProps) {
 return (
  <motion.button
   whileHover={{scale: 1.02}}
   whileTap={{scale: 0.98}}
   disabled={loading}
   className={`w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium rounded-lg transition-all ${
    loading ? "opacity-70 cursor-not-allowed" : ""
   }`}
   {...(props as any)} // Temporary workaround for type issues
  >
   {loading ? (
    <span className="flex items-center justify-center">
     <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24">
      <circle
       className="opacity-25"
       cx="12"
       cy="12"
       r="10"
       stroke="currentColor"
       strokeWidth="4"></circle>
      <path
       className="opacity-75"
       fill="currentColor"
       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
     </svg>
     Processing...
    </span>
   ) : (
    children
   )}
  </motion.button>
 );
}
