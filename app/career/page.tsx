import CareerPage from "@/components/layouts/pages/CareerPage";
import {Metadata} from "next";

export const metadata: Metadata = {
 title: "911 Coffee Karir",
 description: "Temukan kesempatan karir yang sesuai dengan keahlian Anda",
};

export default function Career() {
 return <CareerPage />;
}
