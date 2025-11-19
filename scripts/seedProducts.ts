// scripts/seedProducts.ts

// 1) .env.local 읽어오기
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' }) // MONGODB_URI 여기에서 가져옴

// 2) 나머지 기존 코드
import dbConnect from '../db/dbConnect'
import Product from '../db/models/product'

async function seedProducts() {
  try {
    await dbConnect()

    console.log('🗑 기존 products 컬렉션 비우는 중...')
    await Product.deleteMany({})

    console.log('🛒 테스트 상품 데이터 삽입 중...')

    const products = [
      {
        name: '프레피 하우스 플리스 자켓',
        price: 59000,
        description: '포근한 프레피 무드 플리스 자켓입니다.',
        imageUrl: 'https://picsum.photos/seed/fleece01/600/800',
        category: 'Outer',
        stock: 10,
      },
      {
        name: '체크 스카프 레이어드 니트',
        price: 39000,
        description: '체크 스카프가 레이어드된 포인트 니트입니다.',
        imageUrl: 'https://picsum.photos/seed/knit01/600/800',
        category: 'Knit',
        stock: 15,
      },
      {
        name: '모던 스트레이트 슬랙스',
        price: 42000,
        description: '데일리로 입기 좋은 베이직 스트레이트 슬랙스.',
        imageUrl: 'https://picsum.photos/seed/pants01/600/800',
        category: 'Pants',
        stock: 20,
      },
    ]

    await Product.insertMany(products)

    console.log('🎉 테스트 상품 데이터 삽입 완료!')
    process.exit(0)
  } catch (err) {
    console.error('❌ 시드 작업 중 오류 발생', err)
    process.exit(1)
  }
}

seedProducts()
