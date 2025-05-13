import MenuDetailPage from "@/components/layouts/pages/MenuDetailPage";
import {Metadata} from "next";
import {Suspense} from "react";

export const metadata: Metadata = {
 title: "Menu",
 description: "Menu",
};

export default function MenuDetail() {
 return (
  <Suspense fallback={<div>Loading...</div>}>
   <MenuDetailPage />
  </Suspense>
 );
}
