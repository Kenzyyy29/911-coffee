import PromoPage from "@/components/layouts/admin/products/promo/PromoPage";
import {Metadata} from "next";
import {Suspense} from "react";

export const metadata: Metadata = {
 title: "Promo Management",
 description: "911 Admin Promo Management",
};

export default function Promo() {
 return (
  <Suspense fallback={<div>Loading...</div>}>
   <PromoPage />
  </Suspense>
 );
}
