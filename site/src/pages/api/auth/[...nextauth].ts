import NextAuth, { NextAuthOptions } from 'next-auth'
import { compare } from 'bcrypt'

import Discord from 'next-auth/providers/discord'
import Github from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  secret: process.env.JWT_SECRET!,
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: 'neoexpertise',
      type: 'credentials',
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
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = await prisma.user.findFirst({
          where: {
            email: credentials?.email,
          },
        })

        if (!user) {
          return null
        }

        const passwordMatch = await compare(
          credentials?.password!,
          user.password
        )

        if (!passwordMatch) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
}

export default NextAuth(authOptions)
