'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function Nav() {
  const { data: session } = useSession()

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      {/* 왼쪽 로고 */}
      <Link href="/" className="text-xl font-bold">
        MyShop
      </Link>

      {/* 오른쪽 메뉴들 */}
      <div className="flex items-center gap-4 text-sm">
        <Link href="//" className="hover:underline">
          상품
        </Link>

        <Link href="/cart" className="hover:underline">
          장바구니
        </Link>

        {/* 로그인 상태일 때 */}
        {session?.user ? (
          <div className="flex items-center gap-3">
            {/* 👇 여기: 이메일 클릭하면 /mypage 이동 */}
            <Link href="/mypage" className="font-medium text-blue-600 hover:underline">
              {session.user.email}
            </Link>

            <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
              로그아웃
            </Button>
          </div>
        ) : (
          // 로그아웃 상태일 때
          <>
            <Link href="/login" className="hover:underline">
              로그인
            </Link>
            <Link href="/signup" className="hover:underline">
              회원가입
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
