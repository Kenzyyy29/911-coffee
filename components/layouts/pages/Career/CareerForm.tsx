"use client";
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import {useCareerForm} from "@/lib/hooks/useCareerForm";
import Input from "@/components/ui/Input";
import FileUpload from "@/components/ui/FileUpload";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";

const CareerForm = () => {
 const router = useRouter();
 const searchParams = useSearchParams();
 const {submitApplication, isSubmitting, error, success} = useCareerForm();

 const careerId = searchParams.get("careerId") || "";
 const careerTitle = searchParams.get("title") || "";

 const [formData, setFormData] = useState({
  name: "",
  address: "",
  age: "",
  gender: "",
  whatsapp: "",
  email: "",
  instagram: "",
  agreedToTerms: false,
 });
 const [cvFile, setCvFile] = useState<File | null>(null);
 const [formErrors, setFormErrors] = useState<Record<string, string>>({});

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const {name, value, type, checked} = e.target;
  setFormData({
   ...formData,
   [name]: type === "checkbox" ? checked : value,
  });
 };

 const validateForm = () => {
  const errors: Record<string, string> = {};

  // Validasi dasar
  if (!formData.name.trim()) errors.name = "Nama lengkap harus diisi";
  if (!formData.address.trim()) errors.address = "Alamat harus diisi";
  if (!formData.age) errors.age = "Umur harus diisi";
  if (isNaN(Number(formData.age))) errors.age = "Umur harus berupa angka";
  if (Number(formData.age) < 17) errors.age = "Umur minimal 17 tahun";
  if (!formData.gender) errors.gender = "Jenis kelamin harus dipilih";

  // Validasi WhatsApp
  if (!formData.whatsapp.trim()) {
   errors.whatsapp = "Nomor WhatsApp harus diisi";
  } else if (!/^[0-9]+$/.test(formData.whatsapp)) {
   errors.whatsapp = "Nomor WhatsApp harus berupa angka";
  } else if (formData.whatsapp.length < 10) {
   errors.whatsapp = "Nomor WhatsApp terlalu pendek";
  }

  // Validasi Email
  if (!formData.email.trim()) {
   errors.email = "Email harus diisi";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
   errors.email = "Email tidak valid";
  }

  // Validasi Instagram
  if (!formData.instagram.trim()) {
   errors.instagram = "Username Instagram harus diisi";
  } else if (!formData.instagram.startsWith("@")) {
   errors.instagram = "Username Instagram harus diawali dengan @";
  } else if (formData.instagram.length < 2) {
   errors.instagram = "Username Instagram terlalu pendek";
  } else if (/\s/.test(formData.instagram)) {
   errors.instagram = "Username Instagram tidak boleh mengandung spasi";
  }

  // Validasi file CV
  if (!cvFile) errors.cv = "CV harus diunggah";
  if (cvFile && cvFile.type !== "application/pdf")
   errors.cv = "File harus dalam format PDF";
  if (!formData.agreedToTerms)
   errors.agreedToTerms = "Anda harus menyetujui persyaratan";

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
   await submitApplication(
    {
     ...formData,
     age: Number(formData.age),
     careerId,
     careerTitle,
    },
    cvFile as File
   );
  } catch (err) {
   console.error("Submission error:", err);
  }
 };

 if (success) {
  return (
   <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-onyx1 rounded-lg shadow-md mt-10">
    <h1 className="text-2xl font-bold text-onyx1 dark:text-white mb-4">
     Lamaran Berhasil Dikirim
    </h1>
    <p className="text-onyx1 dark:text-white mb-6">
     Terima kasih telah mengirim lamaran untuk posisi {careerTitle}. Kami akan
     menghubungi Anda melalui WhatsApp di{" "}
     <span className="text-blue-500">{formData.whatsapp}</span> atau email di{" "}
     <span className="text-blue-500">{formData.email}</span> jika lamaran Anda
     memenuhi kriteria kami.
    </p>
    <Button
     onClick={() => router.push("/career")}
     variant="primary"
     fullWidth>
     Kembali ke Halaman Karir
    </Button>
   </div>
  );
 }

 return (
  <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-onyx1 rounded-lg shadow-md mt-10">
   <h1 className="text-2xl font-bold text-onyx1 dark:text-white mb-2">
    Formulir Lamaran - {careerTitle}
   </h1>
   <p className="text-gray-600 dark:text-gray-400 mb-6">
    Silakan isi formulir berikut dengan data yang valid untuk melamar posisi
    ini.
   </p>

   <form onSubmit={handleSubmit}>
    <div className="space-y-4">
     <Input
      label="Nama Lengkap"
      name="name"
      value={formData.name}
      onChange={handleChange}
      error={formErrors.name}
      required
     />

     <Input
      label="Alamat Lengkap"
      name="address"
      value={formData.address}
      onChange={handleChange}
      error={formErrors.address}
      required
     />

     <div className="grid grid-cols-2 gap-4">
      <Input
       label="Umur"
       name="age"
       type="number"
       value={formData.age}
       onChange={handleChange}
       error={formErrors.age}
       required
      />

      <div>
       <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
        Jenis Kelamin *
       </label>
       <div className="flex space-x-4">
        <label className="inline-flex items-center">
         <input
          type="radio"
          name="gender"
          value="male"
          checked={formData.gender === "male"}
          onChange={handleChange}
          className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300"
         />
         <span className="ml-2 text-gray-700 dark:text-white">Laki-laki</span>
        </label>
        <label className="inline-flex items-center">
         <input
          type="radio"
          name="gender"
          value="female"
          checked={formData.gender === "female"}
          onChange={handleChange}
          className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300"
         />
         <span className="ml-2 text-gray-700 dark:text-white">Perempuan</span>
        </label>
       </div>
       {formErrors.gender && (
        <p className="mt-1 text-sm text-red-600">{formErrors.gender}</p>
       )}
      </div>
     </div>

     <Input
      label="Nomor WhatsApp"
      name="whatsapp"
      type="tel"
      value={formData.whatsapp}
      onChange={handleChange}
      placeholder="Contoh: 0281234567890"
      error={formErrors.whatsapp}
      required
     />

     <Input
      label="Email"
      name="email"
      type="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="Contoh: nama@email.com"
      error={formErrors.email}
      required
     />

     <Input
      label="Username Instagram"
      name="instagram"
      value={formData.instagram}
      onChange={handleChange}
      placeholder="Contoh: @username"
      error={formErrors.instagram}
      required
     />

     <FileUpload
      label="Upload CV (PDF)"
      accept="application/pdf"
      onFileChange={setCvFile}
      buttonText={cvFile ? "Ganti CV" : "Pilih File"}
      containerClassName="mt-4"
      buttonClassName="w-full"
     />
     {cvFile && (
      <p className="text-sm text-gray-600 dark:text-gray-400">
       File terpilih: {cvFile.name} ({(cvFile.size / 1024).toFixed(2)} KB)
      </p>
     )}
     {formErrors.cv && <p className="text-sm text-red-600">{formErrors.cv}</p>}

     <Checkbox
      name="agreedToTerms"
      checked={formData.agreedToTerms}
      onChange={handleChange}
      label="Saya menyetujui untuk mengirimkan data saya untuk keperluan rekrutmen"
      containerClassName="mt-4"
      required
     />
     {formErrors.agreedToTerms && (
      <p className="text-sm text-red-600">{formErrors.agreedToTerms}</p>
     )}
    </div>

    {error && (
     <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
    )}

    <div className="mt-6 flex space-x-3">
     <Button
      type="button"
      variant="outline"
      onClick={() => router.back()}
      fullWidth>
      Kembali
     </Button>
     <Button
      type="submit"
      variant="primary"
      isLoading={isSubmitting}
      fullWidth>
      {isSubmitting ? "Mengirim..." : "Kirim Lamaran"}
     </Button>
    </div>
   </form>
  </div>
 );
};

export default CareerForm;
