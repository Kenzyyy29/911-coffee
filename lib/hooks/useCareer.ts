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
    orderBy,
} from "firebase/firestore";
import { Career } from "@/lib/types/career";

export const useCareer = () => {
    const [careers, setCareers] = useState<Career[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all careers
    useEffect(() => {
        setLoading(true);
        const careersQuery = query(
            collection(db, "careers"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(
            careersQuery,
            (snapshot) => {
                const careersData: Career[] = [];
                snapshot.forEach((doc) => {
                    careersData.push({ id: doc.id, ...doc.data() } as Career);
                });
                setCareers(careersData);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    // Add new career
    const addCareer = async (careerData: Omit<Career, "id" | "createdAt" | "updatedAt">) => {
        try {
            setLoading(true);
            const docRef = await addDoc(collection(db, "careers"), {
                ...careerData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            return docRef.id;
        } catch (err) {
            setError((err as Error).message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update career
    const updateCareer = async (id: string, careerData: Partial<Career>) => {
        try {
            setLoading(true);
            await updateDoc(doc(db, "careers", id), {
                ...careerData,
                updatedAt: new Date().toISOString(),
            });
        } catch (err) {
            setError((err as Error).message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete career
    const deleteCareer = async (id: string) => {
        try {
            setLoading(true);
            await deleteDoc(doc(db, "careers", id));
        } catch (err) {
            setError((err as Error).message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        careers,
        loading,
        error,
        addCareer,
        updateCareer,
        deleteCareer,
    };
};