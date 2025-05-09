// /lib/utils/service.ts
import {
 addDoc,
 collection,
 doc,
 getDoc,
 getDocs,
 getFirestore,
 query,
 where,
} from "firebase/firestore";
import bcrypt from "bcryptjs";
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
 const data = snapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
 }));
 return data;
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

export async function register(data: {
 fullname: string;
 email: string;
 phone: string;
 password: string;
 role?: string;
 created_at?: Date;
 updated_at?: Date;
}) {
 const q = query(
  collection(firestore, "users"),
  where("email", "==", data.email)
 );
 const snapshot = await getDocs(q);
 const users = snapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
 }));

 if (users.length > 0) {
  return {
   status: false,
   statusCode: 400,
   message: "Email already exists",
  };
 } else {
  data.role = data.role || "member"; // Default role should be member, not admin
  data.password = await bcrypt.hash(data.password, 10);
  data.created_at = new Date();
  data.updated_at = new Date();
  try {
   const docRef = await addDoc(collection(firestore, "users"), data);
   return {
    status: true,
    statusCode: 200,
    message: "User registered successfully",
    data: {
     id: docRef.id,
     ...data,
     password: undefined, // Remove password from response
    },
   };
  } catch (error) {
   return {status: false, statusCode: 500, message: "Something went wrong"};
  }
 }
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

export async function getUserByEmail(email: string) {
 const q = query(collection(firestore, "users"), where("email", "==", email));
 const snapshot = await getDocs(q);
 const users = snapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
 }));

 return users.length > 0 ? users[0] : null;
}
