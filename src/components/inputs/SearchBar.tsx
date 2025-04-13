import React from "react";
import Image from "next/image";

export default function SearchInput() {
    return (
        <>
            <div className="relative w-full max-w-md text-primary poppins-medium text-base">
                <input
                    className="bg-white rounded-2xl px-4 py-6 pr-12 w-full focus: border-none focue: outline-none"
                    placeholder="What are you looking for?"
                    type="text"
                />
                <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-green-200 cursor-pointer"
                >
                    <Image
                        className="object-contain"
                        alt="Search Input"
                        src="/image/search.svg"
                        width={24}
                        height={24}
                    />
                </button>
            </div>
        </>
    );
}
