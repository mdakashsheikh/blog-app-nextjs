import React from 'react'

const Footer = () => {
    return (
        <div className='py-10 text-center'>
            Copyright © {new Date().getFullYear()} All rights reserved.
            <br/>
            This website is made with &hearts; by Akash.
        </div>
    )
}

export default Footer