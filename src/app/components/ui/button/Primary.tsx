import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
}

export default function PrimaryButton({ children }: ButtonProps) {
    return (
        <button className="w-full px-6 py-5 mb-10 text-sm font-bold leading-none text-white transition duration-500 md:w-96 rounded-2xl bg-blue-500 hover:bg-blue-600 hover:cursor-pointer focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500">
            {children}
        </button>
    );
}
