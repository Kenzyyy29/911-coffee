"use client";

import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {retrieveDataById} from "@/lib/utils/service";
import {User} from "@/lib/utils/service";
import {motion} from "framer-motion";
import {
 FiEye,
 FiEyeOff,
 FiSave,
 FiUser,
 FiMail,
 FiPhone,
 FiLock,
} from "react-icons/fi";

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

  // Only validate passwords if either field has value
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
     // Include other fields if needed
     fullname: formData.fullname,
     phone: formData.phone,
    }),
   });

   const data = await response.json();

   if (!response.ok) {
    throw new Error(data.error || "Failed to update profile");
   }

   setSuccess("Profile updated successfully");
   // Clear password fields after successful update
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
   <div className="flex justify-center items-center h-64">
    <motion.div
     animate={{rotate: 360}}
     transition={{repeat: Infinity, duration: 1, ease: "linear"}}
     className="w-10 h-10 border-4 border-black border-t-transparent rounded-full"
    />
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
  <motion.div
   initial={{opacity: 0, y: 20}}
   animate={{opacity: 1, y: 0}}
   transition={{duration: 0.5}}
   className="w-full">
   <motion.h1
    initial={{x: -20, opacity: 0}}
    animate={{x: 0, opacity: 1}}
    transition={{delay: 0.2}}
    className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
    <FiUser className="mr-2" /> Profile Settings
   </motion.h1>

   {error && (
    <motion.div
     initial={{opacity: 0, y: -10}}
     animate={{opacity: 1, y: 0}}
     className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
     <FiLock className="mr-2" /> {error}
    </motion.div>
   )}

   {success && (
    <motion.div
     initial={{opacity: 0, y: -10}}
     animate={{opacity: 1, y: 0}}
     className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
     <FiSave className="mr-2" /> {success}
    </motion.div>
   )}

   <motion.form
    onSubmit={handleSubmit}
    className="space-y-6 bg-white rounded-xl shadow-md p-6"
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{delay: 0.4}}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
     <motion.div
      initial={{x: -20, opacity: 0}}
      animate={{x: 0, opacity: 1}}
      transition={{delay: 0.3}}>
      <label
       htmlFor="fullname"
       className="text-sm font-medium text-gray-700 mb-1 flex items-center">
       <FiUser className="mr-2" /> Name
      </label>
      <div className="relative">
       <input
        type="text"
        id="fullname"
        name="fullname"
        value={formData.fullname}
        onChange={handleChange}
        className="mt-1 w-full rounded-lg border-gray-300 shadow-sm p-3 border pl-10"
        required
       />
       <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
     </motion.div>

     <motion.div
      initial={{x: 20, opacity: 0}}
      animate={{x: 0, opacity: 1}}
      transition={{delay: 0.3}}>
      <label
       htmlFor="email"
       className="text-sm font-medium text-gray-700 mb-1 flex items-center">
       <FiMail className="mr-2" /> Email
      </label>
      <div className="relative">
       <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        disabled
        className="mt-1 w-full rounded-lg border-gray-300 shadow-sm bg-gray-100 p-3 border pl-10"
       />
       <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
     </motion.div>

     <motion.div
      initial={{x: -20, opacity: 0}}
      animate={{x: 0, opacity: 1}}
      transition={{delay: 0.4}}>
      <label
       htmlFor="phone"
       className="text-sm font-medium text-gray-700 mb-1 flex items-center">
       <FiPhone className="mr-2" /> Phone Number
      </label>
      <div className="relative">
       <input
        type="tel"
        id="phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        className="mt-1 w-full rounded-lg border-gray-300 shadow-sm p-3 border pl-10"
       />
       <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
     </motion.div>
    </div>

    <motion.div
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     transition={{delay: 0.5}}
     className="border-t border-gray-200 pt-6">
     <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
      <FiLock className="mr-2" /> Change Password
     </h2>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
       initial={{y: 10, opacity: 0}}
       animate={{y: 0, opacity: 1}}
       transition={{delay: 0.7}}>
       <label
        htmlFor="newPassword"
        className="text-sm font-medium text-gray-700 mb-1 flex items-center">
        <FiLock className="mr-2" /> New Password
       </label>
       <div className="relative">
        <input
         type={showNewPassword ? "text" : "password"}
         id="newPassword"
         name="newPassword"
         value={formData.newPassword}
         onChange={handleChange}
         className="w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-3 border pl-10 pr-10"
         placeholder="Leave empty to keep current password"
        />
        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <button
         type="button"
         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
         onClick={() => setShowNewPassword(!showNewPassword)}>
         {showNewPassword ? <FiEyeOff /> : <FiEye />}
        </button>
       </div>
      </motion.div>

      <motion.div
       initial={{y: 10, opacity: 0}}
       animate={{y: 0, opacity: 1}}
       transition={{delay: 0.8}}>
       <label
        htmlFor="confirmPassword"
        className="text-sm font-medium text-gray-700 mb-1 flex items-center">
        <FiLock className="mr-2" /> Confirm New Password
       </label>
       <div className="relative">
        <input
         type={showConfirmPassword ? "text" : "password"}
         id="confirmPassword"
         name="confirmPassword"
         value={formData.confirmPassword}
         onChange={handleChange}
         className="w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black p-3 border pl-10 pr-10"
         placeholder="Confirm new password"
        />
        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <button
         type="button"
         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
         onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
         {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
        </button>
       </div>
      </motion.div>
     </div>
    </motion.div>

    <motion.div
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     transition={{delay: 0.9}}
     className="flex justify-end">
     <button
      type="submit"
      className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-black hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-300 items-center">
      <FiSave className="mr-2" /> Save Changes
     </button>
    </motion.div>
   </motion.form>
  </motion.div>
 );
}
