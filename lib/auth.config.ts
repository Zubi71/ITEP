import type { NextAuthConfig } from "next-auth";

const PROTECTED_PREFIXES = ["/dashboard", "/exams", "/exam", "/results", "/study", "/courses"];

// Edge-safe config: no Prisma adapter, no Credentials provider (both need
// Node.js APIs). This is the only part of the auth config that middleware
// (which runs on the Edge runtime) is allowed to import.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isProtected = PROTECTED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
      );
      if (!isProtected) return true;
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
