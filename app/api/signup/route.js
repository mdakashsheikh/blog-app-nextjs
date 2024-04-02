// http://localhost:3000/api/signup

import User from "@/models/User";
import bcrypt from 'bcrypt';
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB()
        const { name, email, password } = await req.json();
        const isExisting = await User.findOne({ email });
        if(isExisting) {
            return NextResponse.json({
                message: 'User already existing!'
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({
            name, email, password: hashPassword 
        })

        return NextResponse.json({ 
            success: true,
            message: newUser,

        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'POST Error Form (Sign Up POST)'
        })
    }
}