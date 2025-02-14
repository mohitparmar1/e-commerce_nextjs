import mongoose, { Document, Schema } from 'mongoose';

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
}

export interface Purchase extends Document {
    userId: string;
    productId: string;
    productName: string;
    productPrice: number;
    productDescription: string;
    purchaseDate: Date;
}
export interface Product extends Document {
    name: string;
    price: number;
    description: string;
}

const PurchaseSchema = new Schema<Purchase>({
    userId: {
        type: String, // Or mongoose.Schema.Types.ObjectId, depending on how you store user IDs
        required: true
    },
    productId: {
        type: String, // Or mongoose.Schema.Types.ObjectId
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    }
});

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

const Purchase =
    (mongoose.models.Purchase as mongoose.Model<Purchase>) ||
    mongoose.model<Purchase>('Purchase', PurchaseSchema);

export { User, Product, Purchase };