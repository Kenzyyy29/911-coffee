import OutletsLayout from "@/components/layouts/admin/OutletsLayout";
import {Metadata} from "next";

export const metadata: Metadata = {
 title: "Outlets",
 description: "911 Admin Outlets Management",
};

export default function OutletPage() {
 return <OutletsLayout />;
}
