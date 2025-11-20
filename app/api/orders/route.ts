// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'

type OrderItemInput = {
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl: string
}

type OrderRequestBody = {
  items: OrderItemInput[]
  totalPrice: number
  userEmail?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderRequestBody

    console.log('📦 /api/orders 요청 바디:', body)

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ ok: false, message: '주문 상품이 없습니다.' }, { status: 400 })
    }

    const fakeOrderId = 'dummy-' + Date.now().toString()

    return NextResponse.json({ ok: true, orderId: fakeOrderId, totalPrice: body.totalPrice }, { status: 201 })
  } catch (err) {
    console.error('❌ /api/orders 라우트 에러:', err)
    return NextResponse.json({ ok: false, message: '주문 생성 중 서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
