import { logoutUser } from "@/features/auth/authService";

export async function POST() {
    return await logoutUser();
}
