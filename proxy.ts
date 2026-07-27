import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/exams/:path*",
    "/exam/:path*",
    "/results/:path*",
    "/study/:path*",
    "/courses/:path*",
    "/admin/:path*",
    "/teacher/:path*",
  ],
};
