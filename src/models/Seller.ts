import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },
        businessEmail: {
            type: String,
            required: [true, "Business email is required"],
            unique: true,
            index: true,
        },
        phone: String,
        address: {
            houseNumber: String,
            street: String,
            district: String,
            city: String,
            country: String,
            zipCode: String,
        },
        ownerName: String,
        shopName: {
            type: String,
            required: true,
        },
        businessType: {
            type: String,
            enum: ["individual", "company"],
            default: "individual",
        },
        bankAccount: {
            accountName: String,
            accountNumber: String,
            bankName: {
                type: String,
                enum: ['KBANK', 'SCB', 'BBL'],
                default: "KBANK",
            },
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Add indexes for better query performance
sellerSchema.index({ userId: 1, businessEmail: 1 });

// Add pre-save middleware for validation
sellerSchema.pre('save', async function(next) {
    if (this.isNew) {
        const existingSeller = await mongoose.models.Seller?.findOne({
            $or: [
                { userId: this.userId },
                { businessEmail: this.businessEmail }
            ]
        });

        if (existingSeller) {
            throw new Error(
                existingSeller.businessEmail === this.businessEmail
                    ? "Business email already exists"
                    : "User is already registered as a seller"
            );
        }
    }
    next();
});

// Create or get the model
const Seller = mongoose.models.Seller || mongoose.model("Seller", sellerSchema);

export default Seller;
