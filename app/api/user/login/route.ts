"use server"

import {  NextResponse } from 'next/server';
import {  PrismaClient } from '@/generated/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request : Request) {
    const prisma = new PrismaClient()

    const body = await request.json()

    const email = body.email;
    const password:string = body.password;
    
    try{
        const user = await prisma.user.findFirst({
            where:{
                username:email
            }
        })
        if (!user) {
            return NextResponse.json({ message: "Invalid Credentials!" }, { status: 401 });
        } 
        
        const isvalidPassword = await bcrypt.compare(password,user.password);
        
        if(isvalidPassword){
            return NextResponse.json({ message: 'Logged In!', user: user },{status:200});
        }else{
            return NextResponse.json({ message: 'Invalid Credentials!'},{status:401} );
        }
    }catch(e){
        console.log(e)
        return NextResponse.json({ message: 'Login Failed, please check the fields!'}, {status:500 });    
    }
}
