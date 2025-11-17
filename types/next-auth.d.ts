// types/next-auth.d.ts
import type { DefaultSession } from 'next-auth'
import type { JWT as DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      userType?: 'normal' | 'admin'
    } & DefaultSession['user']
  }

  interface User {
    userType?: 'normal' | 'admin'
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    userType?: 'normal' | 'admin'
  }
}
