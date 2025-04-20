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

        console.log('Receiving productData: ', productData);
        const product = new Product(productData);

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

// Helper function to check product ownership
export async function isOwnerOfProduct(userId: string, productId: string) {
    const product = await findProductById(productId);
    if (!product) throw new Error("Product not found");

    console.log("User ID:", userId);
    console.log("Product Owner ID:", product.ownerId);

    return product.ownerId.toString() === userId;
}

export async function findProductById(productId: string) {
    try {
        const product = await Product.findById(productId);
        console.log("Find product by ID: ", product);

        if (!product) throw new Error("No product found by ID");

        return product;
    } catch (error: any) {
        console.error("Error updating product: ", error.message);
        throw new Error("Failed to find product by ID");
    }
}
