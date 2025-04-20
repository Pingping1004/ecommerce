import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/database";
import { getToken } from "next-auth/jwt";
import { SellerFormData } from "@/components/seller/Form";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Models
import Seller from "@/models/Seller";
import User from "@/models/User";
import { NextRequest } from "next/server";

export const registerSeller = async (
    req: NextRequest,
    sellerFormData: SellerFormData
) => {
    let dbSession;
    try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });
        if (!token) throw new Error("Please login first");

        await connectToDatabase();
        console.log("Connected to database");

        const user = await User.findOne({ email: token.email });
        if (!user) throw new Error("User not found");

        // Validate required fields
        if (
            !sellerFormData.businessEmail ||
            !sellerFormData.shopName ||
            !sellerFormData.bankAccount?.accountNumber
        ) {
            throw new Error("Missing required fields");
        }

        dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        const newSeller = new Seller({
            ...sellerFormData,
            userId: user._id,
            status: "pending",
        });

        console.log("Attempting to save seller:", newSeller);
        await newSeller.save({ session: dbSession });

        user.role = "seller";
        console.log(
            "User who register as seller: ",
            "name: ",
            user.username,
            "role: ",
            user.role
        );
        await user.save({ session: dbSession });

        await dbSession.commitTransaction();
        console.log("Seller registration successful");

        return newSeller;
    } catch (error: any) {
        console.error("Register seller error:", error);
        if (dbSession) {
            await dbSession.abortTransaction();
        }
        throw error;
    } finally {
        if (dbSession) {
            await dbSession.endSession();
        }
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

export const getSellerById = async (userId: string) => {
    try {
        await connectToDatabase();

        const seller = await Seller.findOne({ userId });
        console.log("Finding seller: ", seller);

        return seller;
    } catch (error) {
        console.error("Failed to find seller: ", error);
        throw new Error("Failed to find seller");
    }
};

export const updateSellerStatus = async (status: string, userId: string) => {
    if (!userId) throw new Error("User ID is required");
    if (!status) throw new Error("Status is required");

    try {
        await connectToDatabase();

        const updatedSeller = await getSellerById(userId);
        updatedSeller.status = status;
        await updatedSeller.save();
        console.log('Updaing seller:', updatedSeller.ownerName, " to status: ", updatedSeller.status);

        return updatedSeller;
    } catch (error) {
        console.error("Update seller status error:", error);
        throw error;
    }
};
