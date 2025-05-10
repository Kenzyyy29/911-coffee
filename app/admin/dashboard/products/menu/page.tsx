import MenuPageLayout from "@/components/layouts/admin/MenuPageLayout";
import {Metadata} from "next";

export const metadata: Metadata = {
 title: "Menu Management",
 description: "911 Admin Menu Management",
};

export default function MenuPage() {
 return <MenuPageLayout  />;
}
