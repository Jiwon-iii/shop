// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { dbConnect } from '@/db/dbConnect'
import { User } from '@/db/models/user'

interface SignupBody {
  email?: unknown
  password?: unknown
  nickname?: unknown
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const json = (await req.json()) as unknown

    // body 기본 형태 체크
    if (!json || typeof json !== 'object') {
      return NextResponse.json({ message: '잘못된 요청 형식입니다.' }, { status: 400 })
    }

    const { email, password, nickname } = json as SignupBody

    // 각 필드 타입 검사
    if (typeof email !== 'string' || typeof password !== 'string' || typeof nickname !== 'string') {
      return NextResponse.json({ message: 'email, password, nickname은 문자열이어야 합니다.' }, { status: 400 })
    }

    // 공백 문자열 방지 (조금 더 친절하게)
    if (!email.trim() || !password.trim() || !nickname.trim()) {
      return NextResponse.json({ message: 'email, password, nickname은 비어 있을 수 없습니다.' }, { status: 400 })
    }

    // 이미 가입된 이메일인지 확인
    const existingUser = await User.findOne({ email }).lean()
    if (existingUser) {
      return NextResponse.json({ message: '이미 가입된 이메일입니다.' }, { status: 409 })
    }

    // 비밀번호 해싱
    const passwordHash = await bcrypt.hash(password, 10)

    // 유저 생성
    await User.create({
      email,
      nickname,
      password: passwordHash,
      // userType, profileImageUrl 등은 스키마 기본값 사용
    })

    return NextResponse.json({ message: '회원가입 성공' }, { status: 201 })
  } catch (error) {
    // MongoDB unique 에러(이중 요청 등) 대응
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: unknown }).code === 11000
    ) {
      return NextResponse.json({ message: '이미 존재하는 이메일입니다.' }, { status: 409 })
    }

    console.error('Signup API error:', error)
    return NextResponse.json({ message: '서버 에러가 발생했습니다.' }, { status: 500 })
  }
}
