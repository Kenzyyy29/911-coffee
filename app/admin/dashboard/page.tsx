import DashboardPage from "@/components/layouts/admin/dashboard/DashboardPage";
import { Suspense } from "react";

export default function AdminDashboard() {
 return (
  <Suspense fallback={<div>Loading...</div>}>
   <DashboardPage />
  </Suspense>
 );
}
