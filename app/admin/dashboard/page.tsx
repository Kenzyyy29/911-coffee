import DashboardPage from "@/components/layouts/admin/dashboard/DashboardPage";
import {Metadata} from "next";
import {Suspense} from "react";

export const metadata: Metadata = {
 title: "Dashboard",
 description: "911 Coffee Admin Dashboard",
};

export default function AdminDashboard() {
 return (
  <Suspense fallback={<div>Loading...</div>}>
   <DashboardPage />
  </Suspense>
 );
}
