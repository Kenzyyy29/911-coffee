import TaxesPageLayout from "@/components/layouts/admin/TaxesPageLayout";
import {Metadata} from "next";

export const metadata: Metadata = {
 title: "Taxes Management",
 description: "911 Admin Taxes Management",
};

export default function TaxesPage() {
 return <TaxesPageLayout />;
}
