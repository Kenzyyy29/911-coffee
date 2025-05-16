import React, {useState} from "react";
import {FiUpload, FiFile, FiX} from "react-icons/fi";

interface FileUploadInputProps {
 label?: string;
 accept?: string;
 onFileChange: (file: File | null) => void;
 buttonText?: string;
 uploading?: boolean;
 file?: File | null;
 error?: string;
 maxSizeMB?: number;
 containerClassName?: string;
 buttonClassName?: string;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({
 label = "Upload File",
 accept = "application/pdf",
 onFileChange,
 buttonText = "Pilih File",
 uploading = false,
 file,
 error,
 maxSizeMB = 5,
 containerClassName = "",
 buttonClassName = "",
}) => {
 const fileInputRef = React.useRef<HTMLInputElement>(null);
 const [fileError, setFileError] = useState<string | null>(null);

 const handleClick = () => {
  fileInputRef.current?.click();
 };

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0] || null;

  if (!selectedFile) {
   onFileChange(null);
   return;
  }

  // Validate File Type
  if (accept && !selectedFile.type.includes(accept.replace("/*", ""))) {
   setFileError(`Hanya file ${accept} yang diizinkan`);
   onFileChange(null);
   return;
  }

  // Validate File Size
  if (selectedFile.size > maxSizeMB * 1024 * 1024) {
   setFileError(`Ukuran file maksimal ${maxSizeMB}MB`);
   onFileChange(null);
   return;
  }

  setFileError(null);
  onFileChange(selectedFile);
 };

 const removeFile = () => {
  if (fileInputRef.current) {
   fileInputRef.current.value = "";
  }
  onFileChange(null);
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

   <div className="flex flex-col gap-2">
    <div className="flex items-center gap-3">
     <button
      type="button"
      onClick={handleClick}
      disabled={uploading}
      className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-white hover:bg-gray-50 transition-colors ${buttonClassName}`}>
      <FiUpload className="mr-2" />
      {uploading ? "Uploading..." : buttonText}
     </button>

     {file && (
      <div className="flex items-center gap-2">
       <FiFile className="text-gray-500" />
       <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
        {file.name}
       </span>
       <button
        type="button"
        onClick={removeFile}
        className="text-red-500 hover:text-red-700">
        <FiX size={16} />
       </button>
      </div>
     )}
    </div>

    {(error || fileError) && (
     <p className="text-sm text-red-600">{error || fileError}</p>
    )}

    {file && (
     <div className="text-xs text-gray-500 dark:text-gray-400">
      Ukuran: {(file.size / 1024 / 1024).toFixed(2)} MB
     </div>
    )}
   </div>
  </div>
 );
};

export default FileUploadInput;
