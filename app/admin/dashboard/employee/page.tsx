import EmployeeDashboard from "@/components/layouts/admin/employee/EmployeeDashboard";
import {Metadata} from "next";

export const metadata: Metadata = {
 title: "Employee Management",
 description: "911 Admin Employee Management",
};

export default function EmployeePage() {
 return <EmployeeDashboard />;
}
