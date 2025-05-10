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
 orderBy,
} from "firebase/firestore";
import {Outlet} from "@/lib/types/outlet";

export const useOutlets = () => {
 const [outlets, setOutlets] = useState<Outlet[]>([]);
 const [loading, setLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);

 // Fetch all outlets
 useEffect(() => {
  setLoading(true);
  const outletsQuery = query(
   collection(db, "outlets"),
   orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(
   outletsQuery,
   (snapshot) => {
    const outletsData: Outlet[] = [];
    snapshot.forEach((doc) => {
     outletsData.push({id: doc.id, ...doc.data()} as Outlet);
    });
    setOutlets(outletsData);
    setLoading(false);
   },
   (err) => {
    setError(err.message);
    setLoading(false);
   }
  );

  return () => unsubscribe();
 }, []);

 // Add new outlet
 const addOutlet = async (outletData: Omit<Outlet, "id" | "createdAt">) => {
  try {
   setLoading(true);
   const docRef = await addDoc(collection(db, "outlets"), {
    ...outletData,
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

 // Update outlet
 const updateOutlet = async (id: string, outletData: Partial<Outlet>) => {
  try {
   setLoading(true);
   await updateDoc(doc(db, "outlets", id), outletData);
  } catch (err) {
   setError((err as Error).message);
   throw err;
  } finally {
   setLoading(false);
  }
 };

 // Delete outlet
 const deleteOutlet = async (id: string) => {
  try {
   setLoading(true);
   await deleteDoc(doc(db, "outlets", id));
  } catch (err) {
   setError((err as Error).message);
   throw err;
  } finally {
   setLoading(false);
  }
 };

 return {
  outlets,
  loading,
  error,
  addOutlet,
  updateOutlet,
  deleteOutlet,
 };
};
