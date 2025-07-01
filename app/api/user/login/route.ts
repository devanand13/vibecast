"use server"

import { NextRequest, NextResponse } from 'next/server';
import {  PrismaClient } from '@/generated/prisma';
import { NextApiRequest } from 'next';

export async function POST(request : Request) {
    const prisma = new PrismaClient()

    const body = await request.json()

    const email = body.email;
    const password = body.password;
    
    try{
        const user = await prisma.user.findFirst({
            where:{
                username:email
            }
        })

        if(user?.password == password){
            return NextResponse.json({ message: 'Logged In!', user: user });
        }else{
            return NextResponse.json({ message: 'Invalid Credentials!'});
        }
    }catch(e){
        return NextResponse.json({ message: 'Signup Failed, please check the fields!', status:400 });    
    }
    

    
}
