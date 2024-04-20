"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import moment from "moment";

import { 
    AiFillDelete, 
    AiFillHeart, 
    AiOutlineComment, 
    AiOutlineHeart, 
    AiTwotoneCalendar 
} from 'react-icons/ai'

import { BsFillPencilFill, BsTrash } from 'react-icons/bs'
import demoImage from '@/public/img/demo_image.jpg'
import Input from '@/components/Input'
import { deletePhoto } from "@/action/uploadAction";

const splitParagraph = (paragraph) => {
    const MIN_LENGTH = 280;
    const sentences = paragraph.split('. ')

    let currentParagraph = '';
    let paragraphs = [];

    for(let i = 0; i < sentences.length; i ++) {
        const sentence = sentences[i];
        const isLastSentence = i === sentences.length - 1;

        if (isLastSentence) {
            currentParagraph += sentence + " "; // No dot after the last sentence
        } else if (currentParagraph.length + sentence.length + 2 <= MIN_LENGTH) {
            currentParagraph += sentence + ". ";
        } else {
            paragraphs.push(<p key={paragraphs.length}>{currentParagraph.trim()}</p>);
            currentParagraph = sentence + ". ";
        }
    }

    if (currentParagraph) {
        paragraphs.push(<p key={paragraphs.length}>{currentParagraph.trim()}</p>);
    }

    return paragraphs;
}


const BlogDetails = ({params}) => {
    const [blogDetails, setBlogDetails] = useState({});
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [blogLikes, setBlogLikes] = useState(0)

    const router = useRouter();
    const { data: session, status} = useSession();

    const fetchBlog = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/blog/${params.id}`);
            const blog = await response.json();
            setBlogDetails(blog);
            setIsLiked(blog?.likes?.includes(session?.user?._id))
            setBlogLikes(blog?.likes?.length || 0)

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchBlog()
    }, [])

    const timeStr = blogDetails?.createdAt;
    const time = moment(timeStr)
    const formattedTime = time.format('MMMM Do YYYY')

    const handleBlogDelete = async (imageId) => {
        try {
            const confirmModel = window.confirm('Are you sure you want to delete your blog?')

            if(confirmModel) {
                setIsDeleting(true)

                const response = await fetch(`http://localhost:3000/api/blog/${params.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${session?.user?.accessToken}`
                    }
                })

                if(response?.status === 200) {
                    await deletePhoto(imageId);
                    router.refresh()
                    router.push('/blog')
                }
            }

            setIsDeleting(false);

        } catch (error) {
            console.log(error);
        }
    }

    const handleLike = async() => {
        if(!session?.user) {
            alert('Please login before liking.')
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/blog/${params.id}/like`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${session?.user?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(null)
            })

            if(response.status ===  200) {
                setIsLiked(prev => !prev)
                setBlogLikes(prev => (isLiked ? prev - 1 : prev + 1))
            } else {
                console.log('Request failed with status:', response.status)
            }

        } catch (error) {
            console.log(error)
        }
    }

    console.log(blogLikes)

    return (
        <section className="container max-w-3xl">
            {blogDetails?.authorId?._id.toString() === session?.user?._id.toString() && (
                <div className="flex items-center justify-end gap-5">
                    <Link href={`/blog/edit/${params.id}`} className="flex items-center gap-1 text-primaryColor">
                        <BsFillPencilFill/>
                        Edit
                    </Link>

                    <button onClick={() => handleBlogDelete(blogDetails?.image?.id)} className="flex items-center gap-1 text-red-600">
                        <BsTrash/>
                        { isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            )}

            <div className="flex flex-col items-center justify-center">
                <Link href={`/user/${blogDetails?.authorId?._id.toString()}`}>
                    <div className="flex flex-col justify-center items-center py-10">
                        <Image
                            src={
                                blogDetails?.authorId?.avatar?.url
                                    ? blogDetails?.authorId?.avatar?.url
                                    : demoImage
                            }
                            alt="avatar image"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-20 h-20 rounded-full"
                        />

                        <div className="text-center">
                            <p className="text-white">{blogDetails?.authorId?.name}</p>
                            <p>{blogDetails?.authorId?.designation}</p>
                        </div>

                        <div className="text-center space-y-3">
                            <h2>{blogDetails?.title}</h2>
                            <p>{blogDetails?.excerpt}...</p>
                            <p className="flex items-center justify-center gap-3">
                                <span className="text-primaryColor">{blogDetails?.category}</span>

                                <span className="flex  items-center gap-1">
                                    <AiTwotoneCalendar/>
                                    {formattedTime}
                                </span>
                            </p>

                            <div>
                                <Image
                                    src={blogDetails?.image ? blogDetails?.image?.url : demoImage}
                                    alt="blog details image"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="w-full h-full rounded-lg py-10"
                                />
                            </div>

                            <div className="text-start">
                                <div className="space-y-5">
                                    {
                                        blogDetails?.description && splitParagraph(blogDetails?.description).map(
                                            (paragraph, pIndex) => (
                                                <div key={pIndex}>
                                                    {pIndex === 
                                                        Math.floor(
                                                            splitParagraph(blogDetails?.description).length / 2
                                                        ) && (
                                                            <blockquote className="border-l-4 border-primaryColor border-spacing-6 italic mb-5">
                                                                <p className="ml-5">{blogDetails?.quote}</p>
                                                            </blockquote>
                                                        )
                                                    }
                                                    {paragraph}
                                                </div>
                                            )
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="py-12">
                <div className="flex gap-10 items-center text-xl justify-center">
                    <div className="flex items-center gap-1">
                        <p>{blogLikes}</p>

                        {
                            isLiked ? (
                                <AiFillHeart onClick={() => handleLike} size={20} color="#ed5784" cursor='pointer' />
                            ) : (
                                <AiOutlineHeart onClick={() => handleLike} size={20} cursor='pointer' />
                            )
                        }

                    </div>

                    <div className="flex items-center gap-1">
                        <p>12</p>

                        <AiOutlineComment size={20} />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-red-500">Kindly login to leave a comment</h3>

                <form  className="space-y-2">
                    <Input name='comment' type='text' placeholder='Type message...'/>
                    <button type="submit" className="btn">
                        Comment
                    </button>
                </form>

                <div className="flex gap-3 py-5 items-center">
                    <Image
                        src={demoImage}
                        alt="avatar image"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <p className="text-whiteColor">John</p>
                        <p>This is our first comment</p>
                    </div>

                    <BsTrash cursor='pointer' className="text-red-500 ml-10"/>
                </div>
            </div>
        </section>
    )
}

export default BlogDetails