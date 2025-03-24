import React from "react";

export default function TextInput() {
    return (
        <div>
            <input
                type="text/email"
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none mb-7 placeholder:text-gray-400 bg-gray-100 text-gray-900 rounded-2xl"
            />
        </div>
    );
}
