"use server";

import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import jwt from "jsonwebtoken";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, profileImage } = body;

    const updatedUser = await prisma.user.update({
      where: { id: user.id }, 
      data: {
        ...(name && { name }),
        ...(profileImage && { profileImage }),
      },
    });

    // Minimize what's stored in JWT
    const token = jwt.sign(
      {
        id: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.name,
        profileImage: updatedUser.profileImage,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ message: "User updated", token }, { status: 200 });
  } catch (e) {
    console.error("Update error:", e);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
