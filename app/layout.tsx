"use client";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layouts/Navbar";
import {SessionProvider} from "next-auth/react";
import {usePathname} from "next/navigation";
import Footer from "@/components/layouts/Footer";

const geistSans = Geist({
 variable: "--font-geist-sans",
 subsets: ["latin"],
});

const geistMono = Geist_Mono({
 variable: "--font-geist-mono",
 subsets: ["latin"],
});

const disableNavbar = [
 "/auth/login",
 "/auth/register",
 "/admin/dashboard",
 "/unauthorized",
 "/menu",
 "/promo",
];

const disableFooter = [
 "/auth/login",
 "/auth/register",
 "/admin/dashboard",
 "/unauthorized",
 "/menu",
 "/promo",
];

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 const pathname = usePathname();

 const showNavbar = !disableNavbar.some(
  (path) => pathname === path || pathname.startsWith(`${path}/`)
 );

 const showFooter = !disableFooter.some(
  (path) => pathname === path || pathname.startsWith(`${path}/`)
 );

 return (
  <html lang="en">
   <SessionProvider>
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
     {showNavbar && <Navbar />}
     {children}
     {showFooter && <Footer />}
    </body>
   </SessionProvider>
  </html>
 );
}
