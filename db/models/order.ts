// db/models/order.ts
import mongoose, { Schema, Types, InferSchemaType, Model } from 'mongoose'

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String, default: '' },
  },
  { _id: false }
)

const orderSchema = new Schema(
  {
    // 나중에 NextAuth랑 연동해서 userId/userEmail 넣기 쉽게 필드 준비
    userEmail: { type: String, default: '' },

    items: { type: [orderItemSchema], required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'PAID' }, // 간단히 결제완료만
  },
  {
    timestamps: true,
    collection: 'orders',
  }
)

type OrderSchemaType = InferSchemaType<typeof orderSchema>

export interface OrderDoc extends OrderSchemaType {
  _id: Types.ObjectId
}

export type OrderLean = OrderDoc

const Order: Model<OrderDoc> = mongoose.models.Order || mongoose.model<OrderDoc>('Order', orderSchema)

export default Order
