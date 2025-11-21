// lib/cart.ts
import type { ProductDTO } from '@/types/product'

export type CartItem = {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

const isBrowser = typeof window !== 'undefined'
const STORAGE_KEY = 'cart'

export function getCart(): CartItem[] {
  if (!isBrowser) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CartItem[]
  } catch {
    return []
  }
}

function saveCart(cart: CartItem[]) {
  if (!isBrowser) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
}

// 장바구니에 추가 (이미 있으면 quantity +1)
export function addToCart(product: ProductDTO) {
  if (!isBrowser) return

  if (!product._id) {
    console.error('장바구니 오류: product._id 없음', product)
    return
  }

  const cart = getCart()
  const existing = cart.find((item) => item.id === product._id)

  const safeImageUrl = product.imageUrl ?? ''

  let newCart: CartItem[]
  if (existing) {
    newCart = cart.map((item) => (item.id === product._id ? { ...item, quantity: item.quantity + 1 } : item))
  } else {
    const newItem: CartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: safeImageUrl,
      quantity: 1,
    }
    newCart = [...cart, newItem]
  }

  saveCart(newCart)
}

export function removeFromCart(id: string) {
  const cart = getCart()
  const newCart = cart.filter((item) => item.id !== id)
  saveCart(newCart)
}

export function clearCart() {
  saveCart([])
}

// 수량 변경 함수 (증가/감소 모두 이걸로 처리)
export function updateCartQuantity(id: string, quantity: number) {
  const cart = getCart()

  // 0 이하로 내려가면 삭제
  if (quantity <= 0) {
    const filtered = cart.filter((item) => item.id !== id)
    saveCart(filtered)
    return
  }

  const newCart = cart.map((item) => (item.id === id ? { ...item, quantity } : item))

  saveCart(newCart)
}
