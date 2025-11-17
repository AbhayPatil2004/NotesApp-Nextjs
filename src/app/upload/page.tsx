"use client";

import React from "react";

export default function Upload() {

  const uploadData = async () => {

    const data = {
      title: "Swap 2 Numbers",
      description: "How to swap two numbers in cpp",
      uploadedBy: "Abhay",
      category: "coding",

      content:
        "#include <iostream>\n" +
        "using namespace std;\n\n" +
        "int main() {\n" +
        "    int a = 10, b = 20;\n\n" +
        "    int temp = a;\n" +
        "    a = b;\n" +
        "    b = temp;\n\n" +
        "    cout << \"a = \" << a << \", b = \" << b;\n" +
        "    return 0;\n" +
        "}\n",

      tags: ["cpp", "swap"],
      likes: 0,
      downloads: 0,
    };

    try {
      const res = await fetch("/api/textUpload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();
      console.log("API Response:", response);

      if (!res.ok) {
        alert("Error: " + response.message);
      } else {
        alert("Upload Successful!");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div>
      <button onClick={uploadData}>Upload Code</button>
      <div>Hello World</div>
    </div>
  );
}
