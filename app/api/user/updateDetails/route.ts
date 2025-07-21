"use server";

import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { username, ...dataToUpdate } = body;
 
    if (!username) {
      return NextResponse.json({ message: 'Email is required to identify user' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { 
        username:username
       },
      data: dataToUpdate,
    });

    const token = jwt.sign(updatedUser, process.env.JWT_SECRET!, { expiresIn: "7d" });

    return NextResponse.json({ message: 'User updated', token }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}
