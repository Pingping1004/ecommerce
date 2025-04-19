import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env"
    );
}

export async function connectToDatabase() {
    try {
        const opts = {
            bufferCommands: true,
        };

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGODB_URI, opts);
            console.log("MongoDB connected successfully");

            // Ensure collections exist
            const db = mongoose.connection.db;
            if (!db) {
                throw new Error("mongoose.connection.db is undefined.");
            }
            const collections = await db.listCollections().toArray();
            const collectionNames = collections.map((col) => col.name);

            if (!collectionNames.includes("sellers")) {
                await db.createCollection("sellers");
                console.log("Sellers collection created");
            }
        }
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}
