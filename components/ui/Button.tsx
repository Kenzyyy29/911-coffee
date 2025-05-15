import React from "react";
import {motion, HTMLMotionProps} from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: "primary" | "secondary" | "outline" | "ghost";
 size?: "sm" | "md" | "lg";
 isLoading?: boolean;
 fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
 (
  {
   children,
   variant = "primary",
   size = "md",
   isLoading = false,
   fullWidth = false,
   className = "",
   ...props
  },
  ref
 ) => {
  const baseClasses =
   "rounded-lg transition-colors flex items-center justify-center";

  const sizeClasses = {
   sm: "px-3 py-1.5 text-sm",
   md: "px-4 py-2 text-base",
   lg: "px-6 py-3 text-lg",
  };

  const variantClasses = {
   primary: "bg-onyx1 text-white hover:bg-onyx1/90",
   secondary: "bg-blue-600 text-white hover:bg-blue-700",
   outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
   ghost: "text-gray-700 hover:bg-gray-100",
  };

  const widthClass = fullWidth ? "w-full" : "";

  // Extract motion-specific props to avoid conflicts
  const {onAnimationStart, ...restProps} = props as HTMLMotionProps<"button">;

  return (
   <motion.button
    ref={ref}
    whileHover={{scale: 1.02}}
    whileTap={{scale: 0.98}}
    className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
    disabled={isLoading || props.disabled}
    {...restProps}>
    {isLoading ? (
     <>
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
     </>
    ) : (
     children
    )}
   </motion.button>
  );
 }
);

Button.displayName = "Button";

export default Button;
