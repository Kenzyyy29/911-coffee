import AdminProfileSettings from "@/components/layouts/admin/AdminProfileSettings";
import {Metadata} from "next";

export const metadata: Metadata = {
 title: "Profile Settings",
 description: "911 Admin Profile Settings",
};

export default function AdminProfile() {
 return <AdminProfileSettings />;
}
