// app/api/auth/register/route.ts
import {register} from "@/lib/utils/service";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
 try {
  const {fullname, email, phone, password} = await request.json();

  if (!fullname || !email || !phone || !password) {
   return NextResponse.json(
    {status: false, message: "All fields are required"},
    {status: 400}
   );
  }

  const response = await register({
   fullname,
   email,
   phone,
   password,
  });

  if (!response.status) {
   return NextResponse.json(
    {status: false, message: response.message},
    {status: response.statusCode}
   );
  }

  return NextResponse.json({
   status: true,
   message: "User registered successfully",
   data: response.data,
  });
 } catch (error) {
  return NextResponse.json(
   {status: false, message: "Internal server error"},
   {status: 500}
  );
 }
}
