// app/api/auth/signup/route.ts (예시)
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/db/dbConnect'
import User from '@/db/models/user'

export async function POST(req: NextRequest) {
  try {
    const { email, password, nickname } = await req.json()

    // 1) DB 연결
    await dbConnect()

    // 2) 중복 이메일 체크
    const exists = await User.findOne({ email })
    if (exists) {
      return NextResponse.json({ message: '이미 가입된 이메일입니다.' }, { status: 400 })
    }

    // 3) 비밀번호 해싱
    const hashed = await bcrypt.hash(password, 10)

    // 4) 유저 생성
    await User.create({
      email,
      password: hashed,
      nickname,
    })

    // 5) 응답
    return NextResponse.json({ message: '회원가입 성공' }, { status: 201 })
  } catch (error) {
    console.error('signup error:', error)
    return NextResponse.json({ message: '서버 에러 발생' }, { status: 500 })
  }
}
