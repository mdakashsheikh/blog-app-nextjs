'use client'

import React, { useEffect, useState } from 'react';
import Input from './Input';
import Link from 'next/link';

const SighupForm = () => {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, [])
    if(!hydrated) {
        return null;
    }
    
    return (
        <section className='container'>
            <form className='border-2 border-paragraphColor rounded-lg max-w-sm mx-auto px-8 py-6 space-y-5'>
                <h2 className='text-center special-word'>Sign Up</h2>

                <Input label='name' type='text' name='name'/>
                <Input label='Email' type='text' name='email'/>
                <Input label='Password' type='password' name='password'/>

                <button type='submit' className='btn w-full'>Sign Up</button>
                <p className='text-center'>
                    Already a user? {" "}
                    <Link href='/login' className='text-primaryColor'>Login</Link>
                </p>
            </form>
        </section>
    )
}

export default SighupForm