import {NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {retrieveDataById} from "@/lib/utils/service";
import {NextRequest} from "next/server";

interface UserResponse {
 status: boolean;
 data?: {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  role?: string;
 };
 message?: string;
}

export async function GET(request: NextRequest) {
 try {
  const token = await getToken({req: request});

  if (!token) {
   return NextResponse.json(
    {status: false, message: "Unauthorized"},
    {status: 401}
   );
  }

  const user = await retrieveDataById("users", token.id as string);

  if (!user) {
   return NextResponse.json(
    {status: false, message: "User not found"},
    {status: 404}
   );
  }

  const userData = Object.fromEntries(
   Object.entries(user).filter(([key]) => key !== "password")
  );

  return NextResponse.json({
   status: true,
   data: userData,
  } as UserResponse);
 } catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  console.error("API Error:", errorMessage);
  return NextResponse.json(
   {
    status: false,
    message: "Internal server error",
   },
   {status: 500}
  );
 }
}