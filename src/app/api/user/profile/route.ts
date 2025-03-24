import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

// const profileHandler = async (req: NextApiRequest & { user?: any }, res: NextApiResponse) => {
//     if (req.user) {
//         return res.status(200).json({ user: req.user });
//     }

//     res.status(401).json({ message: 'Unauthorized, no token provided' });
// };

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//     return authenticateUser(req, res, profileHandler);
// }

export async function GET(req: NextRequest) {
    return NextResponse.json({ messaege: 'Welcome to authorized api route' }, { status: 200 })
}

// // Get users
// export async function GET(req: NextRequest) {
//     // Get token from the Authorization header
//     const token = req.headers.get("Authorization")?.split(" ")[1];
//     console.log("Received token:", token); // Debugging: Log received token
//     if (!token) {
//         return NextResponse.json(
//             { error: "No token provided" },
//             { status: 401 }
//         );
//     }

//     try {
//         // Verify token
//         const decoded = await verifyToken(token);
//         console.log("Decoded token payload:", decoded); // Debugging: Log decoded token payload
//         await connectToDatabase();

//         if (!decoded || typeof decoded !== "object" || !decoded.id) {
//             return NextResponse.json(
//                 { error: "Invalid token payload" },
//                 { status: 401 }
//             );
//         }

//         const user = await User.findById(decoded.id);
//         if (!user) {
//             return NextResponse.json(
//                 { error: "User not found" },
//                 { status: 404 }
//             );
//         }

//         const { password, ...userData } = user.toObject();
//         console.log("Returning user data:", userData); // Debugging: Log user data being returned
//         return NextResponse.json({ message: "User found", user: userData });
//     } catch (error) {
//         console.error("Server error:", error);
//         return NextResponse.json(
//             { error: "Server error occurred" },
//             { status: 500 }
//         );
//     }
// }
