import { Schema, model } from 'mongoose'

export const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        refreshToken: { type: String, default: null },
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
    }
)

export const User = model('user', userSchema)
