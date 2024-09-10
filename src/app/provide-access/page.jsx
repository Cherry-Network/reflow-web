"use client";

import PageLayout from "@/components/layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ProvideAccess = () => {
  const router = useRouter();
  const [accessDetails, setAccessDetails] = useState({
    username: "",
    projectID: "",
  });
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");

    if (!storedUsername) {
      router.push("/username");
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            username: storedUsername,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Fetched Project Data:", data);

        if (data && data.ownProjects) {
          setProjectData(data.ownProjects);
        } else {
          console.warn("Own projects data not found:", data);
          setProjectData([]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjectData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccessDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/provide-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accessDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to provide access");
      }

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error providing access:", error);
    } finally {
      setSubmitting(false);
      setAccessDetails({ username: "", projectID: "" });
    }
  };

  return (
    <PageLayout pageName={"Provide Access"}>
      <div className="p-10">
        <div className="text-3xl font-bold text-theme_black/90">
          Provide the Access Details
        </div>
        <form
          className="bg-theme_black/10 text-theme_black/60 py-10 px-16 flex flex-col justify-center items-center gap-10 rounded-2xl mt-10"
          onSubmit={handleSubmit}
        >
          <div className="text-lg flex flex-col gap-3 w-full">
            <span>Enter Username :</span>
            <input
              type="text"
              name="username"
              value={accessDetails.username}
              onChange={handleInputChange}
              placeholder="Enter Username to Provide Access"
              className="px-3 py-4 rounded-2xl border border-theme_black/40 focus:outline-none focus:border-theme_black/90"
              required
            />
          </div>
          <div className="text-lg flex flex-col gap-3 w-full">
            <span className="">Select Project :</span>
            <select
              name="projectID"
              className="px-3 py-4 border border-theme_black/40 rounded-2xl focus:border-theme_black/90 focus:outline-none"
              onChange={handleInputChange}
              value={accessDetails.projectID}
              required
            >
              <option value="">Select Project to give Access</option>
              {projectData.length > 0 ? (
                projectData.map((option, index) => (
                  <option
                    key={index}
                    value={option._id}
                    className="text-black max-w-fit"
                  >
                    {option.name}
                  </option>
                ))
              ) : (
                <option value="">No Projects to Select</option>
              )}
            </select>
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
              "Provide Access"
            )}
          </button>
        </form>
      </div>
    </PageLayout>
  );
};

export default ProvideAccess;
