import type { NextAuthConfig } from "next-auth";

const PROTECTED_PREFIXES = ["/dashboard", "/exams", "/exam", "/results", "/study", "/courses"];
const ADMIN_PREFIXES = ["/admin"];

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

      const isAdminRoute = ADMIN_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
      );
      if (isAdminRoute) {
        // Role is already on the decoded JWT, so this needs no DB call.
        return auth?.user?.role === "ADMIN";
      }

      const isProtected = PROTECTED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
      );
      if (!isProtected) return true;
      return !!auth?.user;
    },
    // This must live here (not only in lib/auth.ts) because proxy.ts uses a
    // SEPARATE NextAuth(authConfig) instance for edge gating — if this
    // session callback only existed on the full config, the edge instance's
    // decoded `auth.user` would never get `role` copied onto it, and
    // admin-route gating above would always see `role` as undefined.
    async session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
        const role = token.role as "STUDENT" | "TEACHER" | "ADMIN" | undefined;
        session.user.role = role ?? "STUDENT";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
