import { Timestamp } from "firebase/firestore";

export interface CareerApplication {
 id?: string;
 name: string;
 address: string;
 age: number;
 gender: string;
 whatsapp: string;
 email: string;
 instagram: string;
 cvUrl: string;
 careerId: string;
 careerTitle: string;
 agreedToTerms: boolean;
 createdAt?: Date | Timestamp;
}
