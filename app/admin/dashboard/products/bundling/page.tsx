import BundlingPage from "@/components/layouts/admin/products/bundling/BundlingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title:"Bundling",
    description: "911 Admin Bundling Management"
}

export default function Bundling(){
    return <BundlingPage/>
}