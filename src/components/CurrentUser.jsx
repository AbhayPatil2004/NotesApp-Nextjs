"use client";

import React, { useEffect, useState } from "react";
import LogoutButton from "@/components/Logout";
import ProfileIcon from "@/components/ProfileIcon";
import { useRouter } from "next/navigation";

function CurrentUser() {
  const router = useRouter();
  const [userName, setUsername] = useState("");

  // helper to read localStorage and set state
  const readUserFromStorage = () => {
    const stored = typeof window !== "undefined" && localStorage.getItem("user");
    if (!stored) {
      setUsername("");
      return;
    }

    try {
      const userObj = JSON.parse(stored);
      setUsername(userObj.userName || userObj.username || "");
    } catch (err) {
      console.warn("Failed to parse user from localStorage", err);
      setUsername("");
    }
  };

  useEffect(() => {
    // initial read
    readUserFromStorage();

    // storage event fires for other tabs/windows when localStorage changes
    const onStorage = (e) => {
      if (e.key === "user") {
        readUserFromStorage();
      }
    };
    window.addEventListener("storage", onStorage);

    // custom event for same-tab changes (we will dispatch this manually on login/logout)
    const onUserChange = () => {
      readUserFromStorage();
    };
    window.addEventListener("user-change", onUserChange);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("user-change", onUserChange);
    };
  }, []);

  return (
    <div>
      {userName ? (
        <div className="w-full flex justify-between items-center rounded-md shadow gap-5 md:text-sm">
          <h1 className="text-base sm:text-lg md:text-xl font-semibold text-white">
            <button
              className="cursor-pointer"
              onClick={() => {
                router.push("/profile");
              }}
            >
              {userName}
            </button>
          </h1>
          <LogoutButton />
        </div>
      ) : (
        <ProfileIcon />
      )}
    </div>
  );
}

export default CurrentUser;
