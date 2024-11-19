// src/pages/api/auth/[...nextauth].ts
import NextAuth, { Session } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { JWT } from 'next-auth/jwt';
import prisma from '../../../../lib/prisma';

export default NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account?.id_token) {
        return false;
      }

      try {
        // Get or create user in database
        const dbUser = await prisma.user.upsert({
          where: { keycloakId: user.id },
          update: {},
          create: {
            keycloakId: user.id,
            username: user.name ?? '',
            email: user.email ?? '',
          },
        });

        // Check if 2FA is enabled
        const twoFactor = await prisma.twoFactorAuth.findFirst({
          where: { 
            userId: dbUser.id,
            isEnabled: true 
          },
        });

        if (twoFactor) {
          return `/auth/verify-2fa?userId=${dbUser.id}`;
        }

        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },

    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },

    async session({ session, token }): Promise<Session> {
      return {
        ...session,
        accessToken: token.accessToken,
        idToken: token.idToken,
      };
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
});