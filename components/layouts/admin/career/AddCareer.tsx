"use client";
import {useEffect, useState} from "react";
import {Career} from "@/lib/types/career";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";

interface AddCareerProps {
 isOpen: boolean;
 onClose: () => void;
 onSubmit: (data: Omit<Career, "id" | "createdAt" | "updatedAt">) => void;
 career: Career | null;
}

const employmentTypeOptions = [
 {value: "FULL_TIME", label: "Full-time"},
 {value: "PART_TIME", label: "Part-time"},
 {value: "CONTRACT", label: "Kontrak"},
 {value: "INTERNSHIP", label: "Magang"},
];

const AddCareer = ({isOpen, onClose, onSubmit, career}: AddCareerProps) => {
 const [formData, setFormData] = useState<
  Omit<Career, "id" | "createdAt" | "updatedAt">
 >({
  title: "",
  description: "",
  outlet: "",
  requirements: [],
  responsibilities: [],
  employmentType: "FULL_TIME",
  isActive: true,
  salaryRange: "",
 });

 useEffect(() => {
  if (career) {
   setFormData({
    title: career.title,
    description: career.description,
    outlet: career.outlet,
    requirements: career.requirements,
    responsibilities: career.responsibilities,
    employmentType: career.employmentType,
    isActive: career.isActive,
    salaryRange: career.salaryRange || "",
   });
  } else {
   setFormData({
    title: "",
    description: "",
    outlet: "",
    requirements: [],
    responsibilities: [],
    employmentType: "FULL_TIME",
    isActive: true,
    salaryRange: "",
   });
  }
 }, [career]);

 const handleChange = (
  e: React.ChangeEvent<
   HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
 ) => {
  const {name, value, type} = e.target;
  const checked = (e.target as HTMLInputElement).checked;

  setFormData((prev) => ({
   ...prev,
   [name]: type === "checkbox" ? checked : value,
  }));
 };

 const handleArrayChange = (
  field: "requirements" | "responsibilities",
  value: string,
  index: number
 ) => {
  setFormData((prev) => {
   const newArray = [...prev[field]];
   newArray[index] = value;
   return {...prev, [field]: newArray};
  });
 };

 const addArrayItem = (field: "requirements" | "responsibilities") => {
  setFormData((prev) => ({
   ...prev,
   [field]: [...prev[field], ""],
  }));
 };

 const removeArrayItem = (
  field: "requirements" | "responsibilities",
  index: number
 ) => {
  setFormData((prev) => ({
   ...prev,
   [field]: prev[field].filter((_, i) => i !== index),
  }));
 };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  onSubmit(formData);
 };

 return (
  <Modal
   isOpen={isOpen}
   onClose={onClose}
   title={career ? "Edit Career" : "Add New Career"}
   maxWidth="xl">
   <form onSubmit={handleSubmit}>
    <div className="space-y-4">
     <Input
      label="Title"
      name="title"
      value={formData.title}
      onChange={handleChange}
      required
     />

     <Input
      label="Outlet"
      name="outlet"
      value={formData.outlet}
      onChange={handleChange}
      required
     />

     <Select
      label="Jenis Pekerjaan"
      name="employmentType"
      value={formData.employmentType}
      onChange={handleChange}
      options={employmentTypeOptions}
      required
     />

     <Textarea
      label="Description"
      name="description"
      value={formData.description}
      onChange={handleChange}
      rows={3}
      required
     />

     <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
       Requirements
      </label>
      {formData.requirements.map((item, index) => (
       <div
        key={index}
        className="flex mb-2">
        <Input
         value={item}
         onChange={(e) =>
          handleArrayChange("requirements", e.target.value, index)
         }
         containerClassName="flex-1"
         required
        />
        <Button
         type="button"
         onClick={() => removeArrayItem("requirements", index)}
         variant="ghost"
         className="ml-2 bg-red-100 text-red-600 hover:bg-red-200">
         Remove
        </Button>
       </div>
      ))}
      <Button
       type="button"
       onClick={() => addArrayItem("requirements")}
       variant="ghost"
       className="mt-2 bg-gray-100 hover:bg-gray-200">
       Add Requirement
      </Button>
     </div>

     <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
       Responsibilities
      </label>
      {formData.responsibilities.map((item, index) => (
       <div
        key={index}
        className="flex mb-2">
        <Input
         value={item}
         onChange={(e) =>
          handleArrayChange("responsibilities", e.target.value, index)
         }
         containerClassName="flex-1"
         required
        />
        <Button
         type="button"
         onClick={() => removeArrayItem("responsibilities", index)}
         variant="ghost"
         className="ml-2 bg-red-100 text-red-600 hover:bg-red-200">
         Remove
        </Button>
       </div>
      ))}
      <Button
       type="button"
       onClick={() => addArrayItem("responsibilities")}
       variant="ghost"
       className="mt-2 bg-gray-100 hover:bg-gray-200">
       Add Responsibility
      </Button>
     </div>

     <Input
      label="Range Gaji (opsional)"
      name="salaryRange"
      value={formData.salaryRange}
      onChange={handleChange}
      placeholder="Contoh: Rp 5.000.000 - Rp 8.000.000"
     />

     <Checkbox
      name="isActive"
      checked={formData.isActive}
      onChange={handleChange}
      label="Active"
     />

     <div className="flex justify-end space-x-3 pt-4">
      <Button
       type="button"
       onClick={onClose}
       variant="outline">
       Cancel
      </Button>
      <Button
       type="submit"
       variant="primary">
       {career ? "Update" : "Create"}
      </Button>
     </div>
    </div>
   </form>
  </Modal>
 );
};

export default AddCareer;
