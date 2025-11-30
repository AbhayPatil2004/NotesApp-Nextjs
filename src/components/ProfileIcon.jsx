"use client"

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function ProfileIcon() {

    const router = useRouter()
    return (
        <button
            className="bg-black text-white p-1 sm:p-2 rounded-full cursor-pointer"
            onClick={() => router.push("/profile")}
        >
            <Image
                src="/profile-round-1346-svgrepo-com.svg"
                alt="profile"
                width={28}          // mobile size
                height={28}
                className="
      bg-white rounded-full p-1
      w-[28px] h-[28px]     /* mobile size */
      sm:w-[40px] sm:h-[40px] /* tablet and up */
      md:w-[48px] md:h-[48px] /* bigger screens */
    "
            />
        </button>

    )
}

export default ProfileIcon