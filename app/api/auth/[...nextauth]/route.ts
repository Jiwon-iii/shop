import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { dbConnect } from '@/db/dbConnect'
import { User } from '@/db/models/user'

function isUserType(value: unknown): value is 'normal' | 'admin' {
  return value === 'normal' || value === 'admin'
}

const handler = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        await dbConnect()

        const userDoc = await User.findOne({ email: credentials.email }).select('+password')
        if (!userDoc) {
          return null
        }

        if (typeof userDoc.password !== 'string') {
          return null
        }

        const passwordHash = userDoc.password as string

        const isValidPassword = await bcrypt.compare(credentials.password, passwordHash)
        if (!isValidPassword) {
          return null
        }

        const userType = isUserType(userDoc.userType) ? userDoc.userType : 'normal'

        return {
          id: userDoc._id.toString(),
          email: userDoc.email,
          name: userDoc.nickname,
          userType,
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user && 'userType' in user && isUserType(user.userType)) {
        token.userType = user.userType
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        if (typeof token.sub === 'string') {
          session.user.id = token.sub
        }
        if (isUserType(token.userType)) {
          session.user.userType = token.userType
        }
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
