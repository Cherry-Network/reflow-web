"use client";
import Form from "@/components/forms";
import { useState, useEffect } from "react";
import { AddProjectButton } from "@/components/add-project";
import PageLayout from "@/components/layout";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  const [projectData, setProjectData] = useState([]);

  const showProject = (project) => {
    localStorage.setItem("projectDetail", JSON.stringify(project));
    router.push("/viewproject");
  };

  console.log(projectData);

  useEffect(() => {
    setProjectData(JSON.parse(localStorage.getItem("projects")) || []);
  }, []);

  return (
    <>
      <PageLayout pageName={"Add Project"}>
        <div className="p-10 flex flex-wrap gap-4 justify-start items-stretch">
          {projectData.map((project, index) => (
            <button
              key={index}
              className="flex flex-col gap-1 py-6 h-[250px] justify-center items-center bg_project_card rounded-2xl w-[400px]"
              onClick={()  => showProject({ project })}
            >
              <span className="text-2xl text-theme_white font-bold">
                {project.project_name}
              </span>
              <span className="text-sm font-medium tracking-wide text-gray-300">
                ID: {project.project_id}
              </span>
            </button>
          ))}
          <AddProjectButton
            addProjectFunction={() => router.push("/addproject")}
          />
        </div>
      </PageLayout>
    </>
  );
}
