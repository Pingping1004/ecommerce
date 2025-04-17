"use client";

import { useProductContext } from "@/context/ProductContext";
import UserContext from "@/context/UserContext";
import { useAuth } from "@/hooks/useAuth";
import { useContext } from "react";

export default function Feed() {
    const { products, isLoading, error, refetchProducts } = useProductContext();
    const { user } = useContext(UserContext)!;
    const { logout } = useAuth();

    if (isLoading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
                <button onClick={refetchProducts}>Retry</button>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return <div>No products found</div>;
    }

    return (
        <div className="inline-flex flex-col gap-4">
            <h1>User: {user?.username}</h1>
            <button
            onClick={logout}
            className="bg-white text-black"
            >
                Logout
            </button>
            {products.map((product) => (
                <div 
                    key={product._id}
                    className="border p-4 rounded shadow-sm text-white bg-transparent
                    hover:bg-white hover:text-black hover:scale-105 transition-all duration-400 ease-in-out"
                >
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    <p className="text-gray-600">{product.description}</p>
                    <p className="text-lg font-semibold mt-2">
                        ${product.price}
                    </p>
                    <p className="text-sm text-gray-500">
                        Category: {product.category}
                    </p>
                </div>
            ))}
        </div>
    );
}
