"use client";

import AuthFormContainer from "@/components/core/AuthFormContainer";
import AuthInput from "@/components/core/AuthInput";
import AuthButton from "@/components/core/AuthButton";
import {FiMail, FiLock} from "react-icons/fi";
import {useRouter, useSearchParams} from "next/navigation";
import {signIn} from "next-auth/react";
import {useState} from "react";
import Link from "next/link";
import {motion} from "framer-motion";

export default function LoginPage() {
 const {push} = useRouter();
 const searchParams = useSearchParams();
 const [formData, setFormData] = useState({
  email: "",
  password: "",
 });
 const [errors, setErrors] = useState<Record<string, string>>({});
 const [loading, setLoading] = useState(false);
 const [apiError, setApiError] = useState("");

 const registered = searchParams.get("registered");
 const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const {name, value} = e.target;
  setFormData((prev) => ({...prev, [name]: value}));

  if (errors[name]) {
   setErrors((prev) => ({...prev, [name]: ""}));
  }
 };

 const validate = () => {
  const newErrors: Record<string, string> = {};

  if (!formData.email.trim()) {
   newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
   newErrors.email = "Invalid email format";
  }

  if (!formData.password) {
   newErrors.password = "Password is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validate()) return;

  setLoading(true);
  setApiError("");

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
    push(callbackUrl);
   }
  } catch (error: any) {
   setApiError(error.message || "Login failed");
  } finally {
   setLoading(false);
  }
 };

 return (
  <AuthFormContainer title="Welcome Back">
   {registered && (
    <motion.div
     initial={{opacity: 0, y: -20}}
     animate={{opacity: 1, y: 0}}
     className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-lg text-sm text-green-200">
     Registration successful! Please log in.
    </motion.div>
   )}

   {apiError && (
    <motion.div
     initial={{opacity: 0, y: -20}}
     animate={{opacity: 1, y: 0}}
     className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-sm text-red-200">
     {apiError}
    </motion.div>
   )}

   <form onSubmit={handleSubmit}>
    <AuthInput
     icon={<FiMail className="text-gray-400" />}
     type="email"
     name="email"
     placeholder="Email Address"
     value={formData.email}
     onChange={handleChange}
     error={errors.email}
    />

    <AuthInput
     icon={<FiLock className="text-gray-400" />}
     type="password"
     name="password"
     placeholder="Password"
     value={formData.password}
     onChange={handleChange}
     error={errors.password}
    />

    <div className="flex justify-end mb-6">
     <Link
      href="/auth/forgot-password" // You'll need to create this page
      className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
      Forgot password?
     </Link>
    </div>

    <div className="mt-2">
     <AuthButton
      type="submit"
      loading={loading}>
      Login
     </AuthButton>
    </div>
   </form>

   <motion.div
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{delay: 0.2}}
    className="mt-6 text-center text-sm text-gray-400">
    Don't have an account?{" "}
    <Link
     href="/auth/register"
     className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
     Sign up
    </Link>
   </motion.div>
  </AuthFormContainer>
 );
}
