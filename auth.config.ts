// auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login", // We will build this page later
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdminPanel = nextUrl.pathname.startsWith("/admin");

      if (isOnAdminPanel) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      // Allow access to all other routes
      return true;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
