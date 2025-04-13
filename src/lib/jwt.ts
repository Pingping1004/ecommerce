import { SignJWT, jwtVerify, JWTPayload } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

if (!SECRET_KEY) {
    throw new Error("JWT_SECRET environment variable is not set");
}

export const signToken = async (payload: JWTPayload) => {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(SECRET_KEY);
};

export const verifyToken = async (token: string) => {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        console.error("Token verification failed:", error);
        throw new Error("Invalid token");
    }
};
