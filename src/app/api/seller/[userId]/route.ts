import {
    getSellerById,
    updateSellerStatus,
} from "@/features/seller/sellerService";
import { NextRequest, NextResponse } from "next/server";
import checkToken from "@/util/checkToken";
import { adminGuard } from "@/lib/guard/adminGuard";

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        checkToken(req);
        const { userId } = params;

        const seller = await getSellerById(userId);
        console.log("Find seller by ID API: ", seller);
        return NextResponse.json(seller, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const adminToken = await adminGuard(request);
        if (!adminToken) return NextResponse.json({ error: 'Unauthorized, only admin role can access' }, { status: 401 });
        
        const { status } = await request.json();
        const userId = params?.userId;

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID is required" }, { status: 400 }
            );
        }

        const updatedSeller = await updateSellerStatus(status, userId);

        return NextResponse.json({ success: true, data: updatedSeller });
    } catch (error: any) {
        console.error("Update failed:", error);
        return NextResponse.json(
            { success: false, message: error.message }, { status: 500 }
        );
    }
}
