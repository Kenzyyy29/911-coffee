import CareerForm from "@/components/layouts/pages/Career/CareerForm";
import {Metadata} from "next";

export const metadata: Metadata = {
 title: "Lowongan Pekerjaan",
 description: "Temukan kesempatan karir yang sesuai dengan keahlian Anda",
};

export default function CareerFormPage() {
 return <CareerForm />;
}
