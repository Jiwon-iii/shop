import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Nav from '@/components/Nav' // ⭐ Nav 추가
import { SessionProvider } from 'next-auth/react' // ⭐ 세션 공급자

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'My Shop',
  description: 'Shopping Project',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <Nav />
          <main className="mx-auto max-w-screen-xl px-6 py-6">{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}
