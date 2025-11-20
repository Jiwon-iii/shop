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
  } catch (e) {
    console.error('getCart error', e)
    return []
  }
}

function saveCart(cart: CartItem[]) {
  if (!isBrowser) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
}

export function addToCart(product: ProductDTO) {
  if (!isBrowser) return

  // ✅ 여기서 한 번 필터링해서 _id 없는 상품은 그냥 무시
  if (!product._id) {
    console.error('addToCart: _id가 없는 상품은 장바구니에 담을 수 없습니다.', product)
    return
  }

  const cart = getCart()
  const existing = cart.find((item) => item.id === product._id)

  const safeImageUrl = product.imageUrl ?? '' // undefined면 빈 문자열로 처리

  let newCart: CartItem[]
  if (existing) {
    newCart = cart.map((item) => (item.id === product._id ? { ...item, quantity: item.quantity + 1 } : item))
  } else {
    const newItem: CartItem = {
      id: product._id, // ✅ 위에서 _id 체크했으므로 이제 string으로 좁혀짐
      name: product.name,
      price: product.price,
      imageUrl: safeImageUrl, // ✅ string으로 확정
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
