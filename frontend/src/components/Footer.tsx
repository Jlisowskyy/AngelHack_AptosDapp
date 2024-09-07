import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AptosIcon from "@/assets/aptos_ico.svg";

const Footer: React.FC = () => {
    return (
        <footer className='bg-black text-white py-8'>
            <div className='container mx-auto px-4'>
                <div className='flex flex-row justify-between items-center'>
                    <div className={"flex flex-row"}>
                        <div className={"mr-[2rem]"}>
                            <h2 className={'text-2xl font-bold'}>TicketsChain</h2>
                            <p className={'text-sm'}>Tickets selling secure and safe as never</p>
                        </div>
                        <Image src={"/icon64.png"} alt={"TicketsChain"} width={64} height={64}/>
                    </div>

                    <div className='mt-8 text-center text-sm'>
                    <p>&copy; {new Date().getFullYear()} TicketsChain. All rights reserved.</p>
                    </div>
                    <div className='flex flex-col md:flex-row items-center'>
                        <div>
                            <h2 className='text-lg font-semibold mb-2'>Powered by:</h2>
                            <Link href='https://aptosfoundation.org/' className='hover:text-blue-400 flex flex-row items-center justify-between'>
                                <h3 className={"font-bold mr-[1rem]"}>{"Aptos"}</h3>
                                <Image src={AptosIcon} alt={"Aptos foundation icon"} width={64} height={64}/>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;