import type {NextConfig} from "next";

const nextConfig: NextConfig = {
 /* config options here */
 images: {
  remotePatterns: [
   {
    protocol: "https",
    hostname: "drive.google.com",
    pathname: "/uc",
   },
   {
    protocol: "https",
    hostname: "*.public.blob.vercel-storage.com",
   },
  ],
 },
};

export default nextConfig;
