import { NextRequest, NextResponse } from 'next/server';
import checkToken from '@/util/checkToken';
import { findProductById, updateProduct, deleteProduct } from '@/features/products/productService';
import { sellerGuard } from '@/lib/guard/sellerGuard';

// Get specific product
export async function GET(req: NextRequest, { params }: { params: { productId: string }}) {
    try {
        checkToken(req);
        const { productId } = params;

        const productData = await findProductById(productId);
        console.log("Products being sent:", productData);

        return NextResponse.json(productData);
    } catch (error) {
        console.error("Product fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { productId: string }}) {
    try {
        const sellerToken = await sellerGuard(req);
        if (!sellerToken)return NextResponse.json({ error: 'Unauthorized, only seller can access' }, { status: 401 });

        const { productId } = params;
        const { userId, ...updatedProduct } = await req.json();
        console.log("Received update data in API:", updatedProduct);

        checkToken(req);
        if (!productId || !userId) {
            return NextResponse.json(
                { error: "Missing required fields: productId and userId are required" }, 
                { status: 400 }
            );
        }

        const product = await updateProduct(userId, productId, updatedProduct);

        return NextResponse.json({ success: true, data: product }, { status: 200 });
    } catch (error: any) {
        console.error("Failed to update product:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to update product" }, { status: 500 });
    }
}

// Delete single product
export async function DELETE(req: NextRequest, { params }: { params: { productId: string }}) {
    try {
        const sellerToken = await sellerGuard(req);
        if (!sellerToken)return NextResponse.json({ error: 'Unauthorized, only seller can access' }, { status: 401 });
        
        const { productId } = params;
        checkToken(req);

        const { userId } = await req.json();
        await deleteProduct(userId, productId);

        console.log('Deleted productIds: ', productId);

        return NextResponse.json({ message: `Successfully deleted products` }, { status: 200 });
    } catch (error: any) {
        console.error("Error removing product: ", error.message);
        return NextResponse.json(
            { error: "Failed to remove product" },
            { status: 500 }
        );
    }
}
