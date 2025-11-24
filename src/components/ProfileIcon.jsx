"use client"

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function ProfileIcon() {

    const router = useRouter()
    return (
        <button className="bg-black text-white p-1 sm:p-2 rounded-full cursor-pointer"
            onClick={() => router.push("/profile")}
        >
            <Image
                src="/profile-round-1346-svgrepo-com.svg"
                alt="profile"
                width={40}
                height={40}
                className="bg-white rounded-full p-1 sm:p-2"
            />
        </button>
    )
}

export default ProfileIcon