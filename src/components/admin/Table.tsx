"use client";

import { SellerContext } from "@/context/sellerContext";
import { useContext } from "react";

export default function AdminTable() {
    const { sellers } = useContext(SellerContext)!;

    return (
        <div>
            <h2>Admin page</h2>
            <br />
            <div>
                {sellers?.map((seller) => (
                    <div key={seller.userId}>
                        <h2>Seller name: {seller.ownerName}</h2>
                        <p>Shop name: {seller.shopName}</p>
                        <p>Status: {seller.status}</p>
                        <br />
                    </div>
                ))}
            </div>
        </div>
    );
}
