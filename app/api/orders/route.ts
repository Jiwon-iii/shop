// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/db/dbConnect'
import Order from '@/db/models/order'

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

// 주문 생성
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderRequestBody
    const { items, totalPrice, userEmail } = body

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: '주문 상품이 없습니다.' }, { status: 400 })
    }

    await dbConnect()

    const order = await Order.create({
      userEmail: userEmail ?? '',
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      })),
      totalPrice,
    })

    return NextResponse.json({ ok: true, orderId: order._id.toString() }, { status: 201 })
  } catch (err) {
    console.error('POST /api/orders error', err)
    return NextResponse.json({ ok: false, message: '주문 생성 중 오류가 발생했습니다.' }, { status: 500 })
  }
}

// 주문 목록 조회 (구매 내역)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
  try {
    await dbConnect()

    const orders = await Order.find().sort({ createdAt: -1 }).lean()

    const mapped = orders.map((order) => ({
      id: order._id.toString(),
      userEmail: order.userEmail ?? '',
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : '',
      items: order.items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl ?? '',
      })),
    }))

    return NextResponse.json({ ok: true, orders: mapped }, { status: 200 })
  } catch (err) {
    console.error('GET /api/orders error', err)
    return NextResponse.json({ ok: false, message: '주문 목록 조회 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
