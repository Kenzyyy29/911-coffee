// app/api/user/route.ts
import {NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import {retrieveDataById} from "@/lib/utils/service";
import {headers} from "next/headers";

export async function GET(request: Request) {
 try {
  const headersList = headers();
  const headersObject = Object.fromEntries(
   headersList as unknown as Iterable<readonly [string, string]>
  );

  const token = await getToken({
   req: {
    headers: headersObject,
    url: request.url,
    cookies: Object.fromEntries(
     request.headers
      .get("cookie")
      ?.split(";")
      .map((c) => c.trim().split("=")) || []
    ),
   } as any,
  });

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

  const {password, ...userData} = user;

  return NextResponse.json({
   status: true,
   data: userData,
  });
 } catch (error: any) {
  console.error("API Error:", error);
  return NextResponse.json(
   {
    status: false,
    message: "Internal server error",
    error: error.message,
   },
   {status: 500}
  );
 }
}
