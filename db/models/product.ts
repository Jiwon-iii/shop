import mongoose, { Schema, Types, InferSchemaType, Model } from 'mongoose'

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    category: { type: String, default: '' },
    stock: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: 'products',
  }
)

// 스키마에서 필드 타입만 추론 (name, price, description, ...)
type ProductSchemaType = InferSchemaType<typeof productSchema>

// 실제 MongoDB 문서 타입 (_id 포함)
export interface ProductDoc extends ProductSchemaType {
  _id: Types.ObjectId
}

// lean() 결과에 사용할 타입
export type ProductLean = ProductDoc

const Product: Model<ProductDoc> = mongoose.models.Product || mongoose.model<ProductDoc>('Product', productSchema)

export default Product
