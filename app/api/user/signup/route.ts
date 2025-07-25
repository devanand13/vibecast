"use server"

import {  NextResponse } from 'next/server';
import {  PrismaClient } from '@/generated/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request : Request) {
    const prisma = new PrismaClient()

    const body = await request.json()

    const email = body.email;
    const password = body.password;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try{

        const checkifUserExists = await prisma.user.findFirst({
            where:{
                username:email
            }
        })

        if(checkifUserExists){
            return NextResponse.json({ message: 'User already exists! Please login to continue'},{ status:400 });    
        }
        const user = await prisma.user.create({
            data:{
                username:email,
                password:hashedPassword,
            }
        })

        const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "7d" });
        return NextResponse.json({ message: 'Signed Up!', token },{status:200});
    }catch(e){
        console.log(e)
        return NextResponse.json({ message: 'Signup Failed, please check the fields!'},{ status:400 });    
    }
    

    
}
