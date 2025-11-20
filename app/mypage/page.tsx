'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function MyPage() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <main className="mx-auto max-w-xl px-6 py-10">
        <p className="text-center text-neutral-500">로그인 후 이용해주세요.</p>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-blue-600 hover:underline">
            로그인 하러가기
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold">마이페이지</h1>

      <div className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
        <p className="text-sm">
          <span className="font-semibold">이메일: </span>
          {session.user.email}
        </p>

        <Link href="/orders">
          <Button className="w-full" variant="outline">
            구매 내역 보기
          </Button>
        </Link>

        <Button className="w-full" variant="destructive" onClick={() => signOut({ callbackUrl: '/' })}>
          로그아웃
        </Button>
      </div>
    </main>
  )
}
