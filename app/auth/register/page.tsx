// app/auth/register/page.tsx
"use client";

import AuthFormContainer from "@/components/core/AuthFormContainer";
import AuthInput from "@/components/core/AuthInput";
import AuthButton from "@/components/core/AuthButton";
import {FiUser, FiMail, FiPhone, FiLock} from "react-icons/fi";
import {useRouter} from "next/navigation";
import {useState} from "react";
import Link from "next/link";
import {motion} from "framer-motion";

export default function RegisterPage() {
 const {push} = useRouter();
 const [formData, setFormData] = useState({
  fullname: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
 });
 const [errors, setErrors] = useState<Record<string, string>>({});
 const [loading, setLoading] = useState(false);
 const [apiError, setApiError] = useState("");

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const {name, value} = e.target;
  setFormData((prev) => ({...prev, [name]: value}));

  if (errors[name]) {
   setErrors((prev) => ({...prev, [name]: ""}));
  }
 };

 const validate = () => {
  const newErrors: Record<string, string> = {};

  if (!formData.fullname.trim()) {
   newErrors.fullname = "Full name is required";
  }

  if (!formData.email.trim()) {
   newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
   newErrors.email = "Invalid email format";
  }

  if (!formData.phone.trim()) {
   newErrors.phone = "Phone number is required";
  }

  if (!formData.password) {
   newErrors.password = "Password is required";
  } else if (formData.password.length < 6) {
   newErrors.password = "Password must be at least 6 characters";
  }

  if (formData.password !== formData.confirmPassword) {
   newErrors.confirmPassword = "Passwords do not match";
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
   const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({
     fullname: formData.fullname,
     email: formData.email,
     phone: formData.phone,
     password: formData.password,
    }),
   });

   const data = await response.json();

   if (!response.ok) {
    throw new Error(data.message || "Registration failed");
   }

   push("/auth/login?registered=true");
  } catch (error: any) {
   setApiError(error.message || "Something went wrong");
  } finally {
   setLoading(false);
  }
 };

 return (
  <AuthFormContainer title="Create Account">
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
     icon={<FiUser className="text-gray-400" />}
     type="text"
     name="fullname"
     placeholder="Full Name"
     value={formData.fullname}
     onChange={handleChange}
     error={errors.fullname}
    />

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
     icon={<FiPhone className="text-gray-400" />}
     type="tel"
     name="phone"
     placeholder="Phone Number"
     value={formData.phone}
     onChange={handleChange}
     error={errors.phone}
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

    <AuthInput
     icon={<FiLock className="text-gray-400" />}
     type="password"
     name="confirmPassword"
     placeholder="Confirm Password"
     value={formData.confirmPassword}
     onChange={handleChange}
     error={errors.confirmPassword}
    />

    <div className="mt-6">
     <AuthButton
      type="submit"
      loading={loading}>
      Register
     </AuthButton>
    </div>
   </form>

   <motion.div
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{delay: 0.2}}
    className="mt-6 text-center text-sm text-gray-400">
    Already have an account?{" "}
    <Link
     href="/auth/login"
     className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
     Sign in
    </Link>
   </motion.div>
  </AuthFormContainer>
 );
}
