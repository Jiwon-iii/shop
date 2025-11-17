// db/models/user.ts
import { Schema, model, models } from 'mongoose'

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    nickname: { type: String, required: true },
    profile_image_url: { type: String, default: '' },
    user_type: { type: String, default: 'user' },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: 'user',
  }
)

const User = models.User || model('User', UserSchema)

export default User
