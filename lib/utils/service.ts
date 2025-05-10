import {
 collection,
 doc,
 getDoc,
 getDocs,
 getFirestore,
 query,
 where,
} from "firebase/firestore";
import app from "../firebase/init";

const firestore = getFirestore(app);

interface User {
 id?: string;
 fullname: string;
 email: string;
 phone: string;
 password: string;
 role?: string;
 created_at?: Date;
 updated_at?: Date;
}

export async function retrieveData(collectionName: string) {
 const snapshot = await getDocs(collection(firestore, collectionName));
 return snapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
 }));
}

export async function retrieveDataById(
 collectionName: string,
 id: string
): Promise<User | null> {
 const snapshot = await getDoc(doc(firestore, collectionName, id));
 if (!snapshot.exists()) {
  return null;
 }
 return {
  id: snapshot.id,
  ...snapshot.data(),
 } as User;
}

export async function login(data: {email: string}): Promise<User | null> {
 const q = query(
  collection(firestore, "users"),
  where("email", "==", data.email)
 );
 const snapshot = await getDocs(q);
 const users = snapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
 })) as User[];

 return users.length > 0 ? users[0] : null;
}
