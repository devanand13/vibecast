import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { MyTokenPayload } from "@/types/auth";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function getAuthenticatedUser(): Promise<MyTokenPayload | null> {
    const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as MyTokenPayload;
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
}
