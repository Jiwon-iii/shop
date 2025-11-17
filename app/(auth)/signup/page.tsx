// app/(auth)/signup/page.tsx
'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email.trim() || !nickname.trim() || !password.trim()) {
      setIsError(true)
      setMessage('모든 항목을 입력해주세요.')
      return
    }

    setIsLoading(true)
    setIsError(false)
    setMessage('')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nickname }),
      })

      const data = (await res.json()) as { message?: string }

      if (!res.ok) {
        setIsError(true)
        setMessage(data.message ?? '회원가입에 실패했습니다.')
        return
      }

      setMessage(data.message ?? '회원가입에 성공했습니다.')
      setEmail('')
      setNickname('')
      setPassword('')

      // 1~2초 정도 안내 문구를 보여주고 로그인 페이지로 이동하고 싶다면:
      setTimeout(() => {
        router.push('/auth/login')
      }, 1000)
    } catch (error) {
      console.error('Signup page error:', error)
      setIsError(true)
      setMessage('서버와 통신 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold text-neutral-900">회원가입</h1>
        <p className="mt-2 text-center text-sm text-neutral-500">
          쇼핑몰 서비스를 이용하려면 계정을 먼저 만들어주세요.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-neutral-800">
              이메일
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label htmlFor="nickname" className="mb-1 block text-sm font-medium text-neutral-800">
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              placeholder="사용할 닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-neutral-800">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              placeholder="8자 이상 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-500"
          >
            {isLoading ? '회원가입 중...' : '회원가입'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center text-sm ${isError ? 'text-red-500' : 'text-emerald-600'}`}>{message}</p>
        )}

        <p className="mt-6 text-center text-xs text-neutral-500">
          이미 계정이 있으신가요?{' '}
          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            className="font-semibold text-neutral-900 underline-offset-2 hover:underline"
          >
            로그인하기
          </button>
        </p>
      </section>
    </main>
  )
}
