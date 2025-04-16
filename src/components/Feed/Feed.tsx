"use client";

import { useProductContext } from "@/context/ProductContext";
import UserContext from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useContext } from "react";

export default function Feed() {
    const { products, isLoading, error, refetchProducts } = useProductContext();
    const { user } = useContext(UserContext)!;

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <h1>User: {user?.username}</h1>
            {products.map((product) => (
                <div key={product._id} className="border p-4 rounded shadow-sm">
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
