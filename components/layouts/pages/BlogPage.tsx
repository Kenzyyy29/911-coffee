"use client";

import {motion} from "framer-motion";
import Link from "next/link";
import {useEffect, useState} from "react";
import {BlogPost} from "@/lib/types/blog";
import {collection, getDocs, getFirestore} from "firebase/firestore";
import {app} from "@/lib/firebase/init";
import {FiCalendar, FiUser, FiTag} from "react-icons/fi";
import Image from "next/image";

const firestore = getFirestore(app);

const BlogPage = () => {
 const [posts, setPosts] = useState<BlogPost[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  const fetchPosts = async () => {
   try {
    setLoading(true);
    const querySnapshot = await getDocs(collection(firestore, "blog_posts"));
    const publishedPosts: BlogPost[] = [];

    querySnapshot.forEach((doc) => {
     const data = doc.data();
     if (data.isPublished) {
      publishedPosts.push({
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
      });
     }
    });

    // Sort by publishedAt (newest first)
    publishedPosts.sort((a, b) => {
     const dateA = a.publishedAt || a.createdAt || new Date(0);
     const dateB = b.publishedAt || b.createdAt || new Date(0);
     return dateB.getTime() - dateA.getTime();
    });

    setPosts(publishedPosts);
    setError(null);
   } catch (err) {
    console.error("Error fetching blog posts:", err);
    setError("Failed to load blog posts");
   } finally {
    setLoading(false);
   }
  };

  fetchPosts();
 }, []);

 if (loading) {
  return (
   <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
   </div>
  );
 }

 if (error) {
  return (
   <div className="container mx-auto px-4 py-8 text-center text-red-500">
    {error}
   </div>
  );
 }

 return (
  <div className="container mx-auto px-4 py-8">
   <motion.div
    initial={{opacity: 0, y: -20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.3}}
    className="mb-12 text-center">
    <h1 className="text-4xl font-bold text-gray-800 mb-2">Blog</h1>
    <p className="text-lg text-gray-600">Artikel dan tulisan terbaru kami</p>
   </motion.div>

   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {posts.map((post) => (
     <motion.div
      key={post.id}
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}
      whileHover={{y: -5}}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {post.featuredImage && (
       <div className="h-48 overflow-hidden">
        <Image
         width={600}
         height={600}
         src={post.featuredImage}
         alt={post.title}
         className="w-full h-full object-cover"
        />
       </div>
      )}
      <div className="p-6">
       <div className="flex items-center text-sm text-gray-500 mb-2">
        <FiUser className="mr-1" />
        <span className="mr-4">{post.author}</span>
        <FiCalendar className="mr-1" />
        <span>
         {(post.publishedAt || post.createdAt)?.toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
         })}
        </span>
       </div>
       <Link href={`/blog/${post.slug}`}>
        <h2 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
         {post.title}
        </h2>
       </Link>
       <p className="text-gray-600 mb-4">{post.excerpt}</p>
       {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
         {post.tags.map((tag) => (
          <span
           key={tag}
           className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
           <FiTag className="mr-1" />
           {tag}
          </span>
         ))}
        </div>
       )}
       <Link
        href={`/blog/${post.slug}`}
        className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium">
        Baca selengkapnya →
       </Link>
      </div>
     </motion.div>
    ))}
   </div>

   {posts.length === 0 && (
    <div className="text-center py-12">
     <h3 className="text-xl text-gray-600">Belum ada artikel yang tersedia</h3>
    </div>
   )}
  </div>
 );
};

export default BlogPage;