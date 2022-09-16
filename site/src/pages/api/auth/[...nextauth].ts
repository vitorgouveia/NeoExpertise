import NextAuth, { NextAuthOptions } from 'next-auth'
import Discord from 'next-auth/providers/discord'

import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    Discord({
      clientId: '1014269173343473714',
      clientSecret: 'fcpsON9gRZqL65dEWa2kUuyIaK-YqWXv',
    }),
  ],
}

export default NextAuth(authOptions)
