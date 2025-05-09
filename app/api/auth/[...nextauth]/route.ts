// app/api/auth/[...nextauth]/route.ts
import NextAuth, {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {login} from "@/lib/utils/service";
import bcrypt from "bcryptjs";

interface User {
 id: string;
 fullname: string;
 email: string;
 password: string;
 phone?: string;
 role?: string;
 created_at?: Date;
 updated_at?: Date;
}

export const authOptions: NextAuthOptions = {
 providers: [
  CredentialsProvider({
   name: "Credentials",
   credentials: {
    email: {label: "Email", type: "email"},
    password: {label: "Password", type: "password"},
   },
   async authorize(credentials): Promise<any> {
    if (!credentials?.email || !credentials?.password) {
     return null;
    }

    const user = (await login({email: credentials.email})) as User | null;
    if (!user) {
     return null;
    }

    const isValid = await bcrypt.compare(credentials.password, user.password);

    if (!isValid) {
     return null;
    }

    return {
     id: user.id,
     name: user.fullname,
     email: user.email,
     role: user.role || "member",
    };
   },
  }),
 ],
 callbacks: {
  async redirect({url, baseUrl}: {url: string; baseUrl: string}) {
   if (url.startsWith("/")) return `${baseUrl}${url}`;
   else if (new URL(url).origin === baseUrl) return url;
   return baseUrl;
  },
  jwt: async ({token, user}: any) => {
   if (user) {
    token.id = user.id;
    token.role = user.role;
   }
   return token;
  },
  session: async ({session, token}: any) => {
   if (token) {
    session.user.id = token.id;
    session.user.role = token.role;
   }
   return session;
  },
 },
 pages: {
  signIn: "/auth/login",
  newUser: "/auth/register",
 },
 secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
