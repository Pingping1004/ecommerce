import mongoose, { Schema, Document } from 'mongoose';
import User from './User';

export interface ProductType extends Document {
    user: typeof User,
    name: string;
    description?: string;
    price: number;
    category?:
        | "Apparel"
        | "Electronics"
        | "Home"
        | "Beauty&Health"
        | "Sports"
        | "Books"
        | "Toys"
        | "N/A";
}

const ProductSchema = new Schema<ProductType>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        category: {
            type: String,
            enum: [
                'Apparel',
                'Electronics',
                'Home',
                'Beauty&Health',
                'Sports',
                'Books',
                'Toys',
                'N/A',
            ],
            default: 'N/A',
        },
    },
    { timestamps: true, collection: 'Products' }
)

export default mongoose.models.Product || mongoose.model<ProductType>('Product', ProductSchema);
