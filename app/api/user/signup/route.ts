import { NextRequest, NextResponse } from 'next/server';
import {  PrismaClient } from '@/generated/prisma';
import { NextApiRequest } from 'next';

export async function POST(request : Request) {
    const prisma = new PrismaClient()

    const body = await request.json()

    const email = body.email;
    const password = body.password;
    console.log(body)
    
    try{
        const user = await prisma.user.create({
            data:{
                username:email,
                password:password,
            }
        })

        return NextResponse.json({ message: 'Signed Up!', user: user });
    }catch(e){
        return NextResponse.json({ message: 'Signup Failed, please check the fields!', status:400 });    
    }
    

    
}
