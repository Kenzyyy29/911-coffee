import BlogManagement from "@/components/layouts/admin/blog/BlogManagement";
import {Metadata} from "next";

export const metadata: Metadata = {
 title: "Blog Management",
 description: "911 Admin Blog Management",
};

export default function AdminBlogPage() {
 return <BlogManagement />;
}
