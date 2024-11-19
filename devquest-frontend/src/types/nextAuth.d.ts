// types/next-auth.d.ts
import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    idToken?: string;
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      roles?: string[];  // Add 'roles' here as an array of strings
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    idToken?: string;
    roles?: string[]; // Add 'roles' here as well if you need it in JWT
  }
}
