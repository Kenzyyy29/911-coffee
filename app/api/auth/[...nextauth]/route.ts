import NextAuth, {NextAuthOptions, DefaultSession} from "next-auth";
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

declare module "next-auth" {
 interface Session extends DefaultSession {
  user: {
   id: string;
   role?: string;
  } & DefaultSession["user"];
 }

 interface JWT {
  id?: string;
  role?: string;
 }
}

export const authOptions: NextAuthOptions = {
 providers: [
  CredentialsProvider({
   name: "Credentials",
   credentials: {
    email: {label: "Email", type: "email"},
    password: {label: "Password", type: "password"},
   },
   async authorize(credentials): Promise<User | null> {
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
     fullname: user.fullname,
     email: user.email,
     password: user.password,
     role: user.role || "member",
    };
   },
  }),
 ],
 callbacks: {
  async jwt({token, user}) {
   if (user) {
    token.id = user.id;
    token.role = (user as User).role;
   }
   return token;
  },
  async session({session, token}) {
   if (token && session.user) {
    session.user.id = token.id as string;
    session.user.role = token.role as string;
   }
   return session;
  },
  async redirect({url, baseUrl}) {
   if (url.startsWith("/")) return `${baseUrl}${url}`;
   else if (new URL(url).origin === baseUrl) return url;
   return baseUrl;
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
