'use client'

// components/ProductCard.tsx
import { ProductDTO } from '@/types/product'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { addToCart } from '@/lib/cart'

type ProductCardProps = {
  product: ProductDTO
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleAddToCart = () => {
    addToCart(product)
    alert('장바구니에 담겼습니다.')
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* 이미지 */}
      <div className="relative aspect-[4/3] w-full bg-neutral-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            priority={false}
            sizes="(max-width: 768px) 100vw, 
                   (max-width: 1024px) 50vw, 
                   25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">이미지 준비 중</div>
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <span className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-400">
            {product.category}
          </span>
        )}

        <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900">{product.name}</h3>

        {product.description && <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{product.description}</p>}

        {/* 가격 + 버튼 (카드 하단 고정) */}
        <div className="mt-auto">
          <div className="mt-3 flex items-center justify-between gap-2">
            {/* 🔥 가격 수정된 부분 */}
            <div className="flex items-baseline gap-1 whitespace-nowrap">
              <span className="text-lg font-bold text-neutral-900">{product.price.toLocaleString()}</span>
              <span className="text-xs font-semibold text-neutral-700">원</span>
            </div>

            {/* 버튼 영역 */}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full px-3 py-1 text-[11px]">
                자세히 보기
              </Button>

              <Button size="sm" className="rounded-full px-3 py-1 text-[11px]" onClick={handleAddToCart}>
                장바구니
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
