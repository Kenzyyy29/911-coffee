import CareerForm from "@/components/layouts/pages/Career/CareerForm";
import {Metadata} from "next";
import {Suspense} from "react";
import {FaSpinner} from "react-icons/fa";

export const metadata: Metadata = {
 title: "Lowongan Pekerjaan",
 description: "Temukan kesempatan karir yang sesuai dengan keahlian Anda",
};

export default function CareerFormPage() {
 return (
  <Suspense
   fallback={
    <div className="h-[100dvh] flex items-center justify-center bg-white dark:bg-onyx1">
     <FaSpinner className="text-3xl text-onyx1 dark:text-white animate-spin" />
    </div>
   }>
   <CareerForm />
  </Suspense>
 );
}
