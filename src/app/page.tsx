"use client";

import React, { useEffect } from "react";
import Image from "next/image";

// Components
import SearchInput from "@/components/inputs/SearchBar";
import GuestNav from "@/components/nav/guestNav";
import Divider from "@/components/Divider";

export default function HomePage() {
    // useEffect(() => {
    //     // Fetch product from API
    // })

    return (
        <>
            <div className="bg-[#f7f7f7] min-h-screen">
                <GuestNav />

                <section className="flex flex-row mx-14 my-12 p-12 gap-x-30 bg-green-200 rounded-4xl">
                    <div>
                        <h2 className="text-[64px] text-primary poppins-bold mb-6">
                            Get The Right Products for You
                        </h2>
                        <div className="flex items-center flex-row mb-12">
                            <div className="text-primary text-center">
                                <p className="text-[32px] poppins-bold">50+</p>
                                <p className="text-base poppins-medium">Products</p>
                            </div>

                            <Divider />

                            <div className="text-primary text-center">
                                <p className="text-[32px] poppins-bold">100+</p>
                                <p className="text-base poppins-medium">Customers</p>
                            </div>
                        </div>

                        <SearchInput />
                    </div>

                    <div>
                        <Image
                            src="/image/main.png"
                            alt="Product Picture"
                            width={1000} // Explicit width in pixels
                            height={500} // Fixed height
                            className="object-fill"
                            style={{ width: "30rem", height: "30rem" }} // Force fixed dimensions
                        />
                    </div>
                </section>
                <main className="flex mx-14 my-10 gap-x-10">
                    <div className="inline-flex flex-col relative">
                        <div className="flex justify-center">
                            <Image
                                src="/image/example.png"
                                alt="Product Picture"
                                width={200} // Explicit width in pixels
                                height={242} // Fixed height
                                className="object-fill mb-6"
                                style={{ width: "200px", height: "242px" }} // Force fixed dimensions
                            />
                        </div>
                        <h6 className="mb-1 text-lg text-primary lato-bold">
                            Product name
                        </h6>
                        <div className="flex flex-row">
                            <p className="text-lg text-secondary mr-2">$</p>
                            <p className="text-lg text-secondary">1,400</p>
                        </div>
                    </div>

                    <div className="inline-flex flex-col relative">
                        <div className="flex justify-center">
                            <Image
                                src="/image/example.png"
                                alt="Product Picture"
                                width={200} // Explicit width in pixels
                                height={242} // Fixed height
                                className="object-fill mb-6"
                                style={{ width: "200px", height: "242px" }} // Force fixed dimensions
                            />
                        </div>
                        <h6 className="mb-1 text-lg text-primary lato-bold">
                            Product name
                        </h6>
                        <div className="flex flex-row">
                            <p className="text-lg text-secondary mr-2">$</p>
                            <p className="text-lg text-secondary">1,400</p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
