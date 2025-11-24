"use client";
import { useRouter } from "next/navigation";

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
      className="px-4 py-2 bg-white text-black rounded-md text-12px cursor-pointer md:text-sm"
    >
      Logout
    </button>
  );
}
