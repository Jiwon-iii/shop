export type ProductDTO = {
  _id: string // 필수로 변경
  name: string
  price: number
  imageUrl: string // 필수로 변경
  description?: string
  category?: string
  stock?: number
}
