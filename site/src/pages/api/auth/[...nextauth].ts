import NextAuth, { NextAuthOptions } from 'next-auth'
import Discord from 'next-auth/providers/discord'
import Credentials from 'next-auth/providers/credentials'

import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: 'Email-and-Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'john.doe@gmail.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials, request) {
        try {
          const user = await prisma.user.findFirst({
            where: {
              email: credentials?.email,
            },
          })

          return {
            id: 0,
            name: 'vitor',
            email: 'vitor.gouveia@gmail.com',
          }
        } catch (error) {
          return null
        }
      },
    }),
    Discord({
      clientId: '1014269173343473714',
      clientSecret: 'fcpsON9gRZqL65dEWa2kUuyIaK-YqWXv',
    }),
  ],
}

export default NextAuth(authOptions)
