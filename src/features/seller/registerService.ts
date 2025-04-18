import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/database"
import { NextRequest, NextResponse } from "next/server"
import { Types } from "mongoose"
import { SellerFormData } from "@/app/seller/register/page"
import { SellerType } from "@/models/Seller"
import Seller from "@/models/Seller"
import User from "@/models/User"

export const sellerRegister = async (userId: string, sellerFormData: Partial<SellerFormData>) => {
    await connectToDatabase();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (!sellerFormData.businessEmail) throw new Error('Email is reuired');
        if (!sellerFormData.password) throw new Error('Password is required');

        const existingSeller = await Seller.findOne({ userId }).session(session);
        if (existingSeller) throw new Error('User already registered as a seller');

        const hashPassword = await bcrypt.hash(sellerFormData.password, 12);
        const newSeller = new Seller([{
            userId: new Types.ObjectId((sellerFormData as SellerFormData & { userId: string }).userId) as any,
            businessEmail: sellerFormData.businessEmail,
            password: hashPassword,
            confirmPassword: hashPassword,
            phone: sellerFormData.phone ?? "",
            address: {
                houseNumber: sellerFormData.address?.houseNumber ?? "",
                street: sellerFormData.address?.street ?? "",
                district: sellerFormData.address?.district ?? "",
                city: sellerFormData.address?.city ?? "",
                country: sellerFormData.address?.country ?? "",
                zipCode: sellerFormData.address?.zipCode ?? ""
            },
            ownerName: sellerFormData.ownerName ?? "",
            shopName: sellerFormData.shopName ?? "",
            businessType: sellerFormData.businessType ?? "individual",
        }], { session });

        const updatedRoleUser = await User.findByIdAndUpdate(
            userId,
            { role: 'seller' },
            { session }
        );

        const newSellerData = new Seller(newSeller);
        await newSellerData.save();
        await updatedRoleUser.save();

        await session.commitTransaction();

        console.log('New seller registered: ', newSellerData);
        console.log('User role updated: ', updatedRoleUser);
        
        return NextResponse.json(newSellerData, { status: 201 });
    } catch (error) {
        console.error('Error in sellerRegisteer: ', error);
        throw new Error('Register as seller failed');
    } finally {
        session.endSession();
    }
}

export const isUserSeller = async (userId: string) => {
    const seller = await Seller.exists({ userId });
    return !!seller;
}