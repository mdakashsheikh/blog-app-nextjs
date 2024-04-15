// http://localhost:3000/api/blog

import Blog from "@/models/Blog";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();

    const accessToken = req.headers.get('authorization');
    const token = accessToken.split(' ')[1]
}