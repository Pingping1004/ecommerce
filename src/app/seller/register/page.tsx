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
            <div className="container min-h-screen flex items-center mx-auto justify-center py-10">
                <div className="flex justify-center items-center w-full xl:gap-14 lg:justify-normal md:gap-5 draggable">
                    <div className="flex items-center justify-center w-full px-12">
                        <div className="flex items-center xl:p-10">
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col w-full p-20 max-sm:p-12 text-center bg-white rounded-3xl"
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 p-6 rounded-2xl mb-4">
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
                                                className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none mb-6 max-sm:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
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
                                                className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none mb-6 max-sm:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
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
                                                className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none mb-6 max-sm:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
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
                                                className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none mb-6 max-sm:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div>
                                    <h4 className="flex justify-items-start mb-2 poppins-bold text-primary">
                                        Address
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 p-6 rounded-2xl mb-4">
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
                                                className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none mb-6 max-sm:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
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
                                                className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none mb-6 max-sm:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
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
                                                className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none mb-6 max-sm:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
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
                                                className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none mb-6 max-sm:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
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
                                                className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none mb-6 max-sm:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
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
                                                className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none mb-6 max-sm:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 p-6 rounded-2xl mb-4">
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
                                                className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none mb-6 max-sm:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
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
                                                className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none mb-6 max-sm:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
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
                                                className="flex items-center w-full px-5 py-4 text-secondary text-md lato-regular outline-none mb-6 max-sm:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl 
                                                appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] 
                                                bg-[length:0.7em] bg-[right_1.3em_center] bg-no-repeat pr-12"
                                                required
                                            >
                                                <option 
                                                    value="individual"
                                                >
                                                    Individual
                                                </option>
                                                <option 
                                                    value="company"
                                                >
                                                    Company
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <button className="w-full px-6 py-5 text-sm font-bold leading-none text-white transition duration-500 md:w-96 rounded-2xl bg-gray-700 hover:bg-gray-800 hover:cursor-pointer focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500">
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
