"use client";

import React, { useContext } from "react";
import { UserContext, UserContextType } from "@/context/UserContext";
import { ProductContext, ProductContextType } from "@/context/ProductContext";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function DashboardPage() {
    const userContext = useContext<UserContextType | null>(UserContext);
    const productContext = useContext<ProductContextType | null>(
        ProductContext
    );
    const router = useRouter();

    const logout = async () => {
        console.log("Logout function triggered"); // Debug log
        try {
            await signOut({ redirect: false });
            router.push("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (!userContext || !productContext) {
        return <div>Loading...</div>;
    }

    const { user } = userContext;
    const { products } = productContext;

    console.log("User context: ", user); // Debug log
    console.log("Product context: ", products); // Debug log

    return (
        <>
            <div>
                <button
                    className="bg-white text-black p-2 rounded-md hover:bg-gray-200 cursor-pointer"
                    onClick={logout}
                >
                    Logout
                </button>
                <h1>User: {user?.username}</h1>
                <h1>
                    Products: {
                        products?.map((product) => {
                            console.log("Product: ", product); // Debug log
                            return (
                                <div key={product.name}>
                                    {product.name} - {product.price}
                                </div>
                            );
                        })
                    }</h1>
            </div>
        </>
    );
}
