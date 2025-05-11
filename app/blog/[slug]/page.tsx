import {BlogPost} from "@/lib/types/blog";
import {
 collection,
 getDocs,
 getFirestore,
 query,
 where,
} from "firebase/firestore";
import {app} from "@/lib/firebase/init";
import {FiCalendar, FiUser, FiTag, FiArrowLeft} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

const firestore = getFirestore(app);

export default async function Page({
 params,
}: {
 params: {slug: string};
} & {params: Promise<{slug: string}>}) {
 // Wait for the params promise to resolve
 const resolvedParams = await params;
 const {slug} = resolvedParams;

 try {
  // Fetch post from Firestore
  const q = query(
   collection(firestore, "blog_posts"),
   where("slug", "==", slug),
   where("isPublished", "==", true)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
   return (
    <div className="container mx-auto px-4 py-8 text-center">
     <h1 className="text-2xl font-bold text-gray-800 mb-4">
      Artikel Tidak Ditemukan
     </h1>
     <Link
      href="/blog"
      className="text-blue-600 hover:text-blue-800 underline">
      Kembali ke Daftar Blog
     </Link>
    </div>
   );
  }

  const doc = querySnapshot.docs[0];
  const data = doc.data();

  const post: BlogPost = {
   id: doc.id,
   title: data.title,
   slug: data.slug,
   content: data.content,
   excerpt: data.excerpt,
   featuredImage: data.featuredImage,
   author: data.author,
   tags: data.tags || [],
   isPublished: data.isPublished,
   publishedAt: data.publishedAt?.toDate(),
   createdAt: data.createdAt?.toDate(),
   updatedAt: data.updatedAt?.toDate(),
  };

  return (
   <div className="container mx-auto px-4 py-8 min-h-[100dvh] pt-[100px]">
    <div className="max-w-4xl mx-auto">
     <Link
      href="/blog"
      className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
      <FiArrowLeft className="mr-2" />
      Kembali ke Daftar Blog
     </Link>

     <header className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
       {post.title}
      </h1>

      <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-4">
       <span className="flex items-center">
        <FiUser className="mr-1.5" />
        {post.author}
       </span>
       <span className="flex items-center">
        <FiCalendar className="mr-1.5" />
        {(post.publishedAt || post.createdAt)?.toLocaleDateString("id-ID", {
         year: "numeric",
         month: "long",
         day: "numeric",
        })}
       </span>
      </div>

      {post.featuredImage && (
       <div className="rounded-lg overflow-hidden mb-6 shadow-md">
        <Image
         width={600}
         height={600}
         src={post.featuredImage}
         alt={post.title}
         className="w-full h-auto object-cover"
         loading="lazy"
        />
       </div>
      )}

      {post.tags && post.tags.length > 0 && (
       <div className="flex flex-wrap gap-2 mb-6">
        {post.tags.map((tag) => (
         <span
          key={tag}
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <FiTag className="mr-1.5" />
          {tag}
         </span>
        ))}
       </div>
      )}
     </header>

     <article
      className="prose max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 
                        prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-li:marker:text-gray-400
                        prose-img:rounded-lg prose-img:shadow-md"
      dangerouslySetInnerHTML={{__html: post.content}}
     />
    </div>
   </div>
  );
 } catch (error) {
  console.error("Error fetching blog post:", error);
  return (
   <div className="container mx-auto px-4 py-8 text-center">
    <h1 className="text-2xl font-bold text-gray-800 mb-4">Terjadi Kesalahan</h1>
    <p className="text-gray-600 mb-4">
     Gagal memuat artikel. Silakan coba lagi nanti.
    </p>
    <Link
     href="/blog"
     className="text-blue-600 hover:text-blue-800 underline">
     Kembali ke Daftar Blog
    </Link>
   </div>
  );
 }
}
