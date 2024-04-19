// http://localhost:3000/api/blog/someid

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
        const body = await req.json();
        const blog = await Blog.findById(id).populate('authorId')

        if(blog?.authorId?._id.toString() !== decodedToken._id.toString()) {
            return NextResponse.json(
                { message: 'Only author can update his/her blog' },
                { status: 403 }
            )
        }

        const updateBlog = await Blog.findByIdAndUpdate(
            id, 
            { $set: { ...body }}, 
            { new: true }
        )

        return NextResponse.json(updateBlog, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'PUT error'}, { status: 500 })
    }
}

export async function GET(req, res) {
    await connectDB()

    const id = res.params.id;

    try {
        const blog = await Blog.findById(id).populate({
            path: 'authorId',
            select: '-password'
        }).populate({
            path: 'comments.user',
            select: '-password'
        })

        return NextResponse.json(blog, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'GET error'}, {
            status: 500
        })
    }
}

export async function DELETE(req, res) {
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
        const blog = await Blog.findById(id).populate('authorId')

        if(blog?.authorId?._id.toString() !== decodedToken._id.toString()) {
            return NextResponse.json(
                { message: 'Only author can delete his/her blog' },
                { status: 403 }
            )
        }

        await Blog.findByIdAndDelete(id)

        return NextResponse.json({ message: 'Successfully deleted blog.'}, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'DELETE error'}, { status: 500 })
    }
}