import { ProductDTO } from '@/types/product'

type ProductCardProps = {
  product: ProductDTO
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-3 aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-100">
        {product.imageUrl ? (
          // 필요하면 나중에 next/image로 교체
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">이미지 준비 중</div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        {product.category ? (
          <span className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-400">
            {product.category}
          </span>
        ) : null}

        <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900">{product.name}</h3>

        {product.description ? (
          <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{product.description}</p>
        ) : null}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-bold text-neutral-900">{product.price.toLocaleString()}원</span>
          <button className="rounded-full border border-neutral-200 px-3 py-1 text-[11px] font-medium hover:bg-neutral-100">
            자세히 보기
          </button>
        </div>
      </div>
    </article>
  )
}
