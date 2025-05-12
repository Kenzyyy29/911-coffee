import MenuDetailPage from "@/components/layouts/pages/MenuDetailPage";
import {Metadata} from "next";

export const metadata: Metadata = {
 title: "Menu",
 description: "Menu",
};

export default function MenuDetail() {
 return <MenuDetailPage />;
}
