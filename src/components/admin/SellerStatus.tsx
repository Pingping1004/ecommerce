"use client";

import { SellerContext } from "@/context/sellerContext";
import { useContext, useState } from "react";
import axios from "axios";
import PaggeLoading from "../handling/Loading";

export default function AdminTable() {
    const { sellers, setSellers, isLoading, error } = useContext(SellerContext)!;
    const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

    const handleStatusChange = async (userId: string, newStatus: "pending" | "approved" | "rejected" | "suspended") => {
        try {
            setUpdatingIds(prev => new Set(prev).add(userId));

            // Optimistically update UI
            setSellers(prevSellers =>
                prevSellers ? prevSellers.map(seller =>
                    seller.userId === userId
                        ? { ...seller, status: newStatus }
                        : seller
                ) : null
            );

            const response = await axios.patch(`/api/seller/${userId}`, {
                status: newStatus
            });

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

        } catch (error: any) {
            console.error("Status update failed:", error);
            
            // Only revert if there was an error
            setSellers(prevSellers =>
                prevSellers ? prevSellers.map(seller =>
                    seller.userId === userId
                        ? { ...seller, status: seller.status }
                        : seller
                ) : null
            );
        } finally {
            setUpdatingIds(prev => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
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
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">
                Seller Management
            </h2>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Seller
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Shop Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Current Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sellers?.map((seller) => (
                            <tr
                                key={`${seller.userId}`}
                                className="hover:bg-gray-50"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {seller.ownerName}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {seller.shopName}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${
                                            seller.status === "approved"
                                                ? "bg-green-100 text-green-800"
                                                : ""
                                        }
                                        ${
                                            seller.status === "pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : ""
                                        }
                                        ${
                                            seller.status === "rejected"
                                                ? "bg-red-100 text-red-800"
                                                : ""
                                        }
                                        ${
                                            seller.status === "suspended"
                                                ? "bg-gray-100 text-gray-800"
                                                : ""
                                        }
                                    `}
                                    >
                                        {seller.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <select
                                        defaultValue={seller.status as string}
                                        onChange={(event) =>
                                            handleStatusChange(
                                                seller.userId as string,
                                                event.target.value as
                                                    | "pending"
                                                    | "approved"
                                                    | "rejected"
                                                    | "suspended"
                                            )
                                        }
                                        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 
                                            focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                                            sm:text-sm rounded-md ${
                                                updatingIds.has(
                                                    seller.userId as string
                                                )
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                        disabled={updatingIds.has(
                                            seller.userId as string
                                        )}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">
                                            Approved
                                        </option>
                                        <option value="rejected">
                                            Rejected
                                        </option>
                                        <option value="suspended">
                                            Suspended
                                        </option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
