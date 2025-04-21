import mongoose, { Schema, Document, Types } from 'mongoose';
import User from './User';

export interface ProductType extends Document {
    ownerId: Types.ObjectId | string,
    name: string;
    description?: string;
    price: number;
    quantities: number;
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
        ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        quantities: { type: Number, required: true, default: 1 },
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

ProductSchema.index({ name: 'text' });
ProductSchema.index({ price: 1 });
ProductSchema.index({ name: 1, category: 1 });
ProductSchema.index({ price: 1, category: 1 });

export default mongoose.models.Product || mongoose.model<ProductType>('Product', ProductSchema);
