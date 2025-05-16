import CareerPageLayout from "@/components/layouts/admin/career/CareerPageLayout";
import {Metadata} from "next";

export const metadata: Metadata = {
 title: "Rekruitmen",
 description: "911 Admin Rekruitmen Management",
};

export default function CareerPage() {
 return <CareerPageLayout />;
}
