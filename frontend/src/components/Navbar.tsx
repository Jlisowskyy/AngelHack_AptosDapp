'use client';

import React from 'react';
import Link from 'next/link';
import Image from "next/image";

const Navbar: React.FC = () => {
    return (<nav className='bg-black text-white p-4 sticky top-0 z-50 border-b-2 border-b-white h-[4.5rem]'>
        <div className='container mx-auto flex justify-between items-center md:pt-1 md:pb-1'>
            <div className='flex items-end space-x-2'>
                <Link href='/' className='text-2xl font-bold'>
                    TicketsChain
                </Link>
                <Image
                    src='/icon32.png'
                    alt='TicketsChain logo'
                    width={32}
                    height={32}
                    className='mb-1' // Align the bottom of the logo with the text
                />
            </div>

            <div className='flex space-x-16 text-2xl justify-center w-full font-bold'>
                <Link className='hover:transition-colors hover:text-gray-400 duration-300' href='/'>Home</Link>
                <Link className='hover:transition-colors hover:text-gray-400 duration-300' href='/buy-tickets'>Buy tickets</Link>
                <Link className='hover:transition-colors hover:text-gray-400 duration-300'
                      href='/trade-tickets'>Trade tickets</Link>
                <Link className='hover:transition-colors hover:text-gray-400 duration-300'
                      href='/your-tickets'>Your tickets</Link>
                <Link className='hover:transition-colors hover:text-gray-400 duration-300'
                      href='/create-event'>Create event</Link>
            </div>
        </div>
    </nav>);
}

export default Navbar;
