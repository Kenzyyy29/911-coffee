// components/layouts/admin/webmaster/BlogManagement.tsx
"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import {FiPlus, FiEdit2, FiTrash2} from "react-icons/fi";
import {useBlog} from "@/lib/hooks/useBlog";
import {BlogPost} from "@/lib/types/blog";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";

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
  <div className="h-[100dvh] p-4 md:p-8 bg-white dark:bg-onyx1">
   <motion.div
    initial={{opacity: 0, y: -20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.3}}
    className="max-w-6xl mx-auto rounded-lg">
    <div className="max-w-6xl mx-auto rounded-lg flex justify-between">
     <h1 className="text-2xl font-bold text-onyx1 dark:text-white mb-6">
      Blog Management
     </h1>
     <motion.button
      onClick={handleAddNew}
      className="flex items-center gap-2 bg-onyx1 dark:bg-onyx2 text-white px-4 py-2 rounded-lg hover:bg-onyx2 dark:hover:bg-onyx2/90 transition-colors mb-6">
      <FiPlus /> Add New Post
     </motion.button>
    </div>

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

    {isFormOpen && currentPost && (
     <Modal
      isOpen={isFormOpen}
      onClose={() => setIsFormOpen(false)}
      title={isEditing ? "Edit Post" : "Add New Post"}
      maxWidth="xl">
      <form onSubmit={handleSubmit}>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
         label="Title*"
         name="title"
         value={currentPost.title || ""}
         onChange={handleInputChange}
         required
        />
        <Input
         label="Slug*"
         name="slug"
         value={currentPost.slug || ""}
         onChange={handleInputChange}
         required
        />
       </div>

       <Textarea
        label="Excerpt*"
        name="excerpt"
        value={currentPost.excerpt || ""}
        onChange={handleInputChange}
        rows={2}
        required
       />

       <Textarea
        label="Content*"
        name="content"
        value={currentPost.content || ""}
        onChange={handleInputChange}
        rows={6}
        required
       />

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
         label="Featured Image URL"
         name="featuredImage"
         value={currentPost.featuredImage || ""}
         onChange={handleInputChange}
        />
        <Input
         label="Author*"
         name="author"
         value={currentPost.author || ""}
         onChange={handleInputChange}
         required
        />
       </div>

       <Input
        label="Tags (comma separated)"
        value={currentPost.tags?.join(", ") || ""}
        onChange={handleTagsChange}
       />

       <Checkbox
        id="isPublished"
        checked={currentPost.isPublished || false}
        onChange={handlePublishChange}
        label="Publish"
        containerClassName="mb-4"
       />

       <div className="flex justify-end space-x-2">
        <Button
         type="button"
         onClick={() => setIsFormOpen(false)}
         variant="outline"
         disabled={isSubmitting}>
         Cancel
        </Button>
        <Button
         type="submit"
         variant="primary"
         isLoading={isSubmitting}>
         {isEditing ? "Update" : "Save"}
        </Button>
       </div>
      </form>
     </Modal>
    )}

    {loading ? (
     <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
     </div>
    ) : (
     <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{delay: 0.2}}
      className="bg-white dark:bg-onyx1 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-y-auto">
       <table className="w-full divide-y divide-gray-200 dark:divide-onyx1">
        <thead className="bg-white dark:bg-onyx2">
         <tr>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
           Title
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
           Author
          </th>
          <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
           Status
          </th>
          <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
           Created
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
           Actions
          </th>
         </tr>
        </thead>
        <tbody className="bg-white dark:bg-onyx2 divide-y divide-gray-200 dark:divide-onyx1">
         {posts.map((post) => (
          <motion.tr
           key={post.id}
           initial={{opacity: 0}}
           animate={{opacity: 1}}
           transition={{duration: 0.3}}
           className="hover:bg-gray-50 dark:hover:bg-onyx1/50">
           <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-onyx1 dark:text-white">
             {post.title}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
             {post.slug}
            </div>
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-sm text-onyx1 dark:text-white">
            {post.author}
           </td>
           <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
            <span
             className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              post.isPublished
               ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
               : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
             }`}>
             {post.isPublished ? "Published" : "Draft"}
            </span>
           </td>
           <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-onyx1 dark:text-white">
            {post.createdAt?.toLocaleDateString()}
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex justify-end space-x-2">
             <motion.button
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.9}}
              onClick={() => handleEdit(post)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Edit">
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
              className="text-red-600 hover:text-red-900 dark:hover:text-red-500 transition-colors"
              aria-label="Delete">
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
   </motion.div>
  </div>
 );
};

export default BlogManagement;
