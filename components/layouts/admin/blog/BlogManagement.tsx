// components/layouts/admin/webmaster/BlogManagement.tsx
"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import {FiPlus, FiEdit2, FiTrash2, FiSave} from "react-icons/fi";
import {useBlog} from "@/lib/hooks/useBlog";
import { BlogPost } from "@/lib/types/blog";

const BlogManagement = () => {
 const {
  posts,
  loading,
  error: blogError,
  addPost,
  updatePost,
  deletePost,
 } = useBlog();

 const [isEditing, setIsEditing] = useState(false);
 const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);
 const [isFormOpen, setIsFormOpen] = useState(false);
 const [successMessage, setSuccessMessage] = useState<string | null>(null);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [localError, setLocalError] = useState<string | null>(null);

 const handleAddNew = () => {
  setCurrentPost({
   title: "",
   slug: "",
   content: "",
   excerpt: "",
   featuredImage: "",
   author: "",
   tags: [],
   isPublished: false,
  });
  setIsEditing(false);
  setIsFormOpen(true);
 };

 const handleEdit = (post: BlogPost) => {
  setCurrentPost({...post});
  setIsEditing(true);
  setIsFormOpen(true);
 };

 const handlePublishChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!currentPost) return;

  setCurrentPost({
   ...currentPost,
   isPublished: e.target.checked,
   publishedAt: e.target.checked ? new Date() : null,
  });
 };

 const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
 ) => {
  if (!currentPost) return;
  const {name, value} = e.target;
  setCurrentPost({...currentPost, [name]: value});
 };

 const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!currentPost) return;
  const tags = e.target.value.split(",").map((tag) => tag.trim());
  setCurrentPost({...currentPost, tags});
 };

 const validatePost = (post: Partial<BlogPost>) => {
  if (!post.title || !post.slug || !post.content || !post.author) {
   throw new Error("Please fill all required fields");
  }
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!currentPost) return;

  try {
   setIsSubmitting(true);
   setLocalError(null); // Reset error sebelum submit
   validatePost(currentPost);

   const postData = {
    title: currentPost.title,
    slug: currentPost.slug,
    content: currentPost.content,
    excerpt: currentPost.excerpt,
    featuredImage: currentPost.featuredImage || "",
    author: currentPost.author,
    tags: currentPost.tags || [],
    isPublished: currentPost.isPublished || false,
    publishedAt: currentPost.isPublished
     ? currentPost.publishedAt || new Date()
     : null,
    updatedAt: new Date(),
   };

   if (isEditing && currentPost.id) {
    await updatePost(currentPost.id, postData);
    setSuccessMessage("Post updated successfully!");
   } else {
    await addPost(postData as Omit<BlogPost, "id">);
    setSuccessMessage("Post created successfully!");
   }

   setTimeout(() => setSuccessMessage(null), 3000);
   setIsFormOpen(false);
   setCurrentPost(null);
  } catch (err) {
   console.error("Error saving post:", err);
   setLocalError(err instanceof Error ? err.message : "Failed to save post");
  } finally {
   setIsSubmitting(false);
  }
 };

 return (
  <div className="container mx-auto px-4 py-8">
   <motion.div
    initial={{opacity: 0, y: -20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.3}}
    className="mb-8">
    <h1 className="text-3xl font-bold text-gray-800">Blog Management</h1>
    <p className="text-gray-600">Manage your blog posts here</p>
   </motion.div>

   {blogError && (
    <motion.div
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
     {blogError}
    </motion.div>
   )}

   {localError && (
    <motion.div
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
     {localError}
    </motion.div>
   )}

   {successMessage && (
    <motion.div
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
     {successMessage}
    </motion.div>
   )}

   <motion.button
    onClick={handleAddNew}
    className="bg-black hover:bg-black/90 text-white px-4 py-2 rounded-md flex items-center mb-6">
    <FiPlus className="mr-2" />
    Add New Post
   </motion.button>

   {isFormOpen && currentPost && (
    <motion.div
     initial={{opacity: 0, y: -20}}
     animate={{opacity: 1, y: 0}}
     exit={{opacity: 0, y: -20}}
     className="bg-white rounded-lg shadow-md p-6 mb-8">
     <h2 className="text-xl font-semibold mb-4">
      {isEditing ? "Edit Post" : "Add New Post"}
     </h2>
     <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
       <div>
        <label className="block text-gray-700 mb-2">Title*</label>
        <input
         type="text"
         name="title"
         value={currentPost.title || ""}
         onChange={handleInputChange}
         className="w-full px-3 py-2 border rounded-md"
         required
        />
       </div>
       <div>
        <label className="block text-gray-700 mb-2">Slug*</label>
        <input
         type="text"
         name="slug"
         value={currentPost.slug || ""}
         onChange={handleInputChange}
         className="w-full px-3 py-2 border rounded-md"
         required
        />
       </div>
      </div>

      <div className="mb-4">
       <label className="block text-gray-700 mb-2">Excerpt*</label>
       <textarea
        name="excerpt"
        value={currentPost.excerpt || ""}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded-md"
        rows={2}
        required
       />
      </div>

      <div className="mb-4">
       <label className="block text-gray-700 mb-2">Content*</label>
       <textarea
        name="content"
        value={currentPost.content || ""}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded-md"
        rows={6}
        required
       />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
       <div>
        <label className="block text-gray-700 mb-2">Featured Image URL</label>
        <input
         type="text"
         name="featuredImage"
         value={currentPost.featuredImage || ""}
         onChange={handleInputChange}
         className="w-full px-3 py-2 border rounded-md"
        />
       </div>
       <div>
        <label className="block text-gray-700 mb-2">Author*</label>
        <input
         type="text"
         name="author"
         value={currentPost.author || ""}
         onChange={handleInputChange}
         className="w-full px-3 py-2 border rounded-md"
         required
        />
       </div>
      </div>

      <div className="mb-4">
       <label className="block text-gray-700 mb-2">
        Tags (comma separated)
       </label>
       <input
        type="text"
        value={currentPost.tags?.join(", ") || ""}
        onChange={handleTagsChange}
        className="w-full px-3 py-2 border rounded-md"
       />
      </div>

      <div className="flex items-center mb-4">
       <input
        type="checkbox"
        id="isPublished"
        checked={currentPost.isPublished || false}
        onChange={handlePublishChange}
        className="mr-2"
       />
       <label
        htmlFor="isPublished"
        className="text-gray-700">
        Publish
       </label>
      </div>

      <div className="flex justify-end space-x-2">
       <motion.button
        whileHover={{scale: 1.02}}
        whileTap={{scale: 0.98}}
        type="button"
        onClick={() => setIsFormOpen(false)}
        className="px-4 py-2 border rounded-md text-gray-700"
        disabled={isSubmitting}>
        Cancel
       </motion.button>
       <motion.button
        whileHover={{scale: 1.02}}
        whileTap={{scale: 0.98}}
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        disabled={isSubmitting}>
        {isSubmitting ? (
         <>
          <svg
           className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
           xmlns="http://www.w3.org/2000/svg"
           fill="none"
           viewBox="0 0 24 24">
           <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"></circle>
           <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
         </>
        ) : (
         <>
          <FiSave className="mr-2" />
          {isEditing ? "Update" : "Save"}
         </>
        )}
       </motion.button>
      </div>
     </form>
    </motion.div>
   )}

   {loading ? (
    <div className="flex justify-center items-center h-32">
     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
   ) : (
    <motion.div
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     className="bg-white rounded-lg shadow-md overflow-hidden">
     <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
       <thead className="bg-gray-50">
        <tr>
         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Title
         </th>
         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Author
         </th>
         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status
         </th>
         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Created
         </th>
         <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
         </th>
        </tr>
       </thead>
       <tbody className="bg-white divide-y divide-gray-200">
        {posts.map((post) => (
         <motion.tr
          key={post.id}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          whileHover={{backgroundColor: "rgba(0, 0, 0, 0.02)"}}>
          <td className="px-6 py-4 whitespace-nowrap">
           <div className="text-sm font-medium text-gray-900">{post.title}</div>
           <div className="text-sm text-gray-500">{post.slug}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
           {post.author}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
           <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
             post.isPublished
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
            }`}>
            {post.isPublished ? "Published" : "Draft"}
           </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
           {post.createdAt?.toLocaleDateString()}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
           <div className="flex justify-end space-x-2">
            <motion.button
             whileHover={{scale: 1.1}}
             whileTap={{scale: 0.9}}
             onClick={() => handleEdit(post)}
             className="text-blue-600 hover:text-blue-900"
             title="Edit">
             <FiEdit2 />
            </motion.button>
            <motion.button
             whileHover={{scale: 1.1}}
             whileTap={{scale: 0.9}}
             onClick={() => {
              if (
               window.confirm("Are you sure you want to delete this post?")
              ) {
               deletePost(post.id!);
              }
             }}
             className="text-red-600 hover:text-red-900"
             title="Delete">
             <FiTrash2 />
            </motion.button>
           </div>
          </td>
         </motion.tr>
        ))}
       </tbody>
      </table>
     </div>
    </motion.div>
   )}
  </div>
 );
};

export default BlogManagement;
