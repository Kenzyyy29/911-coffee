import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "@/lib/firebase/init";
import bcrypt from "bcryptjs";

const firestore = getFirestore(app);

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId, fullname, phone, newPassword } = await request.json();

        // Validate user ID matches session
        if (userId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const updateData: any = {
            updated_at: new Date(),
        };

        // Update profile fields if provided
        if (fullname) updateData.fullname = fullname;
        if (phone) updateData.phone = phone;

        // Update password if provided
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateData.password = hashedPassword;
        }

        // Only update if there are changes
        if (Object.keys(updateData).length > 1) {
            await updateDoc(doc(firestore, "users", userId), updateData);
        }

        return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}