// /components/bundling/EditBundlingModal.tsx
import {motion} from "framer-motion";
import {FiX} from "react-icons/fi";
import {Bundling} from "@/lib/types/bundling";
import {useState, useEffect} from "react";

interface EditBundlingModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSubmit: (id: string, bundlingData: Partial<Bundling>) => void;
 bundling: Bundling | null;
 taxes: {id: string; name: string; rate: number}[];
 menus: {id: string; name: string}[];
}

const EditBundlingModal = ({
 isOpen,
 onClose,
 onSubmit,
 bundling,
 taxes,
 menus,
}: EditBundlingModalProps) => {
 const [name, setName] = useState("");
 const [description, setDescription] = useState("");
 const [price, setPrice] = useState(0);
 const [selectedTaxIds, setSelectedTaxIds] = useState<string[]>([]);
 const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);
 const [imageUrl, setImageUrl] = useState("");
 const [isAvailable, setIsAvailable] = useState(true);

 useEffect(() => {
  if (bundling) {
   setName(bundling.name);
   setDescription(bundling.description);
   setPrice(bundling.price);
   setSelectedTaxIds(bundling.taxIds);
   setSelectedMenuIds(bundling.menuIds);
   setImageUrl(bundling.imageUrl);
   setIsAvailable(bundling.isAvailable);
  }
 }, [bundling]);

 const handleSubmit = () => {
  if (!bundling) return;

  onSubmit(bundling.id, {
   name,
   description,
   price,
   taxIds: selectedTaxIds,
   menuIds: selectedMenuIds,
   imageUrl,
   isAvailable,
  });
 };

 if (!isOpen || !bundling) return null;

 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
   <motion.div
    initial={{opacity: 0, scale: 0.9}}
    animate={{opacity: 1, scale: 1}}
    exit={{opacity: 0, scale: 0.9}}
    className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl">
    <div className="flex justify-between items-center mb-4">
     <h2 className="text-2xl font-bold text-gray-800">Edit Bundling</h2>
     <button
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700">
      <FiX size={24} />
     </button>
    </div>

    <div className="space-y-4">
     {/* Form fields sama dengan AddBundlingModal, hanya ganti value dan handler */}
     {/* ... (salin semua form fields dari AddBundlingModal) ... */}
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
      Update Bundling
     </motion.button>
    </div>
   </motion.div>
  </div>
 );
};

export default EditBundlingModal;
