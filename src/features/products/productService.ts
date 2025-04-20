import Product, { ProductType } from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import mongoose from "mongoose";

// Add interface for update data
interface UpdateProductData {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
}

export async function getProducts() {
    try {
        await connectToDatabase();
        const products = await Product.find({});
        console.log("Fetched products: ", products);
        return products; // Return direct array instead of wrapping it
    } catch (error) {
        console.error("Error in getProducts:", error);
        throw error;
    }
}

export async function addProduct(productData: ProductType) {
    try {
        await connectToDatabase();
        if (!productData) throw new Error("Product data is required");
        if (!productData.ownerId) throw new Error("ownerId is missing");

        console.log("Receiving productData: ", productData);
        const product = new Product({
            ...productData,
            ownerId: new mongoose.Types.ObjectId(productData.ownerId),
        });

        await product.save();
        console.log("Added product in service: ", product);

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        console.error("Error adding product:", error.message);
        return NextResponse.json(
            { error: "Failed to add product" },
            { status: 500 }
        );
    }
}

export async function updateProduct(
    userId: string,
    productId: string,
    updateData: UpdateProductData
) {
    console.log("Receiving update data in service:", updateData);
    try {
        await connectToDatabase();

        // Validate productId format
        if (!mongoose.Types.ObjectId.isValid(productId))
            throw new Error("Invalid product ID format");

        // First find the product to check if it exists and get its _id
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) throw new Error("Product not found");

        // Check ownership using the found product
        const isOwner = await isOwnerOfProduct(userId, productId);
        if (!isOwner) throw new Error("You do not own this product");
        console.log("Is owner: ", isOwner);

        // Now update the product using the validated _id
        console.log("Update data before passing:", updateData);
        const updatedProduct = await Product.findByIdAndUpdate(
            existingProduct._id,
            updateData,
            { new: true }
        ).exec();

        console.log("Updated product:", updatedProduct);
        return updatedProduct;
    } catch (error: any) {
        console.error("Error updating product:", error.message);
        throw error;
    }
}

export async function deleteProduct(
    userId: string,
    productIds: string | string[]
) {
    let deletedCount = 0;
    try {
        await connectToDatabase();

        if (!productIds || (Array.isArray(productIds) && productIds.length === 0)) {
            throw new Error("No product ID(s) provided");
        }

        const ids = Array.isArray(productIds) ? productIds : [productIds];
        

        for (const id of ids) {
            try {
                const product = await findProductById(id, userId);
                await product.deleteOne({ _id: id, ownerId: userId });
                console.log(`Deleted product ${id}`);
                deletedCount ++;
            } catch (error: any) {
                console.warn(`Skipped product ${id}:`, error.message);
                // Optionally collect skipped products
            }
        }

        return deletedCount;
    } catch (error: any) {
        console.error("Failed to delete product(s): ", error);
        throw new Error("Failed to delete product(s)");
    }
}

// Helper function to check product ownership
export async function isOwnerOfProduct(userId: string, productId: string) {
    const product = await findProductById(productId);
    if (!product) throw new Error("Product not found");

    console.log("User ID:", userId);
    console.log("Product Owner ID:", product.ownerId);

    if (product.ownerId.toString() !== userId)
        return new Error("You are not the owner of product");
}

export async function findProductById(productId: string, userId?: string) {
    try {
        const query = userId
            ? { _id: productId, ownerId: new mongoose.Types.ObjectId(userId) }
            : { _id: productId };

        console.log("Querying with productId:", productId);
        console.log("Querying with owner ID:", userId, typeof userId);

        const product = await Product.findOne(query);
        console.log("Find product by ID: ", product);

        if (!product) throw new Error("No product found by ID");

        return product;
    } catch (error: any) {
        console.error("Error updating product: ", error.message);
        throw new Error("Failed to find product by ID");
    }
}
