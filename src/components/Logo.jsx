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
                className="flex items-center gap-3 cursor-pointer" // align in row with space
            >
                <Image src="/notes-svgrepo-com.svg" alt="logo" width={60} height={60} className="rounded-full p-1 sm:p-2" />



                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    NOTES SHARE
                </h1>
            </button>
        </div>

    )
}

export default Logo