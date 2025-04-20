"use client";

import React, { FormEvent, useState, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Address {
    houseNumber: string;
    street: string;
    district: string;
    city: string;
    country: string;
    zipCode: string;
}

export interface BankAccountFormData {
    accountName: string;
    accountNumber: string;
    bankName: "KBANK" | "SCB" | "BBL";
}

export interface SellerFormData {
    userId: ReactNode;
    // Personal info
    businessEmail: string;
    phone: string;
    // Address info
    address: Address;
    // Shop info
    ownerName: string;
    shopName: string;
    businessType: "individual" | "company";
    bankAccount: BankAccountFormData;
    status: "pending" | "approved" | "rejected" | "suspended";
}

export default function SellerRegisterForm() {
    const { isLoggedIn } = useAuth();
    const { data: session } = useSession();
    const router = useRouter();

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
        shopName: "", // Fixed: changed from shopname to shopName to match the schema
        businessType: "individual",
        status: "pending",
    });

    const [isFlipped, setIsFlipped] = useState(false);
    const [bankForm, setBankForm] = useState<BankAccountFormData>({
        accountName: "",
        accountNumber: "",
        bankName: "KBANK",
    });

    const handleChange = (
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

    const handleBankFormChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setBankForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isLoggedIn) {
            alert("Please login to continue.");
            return;
        }

        if (!session?.user?.id) {
            alert("User session not found. Please login again.");
            return;
        }

        try {
            const completeForm = {
                ...form,
                bankAccount: bankForm,
            };

            console.log("Submitting form data:", completeForm);

            const response = await axios.post(
                "/api/seller/register",
                completeForm,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );

            console.log("Server response:", response.data);

            if (response.status === 201) {
                alert("Successfully registered as a seller!");
                window.location.href = "/"; // Redirect to home page
            }
        } catch (error: any) {
            console.error(
                "Failed to register as seller:",
                error.response?.data || error
            );
            alert(
                error.response?.data?.message ||
                    "Failed to register as seller. Please try again."
            );
        }
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="min-h-screen w-full overflow-auto">
            <div className="container mx-auto h-full flex items-center justify-center">
                <div className="w-full max-w-4xl py-10">
                    <div
                        className={`flipper relative w-full transition-transform duration-1000 preserve-3d ${
                            isFlipped ? "rotate-y-180" : ""
                        }`}
                    >
                        {/* Front Side - Main Form */}
                        <div className="front absolute w-full backface-hidden">
                            <div className="w-full px-12">
                                <form className="flex flex-col w-full p-20 py-12 max-sm:p-12 text-center bg-white rounded-3xl">
                                    <h3 className="mb-2 text-4xl poppins-bold text-gray-900">
                                        Seller Registration
                                    </h3>
                                    <p className="mb-16 text-secondary lato-bold">
                                        Enter your business details
                                    </p>

                                    {/* Personal Info Section */}
                                    <div>
                                        <h4 className="flex justify-items-start lg:mb-8 mb-6 poppins-bold text-primary">
                                            Personal Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 p-6 rounded-2xl mb-4 max-sm:mb-0">
                                            {/* Business Email input */}
                                            <div className="mb-6 lg:mb-6 max-md:mb-3 max-sm:mb-2">
                                                <label
                                                    htmlFor="email"
                                                    className="flex mb-3 lato-regular text-start text-primary font-[500]"
                                                >
                                                    Business Email
                                                </label>
                                                <input
                                                    type="text"
                                                    name="businessEmail"
                                                    value={form.businessEmail}
                                                    onChange={handleChange}
                                                    placeholder="example@company.com"
                                                    className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none max-md:mb-3 lg:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                    required
                                                />
                                            </div>

                                            {/* Phone input */}
                                            <div className="mb-6 lg:mb-6 max-md:mb-3 max-sm:mb-2">
                                                <label
                                                    htmlFor="phone"
                                                    className="flex mb-3 lato-regular text-start text-primary font-[500]"
                                                >
                                                    Phone
                                                </label>
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    value={form.phone}
                                                    onChange={handleChange}
                                                    placeholder="08X-XXX-XXXX"
                                                    className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none max-md:mb-3 lg:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Section */}
                                    <div>
                                        <h4 className="flex justify-items-start lg:mb-8 mb-6 poppins-bold text-primary">
                                            Address
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-14 p-6 rounded-2xl mb-4 max-sm:mb-0">
                                            {/* House number address input */}
                                            <div className="mb-6 lg:mb-6 max-md:mb-3 max-sm:mb-2">
                                                <label className="flex mb-3 lato-regular text-start text-primary font-[500]">
                                                    House Number
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address.houseNumber"
                                                    value={
                                                        form.address.houseNumber
                                                    }
                                                    onChange={handleChange}
                                                    placeholder="123/45"
                                                    className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none max-md:mb-3 lg:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                    required
                                                />
                                            </div>

                                            {/* Street address input */}
                                            <div className="mb-6 lg:mb-6 max-md:mb-3 max-sm:mb-2">
                                                <label className="flex mb-3 lato-regular text-start text-primary font-[500]">
                                                    Street
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address.street"
                                                    value={form.address.street}
                                                    onChange={handleChange}
                                                    placeholder="Sukhumvit Road"
                                                    className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none max-md:mb-3 lg:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                    required
                                                />
                                            </div>

                                            {/* District and City in one row */}

                                            <div className="mb-6 lg:mb-6 max-md:mb-3 max-sm:mb-2">
                                                <label className="flex mb-3 lato-regular text-start text-primary font-[500]">
                                                    District
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address.district"
                                                    value={
                                                        form.address.district
                                                    }
                                                    onChange={handleChange}
                                                    placeholder="Watthana"
                                                    className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none max-md:mb-3 lg:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                    required
                                                />
                                            </div>

                                            <div className="mb-6 lg:mb-6 max-md:mb-3 max-sm:mb-2">
                                                <label className="flex mb-3 lato-regular text-start text-primary font-[500]">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address.city"
                                                    value={form.address.city}
                                                    onChange={handleChange}
                                                    placeholder="Bangkok"
                                                    className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none max-md:mb-3 lg:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                    required
                                                />
                                            </div>

                                            {/* Country and Zipcode in one row */}
                                            <div className="mb-6 lg:mb-6 max-md:mb-3 max-sm:mb-2">
                                                <label className="flex mb-3 lato-regular text-start text-primary font-[500]">
                                                    Country
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address.country"
                                                    value={form.address.country}
                                                    onChange={handleChange}
                                                    placeholder="Thailand"
                                                    className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none max-md:mb-3 lg:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                    required
                                                />
                                            </div>

                                            <div className="mb-6 lg:mb-6 max-md:mb-3 max-sm:mb-2">
                                                <label className="flex mb-3 lato-regular text-start text-primary font-[500]">
                                                    Zip Code
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address.zipCode"
                                                    value={form.address.zipCode}
                                                    onChange={handleChange}
                                                    placeholder="10110"
                                                    className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none max-md:mb-3 lg:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shop Info Section */}
                                    <div>
                                        <h4 className="flex justify-items-start lg:mb-8 mb-6 poppins-bold text-primary">
                                            Shop Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 p-6 rounded-2xl mb-4 max-sm:mb-0">
                                            {/* Owner name input */}
                                            <div className="mb-6 lg:mb-6 max-md:mb-3 max-sm:mb-2">
                                                <label className="flex mb-3 lato-regular text-start text-primary font-[500]">
                                                    Owner Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="ownerName"
                                                    value={form.ownerName}
                                                    onChange={handleChange}
                                                    placeholder="John Doe"
                                                    className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none max-md:mb-3 lg:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                    required
                                                />
                                            </div>

                                            {/* Shop name input */}
                                            <div className="mb-6 lg:mb-6 max-md:mb-3 max-sm:mb-2">
                                                <label className="flex mb-3 lato-regular text-start text-primary font-[500]">
                                                    Shop Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="shopName"
                                                    value={form.shopName}
                                                    onChange={handleChange}
                                                    placeholder="My Awesome Shop"
                                                    className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none max-md:mb-3 lg:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                    required
                                                />
                                            </div>

                                            {/* Business Type input - full width */}
                                            <div className="mb-6 md:col-span-2">
                                                <label className="flex mb-3 lato-regular text-start text-primary font-[500]">
                                                    Business Type
                                                </label>
                                                <select
                                                    name="businessType"
                                                    value={form.businessType}
                                                    onChange={handleChange}
                                                    className="flex items-center w-full px-5 py-4 text-secondary text-md lato-regular outline-none mb-6 max-sm:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl 
                                                    appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] 
                                                    bg-[length:0.7em] bg-[right_1.3em_center] bg-no-repeat pr-12"
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
                                        <button
                                            type="button"
                                            onClick={handleFlip}
                                            className="w-full px-6 py-5 poppins-semibold font-bold leading-none text-white transition duration-500 md:w-96 rounded-2xl bg-gray-700 hover:bg-gray-800 hover:cursor-pointer focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Back Side - Bank Account Form */}
                        <div className="back absolute w-full backface-hidden rotate-y-180">
                            <div className="w-full px-12">
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex flex-col w-full bg-white p-12 py-12 max-sm:p-12 text-center rounded-3xl"
                                >
                                    <h3 className="mb-2 text-4xl poppins-bold text-gray-900">
                                        Bank Account Details
                                    </h3>
                                    <p className="mb-16 max-sm:mb-8 text-secondary lato-bold">
                                        Enter your bank account information
                                    </p>

                                    {/* Bank Account Fields */}
                                    {/* grid grid-cols-1 md:grid-cols-2 gap-x-6 p-6 rounded-2xl mb-4 max-sm:mb-0 */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 p-6">
                                        <div className="md:mb-4 mb-6">
                                            <label className="flex mb-3 lato-regular text-start text-primary font-[500]">
                                                Account Name
                                            </label>
                                            <input
                                                type="text"
                                                name="accountName"
                                                value={bankForm.accountName}
                                                onChange={handleBankFormChange}
                                                placeholder="JOHN DOE"
                                                className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none mb-6 max-sm:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                required
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <label className="flex mb-3 lato-regular text-start text-primary font-[500]">
                                                Account Number
                                            </label>
                                            <input
                                                type="text"
                                                name="accountNumber"
                                                value={bankForm.accountNumber}
                                                onChange={handleBankFormChange}
                                                placeholder="XXX-X-XXXXX-X"
                                                className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none mb-6 max-sm:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
                                                required
                                            />
                                        </div>

                                        {/* Bank name - full width */}
                                        <div className="md:mb-8 mb-6 md:col-span-2">
                                            <label className="flex mb-3 lato-regular text-start text-primary font-[500]">
                                                Bank
                                            </label>
                                            <select
                                                name="bankName"
                                                value={bankForm.bankName}
                                                onChange={handleBankFormChange}
                                                className="flex items-center w-full px-5 py-4 text-sm text-secondary max-w-[480px]:text-sm lato-regular outline-none mb-6 max-sm:mb-4 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl pr-12"
                                                required
                                            >
                                                <option
                                                    value="KBANK"
                                                    className="text-md max-w-[480px]:text-sm"
                                                >
                                                    Kasikorn Bank (KBANK)
                                                </option>

                                                <option
                                                    value="SCB"
                                                    className="text-md max-w-[480px]:text-sm"
                                                >
                                                    Siam Commercial Bank (SCB)
                                                </option>

                                                <option
                                                    value="BBL"
                                                    className="text-md max-w-[480px]:text-sm"
                                                >
                                                    Bangkok Bank (BBL)
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-center gap-4">
                                        <button
                                            type="button"
                                            onClick={handleFlip}
                                            className="px-6 py-5 poppins-semibold font-bold leading-none text-gray-700 transition duration-500 w-40 rounded-2xl border-2 border-gray-700 hover:bg-gray-100"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-5 poppins-semibold font-bold leading-none text-white transition duration-500 w-40 rounded-2xl bg-gray-700 hover:bg-gray-800"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
