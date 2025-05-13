export const uploadImage = async (file: File) => {
 if (!file) throw new Error("No file provided");

 // Validasi file
 const MAX_SIZE = 5 * 1024 * 1024; // 5MB
 const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

 if (file.size > MAX_SIZE) {
  throw new Error("File size too large (max 5MB)");
 }

 if (!ALLOWED_TYPES.includes(file.type)) {
  throw new Error("Only JPEG, PNG, and WEBP formats are allowed");
 }

 try {
  // Upload ke Vercel Blob
  const response = await fetch("/api/upload", {
   method: "POST",
   body: (() => {
    const formData = new FormData();
    formData.append("file", file);
    return formData;
   })(),
  });

  if (!response.ok) {
   throw new Error(`Upload failed with status ${response.status}`);
  }

  return await response.json();
 } catch (error) {
  console.error("Upload error:", error);
  throw error;
 }
};
