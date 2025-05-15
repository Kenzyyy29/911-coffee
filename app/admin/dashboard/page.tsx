import {Metadata} from "next";
import {GoAlertFill} from "react-icons/go";

export const metadata: Metadata = {
 title: "Dashboard",
 description: "911 Coffee Admin Dashboard",
};

export default function AdminDashboard() {
 return (
  <div className="h-[100dvh] bg-white dark:bg-onyx1 text-onyx1 dark:text-white flex items-center justify-center">
   <div className="flex flex-col items-center gap-2">
    <GoAlertFill className="text-4xl text-yellow-500" />
    <h1 className="text-3xl text-center font-bold italic">
     Halaman ini sedang dalam proses development
    </h1>
    <p className="text-gray-500">Developed by: @simp4iammm</p>
   </div>
  </div>
 );
}
