"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("name");
    localStorage.removeItem("userName")
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="cursor-pointer"
    >
      <Image
        src="/login-svgrepo-com.svg"
        alt="profile"
        width={40}
        height={40}
        className="bg-white rounded-full p-1 sm:p-2"
      />
    </button>
  );
}
