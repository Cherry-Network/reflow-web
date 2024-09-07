"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout";

export default function AddProject() {
  const router = useRouter();
  const [projectDetails, setProjectDetails] = useState({
    project_name: "",
    project_description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Get the stored username from session storage
    const username = sessionStorage.getItem("username");

    if (!username) {
      console.error("Username not found in session storage");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectDetails.project_name,
          description: projectDetails.project_description,
          devices: [],
          username, // Include the username in the request body
        }),
      });

      if (response.ok) {
        console.log("Project Added Successfully");
        router.push("/");
      } else {
        console.error("Error adding project:", await response.text());
      }
    } catch (error) {
      console.error("Error adding project:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageLayout pageName={"My Projects"}>
        <div className="p-10">
          <div className="text-3xl font-bold text-theme_black/90">
            Please Fill the Details
          </div>
          <form
            className="bg-theme_black/10 text-theme_black/60 py-10 px-16 flex flex-col justify-center items-center gap-10 rounded-2xl mt-10"
            onSubmit={handleSubmit}
          >
            <div className="text-lg flex flex-col gap-3 w-full">
              <span>Project Name</span>
              <input
                type="text"
                name="project_name"
                value={projectDetails.project_name}
                onChange={handleInputChange}
                placeholder="Enter Project Name"
                className="px-3 py-4 rounded-3xl border border-theme_black/40 focus:outline-none focus:border-theme_black/90"
                required
              />
            </div>
            <div className="text-lg flex flex-col gap-3 w-full">
              <span>Project Description</span>
              <div className="rounded-3xl border border-theme_black/40 bg-white p-2">
                <textarea
                  name="project_description"
                  placeholder="Enter Project Description"
                  value={projectDetails.project_description}
                  onChange={handleInputChange}
                  maxLength={1500}
                  className="px-3 py-4 h-[200px] w-full focus:outline-none"
                  required
                />
                <span className="text-sm text-theme_black/40 flex justify-end px-3">
                  ({projectDetails.project_description.length} / 1500) Max. 250
                  words
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-[400px] xl:w-[500px] text-center py-4 bg-theme_black/90 text-white rounded-full text-lg"
              disabled={submitting}
            >
              {submitting ? (
                <svg
                  className="animate-spin mx-auto h-7 w-7 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Add Project"
              )}
            </button>
          </form>
        </div>
      </PageLayout>
    </>
  );
}
