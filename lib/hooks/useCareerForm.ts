import {useState} from "react";
import {db} from "@/lib/firebase/init";
import {collection, addDoc, serverTimestamp} from "firebase/firestore";
import { CareerApplication } from "../types/application";

export const useCareerForm = () => {
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [success, setSuccess] = useState(false);

 const submitApplication = async (
  formData: Omit<CareerApplication, "cvUrl">,
  cvFile: File
 ): Promise<void> => {
  setIsSubmitting(true);
  setError(null);
  setSuccess(false);

  try {
   // Validate file type
   if (cvFile.type !== "application/pdf") {
    throw new Error("File harus dalam format PDF");
   }

   // Upload CV to Vercel Blob
   const formDataForUpload = new FormData();
   formDataForUpload.append("file", cvFile);

   const uploadResponse = await fetch("/api/upload", {
    method: "POST",
    body: formDataForUpload,
   });

   if (!uploadResponse.ok) {
    throw new Error("Gagal mengunggah CV");
   }

   const {url} = await uploadResponse.json();

   // Save application data to Firestore
   await addDoc(collection(db, "careerApplications"), {
    ...formData,
    cvUrl: url,
    createdAt: serverTimestamp(),
   });

   setSuccess(true);
  } catch (err) {
   console.error("Error submitting application:", err);
   setError(err instanceof Error ? err.message : "Gagal mengirim lamaran");
   throw err;
  } finally {
   setIsSubmitting(false);
  }
 };

 return {
  submitApplication,
  isSubmitting,
  error,
  success,
 };
};
