import React from "react";
import Image from "next/image";

export default function Divider() {
    return (
        <>
            <div>
                <Image
                    src="/image/Line.svg"
                    alt="Line"
                    width={2}
                    height={64}
                    className="flex text-primary mx-12"
                    style={{ width: "2px", height: "64px" }}
                />
            </div>
        </>
    );
}
