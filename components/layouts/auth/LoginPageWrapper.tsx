"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import AuthFormContainer from "@/components/core/AuthFormContainer";
import AuthInput from "@/components/core/AuthInput";
import AuthButton from "@/components/core/AuthButton";
import {FiMail, FiLock} from "react-icons/fi";
import {signIn} from "next-auth/react";
import Link from "next/link";

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
  <AuthFormContainer title="Admin Login">
   {error && (
    <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-sm text-red-200">
     {error}
    </div>
   )}

   <form onSubmit={handleSubmit}>
    <AuthInput
     icon={<FiMail />}
     type="email"
     name="email"
     placeholder="Admin Email"
     value={formData.email}
     onChange={(e) => setFormData({...formData, email: e.target.value})}
     required
    />

    <AuthInput
     icon={<FiLock />}
     type="password"
     name="password"
     placeholder="Password"
     value={formData.password}
     onChange={(e) => setFormData({...formData, password: e.target.value})}
     required
    />

    <div className="mt-6">
     <AuthButton
      type="submit"
      loading={loading}>
      Login as Admin
     </AuthButton>
    </div>
   </form>

   <div className="mt-6 text-center text-sm text-gray-400">
    Don&apos;t have an account?{" "}
    <Link
     href="/auth/register"
     className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
     Sign up
    </Link>
   </div>
  </AuthFormContainer>
 );
}
