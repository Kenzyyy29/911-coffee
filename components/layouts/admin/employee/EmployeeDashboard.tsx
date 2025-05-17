"use client";
import {motion} from "framer-motion";
import {FiDownload, FiEye, FiTrash2, FiLoader} from "react-icons/fi";
import {useState, useEffect} from "react";
import {db} from "@/lib/firebase/init";
import {
 collection,
 query,
 orderBy,
 onSnapshot,
 deleteDoc,
 doc,
} from "firebase/firestore";
import {CareerApplication} from "@/lib/types/application";
import {format} from "date-fns";
import {id} from "date-fns/locale";
import * as XLSX from "xlsx";

interface DeleteModalProps {
 isOpen: boolean;
 onClose: () => void;
 onConfirm: () => void;
 title: string;
 description: string;
}

const DeleteModal = ({
 isOpen,
 onClose,
 onConfirm,
 title,
 description,
}: DeleteModalProps) => {
 if (!isOpen) return null;

 return (
  <motion.div
   initial={{opacity: 0}}
   animate={{opacity: 1}}
   exit={{opacity: 0}}
   className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
   <motion.div
    initial={{scale: 0.9, y: 20}}
    animate={{scale: 1, y: 0}}
    className="bg-white dark:bg-onyx2 rounded-lg shadow-xl w-full max-w-md">
    <div className="p-6">
     <h3 className="text-lg font-medium text-onyx1 dark:text-white mb-2">
      {title}
     </h3>
     <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
     <div className="flex justify-end space-x-3">
      <button
       onClick={onClose}
       className="px-4 py-2 border border-gray-300 dark:border-onyx1 rounded-lg text-onyx1 dark:text-white hover:bg-gray-50 dark:hover:bg-onyx1 transition-colors">
       Batal
      </button>
      <button
       onClick={onConfirm}
       className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
       Hapus
      </button>
     </div>
    </div>
   </motion.div>
  </motion.div>
 );
};

