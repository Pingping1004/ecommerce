import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/database";
import { getToken } from "next-auth/jwt";
import { SellerFormData } from "@/app/seller/register/page";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Models
import Seller from "@/models/Seller";
import User from "@/models/User";
import { NextRequest } from "next/server";

export const registerSeller = async (req: NextRequest, sellerFormData: SellerFormData) => {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) throw new Error("Please login first");

    await connectToDatabase();

    const user = await User.findOne({ email: token.email });
    if (!user) throw new Error("User not found");

    const existingSeller = await Seller.findOne({ userId: user._id });
    if (existingSeller) throw new Error("User already register as seller");

    if (!sellerFormData.businessEmail || !sellerFormData.phone || !sellerFormData.ownerName || 
        !sellerFormData.shopName || !sellerFormData.address || !sellerFormData.bankAccount) {
        throw new Error("All required fields must be completed");
    }

    const newSeller = new Seller({
        userId: user._id, // This will be the foreign key reference to User collection
        businessEmail: sellerFormData.businessEmail,
        phone: sellerFormData.phone,
        address: {
            houseNumber: sellerFormData.address.houseNumber,
            street: sellerFormData.address.street,
            district: sellerFormData.address.district,
            city: sellerFormData.address.city,
            country: sellerFormData.address.country,
            zipCode: sellerFormData.address.zipCode,
        },
        ownerName: sellerFormData.ownerName,
        shopName: sellerFormData.shopName,
        businessType: sellerFormData.businessType || "individual",
        bankAccount: {
            accountName: sellerFormData.bankAccount.accountName,
            accountNumber: sellerFormData.bankAccount.accountNumber,
            bankName: sellerFormData.bankAccount.bankName || "KBANK",
        },
        status: "pending",
    });

    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
        await newSeller.save({ session: dbSession });
        user.role = 'seller';
        await user.save({ session: dbSession });
        await dbSession.commitTransaction();
        console.log('Creating new seller: ', newSeller);
        console.log('User who register as seller: ', user);
        
        return newSeller;
    } catch (error) {
        await dbSession.abortTransaction();
        console.error('Seller registration failed:', error);
        throw new Error("Failed to register as seller. Please try again.");
    } finally {
        dbSession.endSession();
    }
};

export const isUserSeller = async (userId: string) => {
    const seller = await Seller.exists({ userId });
    return !!seller;
};

export const getSeller = async () => {
    try {
        await connectToDatabase();

        const sellers = await Seller.find({});
        console.log("All sellers: ", sellers);
        return sellers;
    } catch (error) {
        console.error("Failed to get sellers: ", error);
        throw new Error("Get all sellers failed");
    }
};
