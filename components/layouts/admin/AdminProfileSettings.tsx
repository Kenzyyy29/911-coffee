"use client";

import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {retrieveDataById} from "@/lib/utils/service";
import {User} from "@/lib/utils/service";
import {motion} from "framer-motion";
import {FiSave, FiUser, FiMail, FiPhone, FiLock} from "react-icons/fi";
import {FaSpinner} from "react-icons/fa";

export default function AdminProfileSettings() {
 const {data: session} = useSession();
 const [user, setUser] = useState<User | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");

 const [formData, setFormData] = useState({
  fullname: "",
  email: "",
  phone: "",
  newPassword: "",
  confirmPassword: "",
 });

 const [showNewPassword, setShowNewPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);

 useEffect(() => {
  if (session?.user?.id) {
   fetchUserData(session.user.id);
  }
 }, [session]);

 const fetchUserData = async (userId: string) => {
  try {
   const userData = await retrieveDataById("users", userId);
   if (userData) {
    setUser(userData);
    setFormData({
     fullname: userData.fullname,
     email: userData.email,
     phone: userData.phone || "",
     newPassword: "",
     confirmPassword: "",
    });
   }
   setLoading(false);
  } catch (err) {
   console.error("Failed to fetch user data:", err);
   setError("Failed to load profile data");
   setLoading(false);
  }
 };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const {name, value} = e.target;
  setFormData((prev) => ({
   ...prev,
   [name]: value,
  }));
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (formData.newPassword || formData.confirmPassword) {
   if (formData.newPassword !== formData.confirmPassword) {
    setError("New password and confirm password do not match");
    return;
   }
   if (formData.newPassword.length < 6) {
    setError("Password must be at least 6 characters long");
    return;
   }
  }

  try {
   const response = await fetch("/api/admin/profile", {
    method: "PUT",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({
     userId: session?.user?.id,
     newPassword: formData.newPassword,
     fullname: formData.fullname,
     phone: formData.phone,
    }),
   });

   const data = await response.json();

   if (!response.ok) {
    throw new Error(data.error || "Failed to update profile");
   }

   setSuccess("Profile updated successfully");
   setFormData((prev) => ({
    ...prev,
    newPassword: "",
    confirmPassword: "",
   }));
  } catch (err) {
   console.error("Error updating profile:", err);
   setError(err instanceof Error ? err.message : "Failed to update profile");
  }
 };

 if (loading) {
  return (
   <div className="flex justify-center items-center h-[100dvh]">
    <FaSpinner className="w-10 h-10 animate-spin" />
   </div>
  );
 }

 if (!user) {
  return (
   <motion.div
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    className="p-4 text-center text-red-500">
    User not found
   </motion.div>
  );
 }

 return (
  <div className="h-[100dvh] p-4 md:p-8 bg-white dark:bg-onyx1">
   <motion.div
    initial={{opacity: 0, y: -20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.3}}
    className="max-w-6xl mx-auto rounded-lg">
    <h1 className="text-2xl font-bold text-onyx1 dark:text-white mb-6">
     Profile Settings
    </h1>

    {error && (
     <motion.div
      initial={{opacity: 0, y: -10}}
      animate={{opacity: 1, y: 0}}
      className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
      <p>{error}</p>
     </motion.div>
    )}

    {success && (
     <motion.div
      initial={{opacity: 0, y: -10}}
      animate={{opacity: 1, y: 0}}
      className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
      <p>{success}</p>
     </motion.div>
    )}

    <motion.div
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     transition={{delay: 0.2}}
     className="bg-white dark:bg-onyx2 rounded-xl shadow-sm overflow-hidden">
     <div className="overflow-y-auto">
      <table className="w-full divide-y divide-gray-200 dark:divide-onyx1">
       <thead className="bg-white dark:bg-onyx2">
        <tr>
         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
          Field
         </th>
         <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
          Value
         </th>
        </tr>
       </thead>
       <tbody className="bg-white dark:bg-onyx2 divide-y divide-gray-200 dark:divide-onyx1">
        <motion.tr
         initial={{opacity: 0}}
         animate={{opacity: 1}}
         transition={{duration: 0.3}}
         className="hover:bg-gray-50 dark:hover:bg-onyx1">
         <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-onyx1 dark:text-white">
           <FiUser className="inline mr-2" /> Name
          </div>
         </td>
         <td className="px-6 py-4 whitespace-nowrap">
          <input
           type="text"
           name="fullname"
           value={formData.fullname}
           onChange={handleChange}
           disabled
           className="w-full rounded-lg border-gray-300 shadow-sm p-2 border bg-gray-100 dark:bg-onyx2 dark:text-white"
           required
          />
         </td>
        </motion.tr>

        <motion.tr
         initial={{opacity: 0}}
         animate={{opacity: 1}}
         transition={{duration: 0.4}}
         className="hover:bg-gray-50 dark:hover:bg-onyx1">
         <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-onyx1 dark:text-white">
           <FiMail className="inline mr-2" /> Email
          </div>
         </td>
         <td className="px-6 py-4 whitespace-nowrap">
          <input
           type="email"
           name="email"
           value={formData.email}
           disabled
           className="w-full rounded-lg border-gray-300 shadow-sm p-2 border bg-gray-100 dark:bg-onyx2 dark:text-white"
          />
         </td>
        </motion.tr>

        <motion.tr
         initial={{opacity: 0}}
         animate={{opacity: 1}}
         transition={{duration: 0.5}}
         className="hover:bg-gray-50 dark:hover:bg-onyx1">
         <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-onyx1 dark:text-white">
           <FiPhone className="inline mr-2" /> Phone Number
          </div>
         </td>
         <td className="px-6 py-4 whitespace-nowrap">
          <input
           type="tel"
           name="phone"
           value={formData.phone}
           onChange={handleChange}
           disabled
           className="w-full rounded-lg border-gray-300 shadow-sm p-2 border bg-gray-100 dark:bg-onyx2 dark:text-white"
          />
         </td>
        </motion.tr>

        <motion.tr
         initial={{opacity: 0}}
         animate={{opacity: 1}}
         transition={{duration: 0.6}}
         className="hover:bg-gray-50 dark:hover:bg-onyx1">
         <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-onyx1 dark:text-white">
           <FiLock className="inline mr-2" /> New Password
          </div>
         </td>
         <td className="px-6 py-4 whitespace-nowrap">
          <div className="relative">
           <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            disabled
            className="w-full rounded-lg border-gray-300 shadow-sm p-2 border bg-gray-100 dark:bg-onyx2 dark:text-white"
            placeholder="••••••••"
           />
           {/* <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={() => setShowNewPassword(!showNewPassword)}>
            {showNewPassword ? <FiEyeOff /> : <FiEye />}
           </button> */}
          </div>
         </td>
        </motion.tr>

        <motion.tr
         initial={{opacity: 0}}
         animate={{opacity: 1}}
         transition={{duration: 0.7}}
         className="hover:bg-gray-50 dark:hover:bg-onyx1">
         <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-onyx1 dark:text-white">
           <FiLock className="inline mr-2" /> Confirm Password
          </div>
         </td>
         <td className="px-6 py-4 whitespace-nowrap">
          <div className="relative">
           <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled
            className="w-full rounded-lg border-gray-300 shadow-sm p-2 border bg-gray-100 dark:bg-onyx2 dark:text-white"
            placeholder="••••••••"
           />
           {/* <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
           </button> */}
          </div>
         </td>
        </motion.tr>
       </tbody>
      </table>
     </div>
    </motion.div>

    <motion.div
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     transition={{delay: 0.9}}
     className="flex justify-end mt-6">
     <button
      type="button"
      onClick={handleSubmit}
      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-black hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-300 items-center">
      <FiSave className="mr-2" /> Save Changes
     </button>
    </motion.div>
   </motion.div>
  </div>
 );
}
