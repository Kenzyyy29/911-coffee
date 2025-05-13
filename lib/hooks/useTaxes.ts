// lib/hooks/useTaxes.ts
import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase/init";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
} from "firebase/firestore";
import { Tax } from "@/lib/types/tax";

export const useTaxes = () => {
    const [taxes, setTaxes] = useState<Tax[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Memoize the collection reference
    const taxesCollectionRef = useCallback(() => collection(db, "taxes"), []);

    const fetchTaxes = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(taxesCollectionRef(), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const taxesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Tax[];
            setTaxes(taxesData);
        } catch (err) {
            setError("Failed to fetch taxes");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [taxesCollectionRef]); // Now taxesCollectionRef is stable

    const addTax = async (taxData: Omit<Tax, "id" | "createdAt">) => {
        setLoading(true);
        try {
            const newTax = {
                ...taxData,
                createdAt: new Date().toISOString(),
            };
            const docRef = await addDoc(taxesCollectionRef(), newTax);
            await fetchTaxes();
            return docRef.id;
        } catch (err) {
            setError("Failed to add tax");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateTax = async (id: string, taxData: Partial<Tax>) => {
        setLoading(true);
        try {
            const taxDoc = doc(db, "taxes", id);
            await updateDoc(taxDoc, taxData);
            await fetchTaxes();
        } catch (err) {
            setError("Failed to update tax");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteTax = async (id: string) => {
        setLoading(true);
        try {
            const taxDoc = doc(db, "taxes", id);
            await deleteDoc(taxDoc);
            await fetchTaxes();
        } catch (err) {
            setError("Failed to delete tax");
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTaxes();
    }, [fetchTaxes]);

    return {
        taxes,
        loading,
        error,
        addTax,
        updateTax,
        deleteTax,
        fetchTaxes,
    };
};