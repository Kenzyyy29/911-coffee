"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import {FiMail, FiLock} from "react-icons/fi";
import {signIn} from "next-auth/react";
import {motion} from "framer-motion";

export default function LoginPageWrapper() {
 const router = useRouter();
 const searchParams = useSearchParams();
 const [formData, setFormData] = useState({
  email: "",
  password: "",
 });
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);

 const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
   const result = await signIn("credentials", {
    email: formData.email,
    password: formData.password,
    redirect: false,
    callbackUrl,
   });

   if (result?.error) {
    throw new Error(result.error);
   }

   if (result?.ok) {
    router.push(callbackUrl);
   }
  } catch (err: unknown) {
   setError(err instanceof Error ? err.message : "Login failed");
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="min-h-[100dvh] bg-white dark:bg-black flex items-center justify-center p-4">
   <motion.div
    initial={{opacity: 0, scale: 0.95}}
    animate={{opacity: 1, scale: 1}}
    transition={{duration: 0.3}}
    className="w-full max-w-md">
    {/* Login Card */}
    <div className="p-8">
     <h1 className="text-3xl font-bold text-black dark:text-white text-center mb-6">
      911 ADMIN LOGIN
     </h1>

     {/* Error Message */}
     {error && (
      <motion.div
       initial={{opacity: 0, y: -10}}
       animate={{opacity: 1, y: 0}}
       className="mb-4 p-3 bg-red-900/30 text-red-300 text-sm rounded-lg border border-red-800">
       {error}
      </motion.div>
     )}

     {/* Form */}
     <form
      onSubmit={handleSubmit}
      className="space-y-4">
      {/* Email Input */}
      <div>
       <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
         <FiMail className="text-gray-500" />
        </div>
        <input
         type="email"
         name="email"
         placeholder="admin@example.com"
         value={formData.email}
         onChange={(e) => setFormData({...formData, email: e.target.value})}
         required
         className="w-full bg-white dark:bg-black border border-black dark:border-white rounded-lg py-2 pl-10 pr-3 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white"
        />
       </div>
      </div>

      {/* Password Input */}
      <div>
       <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
         <FiLock className="text-gray-500" />
        </div>
        <input
         type="password"
         name="password"
         placeholder="••••••••"
         value={formData.password}
         onChange={(e) => setFormData({...formData, password: e.target.value})}
         required
         className="w-full bg-white dark:bg-black border border-black dark:border-white rounded-lg py-2 pl-10 pr-3 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white"
        />
       </div>
      </div>

      {/* Submit Button */}
      <button
       type="submit"
       disabled={loading}
       className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
        loading
         ? "bg-gray-600 cursor-not-allowed"
         : "bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90"
       }`}>
       {loading ? "Processing..." : "Login"}
      </button>
     </form>
    </div>
   </motion.div>
  </div>
 );
}
