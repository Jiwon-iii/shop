'use client'

import { useEffect, useState } from 'react'
import { getCart, removeFromCart, clearCart, updateCartQuantity, type CartItem } from '@/lib/cart'
import { Button } from '@/components/ui/button'

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setCart(getCart())
  }, [])

  const handleRemove = (id: string) => {
    removeFromCart(id)
    setCart(getCart())
  }

  const handleClear = () => {
    clearCart()
    setCart([])
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // 🔥 수량 증가
  const handleIncrease = (id: string, currentQuantity: number) => {
    const nextQuantity = currentQuantity + 1
    updateCartQuantity(id, nextQuantity)
    setCart(getCart())
  }

  // 🔥 수량 감소
  const handleDecrease = (id: string, currentQuantity: number) => {
    const nextQuantity = currentQuantity - 1
    updateCartQuantity(id, nextQuantity)
    setCart(getCart())
  }

  const handlePurchase = async () => {
    console.log('🛒 구매하기 버튼 클릭')
    if (cart.length === 0) {
      alert('장바구니가 비어 있습니다.')
      return
    }

    if (loading) return

    try {
      setLoading(true)
      alert('구매 요청을 보내는 중입니다...')

      const payload = {
        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        totalPrice,
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('📡 /api/orders 응답 status:', res.status)

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        console.error('❌ 주문 실패 응답:', data)
        alert('구매 중 오류가 발생했습니다.')
        return
      }

      const data = await res.json()
      console.log('✅ 주문 성공 응답:', data)

      clearCart()
      setCart([])
      alert('구매가 완료되었습니다.\n주문번호: ' + data.orderId)
    } catch (e) {
      console.error('❌ 구매 요청을 보내는 중 오류:', e)
      alert('구매 요청을 보내는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">장바구니</h1>

      {cart.length === 0 && <p className="text-sm text-neutral-500">장바구니가 비어 있습니다.</p>}

      <ul className="space-y-4">
        {cart.map((item) => (
          <li key={item.id} className="flex items-center gap-4 rounded-lg border p-4">
            <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-neutral-500">{item.price.toLocaleString()}원</p>

              {/*  수량 조절 UI */}
              <div className="mt-1 flex items-center gap-2 text-sm text-neutral-600">
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-sm"
                  onClick={() => handleDecrease(item.id, item.quantity)}
                >
                  -
                </button>
                <span className="min-w-[24px] text-center">{item.quantity}</span>
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-sm"
                  onClick={() => handleIncrease(item.id, item.quantity)}
                >
                  +
                </button>
              </div>
            </div>

            <Button size="sm" variant="destructive" onClick={() => handleRemove(item.id)}>
              삭제
            </Button>
          </li>
        ))}
      </ul>

      {cart.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="text-right text-lg font-bold">총 금액: {totalPrice.toLocaleString()}원</div>

          <Button className="w-full" variant="outline" onClick={handleClear}>
            장바구니 비우기
          </Button>

          <Button
            className="w-full bg-black text-white hover:bg-neutral-800"
            onClick={handlePurchase}
            disabled={loading}
          >
            {loading ? '구매 처리 중...' : '구매하기'}
          </Button>
        </div>
      )}
    </main>
  )
}
