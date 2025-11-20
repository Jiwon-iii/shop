// components/ProductCard.tsx
import { ProductDTO } from '@/types/product'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

type ProductCardProps = {
  product: ProductDTO
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* 이미지 영역 : 모든 카드 공통 4:3 비율 + object-cover */}
      <div className="relative aspect-[4/3] w-full bg-neutral-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority={false}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">이미지 준비 중</div>
        )}
      </div>

      {/* 텍스트 영역 전체를 flex-1로 잡아서, footer를 항상 맨 아래로 */}
      <div className="flex flex-1 flex-col p-4">
        {product.category ? (
          <span className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-400">
            {product.category}
          </span>
        ) : null}

        <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900">{product.name}</h3>

        {product.description ? (
          <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{product.description}</p>
        ) : null}

        {/* 아래 영역을 항상 카드 맨 아래로 보내기 위해 mt-auto */}
        <div className="mt-auto">
          <div className="mt-3 flex items-center justify-between">
            <span className="text-base font-bold text-neutral-900">{product.price.toLocaleString()}원</span>
            <Button size="sm" variant="outline" className="rounded-full px-3 py-1 text-[11px]" type="button">
              자세히 보기
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
