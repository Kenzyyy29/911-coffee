// /lib/hooks/useBundling.ts
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/init";
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    where,
    orderBy,
} from "firebase/firestore";
import { Bundling } from "@/lib/types/bundling";

export const useBundling = (outletId?: string) => {
    const [bundlings, setBundlings] = useState<Bundling[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const collectionRef = collection(db, "bundlings");
        const q = outletId
            ? query(
                collectionRef,
                where("outletId", "==", outletId),
                orderBy("createdAt", "desc")
            )
            : query(collectionRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                try {
                    const bundlingsData: Bundling[] = [];
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        bundlingsData.push({
                            id: doc.id,
                            name: data.name,
                            description: data.description,
                            price: data.price,
                            taxIds: data.taxIds || [],
                            outletId: data.outletId,
                            imageUrl: data.imageUrl || "",
                            menuItems: data.menuItems || [], // Changed from menuIds to menuItems
                            isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
                            createdAt: data.createdAt || new Date().toISOString(),
                          });
                    });
                    setBundlings(bundlingsData);
                    setError(null);
                } catch (err) {
                    console.error("Error processing bundling data:", err);
                    setError("Failed to process bundling data");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                console.error("Firebase error:", err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [outletId]);

    const addBundling = async (bundlingData: Omit<Bundling, "id" | "createdAt">) => {
        try {
            setLoading(true);
            const docRef = await addDoc(collection(db, "bundlings"), {
                ...bundlingData,
                createdAt: new Date().toISOString(),
            });
            return docRef.id;
        } catch (err) {
            setError((err as Error).message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateBundling = async (id: string, bundlingData: Partial<Bundling>) => {
        try {
            setLoading(true);
            await updateDoc(doc(db, "bundlings", id), bundlingData);
        } catch (err) {
            setError((err as Error).message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteBundling = async (id: string) => {
        try {
            setLoading(true);
            await deleteDoc(doc(db, "bundlings", id));
        } catch (err) {
            setError((err as Error).message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        bundlings,
        loading,
        error,
        addBundling,
        updateBundling,
        deleteBundling,
    };
};