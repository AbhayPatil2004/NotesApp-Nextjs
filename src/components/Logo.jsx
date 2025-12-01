"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

function Logo() {

    const router = useRouter()

    return (
        <div>
            <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer"
            >
                <Image
                    src="/notebook-svgrepo-com.svg"
                    alt="logo"
                    width={35}         // smaller size for mobile
                    height={35}
                    className="p-0 sm:p-2 sm:w-[60px] sm:h-[60px]"
                />
                <h1 className=" sm:text-3xl font-bold text-white">
                    NOTES SHARE
                </h1>
            </button>
        </div>

    )
}

export default Logo