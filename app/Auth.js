
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../prisma/prisma";

export const authOptions = {
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid;
        session.user.role = token.role
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  // pages: {
  //   signIn: '/login',
  // },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {

        
        //
        // Using Prisma to find the user in the database
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        const passwordCorrect = await compare(
          credentials?.password || '',
          user.password
        );

        console.log({ passwordCorrect });

        if (passwordCorrect) {
          return {
            id: user.id,
            email: user.email,
            role: user.role
          };
        }

        return null;
      },
    }),
  ],
}