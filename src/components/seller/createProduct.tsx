"use client";

import { useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ProductFormData {
    name: string;
    description: string;
    price: number;
    quantities: number;
    category:
        | "Apparel"
        | "Electronics"
        | "Home"
        | "Beauty&Health"
        | "Sports"
        | "Books"
        | "Toys"
        | "N/A";
    ownerId?: string;
}

export default function CreateProduct() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState<ProductFormData>({
        name: "",
        description: "",
        price: 0,
        quantities: 1,
        category: "N/A",
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]:
                name === "price"
                    ? parseFloat(value)
                    : name === "quantities"
                    ? parseInt(value)
                    : value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const productData = {
                ...form,
                ownerId: session?.user?.id,
            };

            const response = await axios.post("/api/product", productData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            });

            if (response.status === 201) {
                alert("Product created successfully!");
                router.push("/seller/products");
            }
        } catch (error: any) {
            console.error("Failed to create product:", error);
            alert(error.response?.data?.message || "Failed to create product");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full overflow-auto">
            <div className="container mx-auto h-full flex items-center justify-center">
                <div className="w-full max-w-4xl py-10">
                    <div className="w-full px-12">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col w-full p-20 py-12 max-sm:p-12 text-center bg-white rounded-3xl"
                        >
                            <h3 className="mb-2 text-4xl poppins-bold text-primary">
                                Create Product
                            </h3>
                            <p className="mb-16 text-secondary lato-bold">
                                Enter your product details
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 p-6 rounded-2xl mb-4">
                                {/* Product Name */}
                                <div className="mb-6 lg:mb-6 max-md:mb-3 max-sm:mb-2">
                                    <label className="flex mb-3 lato-regular text-start text-primary font-[500]">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                        className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none text-primary placeholder:text-secondary bg-gray-100 rounded-2xl"
                                        required
                                    />
                                </div>

                                {/* Price */}
                                <div className="mb-6 lg:mb-6 max-md:mb-3 max-sm:mb-2">
                                    <label className="flex mb-3 lato-regular text-start text-primary font-[500]">
                                        Price
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        placeholder="Enter price"
                                        className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none text-primary placeholder:text-secondary bg-gray-100 rounded-2xl"
                                        required
                                    />
                                </div>

                                {/* Quantities */}
                                <div className="mb-6 lg:mb-6 max-md:mb-3 max-sm:mb-2">
                                    <label className="flex mb-3 lato-regular text-start text-primary font-[500]">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        name="quantities"
                                        value={form.quantities}
                                        onChange={handleChange}
                                        min="1"
                                        className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none text-primary placeholder:text-secondary bg-gray-100 rounded-2xl"
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div className="mb-6 lg:mb-6 max-md:mb-3 max-sm:mb-2">
                                    <label className="flex mb-3 lato-regular text-start text-primary font-[500]">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="flex items-center w-full px-5 py-4 text-sm text-secondary lato-regular outline-none bg-gray-100 rounded-2xl appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.7em] bg-[right_1.3em_center] bg-no-repeat pr-12"
                                    >
                                        <option value="N/A">
                                            Select Category
                                        </option>
                                        <option value="Apparel">Apparel</option>
                                        <option value="Electronics">
                                            Electronics
                                        </option>
                                        <option value="Home">Home</option>
                                        <option value="Beauty&Health">
                                            Beauty & Health
                                        </option>
                                        <option value="Sports">Sports</option>
                                        <option value="Books">Books</option>
                                        <option value="Toys">Toys</option>
                                    </select>
                                </div>
                            </div>

                            {/* Description - Full Width */}
                            <div className="mb-6 p-6">
                                <label className="flex mb-3 lato-regular text-start text-primary font-[500]">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Enter product description"
                                    className="w-full px-5 py-4 text-sm font-medium outline-none text-primary placeholder:text-secondary bg-gray-100 rounded-2xl resize-none"
                                />
                            </div>

                            <div className="flex justify-center gap-4 p-6">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-6 py-5 poppins-semibold font-bold leading-none text-gray-700 transition duration-500 w-40 rounded-2xl border-2 border-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-5 poppins-semibold font-bold leading-none text-white transition duration-500 w-40 rounded-2xl bg-gray-700 hover:bg-gray-800"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
