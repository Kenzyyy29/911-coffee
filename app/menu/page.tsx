import MenuPage from "@/components/layouts/pages/MenuPage";
import {Metadata} from "next";
import {Suspense} from "react";

export const metadata: Metadata = {
 title: "911 Coffee - Menu",
 description: "Lihat Menu di Outlet 911 Coffee",
};

export default function Menu() {
 return (
  <Suspense fallback={<div>Loading...</div>}>
   <MenuPage />
  </Suspense>
 );
}
