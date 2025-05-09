// middleware.ts
import {NextRequest} from "next/server";
import {withAuth} from "./middlewares/withAuth";

export async function middleware(request: NextRequest) {
 return await withAuth(request);
}

export const config = {
 matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
