import { NextResponse } from 'next/server';
import { db } from "@/lib/firebase/init";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export async function GET() {
    try {
        const q = query(
            collection(db, "menus"),
            orderBy("clickCount", "desc"),
            limit(10)
        );

        const snapshot = await getDocs(q);
        const popularMenus = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(popularMenus);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch popular menus" },
            { status: 500 }
        );
    }
}