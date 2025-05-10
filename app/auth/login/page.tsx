import LoginPageWrapper from "@/components/layouts/auth/LoginPageWrapper";
import {Metadata} from "next";
import {Suspense} from "react";

export const metadata: Metadata = {
 title: "911 Coffee Login",
 description: "Good Coffee Start From Here",
};

export default function LoginPage() {
 return (
  <Suspense fallback={<div>Loading...</div>}>
   <LoginPageWrapper />
  </Suspense>
 );
}
