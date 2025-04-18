import mongoose, { Schema, Document } from "mongoose";

export interface SellerAddressType {
    houseNumber: string;
    street: string;
    district: string;
    city: string;
    country: string;
    zipCode: string;
}

export interface SellerType extends Document {
    // Personal info
    userId: mongoose.Schema.Types.ObjectId;
    businessEmail: string;
    password: string;
    confirmPassword: string;
    phone: string;
    // Address info
    address: SellerAddressType;
    // Shop info
    ownerName: string;
    shopName: string;
    businessType: "individual" | "company";
}

const SellerSchema = new Schema<SellerType>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        businessEmail: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        confirmPassword: { type: String, required: true },
        phone: { type: String, required: true },
        address: {
            houseNumber: { type: String, required: true },
            street: { type: String, required: true },
            district: { type: String, required: true },
            city: { type: String, required: true },
            country: { type: String, required: true },
            zipCode: { type: String, required: true },
        },
        ownerName: { type: String, required: true },
        shopName: { type: String, required: true },
        businessType: {
            type: String,
            enum: ["individual", "company"],
            default: "individual",
        },
    },
    { timestamps: true, collection: "Sellers" }
);

SellerSchema.pre<SellerType>('save', async function (next) {
    console.log('Pre-save hook triggered for Seller schema');

    if (this.password !== this.confirmPassword) {
        this.confirmPassword = this.password;
        next();
    }
});

export default mongoose.models?.['Seller'] ||
    mongoose.model<SellerType>('Seller', SellerSchema, 'Sellers');