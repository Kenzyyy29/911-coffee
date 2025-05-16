import CareerPageLayout from "@/components/layouts/admin/career/CareerPageLayout";
import {Metadata} from "next";

export const metaata: Metadata = {
 title: "Rekruitmen",
 description: "911 Admin Rekruitmen Management",
};

export default function CareerPage() {
 return <CareerPageLayout />;
}
