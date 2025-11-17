'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      setIsError(true)
      setMessage('이메일과 비밀번호를 모두 입력해주세요.')
      return
    }

    setIsLoading(true)
    setIsError(false)
    setMessage('')

    try {
      const res = await signIn('credentials', {
        redirect: false, // ⚠️ 이거 꼭 유지
        email,
        password,
      })

      console.log('signIn result:', res)

      if (!res) {
        setIsError(true)
        setMessage('알 수 없는 오류가 발생했습니다.')
        return
      }

      if (res.error) {
        setIsError(true)
        setMessage('이메일 또는 비밀번호가 올바르지 않습니다.')
        return
      }

      // 로그인 성공
      setIsError(false)
      setMessage('로그인에 성공했습니다.')
      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
      setIsError(true)
      setMessage('서버와 통신 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold text-neutral-900">로그인</h1>
        <p className="mt-2 text-center text-sm text-neutral-500">가입한 이메일과 비밀번호로 로그인해주세요.</p>

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
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-neutral-800">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              placeholder="비밀번호를 입력하세요"
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
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center text-sm ${isError ? 'text-red-500' : 'text-emerald-600'}`}>{message}</p>
        )}

        <p className="mt-6 text-center text-xs text-neutral-500">
          아직 회원이 아니신가요?{' '}
          <button
            type="button"
            onClick={() => router.push('/signup')}
            className="font-semibold text-neutral-900 underline-offset-2 hover:underline"
          >
            회원가입하기
          </button>
        </p>
      </section>
    </main>
  )
}
