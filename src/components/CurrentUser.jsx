"use client"

import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import LogoutButton from './Logout';
import ProfileIcon from './ProfileIcon';
import { useRouter } from 'next/navigation';

function CurrentUser() {

    const router = useRouter()
    const [userName, setUsername] = useState("")

    useEffect(() => {

        const stored = localStorage.getItem("user");

        if (!stored) {
            // router.push("/auth/signup");
            return;
        }

        const userObj = JSON.parse(stored);   // <--- IMPORTANT

        setUsername(userObj.userName || userObj.username);

        // fetchUserDetails(stored);
    }, []);
    return (
        <div>
            {
                userName !== "" ? (
                    <div className="w-full flex justify-between items-center rounded-md shadow gap-5 md:text-sm">
                        <h1 className="text-base sm:text-lg md:text-xl font-semibold text-white">
                            <button className="cursor-pointer">
                                {userName}
                            </button>
                        </h1>
                        <LogoutButton />
                    </div>

                ) : (
                    <ProfileIcon />
                )
            }
        </div>
    )
}

export default CurrentUser