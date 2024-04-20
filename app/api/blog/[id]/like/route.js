// http://localhost:3000/api/blog/blogid/like

import Blog from "@/models/Blog";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";

export async function PUT(req, res) {
    await connectDB();

    const id = res.params.id

    const accessToken = req.headers.get('authorization');
    const token = accessToken.split(' ')[1];

    const decodedToken = verifyJwtToken(token);

    if(!accessToken || !decodedToken) {
        return NextResponse.json(
            { error: 'unauthorized (wrong or expired token)'},
            { status: 403 }
        )
    }

    try {
        const blog = await Blog.findById(id)

        if(blog.likes.includes(decodedToken._id)) {
            blog.likes = blog.likes?.filter(id => id.toString() !== decodedToken._id.toString())
        } else {
            blog.likes.push(decodedToken._id)
        }

        await blog.save()

    
        return NextResponse.json(blog, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'PUT error'}, { status: 500 })
    }
}
