// middleware/withAuth.ts
import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

export async function withAuth(req: NextRequest) {
 const pathname = req.nextUrl.pathname;
 const token = await getToken({req});

 // Paths that should redirect to login if not authenticated
 const protectedPaths = ["/dashboard", "/admin", "/admin/dashboard"];

 // Auth paths that should redirect to admin dashboard if already authenticated
 const authPaths = ["/auth/login"];

 // Redirect authenticated users away from auth pages
 if (token && authPaths.some((path) => pathname.startsWith(path))) {
  const url = req.nextUrl.clone();
  url.pathname = "/admin/dashboard";
  return NextResponse.redirect(url);
 }

 // Redirect unauthenticated users from protected pages to login
 if (!token && protectedPaths.some((path) => pathname.startsWith(path))) {
  const url = req.nextUrl.clone();
  url.pathname = "/auth/login";
  url.searchParams.set("callbackUrl", "/admin/dashboard");
  return NextResponse.redirect(url);
 }

 // Redirect all /dashboard and /admin access to /admin/dashboard
if (pathname.startsWith("/dashboard") || pathname === "/admin") {
 const url = req.nextUrl.clone();
 url.pathname = "/admin/dashboard";
 return NextResponse.redirect(url);
}

if (pathname === "/auth/register") {
 const url = req.nextUrl.clone();
 url.pathname = "/auth/login";
 return NextResponse.redirect(url);
}

 return NextResponse.next();
}
