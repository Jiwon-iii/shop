// db/dbConnect.ts
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  // 여기서 한 번 체크해서 없으면 바로 에러 던짐
  throw new Error('❌ MONGODB_URI가 .env에 설정되어 있지 않습니다.')
}

// 글로벌 캐시 타입 정의
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// globalThis에 mongoose 캐시 올리기
const globalWithMongoose = global as typeof globalThis & {
  mongoose?: MongooseCache
}

let cached = globalWithMongoose.mongoose

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null }
}

export default async function dbConnect(): Promise<typeof mongoose> {
  // 이미 연결되어 있으면 그거 재사용
  if (cached!.conn) {
    return cached!.conn
  }

  // 아직 연결 시도 중인 게 없으면 새로 연결 시도
  if (!cached!.promise) {
    console.log('🟢 MongoDB 최초 연결 시도...')
    cached!.promise = mongoose.connect(MONGODB_URI, {
      // mongoose v7 이상이면 기본 옵션으로도 충분함
      // 필요하면 여기 옵션 추가 가능
      // serverSelectionTimeoutMS: 30000, 등
    })
  }

  try {
    cached!.conn = await cached!.promise
    console.log('✅ MongoDB 연결 성공')
  } catch (err) {
    // 실패하면 다음 요청에서 다시 시도할 수 있도록 초기화
    cached!.promise = null
    console.error('❌ MongoDB 연결 실패:', err)
    throw err
  }

  return cached!.conn
}
