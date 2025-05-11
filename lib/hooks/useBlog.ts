import { useState, useEffect } from "react";
import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    getFirestore,
} from "firebase/firestore";
import { app } from "@/lib/firebase/init";
import { BlogPost } from "../types/blog";

const firestore = getFirestore(app);

type CleanablePostData = Partial<BlogPost> | Omit<BlogPost, 'id'>;

export const useBlog = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const collectionName = "blog_posts";

    const cleanData = <T extends CleanablePostData>(data: T): T => {
        const cleaned = { ...data };
        (Object.keys(cleaned) as Array<keyof T>).forEach(key => {
            if (cleaned[key] === undefined) {
                delete cleaned[key];
            }
        });
        return cleaned;
    };

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(firestore, collectionName));
            const postsData: BlogPost[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                postsData.push({
                    id: doc.id,
                    title: data.title,
                    slug: data.slug,
                    content: data.content,
                    excerpt: data.excerpt,
                    featuredImage: data.featuredImage,
                    author: data.author,
                    tags: data.tags || [],
                    isPublished: data.isPublished,
                    publishedAt: data.publishedAt?.toDate() || null,
                    createdAt: data.createdAt?.toDate(),
                    updatedAt: data.updatedAt?.toDate(),
                });
            });

            setPosts(postsData);
            setError(null);
        } catch (err) {
            console.error("Error fetching blog posts:", err);
            setError("Failed to load blog posts");
        } finally {
            setLoading(false);
        }
    };

    const addPost = async (postData: Omit<BlogPost, 'id'>) => {
        try {
            setLoading(true);
            const newPost = cleanData({
                ...postData,
                isPublished: postData.isPublished || false,
                createdAt: new Date(),
                updatedAt: new Date(),
                publishedAt: postData.isPublished ? new Date() : null
            });

            await addDoc(collection(firestore, collectionName), newPost);
            await fetchPosts();
            return { success: true };
        } catch (err) {
            console.error("Error adding blog post:", err);
            return { success: false, error: "Failed to add blog post" };
        } finally {
            setLoading(false);
        }
    };

    const updatePost = async (id: string, postData: Partial<BlogPost>) => {
        try {
            setLoading(true);
            const cleanedData = cleanData({
                ...postData,
                updatedAt: new Date(),
                publishedAt: postData.isPublished
                    ? postData.publishedAt || new Date()
                    : null
            });

            await updateDoc(doc(firestore, collectionName, id), cleanedData);
            await fetchPosts();
            return { success: true };
        } catch (err) {
            console.error("Error updating blog post:", err);
            return { success: false, error: "Failed to update blog post" };
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (id: string) => {
        try {
            setLoading(true);
            await deleteDoc(doc(firestore, collectionName, id));
            await fetchPosts();
            return { success: true };
        } catch (err) {
            console.error("Error deleting blog post:", err);
            return { success: false, error: "Failed to delete blog post" };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return {
        posts,
        loading,
        error,
        setError,
        addPost,
        updatePost,
        deletePost,
        refresh: fetchPosts,
    };
};