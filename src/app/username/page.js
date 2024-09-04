"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout";

export default function UsernamePage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username.trim() === "") {
      setError("Username cannot be empty");
      return;
    }

    // Store the username in sessionStorage
    sessionStorage.setItem("username", username);

    // Redirect to the projects page
    router.push("/");
  };

  return (
    <PageLayout pageName={"Enter Username"}>
      <div className="p-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Enter Your Username</h1>
        <form
          className="bg-theme_black/10 text-theme_black/60 py-10 px-16 flex flex-col justify-center items-center gap-10 rounded-2xl"
          onSubmit={handleSubmit}
        >
          <div className="text-lg flex flex-col gap-3 w-full">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={handleInputChange}
              placeholder="Enter Your Username"
              className="px-3 py-4 rounded-3xl border border-theme_black/40 focus:outline-none focus:border-theme_black/90"
              required
            />
          </div>

          {error && <span className="text-red-500">{error}</span>}

          <button
            type="submit"
            className="w-[400px] xl:w-[500px] text-center py-4 bg-theme_black/90 text-white rounded-full text-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </PageLayout>
  );
}
