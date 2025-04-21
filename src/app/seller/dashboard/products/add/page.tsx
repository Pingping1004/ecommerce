"use client";

import React, { useContext } from "react";

import PageLoading from "@/components/handling/Loading";
import CreateProduct from "@/components/seller/createProduct";

import { useSellerContext } from "@/context/sellerContext";

export default function CreateProductPage() {
    const { sellers, setSellers, isLoading } = useSellerContext();
    if (isLoading) {
        return (
            <>
                <PageLoading />
            </>
        );
    }

    return (
        <>
            <CreateProduct />
        </>
    );
}
