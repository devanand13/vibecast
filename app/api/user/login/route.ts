"use server";

import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();

  const email = body.email;
  const passwordInput: string = body.password;

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: email
      }
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid Credentials!" }, { status: 401 });
    }

    const isvalidPassword = await bcrypt.compare(passwordInput, user.password);

    if (!isvalidPassword) {
      return NextResponse.json({ message: "Invalid Credentials!" }, { status: 401 });
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userRes } = user;

    const token = jwt.sign(userRes, process.env.JWT_SECRET!, { expiresIn: "7d" });

    return NextResponse.json({ message: "Logged In!", token }, { status: 200 });

  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Login Failed, please check the fields!" }, { status: 500 });
  }
}
