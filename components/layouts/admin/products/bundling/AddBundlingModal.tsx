// /components/bundling/AddBundlingModal.tsx
import {motion} from "framer-motion";
import {FiX} from "react-icons/fi";
import {Bundling} from "@/lib/types/bundling";
import {useState} from "react";

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

 if (!isOpen) return null;

 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
   <motion.div
    initial={{opacity: 0, scale: 0.9}}
    animate={{opacity: 1, scale: 1}}
    exit={{opacity: 0, scale: 0.9}}
    className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl">
    <div className="flex justify-between items-center mb-4">
     <h2 className="text-2xl font-bold text-gray-800">Add New Bundling</h2>
     <button
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700">
      <FiX size={24} />
     </button>
    </div>

    <div className="space-y-4">
     <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
       Name
      </label>
      <input
       type="text"
       value={name}
       onChange={(e) => setName(e.target.value)}
       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
     </div>

     <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
       Description
      </label>
      <textarea
       value={description}
       onChange={(e) => setDescription(e.target.value)}
       rows={3}
       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
     </div>

     <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
       Price
      </label>
      <input
       type="number"
       value={price}
       onChange={(e) => setPrice(Number(e.target.value))}
       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
     </div>

     <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
       Taxes
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
       {taxes.map((tax) => (
        <div
         key={tax.id}
         className="flex items-center">
         <input
          type="checkbox"
          id={`tax-${tax.id}`}
          checked={selectedTaxIds.includes(tax.id)}
          onChange={(e) => {
           if (e.target.checked) {
            setSelectedTaxIds([...selectedTaxIds, tax.id]);
           } else {
            setSelectedTaxIds(selectedTaxIds.filter((id) => id !== tax.id));
           }
          }}
          className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
         />
         <label
          htmlFor={`tax-${tax.id}`}
          className="ml-2 text-sm text-gray-700">
          {tax.name} ({tax.rate}%)
         </label>
        </div>
       ))}
      </div>
     </div>

     <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
       Select Menus
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
       {menus.map((menu) => (
        <div
         key={menu.id}
         className="flex items-center">
         <input
          type="checkbox"
          id={`menu-${menu.id}`}
          checked={selectedMenuIds.includes(menu.id)}
          onChange={(e) => {
           if (e.target.checked) {
            setSelectedMenuIds([...selectedMenuIds, menu.id]);
           } else {
            setSelectedMenuIds(selectedMenuIds.filter((id) => id !== menu.id));
           }
          }}
          className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
         />
         <label
          htmlFor={`menu-${menu.id}`}
          className="ml-2 text-sm text-gray-700">
          {menu.name}
         </label>
        </div>
       ))}
      </div>
     </div>

     <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
       Image URL
      </label>
      <input
       type="text"
       value={imageUrl}
       onChange={(e) => setImageUrl(e.target.value)}
       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
       placeholder="https://example.com/image.jpg"
      />
     </div>

     <div className="flex items-center">
      <input
       type="checkbox"
       id="isAvailable"
       checked={isAvailable}
       onChange={(e) => setIsAvailable(e.target.checked)}
       className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
      />
      <label
       htmlFor="isAvailable"
       className="ml-2 text-sm text-gray-700">
       Available
      </label>
     </div>
    </div>

    <div className="mt-6 flex justify-end space-x-3">
     <motion.button
      whileHover={{scale: 1.05}}
      whileTap={{scale: 0.95}}
      onClick={onClose}
      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
      Cancel
     </motion.button>
     <motion.button
      whileHover={{scale: 1.05}}
      whileTap={{scale: 0.95}}
      onClick={handleSubmit}
      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
      Save Bundling
     </motion.button>
    </div>
   </motion.div>
  </div>
 );
};

export default AddBundlingModal;
