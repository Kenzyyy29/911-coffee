import UserBundlingPage from "@/components/layouts/pages/Bundling/UserBundlingPage";
import { Metadata } from "next";
import {Suspense} from "react";

export const metadata: Metadata = {
    title:"Bundling",
    description: "911 Coffee Bundling Management"
}

export default function Bundling() {
 return (
  <Suspense fallback={<div>Loading...</div>}>
   <UserBundlingPage />
  </Suspense>
 );
}
