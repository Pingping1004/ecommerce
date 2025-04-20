import { getSellerById, updateSellerStatus } from "@/features/seller/sellerService";
import { NextRequest, NextResponse } from "next/server";
import checkToken from "@/util/checkToken";

export async function GET(req: NextRequest, { params }: { params: { userId: string }}) {
    try {
        checkToken(req);
        const { userId } = params;

        const seller = await getSellerById(userId);
        console.log('Find seller by ID API: ', seller);
        return NextResponse.json(seller, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { userId: string }}) {
    try {
        checkToken(req);
        const { userId } = params;
        const { status } = await req.json();

        console.log('userId in update seller state: ', userId);
        console.log('Seller status in update seller state: ', status);

        const seller = await updateSellerStatus(status, userId);

        return NextResponse.json(seller, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message}, { status: 500 })
    }
}