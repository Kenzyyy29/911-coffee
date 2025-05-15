// components/ui/Checkbox.tsx
import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
 label?: string;
 containerClassName?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
 ({label, containerClassName = "", className = "", ...props}, ref) => {
  return (
   <div className={`flex items-center ${containerClassName}`}>
    <input
     ref={ref}
     type="checkbox"
     className={`h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded ${className}`}
     {...props}
    />
    {label && (
     <label
      htmlFor={props.id}
      className="ml-2 block text-sm text-gray-700 dark:text-white">
      {label}
     </label>
    )}
   </div>
  );
 }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
