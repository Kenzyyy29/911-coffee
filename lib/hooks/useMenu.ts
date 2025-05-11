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
import {Menu} from "@/lib/types/menu";

export const useMenu = (outletId: string) => {
 const [menus, setMenus] = useState<Menu[]>([]);
 const [loading, setLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!outletId) {
            setMenus([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const q = query(
            collection(db, "menus"),
            where("outletId", "==", outletId),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                try {
                    const menusData: Menu[] = [];
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        menusData.push({
                            id: doc.id,
                            name: data.name,
                            description: data.description,
                            price: data.price,
                            taxIds: data.taxIds || [], // Changed to handle array
                            outletId: data.outletId,
                            imageUrl: data.imageUrl || "",
                            isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
                            createdAt: data.createdAt || new Date().toISOString(),
                        });
                    });
                    setMenus(menusData);
                    setError(null);
                } catch (err) {
                    console.error("Error processing menu data:", err);
                    setError("Failed to process menu data");
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

 const addMenu = async (menuData: Omit<Menu, "id" | "createdAt">) => {
  try {
   setLoading(true);
   const docRef = await addDoc(collection(db, "menus"), {
    ...menuData,
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

 const updateMenu = async (id: string, menuData: Partial<Menu>) => {
  try {
   setLoading(true);
   await updateDoc(doc(db, "menus", id), menuData);
  } catch (err) {
   setError((err as Error).message);
   throw err;
  } finally {
   setLoading(false);
  }
 };

 const deleteMenu = async (id: string) => {
  try {
   setLoading(true);
   await deleteDoc(doc(db, "menus", id));
  } catch (err) {
   setError((err as Error).message);
   throw err;
  } finally {
   setLoading(false);
  }
 };

 return {
  menus,
  loading,
  error,
  addMenu,
  updateMenu,
  deleteMenu,
 };
};
