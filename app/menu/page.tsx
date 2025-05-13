import MenuPage from "@/components/layouts/pages/MenuPage";
import {Metadata} from "next";
import {Suspense} from "react";

export const metadata: Metadata = {
 title: "Menu",
 description: "Menu",
};

export default function Menu() {
 return (
  <Suspense fallback={<div>Loading...</div>}>
   <MenuPage />
  </Suspense>
 );
}
