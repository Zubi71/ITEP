import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import LinkedIn from "next-auth/providers/linkedin";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

// OAuth providers only register once real credentials are supplied via env
// vars — this lets the app run fine before those are configured, rather
// than crashing or showing a broken "Sign in with Google" button.
const providers: Provider[] = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      const email = typeof credentials?.email === "string" ? credentials.email : undefined;
      const password = typeof credentials?.password === "string" ? credentials.password : undefined;
      if (!email || !password) return null;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user?.passwordHash) return null;

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) return null;

      // Suspended accounts, and accounts still awaiting admin approval
      // (e.g. a self-signed-up teacher), can't sign in yet.
      if (user.status === "INACTIVE" || user.status === "PENDING") return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })
  );
}
if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    Facebook({ clientId: process.env.FACEBOOK_CLIENT_ID, clientSecret: process.env.FACEBOOK_CLIENT_SECRET })
  );
}
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  providers.push(
    LinkedIn({ clientId: process.env.LINKEDIN_CLIENT_ID, clientSecret: process.env.LINKEDIN_CLIENT_SECRET })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      // authorize() already enforces this for Credentials; OAuth sign-ins
      // skip authorize() entirely, so it needs enforcing here too.
      if (user.status === "INACTIVE" || user.status === "PENDING") return false;
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // session callback (id/role copying) is inherited from authConfig.callbacks
    // via the spread above — it must stay in the shared edge-safe config so
    // proxy.ts's separate NextAuth(authConfig) instance sees it too.
  },
});
