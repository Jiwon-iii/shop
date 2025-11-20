'use client'

import { useEffect, useState } from 'react'
import { getCart, removeFromCart, clearCart, type CartItem } from '@/lib/cart'
import { Button } from '@/components/ui/button'

export default function CartPage() {
  // 🔥 cart의 타입을 CartItem[]으로 명시
  const [cart, setCart] = useState<CartItem[]>([])

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
              <p className="text-sm text-neutral-500">수량: {item.quantity}</p>
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

          <Button className="w-full bg-black text-white hover:bg-neutral-800">구매하기</Button>
        </div>
      )}
    </main>
  )
}
