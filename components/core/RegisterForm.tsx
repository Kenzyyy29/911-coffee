"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function RegisterForm({
 searchParams,
}: {
 searchParams?: {callbackUrl?: string};
}) {
 const {push} = useRouter();
 const [error, setError] = useState("");
 const [isLoading, setIsLoading] = useState(false);

 const callbackUrl = searchParams?.callbackUrl || "/login";

 const handleSubmit = async (e: any) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  const res = await fetch("/api/auth/register", {
   method: "POST",
   body: JSON.stringify({
    fullname: e.target.fullname.value,
    email: e.target.email.value,
    phone: e.target.phone.value,
    password: e.target.password.value,
   }),
  });
  if (res.status === 200) {
   e.target.reset();
   setIsLoading(false);
   push(callbackUrl);
  } else {
   setError("Email already exists");
   setIsLoading(false);
  }
 };

 return (
  <div className="bg-white/50 backdrop-blur-sm max-w-sm w-full p-5 flex flex-col gap-4 justify-center items-center rounded-[8px] shadow-xl shadow-gray-300">
   <h1
    className="text-2xl font-bold italic"
    style={{fontFamily: "Raleway"}}>
    Sellaris Register
   </h1>
   <form
    onSubmit={handleSubmit}
    className="w-full flex flex-col items-center justify-center gap-4">
    <div className="flex flex-col gap-2 w-full">
     <input
      type="text"
      name="fullname"
      id="fullname"
      placeholder="Fullname"
      className="w-full border border-gray-300 text-gray-400 focus:text-black focus:outline-none p-2 rounded-[8px]"
     />
    </div>
    <div className="flex flex-col gap-2 w-full">
     <input
      type="email"
      name="email"
      id="email"
      placeholder="Email"
      className="w-full border border-gray-300 text-gray-400 focus:text-black focus:outline-none p-2 rounded-[8px]"
     />
    </div>
    <div className="flex flex-col gap-2 w-full">
     <input
      type="text"
      name="phone"
      id="phone"
      placeholder="Phone"
      className="w-full border border-gray-300 text-gray-400 focus:text-black focus:outline-none p-2 rounded-[8px]"
     />
    </div>
    <div className="flex flex-col gap-2 w-full">
     <input
      type="password"
      name="password"
      id="password"
      placeholder="Password"
      className="w-full border border-gray-300 text-gray-400 focus:text-black focus:outline-none p-2 rounded-[8px]"
     />
    </div>
    <button
     type="submit"
     className="w-full bg-[#337367] font-semibold p-2 rounded text-white cursor-pointer hover:bg-[#50857a]">
     {isLoading ? "Loading..." : "Register"}
    </button>
   </form>
   <div className="flex gap-2 text-[14px]">
    <h1 className="text-gray-400">Already have an account?</h1>
    <Link href="/login">
     <h1 className="text-blue-300 hover:underline">Login</h1>
    </Link>
   </div>
  </div>
 );
}
