import dbConnect from '@/db/dbConnect'
import Product, { ProductLean } from '@/db/models/product'
import ProductCard from '@/components/ProductCard'
import { ProductDTO } from '@/types/product'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  await dbConnect()

  // MongoDB에서 상품 목록 가져오기
  const rawProducts = await Product.find().sort({ createdAt: -1 }).lean<ProductLean[]>()

  // DB 타입(ProductLean) → 화면용 타입(ProductDTO)으로 변환
  const products: ProductDTO[] = rawProducts.map((p: ProductLean) => ({
    _id: p._id.toString(),
    name: p.name,
    price: p.price,
    description: p.description ?? '',
    imageUrl: p.imageUrl ?? '',
    category: p.category ?? '',
  }))

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">상품 목록</h1>
        <p className="mt-2 text-sm text-neutral-500">지금 등록된 상품을 확인해 보세요.</p>
      </section>

      {products.length === 0 ? (
        <p className="rounded-xl bg-neutral-50 p-6 text-center text-sm text-neutral-500">
          아직 등록된 상품이 없습니다. 테스트용 상품 데이터를 먼저 추가해 보세요.
        </p>
      ) : (
        <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </section>
      )}
    </main>
  )
}
