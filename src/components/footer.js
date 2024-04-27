"use client"


import { FaHouse, FaRegBookmark, FaTicket } from "react-icons/fa6";
import Link from 'next/link'

export default function Footer({ page, token }) {    
    return (
        <footer className="fixed bottom-0 h-[12.5%] w-full shadow-2xl order-t-4 border-gray-50 bg-inherit flex justify-center items-center pb-4">
            <ul className="flex justify-evenly w-[80%]">
                <li>
                    <Link href={'/' + '?userID=' + token}>
                        <FaHouse className={`${page == 'home' && 'text-[#D6D6FD]'} outline-black"`} size={30} />
                    </Link>
                </li>
                {!token && <li>
                    <Link href='/login'>
                        <FaTicket className={`${page == 'login' && 'text-[#D6D6FD]'} rotate-90 border-black`} size={30} />
                    </Link>
                </li>}
                <li>
                    <Link href={'/favorites' + '?userID=' + token}>
                        <FaRegBookmark className={page == 'favorites' && 'text-[#D6D6FD]'} size={30} />
                    </Link>
                </li>
            </ul>
        </footer>
    )
}