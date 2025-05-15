"use client";

import {useState, useEffect} from "react";
import {Promo, PromoCategory} from "@/lib/types/promo";
import {uploadImage} from "@/lib/utils/uploadImage";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import FileUpload from "@/components/ui/FileUpload";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";

interface AddPromoModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSubmit: (promoData: Omit<Promo, "id" | "createdAt">) => void;
 outletId: string;
}

const initialFormData = (outletId: string) => ({
 name: "",
 description: "",
 price: 0,
 outletId: outletId,
 imageUrl: "",
 isActive: true,
 category: "sarapan & ngopi pagi" as PromoCategory,
});

const AddPromoModal = ({
 isOpen,
 onClose,
 onSubmit,
 outletId,
}: AddPromoModalProps) => {
 const [formData, setFormData] = useState(initialFormData(outletId));
 const [uploading, setUploading] = useState(false);

 useEffect(() => {
  if (isOpen) {
   setFormData(initialFormData(outletId));
  }
 }, [isOpen, outletId]);

 const handleUpload = async (file: File | null) => {
  if (!file) return;

  try {
   setUploading(true);
   const blob = await uploadImage(file);
   setFormData({
    ...formData,
    imageUrl: blob.url,
   });
  } catch (error) {
   if (error instanceof Error) {
    alert(error.message);
   } else {
    alert("Upload failed with unknown error");
   }
  } finally {
   setUploading(false);
  }
 };

 const handleChange = (
  e: React.ChangeEvent<
   HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >
 ) => {
  const {name, value, type} = e.target;
  const checked = (e.target as HTMLInputElement).checked;

  setFormData({
   ...formData,
   [name]: type === "checkbox" ? checked : value,
  });
 };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name || !formData.price) {
   alert("Please fill all required fields");
   return;
  }

  const promoData = {
   name: formData.name,
   description: formData.description,
   price: Number(formData.price),
   outletId: outletId,
   imageUrl: formData.imageUrl || "",
   isActive: Boolean(formData.isActive),
   category: formData.category,
  };

  onSubmit(promoData);
 };

 const categoryOptions = [
  {value: "sarapan & ngopi pagi", label: "Sarapan & Ngopi Pagi"},
  {value: "makan siang", label: "Makan Siang"},
  {value: "ngopi sore", label: "Ngopi Sore"},
 ];

 return (
  <Modal
   isOpen={isOpen}
   onClose={onClose}
   title="Add New Promo"
   maxWidth="lg">
   <form onSubmit={handleSubmit}>
    <div className="space-y-4">
     <Input
      label="Promo Name"
      name="name"
      value={formData.name}
      onChange={handleChange}
      required
     />

     <Select
      label="Category"
      name="category"
      value={formData.category}
      onChange={handleChange}
      options={categoryOptions}
      required
     />

     <Textarea
      label="Description"
      name="description"
      value={formData.description}
      onChange={handleChange}
      rows={3}
     />

     <Input
      label="Price (IDR)"
      type="number"
      name="price"
      value={formData.price || ""}
      onChange={handleChange}
      min="0"
      step="0.01"
      required
     />

     <FileUpload
      label="Promo Image"
      onFileChange={handleUpload}
      uploading={uploading}
      previewUrl={formData.imageUrl}
     />

     <Checkbox
      name="isActive"
      id="isActive"
      checked={formData.isActive}
      onChange={handleChange}
      label="Active Promo"
     />
    </div>

    <div className="mt-6 flex justify-end space-x-3">
     <Button
      type="button"
      onClick={onClose}
      variant="outline">
      Cancel
     </Button>
     <Button
      type="submit"
      variant="primary">
      Add Promo
     </Button>
    </div>
   </form>
  </Modal>
 );
};

export default AddPromoModal;
