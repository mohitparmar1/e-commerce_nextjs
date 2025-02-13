import mongoose, { Document, Schema } from 'mongoose';

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
}
export interface Product extends Document {
    name: string;
    price: number;
    description: string;
}

const userSchema = new Schema<User>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: 'user',
    }
});
const ProductSchema = new Schema<Product>({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

const User =
    (mongoose.models.User as mongoose.Model<User>) ||
    mongoose.model<User>('User', userSchema);

const Product = (mongoose.models.Product as mongoose.Model<Product>) || mongoose.model<Product>('Product', ProductSchema)
export { User, Product };