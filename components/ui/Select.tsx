// components/ui/Select.tsx
import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
 label?: string;
 error?: string;
 options: {value: string; label: string}[];
 containerClassName?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
 (
  {label, error, options, containerClassName = "", className = "", ...props},
  ref
 ) => {
  return (
   <div className={containerClassName}>
    {label && (
     <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
      {label}
      {props.required && " *"}
     </label>
    )}
    <select
     ref={ref}
     className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 ${className}`}
     {...props}>
     {options.map((option) => (
      <option
       key={option.value}
       value={option.value}>
       {option.label}
      </option>
     ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
   </div>
  );
 }
);

Select.displayName = "Select";

export default Select;
