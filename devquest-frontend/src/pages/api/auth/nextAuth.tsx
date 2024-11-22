// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

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
    async jwt({ token, account }) {
      if (account) {
        if (typeof account.access_token === 'string') {
          token.accessToken = account.access_token;
        }
        if (typeof account.id_token === 'string') {
          token.idToken = account.id_token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      return session;
    },
  },
});
