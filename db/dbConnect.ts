// db/dbConnect.ts
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('⚠️ MONGODB_URI 환경 변수가 설정되지 않았습니다. .env.local을 확인하세요.')
}

// 전역 캐시 (Next.js hot reload 환경에서 중복 연결 방지용)
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const globalWithMongoose = global as typeof globalThis & {
  mongoose?: MongooseCache
}

let cached = globalWithMongoose.mongoose

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null }
}

export default async function dbConnect() {
  if (cached?.conn) {
    return cached.conn
  }

  if (!cached?.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI!).then((mongooseInstance) => mongooseInstance)
  }

  cached!.conn = await cached!.promise
  return cached!.conn
}
