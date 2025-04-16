"use client";

import React, { useContext } from "react";
import UserContext, { UserContextType } from "@/context/UserContext";
import ProductContext, { ProductContextType } from "@/context/ProductContext";
import { AuthContext } from "@/context/AuthContext";

export default function FeedPage() {
    const userContext = useContext<UserContextType | null>(UserContext);

    if (!userContext) {
        return <div>Loading user context...</div>;
    }

    const { user } = userContext;
    const { products } = useContext<ProductContextType>(ProductContext);
    const { logout, isLoggedIn, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!isLoggedIn) {
        return <div>Please log in to access the dashboard</div>;
    }

    console.log('User context: ', user);
    console.log('Product context: ', products);
    console.log('Login state: ', isLoggedIn, 'Loading state: ', isLoading);

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
                    Products:
                    {products?.map((product, index) => (
                        <div key={index}>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>{product.price}</p>
                            <p>{product.category}</p>
                        </div>
                    ))}
                </h1>
            </div>
        </>
    );
}
