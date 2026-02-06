import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // This regex matches all paths EXCEPT static files, images, and the favicon
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
