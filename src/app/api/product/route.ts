import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import {
    addProduct,
    deleteProduct,
    getProducts,
    updateProduct,
} from "@/features/products/productService";
import checkToken from "@/util/checkToken";
import { sellerGuard } from "@/lib/guard/sellerGuard";

// Get all products
export async function GET(req: NextRequest) {
    try {
        checkToken(req); // Verify token using the utility function

        const productData = await getProducts();
        console.log("Products being sent:", productData); // Debug log
        return NextResponse.json(productData); // Send array directly
    } catch (error) {
        console.error("Product fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const sellerToken = await sellerGuard(req);
        if (!sellerToken)return NextResponse.json({ error: 'Unauthorized, only seller can access' }, { status: 401 });
        
        const productData = await req.json();
        // const { ownerId } = productData;
        console.log("Added product in API: ", productData);

        // Validate the request body here if needed
        if (!productData) {
            console.error("Invalid request body");
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        // Make sure ownerId is included in the request
        if (!productData.ownerId) {
            return NextResponse.json(
                { error: "ownerId is required" },
                { status: 400 }
            );
        }

        checkToken(req);

        const response = await addProduct(productData);
        return response;
    } catch (error: any) {
        console.error("Error adding product: ", error.message);
        return NextResponse.json(
            { error: "Failed to add product" },
            { status: 500 }
        );
    }
}

// Delete multiple products
export async function DELETE(req: NextRequest) {
    try {
        checkToken(req);

        const data = await req.json();
        let { userId, productIds } = data;
        productIds = data.productIds ?? data.productId;

        const deletedCount = await deleteProduct(userId, productIds);

        console.log(`Deleted ${deletedCount} products in API`);
        console.log('Deleted productIds: ', productIds);

        return NextResponse.json({ message: `Deleted ${deletedCount} products` }, { status: 200 });
    } catch (error: any) {
        console.error("Error removing product: ", error.message);
        return NextResponse.json(
            { error: "Failed to remove product" },
            { status: 500 }
        );
    }
}
