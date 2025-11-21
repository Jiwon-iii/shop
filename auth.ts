// auth.ts
import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'

// 서버 구성 요소와 server action에서 사용할 auth, signIn, signOut
export const { auth, signIn, signOut } = NextAuth(authConfig)
