// lib/utils/uploadPdf.ts
export const uploadPdf = async (file: File) => {
 if (!file) throw new Error("No file provided");

 // Validate File Type
 if (file.type !== "application/pdf") {
  throw new Error("Only PDF files are allowed");
 }

 // Validate File Size (5MB max)
 const MAX_SIZE = 5 * 1024 * 1024;
 if (file.size > MAX_SIZE) {
  throw new Error("File size exceeds 5MB limit");
 }

 try {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
   method: "POST",
   body: formData,
  });

  if (!response.ok) {
   const errorData = await response.json();
   throw new Error(errorData.error || "Upload failed");
  }

  return await response.json();
 } catch (error) {
  console.error("Upload Error:", error);
  throw error;
 }
};
