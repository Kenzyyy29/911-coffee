import RegisterPageWrapper from "@/components/layouts/auth/RegisterPageWrapper";
import {Suspense} from "react";

export default function RegisterPage() {
 return (
  <Suspense fallback={<div>Loading...</div>}>
   <RegisterPageWrapper />
  </Suspense>
 );
}
