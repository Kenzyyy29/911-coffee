import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth/auth-options";
import {doc, getDoc, getFirestore, updateDoc} from "firebase/firestore";
import {app} from "@/lib/firebase/init";
import bcrypt from "bcryptjs";

const firestore = getFirestore(app);

export async function PUT(request: Request) {
 try {
  const session = await getServerSession(authOptions);
  if (!session) {
   return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const {fullname, phone, currentPassword, newPassword} = await request.json();

  // Update profile data
  if (fullname || phone) {
   await updateDoc(doc(firestore, "users", session.user.id), {
    fullname,
    phone,
    updated_at: new Date(),
   });
  }

  // Change password if provided
  if (currentPassword && newPassword) {
   const userDoc = await getDoc(doc(firestore, "users", session.user.id));
   if (!userDoc.exists()) {
    return NextResponse.json({error: "User not found"}, {status: 404});
   }

   const user = userDoc.data();
   const isValid = await bcrypt.compare(currentPassword, user.password);
   if (!isValid) {
    return NextResponse.json(
     {error: "Current password is incorrect"},
     {status: 400}
    );
   }

   const hashedPassword = await bcrypt.hash(newPassword, 10);
   await updateDoc(doc(firestore, "users", session.user.id), {
    password: hashedPassword,
    updated_at: new Date(),
   });
  }

  return NextResponse.json({message: "Profile updated successfully"});
 } catch (error) {
  console.error("Error updating profile:", error);
  return NextResponse.json({error: "Failed to update profile"}, {status: 500});
 }
}
