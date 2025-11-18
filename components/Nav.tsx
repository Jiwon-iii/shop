'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Nav() {
  const { data: session } = useSession()

  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      {/* 왼쪽 로고 */}
      <Link href="/" className="text-xl font-bold">
        MyShop
      </Link>

      {/* 오른쪽 메뉴 */}
      <div className="flex items-center gap-6">
        <Link href="/products">상품</Link>
        <Link href="/cart">장바구니</Link>

        {session ? (
          <>
            <span>{session.user?.email} 님</span>
            <button className="text-red-500" onClick={() => signOut({ callbackUrl: '/' })}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/login">로그인</Link>
            <Link href="/signup">회원가입</Link>
          </>
        )}
      </div>
    </nav>
  )
}
