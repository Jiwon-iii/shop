// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import dbConnect from '@/db/dbConnect'
import User from '@/db/models/user'

// ❗ v5 방식: NextAuth가 객체를 리턴하니까 구조 분해로 GET/POST 꺼내야 함
export const {
  handlers: { GET, POST }, // ← 여기서 GET, POST 추출
  auth,
  signIn,
  signOut,
} = NextAuth({
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
  // 개발 중엔 디버그 켜두면 에러 로그 잘 보임
  debug: process.env.NODE_ENV === 'development',
})
