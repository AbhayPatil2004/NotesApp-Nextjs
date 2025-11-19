"use client";

import React, { useEffect, useState } from "react";

function Page() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/fetchTextContent", {
        method: "GET",
      });

      const json = await res.json(); // convert to JSON

      if (!json.ok) {
        console.log("Error:", json.message);
        return;
      }

      setData(json.fetchedData); // set fetched documents
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Fetched Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Page;
