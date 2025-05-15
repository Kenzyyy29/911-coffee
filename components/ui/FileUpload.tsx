// components/ui/FileUpload.tsx
import Image from "next/image";
import React from "react";
import {FiUpload} from "react-icons/fi";

interface FileUploadProps {
 label?: string;
 accept?: string;
 onFileChange: (file: File | null) => void;
 buttonText?: string;
 uploading?: boolean;
 previewUrl?: string;
 containerClassName?: string;
 buttonClassName?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
 label,
 accept = "image/*",
 onFileChange,
 buttonText = "Upload",
 uploading = false,
 previewUrl,
 containerClassName = "",
 buttonClassName = "",
}) => {
 const fileInputRef = React.useRef<HTMLInputElement>(null);

 const handleClick = () => {
  fileInputRef.current?.click();
 };

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] || null;
  onFileChange(file);
 };

 return (
  <div className={containerClassName}>
   {label && (
    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
     {label}
    </label>
   )}
   <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileChange}
    accept={accept}
    className="hidden"
   />
   <button
    type="button"
    onClick={handleClick}
    disabled={uploading}
    className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-white hover:bg-gray-50 transition-colors ${buttonClassName}`}>
    <FiUpload className="mr-2" />
    {uploading ? "Uploading..." : buttonText}
   </button>
   {previewUrl && (
    <div className="mt-2 flex justify-center">
     <Image
      height={400}
      width={400}
      src={previewUrl}
      alt="Preview"
      className="max-w-full h-auto max-h-40 object-contain rounded-lg"
     />
    </div>
   )}
  </div>
 );
};

export default FileUpload;
