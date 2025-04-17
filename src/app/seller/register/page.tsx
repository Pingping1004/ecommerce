"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Preahvihear } from "next/font/google";

interface Address {
    houseNumber: string;
    street: string;
    district: string;
    city: string;
    country: string;
    zipCode: string;
}

interface SellerFormData {
    // Personal info
    businessEmail: string;
    password: string;
    confirmPassword: string;
    phone: string;
    // Address info
    address: Address;
    // Shop info
    ownerName: string;
    shopName: string;
    businessType: "individual" | "company";
}

export default function SellerRegisterPage() {
    const [form, setForm] = useState({
        businessEmail: "",
        password: "",
        confirmPassword: "",
        address: {
            houseNumber: "",
            street: "",
            district: "",
            city: "",
            country: "",
            zipCode: "",
        },
        phone: "",
        ownerName: "",
        shopname: "",
        businessType: "individual",
    });

    const handleChnage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        if (event.target.name.startsWith("address.")) {
            const child = event.target.name.split(".")[1];
            setForm((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [child]: event.target.value,
                },
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [event.target.name]: event.target.value,
            }));
        }
    };

    const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("passwords do not match");
            return;
        }
    };

    return (
        <>
            <div className="container flex items-center mx-auto justify-center">
                <div className="flex justify-center items-center w-full h-full xl:gap-14 lg:justify-normal md:gap-5 draggable">
                    <div className="flex items-center justify-center w-full lg:p-12">
                        <div className="flex items-center xl:p-10">
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col w-full h-full p-20 pb-6 text-center bg-white rounded-3xl"
                            >
                                <h3 className="mb-2 text-4xl poppins-bold text-gray-900">
                                    Seller Registration
                                </h3>
                                <p className="mb-16 text-secondary lato-bold">
                                    Enter your business details
                                </p>

                                {/* Personal Info Section */}
                                <div>
                                    <h4 className="flex justify-items-start mb-2 poppins-bold text-primary">
                                        Personal Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl mb-4">
                                        {/* Business Email input */}
                                        <div className="mb-6">
                                            <label
                                                htmlFor="email"
                                                className="flex mb-2 lato-regular text-start text-primary font-[500]"
                                            >
                                                Business Email
                                            </label>
                                            <input
                                                type="text"
                                                name="businessEmail"
                                                value={form.businessEmail}
                                                onChange={handleChnage}
                                                placeholder="Business Email"
                                                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none mb-7 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                required
                                            />
                                        </div>

                                        {/* Phone input */}
                                        <div className="mb-6">
                                            <label
                                                htmlFor="phone"
                                                className="flex mb-2 lato-regular text-start text-primary font-[500]"
                                            >
                                                Phone
                                            </label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChnage}
                                                placeholder="Phone"
                                                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none mb-7 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                required
                                            />
                                        </div>

                                        {/* Password input */}
                                        <div className="mb-6">
                                            <label
                                                htmlFor="password"
                                                className="flex mb-2 lato-regular text-start text-primary font-[500]"
                                            >
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={form.password}
                                                onChange={handleChnage}
                                                placeholder="Password"
                                                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none mb-7 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                required
                                            />
                                        </div>

                                        {/* Confirm Password input */}
                                        <div className="mb-6">
                                            <label
                                                htmlFor="confirmPassword"
                                                className="flex mb-2 lato-regular text-start text-primary font-[500]"
                                            >
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={form.confirmPassword}
                                                onChange={handleChnage}
                                                placeholder="Confirm Password"
                                                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none mb-7 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div>
                                    <h4 className="flex justify-items-start mb-2 poppins-bold text-primary">
                                        Business Address
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl mb-4">
                                        {/* House number address input */}
                                        <div className="mb-6">
                                            <label className="flex mb-2 lato-regular text-start text-primary font-[500]">
                                                House Number
                                            </label>
                                            <input
                                                type="text"
                                                name="address.houseNumber"
                                                value={form.address.houseNumber}
                                                onChange={handleChnage}
                                                placeholder="House Number"
                                                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none mb-7 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                required
                                            />
                                        </div>

                                        {/* Street address input */}
                                        <div className="mb-6">
                                            <label className="flex mb-2 lato-regular text-start text-primary font-[500]">
                                                Street
                                            </label>
                                            <input
                                                type="text"
                                                name="address.street"
                                                value={form.address.street}
                                                onChange={handleChnage}
                                                placeholder="Street"
                                                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none mb-7 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                required
                                            />
                                        </div>

                                        {/* District and City in one row */}

                                        <div className="mb-6">
                                            <label className="flex mb-2 lato-regular text-start text-primary font-[500]">
                                                District
                                            </label>
                                            <input
                                                type="text"
                                                name="address.district"
                                                value={form.address.district}
                                                onChange={handleChnage}
                                                placeholder="District"
                                                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none mb-7 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                required
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <label className="flex mb-2 lato-regular text-start text-primary font-[500]">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="address.city"
                                                value={form.address.city}
                                                onChange={handleChnage}
                                                placeholder="City"
                                                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none mb-7 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                required
                                            />
                                        </div>

                                        {/* Country and Zipcode in one row */}
                                        <div className="mb-6">
                                            <label className="flex mb-2 lato-regular text-start text-primary font-[500]">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                name="address.country"
                                                value={form.address.country}
                                                onChange={handleChnage}
                                                placeholder="Country"
                                                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none mb-7 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                required
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <label className="flex mb-2 lato-regular text-start text-primary font-[500]">
                                                Zip Code
                                            </label>
                                            <input
                                                type="text"
                                                name="address.zipCode"
                                                value={form.address.zipCode}
                                                onChange={handleChnage}
                                                placeholder="Zip Code"
                                                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none mb-7 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Shop Info Section */}
                                <div>
                                    <h4 className="flex justify-items-start mb-2 poppins-bold text-primary">
                                        Shop Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl mb-4">
                                        {/* Owner name input */}
                                        <div className="mb-6">
                                            <label className="flex mb-2 lato-regular text-start text-primary font-[500]">
                                                Owner Name
                                            </label>
                                            <input
                                                type="text"
                                                name="ownerName"
                                                value={form.ownerName}
                                                onChange={handleChnage}
                                                placeholder="Owner name"
                                                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none mb-7 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                required
                                            />
                                        </div>

                                        {/* Shop name input */}
                                        <div className="mb-6">
                                            <label className="flex mb-2 lato-regular text-start text-primary font-[500]">
                                                Shop Name
                                            </label>
                                            <input
                                                type="text"
                                                name="shopname"
                                                value={form.shopname}
                                                onChange={handleChnage}
                                                placeholder="Shop name"
                                                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none mb-7 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                required
                                            />
                                        </div>

                                        {/* Business Type input - full width */}
                                        <div className="mb-6 md:col-span-2">
                                            <label className="flex mb-2 lato-regular text-start text-primary font-[500]">
                                                Business Type
                                            </label>
                                            <select
                                                name="businessType"
                                                value={form.businessType}
                                                onChange={handleChnage}
                                                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none mb-7 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                required
                                            >
                                                <option value="individual">
                                                    Individual
                                                </option>
                                                <option value="company">
                                                    Company
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <button className="w-full px-6 py-5 mb-10 text-sm font-bold leading-none text-white transition duration-500 md:w-96 rounded-2xl bg-gray-700 hover:bg-gray-800 hover:cursor-pointer focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500">
                                        Register as Seller
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
