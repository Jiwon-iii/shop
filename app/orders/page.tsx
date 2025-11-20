'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type OrderItem = {
  name: string
  price: number
  quantity: number
  imageUrl: string
}

type OrderSummary = {
  id: string
  userEmail: string
  totalPrice: number
  status: string
  createdAt: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch('/api/orders', { method: 'GET' })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          console.error('❌ 주문 목록 응답 오류:', data)
          setError('주문 목록을 불러오는 중 오류가 발생했습니다.')
          return
        }

        const data = (await res.json()) as { ok: boolean; orders: OrderSummary[] }
        setOrders(data.orders)
      } catch (e) {
        console.error('❌ 주문 목록 요청 오류:', e)
        setError('주문 목록을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">구매 내역</h1>
        <Link href="/">
          <Button size="sm" variant="outline">
            상품 보러가기
          </Button>
        </Link>
      </div>

      {loading && <p className="text-sm text-neutral-500">불러오는 중...</p>}

      {error && !loading && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="text-sm text-neutral-500">아직 구매 내역이 없습니다.</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <section key={order.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">
                  주문번호: <span className="font-mono text-xs">{order.id}</span>
                </p>
                <p className="text-xs text-neutral-500">
                  주문일시:{' '}
                  {new Date(order.createdAt).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  총 금액: <span className="text-base font-bold">{order.totalPrice.toLocaleString()}원</span>
                </p>
                <p className="text-xs text-neutral-500">상태: {order.status}</p>
              </div>
            </div>

            <ul className="space-y-2 border-t pt-3 text-sm">
              {order.items.map((item, index) => (
                <li key={`${order.id}-${index}`} className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-md bg-neutral-100">
                    {item.imageUrl ? (
                      // 구매 내역은 대충 img로만 (성능 크게 상관없음)
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-neutral-500">
                      {item.price.toLocaleString()}원 × {item.quantity}개
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