const EmployeeDashboard = () => {
 const [applications, setApplications] = useState<CareerApplication[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [selectedApplication, setSelectedApplication] =
  useState<CareerApplication | null>(null);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [pdfUrl, setPdfUrl] = useState<string | null>(null);
 const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);

 const exportToExcel = () => {
  // Now applications is in scope
  const excelData = applications.map((app: CareerApplication) => ({
   Nama: app.name,
   Alamat: app.address,
   Usia: app.age,
   "Jenis Kelamin": app.gender,
   WhatsApp: app.whatsapp,
   Email: app.email,
   Instagram: app.instagram,
   "Posisi Dilamar": app.careerTitle,
   "ID Posisi": app.careerId,
   "Tanggal Melamar": app.createdAt
    ? format(
       app.createdAt instanceof Date ? app.createdAt : app.createdAt.toDate(),
       "dd MMM yyyy",
       {locale: id}
      )
    : "",
   "Setuju Syarat": app.agreedToTerms ? "Ya" : "Tidak",
   "CV URL": app.cvUrl,
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pelamar");

  // Generate Excel file and download
  XLSX.writeFile(wb, `Data_Pelamar_${format(new Date(), "yyyyMMdd")}.xlsx`);
 };

 useEffect(() => {
  const q = query(
   collection(db, "careerApplications"),
   orderBy("createdAt", "desc")
  );
  const unsubscribe = onSnapshot(
   q,
   (querySnapshot) => {
    const apps: CareerApplication[] = [];
    querySnapshot.forEach((doc) => {
     const data = doc.data();
     apps.push({
      id: doc.id,
      name: data.name,
      address: data.address,
      age: data.age,
      gender: data.gender,
      whatsapp: data.whatsapp,
      email: data.email,
      instagram: data.instagram,
      cvUrl: data.cvUrl,
      careerId: data.careerId,
      careerTitle: data.careerTitle,
      agreedToTerms: data.agreedToTerms,
      createdAt: data.createdAt,
     });
    });
    setApplications(apps);
    setLoading(false);
   },
   (err) => {
    setError(err.message);
    setLoading(false);
   }
  );

  return () => unsubscribe();
 }, []);

 const handleDeleteClick = (application: CareerApplication) => {
  setSelectedApplication(application);
  setIsDeleteModalOpen(true);
 };

 const handleDeleteConfirm = async () => {
  if (selectedApplication?.id) {
   try {
    await deleteDoc(doc(db, "careerApplications", selectedApplication.id));
    setIsDeleteModalOpen(false);
   } catch (err) {
    setError(
     err instanceof Error ? err.message : "Failed to delete application"
    );
   }
  }
 };

 const handleViewPdf = (url: string) => {
  setPdfUrl(url);
  setIsPdfViewerOpen(true);
 };

 const handleDownloadPdf = (url: string, name: string) => {
  fetch(url)
   .then((response) => response.blob())
   .then((blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CV_${name.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
   });
 };

 if (loading)
  return (
   <div className="min-h-screen flex items-center justify-center">
    <motion.div className="text-onyx1 dark:text-white">
     <FiLoader
      size={32}
      className="animate-spin"
     />
    </motion.div>
   </div>
  );

 if (error) {
  return (
   <div className="p-4 text-red-500 bg-red-100 dark:bg-red-900/30 rounded-lg">
    Error: {error}
   </div>
  );
 }

 return (
  <div className="h-[100dvh] p-4 md:p-8 bg-white dark:bg-onyx1">
   <motion.div
    initial={{opacity: 0, y: -20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.3}}
    className="max-w-6xl mx-auto rounded-lg">
    <div className="flex items-center space-x-4 justify-between mb-4">
     <div className="text-sm text-gray-500 dark:text-gray-400">
      Total: {applications.length} pelamar
     </div>
     <motion.button
      whileHover={{scale: 1.05}}
      whileTap={{scale: 0.95}}
      onClick={exportToExcel}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2">
      <FiDownload size={16} />
      Export Excel
     </motion.button>
    </div>

    <div className="bg-white dark:bg-onyx2 rounded-xl shadow-sm overflow-hidden">
     <div className="overflow-x-auto">
      <table className="w-full divide-y divide-gray-200 dark:divide-onyx1">
       <thead className="bg-white dark:bg-onyx2">
        <tr>
         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-onyx1 dark:text-white">
          Nama
         </th>
         <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-onyx1 dark:text-white">
          Posisi
         </th>
         <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-onyx1 dark:text-white">
          Kontak
         </th>
         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-onyx1 dark:text-white">
          Tanggal
         </th>
         <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-onyx1 dark:text-white">
          CV
         </th>
         <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-onyx1 dark:text-white">
          Aksi
         </th>
        </tr>
       </thead>
       <tbody className="bg-white dark:bg-onyx2 divide-y divide-gray-200 dark:divide-onyx1">
        {applications.map((application) => (
         <motion.tr
          key={application.id}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.3}}
          className="hover:bg-gray-50 dark:hover:bg-onyx1">
          <td className="px-6 py-4 whitespace-nowrap">
           <div className="text-sm font-medium text-onyx1 dark:text-white">
            {application.name}
           </div>
           <div className="text-xs text-gray-500 dark:text-gray-400">
            {application.gender}, {application.age} tahun
           </div>
          </td>
          <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
           <div className="text-sm text-onyx1 dark:text-white">
            {application.careerTitle}
           </div>
           <div className="text-xs text-gray-500 dark:text-gray-400">
            {application.careerId}
           </div>
          </td>
          <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
           <div className="text-sm text-onyx1 dark:text-white">
            {application.whatsapp}
           </div>
           <div className="text-xs text-gray-500 dark:text-gray-400">
            {application.email}
           </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-onyx1 dark:text-white">
           {application.createdAt &&
            format(
             application.createdAt instanceof Date
              ? application.createdAt
              : application.createdAt.toDate(),
             "dd MMM yyyy",
             {locale: id}
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
           <div className="flex justify-end space-x-2">
            <motion.button
             whileHover={{scale: 1.1}}
             whileTap={{scale: 0.9}}
             onClick={() => handleViewPdf(application.cvUrl)}
             className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 transition-colors"
             title="Lihat CV">
             <FiEye />
            </motion.button>
            <motion.button
             whileHover={{scale: 1.1}}
             whileTap={{scale: 0.9}}
             onClick={() =>
              handleDownloadPdf(application.cvUrl, application.name)
             }
             className="text-green-600 hover:text-green-900 dark:hover:text-green-400 transition-colors"
             title="Download CV">
             <FiDownload />
            </motion.button>
           </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
           <motion.button
            whileHover={{scale: 1.1}}
            whileTap={{scale: 0.9}}
            onClick={() => handleDeleteClick(application)}
            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 transition-colors"
            title="Hapus aplikasi">
            <FiTrash2 />
           </motion.button>
          </td>
         </motion.tr>
        ))}
       </tbody>
      </table>
     </div>
    </div>
   </motion.div>

   {/* PDF Viewer Modal */}
   {isPdfViewerOpen && pdfUrl && (
    <motion.div
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     exit={{opacity: 0}}
     className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
     onClick={() => setIsPdfViewerOpen(false)}>
     <motion.div
      initial={{scale: 0.9, y: 20}}
      animate={{scale: 1, y: 0}}
      className="bg-white dark:bg-onyx2 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center p-4 border-b dark:border-onyx1">
       <h3 className="text-lg font-medium text-onyx1 dark:text-white">
        Curriculum Vitae
       </h3>
       <button
        onClick={() => setIsPdfViewerOpen(false)}
        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        ✕
       </button>
      </div>
      <div className="flex-1 overflow-auto">
       <iframe
        src={pdfUrl}
        className="w-full h-[70vh]"
        frameBorder="0"
       />
      </div>
      <div className="p-4 border-t dark:border-onyx1 flex justify-end">
       <button
        onClick={() => setIsPdfViewerOpen(false)}
        className="px-4 py-2 bg-onyx1 dark:bg-onyx2 text-white rounded-lg hover:bg-onyx2 dark:hover:bg-onyx1 transition-colors">
        Tutup
       </button>
      </div>
     </motion.div>
    </motion.div>
   )}

   <DeleteModal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    onConfirm={handleDeleteConfirm}
    title="Hapus Aplikasi"
    description="Apakah Anda yakin ingin menghapus aplikasi ini? Tindakan ini tidak dapat dibatalkan."
   />
  </div>
 );
};

export default EmployeeDashboard;
