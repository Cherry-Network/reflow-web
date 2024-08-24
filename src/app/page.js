
"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout";
import { AddProjectButton } from "@/components/add-project";

export default function Home() {
  const router = useRouter();
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);

  const showProject = (project) => {
    localStorage.setItem("selectedProjectID", project._id);
    router.push("/viewproject");
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProjectData(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <PageLayout pageName={"Projects"}>
      <div className="p-10 flex flex-wrap gap-4 justify-start items-stretch">
        {loading ? (
          <p>Loading...</p>
        ) : (
          projectData.map((project, index) => (
            <button
              key={index}
              className="flex flex-col gap-1 py-6 h-[250px] justify-center items-center bg_project_card rounded-2xl w-[400px]"
              onClick={() => showProject(project)}
            >
              <span className="text-2xl text-theme_white font-bold">
                {project.name}
              </span>
              <span className="text-sm font-medium tracking-wide text-gray-300">
                ID: {project._id}
              </span>
            </button>
          ))
        )}
        <AddProjectButton
          addProjectFunction={() => router.push("/addproject")}
        />
      </div>
    </PageLayout>
  );
}
