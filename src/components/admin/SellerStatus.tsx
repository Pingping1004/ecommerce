"use client";

import { SellerContext } from "@/context/sellerContext";
import { useContext } from "react";
import axios from "axios";
import PaggeLoading from "../handling/Loading";

export default function AdminTable() {
    const { sellers, isLoading, error } = useContext(SellerContext)!;

    const handleStatusChange = async (userId: string, newStatus: string) => {
        try {
            await axios.patch('/api/seller/register', {
                userId,
                status: newStatus
            });
        } catch (error) {
            console.error('Failed to update seller status:', error);
        }
    };

    if (error) alert(`Error: ${error}`);
    if (isLoading) {
        return (
            <>
                <PaggeLoading />
            </>
        );
    }

    return (
        <div>
            <h2 className="text-2xl poppins-semibold">Admin page</h2>
            <br />
            <div>
                {sellers?.map((seller) => (
                    <div key={`${seller.userId}`}>
                        <h2>Seller name: {seller.ownerName}</h2>
                        <p>Shop name: {seller.shopName}</p>
                        <p>Status: {seller.status}</p>
                        <br />
                        <select 
                            defaultValue={seller.status as string}
                            onChange={
                                (event) => handleStatusChange(
                                    seller.userId as string, 
                                    event.target.value
                                )}
                        >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="suspended">Suspended</option>
                        </select>
                        <br />
                        <br />
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
}
