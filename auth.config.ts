// auth.config.ts
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import dbConnect from '@/db/dbConnect'
import User from '@/db/models/user'

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null

          const { email, password } = credentials as {
            email?: unknown
            password?: unknown
          }

          if (typeof email !== 'string' || typeof password !== 'string') {
            return null
          }

          await dbConnect()

          const userDoc = await User.findOne({ email }).select('+password')
          if (!userDoc) return null
          if (typeof userDoc.password !== 'string') return null

          const isValidPassword = await bcrypt.compare(password, userDoc.password)
          if (!isValidPassword) return null

          const idString = userDoc._id?.toString()
          if (!idString) return null

          return {
            id: idString,
            email: userDoc.email,
            name: userDoc.nickname,
          }
        } catch (error) {
          console.error('NextAuth authorize error:', error)
          return null
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }) {
      if (session.user && typeof token.sub === 'string') {
        ;(session.user as { id?: string }).id = token.sub
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === 'development',
}
