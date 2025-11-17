// app/mypage/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

export default function MyPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  // 로그인 안 했으면 /login으로 보내기
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-100">
        <p className="text-sm text-neutral-600">세션 확인 중...</p>
      </main>
    )
  }

  if (status === 'unauthenticated') {
    // 위 useEffect에서 이미 /login으로 보내고 있어서
    // 여기선 그냥 빈 화면만 잠깐 보여줘도 됨.
    return null
  }

  // 여기까지 오면 로그인된 상태
  const userEmail = session?.user?.email ?? ''
  const userId = session?.user?.id ?? ''
  const userType = session?.user?.userType ?? 'normal'

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-neutral-900">마이페이지</h1>
        <p className="mt-1 text-sm text-neutral-500">현재 로그인 중인 계정 정보입니다.</p>

        <div className="mt-6 space-y-2 text-sm text-neutral-800">
          <p>
            <span className="font-medium">이메일:</span> {userEmail}
          </p>
          <p>
            <span className="font-medium">사용자 ID:</span> {userId}
          </p>
          <p>
            <span className="font-medium">권한:</span> {userType}
          </p>
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="mt-8 w-full rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          로그아웃
        </button>
      </section>
    </main>
  )
}
