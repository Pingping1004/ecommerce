import { getSeller, registerSeller, updateSellerStatus } from "@/features/seller/sellerService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const sellerData = await req.json();

        const result = await registerSeller(req, sellerData);

        return NextResponse.json(
            { message: "Seller registered successfully", data: result },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Failed to register seller:", error);
        return NextResponse.json(
            { message: error.message || "Failed to register seller", }, 
            { status: error.status || 500 }
        );
    }
}

export async function GET() {
    try {
        const sellers = await getSeller();
        return NextResponse.json({ success: true, data: sellers });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}