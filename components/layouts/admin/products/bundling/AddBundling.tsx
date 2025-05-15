"use client";

import {useState} from "react";
import {Bundling} from "@/lib/types/bundling";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";

interface AddBundlingModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSubmit: (bundlingData: Omit<Bundling, "id" | "createdAt">) => void;
 taxes: {id: string; name: string; rate: number}[];
 menus: {id: string; name: string}[];
 outletId: string;
}

const AddBundlingModal = ({
 isOpen,
 onClose,
 onSubmit,
 taxes,
 menus,
 outletId,
}: AddBundlingModalProps) => {
 const [name, setName] = useState("");
 const [description, setDescription] = useState("");
 const [price, setPrice] = useState(0);
 const [selectedTaxIds, setSelectedTaxIds] = useState<string[]>([]);
 const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);
 const [imageUrl, setImageUrl] = useState("");
 const [isAvailable, setIsAvailable] = useState(true);

 const handleSubmit = () => {
  if (!outletId) return;

  onSubmit({
   name,
   description,
   outletId: outletId,
   price,
   taxIds: selectedTaxIds,
   menuIds: selectedMenuIds,
   imageUrl,
   isAvailable,
  });

  // Reset form
  setName("");
  setDescription("");
  setPrice(0);
  setSelectedTaxIds([]);
  setSelectedMenuIds([]);
  setImageUrl("");
  setIsAvailable(true);
 };

 return (
  <Modal
   isOpen={isOpen}
   onClose={onClose}
   title="Add New Bundling"
   maxWidth="xl">
   <div className="space-y-4">
    <Input
     label="Name"
     value={name}
     onChange={(e) => setName(e.target.value)}
    />

    <Textarea
     label="Description"
     value={description}
     onChange={(e) => setDescription(e.target.value)}
     rows={3}
    />

    <Input
     label="Price"
     type="number"
     value={price}
     onChange={(e) => setPrice(Number(e.target.value))}
    />

    <div>
     <label className="block text-sm font-medium text-gray-700 mb-1">
      Taxes
     </label>
     <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {taxes.map((tax) => (
       <Checkbox
        key={tax.id}
        id={`tax-${tax.id}`}
        checked={selectedTaxIds.includes(tax.id)}
        onChange={(e) => {
         if (e.target.checked) {
          setSelectedTaxIds([...selectedTaxIds, tax.id]);
         } else {
          setSelectedTaxIds(selectedTaxIds.filter((id) => id !== tax.id));
         }
        }}
        label={`${tax.name} (${tax.rate}%)`}
       />
      ))}
     </div>
    </div>

    <div>
     <label className="block text-sm font-medium text-gray-700 mb-1">
      Select Menus
     </label>
     <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {menus.map((menu) => (
       <Checkbox
        key={menu.id}
        id={`menu-${menu.id}`}
        checked={selectedMenuIds.includes(menu.id)}
        onChange={(e) => {
         if (e.target.checked) {
          setSelectedMenuIds([...selectedMenuIds, menu.id]);
         } else {
          setSelectedMenuIds(selectedMenuIds.filter((id) => id !== menu.id));
         }
        }}
        label={menu.name}
       />
      ))}
     </div>
    </div>

    <Input
     label="Image URL"
     value={imageUrl}
     onChange={(e) => setImageUrl(e.target.value)}
     placeholder="https://example.com/image.jpg"
    />

    <Checkbox
     id="isAvailable"
     checked={isAvailable}
     onChange={(e) => setIsAvailable(e.target.checked)}
     label="Available"
    />

    <div className="mt-6 flex justify-end space-x-3">
     <Button
      type="button"
      onClick={onClose}
      variant="outline">
      Cancel
     </Button>
     <Button
      type="button"
      onClick={handleSubmit}
      variant="primary">
      Save Bundling
     </Button>
    </div>
   </div>
  </Modal>
 );
};

export default AddBundlingModal;
