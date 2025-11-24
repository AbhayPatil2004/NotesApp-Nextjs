"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [myCodes, setMyCodes] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [myPdfs, setMyPdfs] = useState([]);

  
  const fetchUserDetails = async (uname) => {
    try {
      setLoading(true);

      const [codesRes, imagesRes, pdfsRes] = await Promise.all([
        fetch(`/api/myUploads/Codes?username=${encodeURIComponent(uname)}`),
        fetch(`/api/myUploads/Images?username=${encodeURIComponent(uname)}`),
        fetch(`/api/myUploads/Pdfs?username=${encodeURIComponent(uname)}`),
      ]);

      if (!codesRes.ok) throw new Error("Failed to fetch codes");
      if (!imagesRes.ok) throw new Error("Failed to fetch images");
      if (!pdfsRes.ok) throw new Error("Failed to fetch pdfs");

      const [codes, images, pdfs] = await Promise.all([
        codesRes.json(),
        imagesRes.json(),
        pdfsRes.json(),
      ]);

      setMyCodes(codes || []);
      setMyImages(images || []);
      setMyPdfs(pdfs || []);

      console.log("Data fetched successfully");
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("Error occurred — try again later.");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const stored = localStorage.getItem("username");

    if (!stored) {
      router.push("/auth/signup");
      return;
    }

    setUsername(stored);
    // fetchUserDetails(stored);
  }, []);

  return (
    <div>
      <h1>Profile</h1>

      {/* {loading && <p>Loading your uploads...</p>}

      {!loading && (
        <>
          <h3>Your Codes</h3>
          <pre>{JSON.stringify(myCodes, null, 2)}</pre>

          <h3>Your Images</h3>
          <pre>{JSON.stringify(myImages, null, 2)}</pre>

          <h3>Your PDFs</h3>
          <pre>{JSON.stringify(myPdfs, null, 2)}</pre>
        </>
      )} */}
    </div>
  );
}
