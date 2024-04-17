import { prisma } from '../../../server/db'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { type NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },

  adapter: PrismaAdapter(prisma),
  providers: [],
}

export default NextAuth(authOptions)
