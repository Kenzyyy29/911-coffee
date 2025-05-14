import {useState, useEffect} from "react";
import {db} from "@/lib/firebase/init";
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
import {Promo} from "@/lib/types/promo";

export const usePromo = (outletId: string) => {
 const [promos, setPromos] = useState<Promo[]>([]);
 const [loading, setLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  if (!outletId) {
   setPromos([]);
   setLoading(false);
   return;
  }

  setLoading(true);
  const q = query(
   collection(db, "promos"),
   where("outletId", "==", outletId),
   where("isActive", "==", true) // Hanya ambil promo aktif
  );

  const unsubscribe = onSnapshot(
   q,
   (snapshot) => {
    try {
     const promosData: Promo[] = [];
     snapshot.forEach((doc) => {
      const data = doc.data();
      promosData.push({
       id: doc.id,
       name: data.name,
       description: data.description,
       category: data.category,
       price: data.price,
       outletId: data.outletId,
       imageUrl: data.imageUrl || "",
       isActive: data.isActive !== undefined ? data.isActive : true,
       createdAt: data.createdAt || new Date().toISOString(),
      });
     });
     setPromos(promosData);
     setError(null);
    } catch (err) {
     console.error("Error processing promo data:", err);
     setError("Failed to process promo data");
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

 const addPromo = async (promoData: Omit<Promo, "id" | "createdAt">) => {
  try {
   setLoading(true);
   const docRef = await addDoc(collection(db, "promos"), {
    ...promoData,
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

 const updatePromo = async (id: string, promoData: Partial<Promo>) => {
  try {
   setLoading(true);
   await updateDoc(doc(db, "promos", id), promoData);
  } catch (err) {
   setError((err as Error).message);
   throw err;
  } finally {
   setLoading(false);
  }
 };

 const deletePromo = async (id: string) => {
  try {
   setLoading(true);
   await deleteDoc(doc(db, "promos", id));
  } catch (err) {
   setError((err as Error).message);
   throw err;
  } finally {
   setLoading(false);
  }
 };

 return {
  promos,
  loading,
  error,
  addPromo,
  updatePromo,
  deletePromo,
 };
};
