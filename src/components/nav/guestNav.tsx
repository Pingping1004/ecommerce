import React from "react";
import { useRouter } from "next/navigation";

export default function GuestNav() {
    const router = useRouter();

    return (
        <>
            <div className="flex justify-between items-center py-6 bg-gray-800 text-white">
                <h2 className="text-xl lato-bold ml-14">Explore Products</h2>

                <button
                    className="bg-white text-primary lato-bold mr-14 px-4 py-2 rounded-lg cursor-pointer"
                    onClick={() => {
                        router.push("/login"); // Navigate to /login
                    }}
                >
                    Login
                </button>
            </div>
        </>
    );
}
