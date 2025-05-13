// /app/promo/page.tsx
import UserPromoPage from "@/components/layouts/pages/Promo/UserPromoPage";
import {Metadata} from "next";
import {Suspense} from "react";

export const metadata: Metadata = {
 title: "Promo",
 description: "View our current promotions",
};

export default function PromoPage() {
 return (
  <Suspense fallback={<div>Loading...</div>}>
   <UserPromoPage />
  </Suspense>
 );
}
