
import PromoDetailPage from "@/components/layouts/pages/Promo/PromoDetailPage";
import {Metadata} from "next";
import {Suspense} from "react";

export const metadata: Metadata = {
 title: "911 Coffee - Daily Promo",
 description: "View our current promotions",
};

export default function MenuDetail() {
 return (
  <Suspense fallback={<div>Loading...</div>}>
   <PromoDetailPage />
  </Suspense>
 );
}
