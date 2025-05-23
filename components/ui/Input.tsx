// components/ui/Input.tsx
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
 label?: string;
 error?: string;
 containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
 ({label, error, containerClassName = "", className = "", ...props}, ref) => {
  return (
   <div className={containerClassName}>
    {label && (
     <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
      {label}
      {props.required && " *"}
     </label>
    )}
    <input
     ref={ref}
     className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 ${className}`}
     {...props}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
   </div>
  );
 }
);

Input.displayName = "Input";

export default Input;
