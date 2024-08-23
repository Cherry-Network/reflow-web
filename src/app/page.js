"use client";
import Form from "@/components/forms";
import { useState, useEffect } from "react";
import { AddProjectButton } from "@/components/add-project";
import PageLayout from "@/components/layout";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [projectData, setProjectData] = useState([]);
  const [viewProject, setViewProject] = useState(false);
  const [thisproject, setThisProject] = useState({});

  useEffect(() => {
    setProjectData(JSON.parse(localStorage.getItem("projects")) || []);
  }, []);

  const showProject = (project) => {
    setThisProject(project);
    localStorage.setItem("projectDetail", JSON.stringify(project));
    setViewProject(false);
  };
  const [showAddDevice, setShowAddDevice] = useState(false);
  console.log(viewProject);

  return (
    <>
      <PageLayout pageName={"Add Project"}>
        {viewProject ? (
          <>
            <div className="p-10">
              <div
                className={
                  showAddDevice
                    ? "hidden"
                    : `p-10 bg-theme_black/10 rounded-2xl`
                }
              >
                <div className="text-4xl font-bold text-theme_black/40">
                  Hello! "Name"
                </div>
                <div className="text-4xl font-bold text-theme_black/90 mt-2">
                  Welcome to "
                  {thisproject?.project_name
                    ? thisproject?.project_name
                    : "Project Name"}
                  "
                </div>
                <div className="flex justify-center my-20">
                  <button
                    className="bg-theme_black/90 text-white w-[450px] text-xl font-semibold tracking-wide py-4 rounded-full mt-4 flex gap-3 justify-center items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAddDevice(true);
                    }}
                  >
                    <img
                      src="/icons/add-solid.svg"
                      alt="add"
                      className="w-7 h-auto"
                    />
                    <span>Add Device</span>
                  </button>
                </div>
              </div>
              {showAddDevice && (
                <div className="">
                  <Form />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-10 flex flex-wrap gap-4 justify-start items-stretch">
            {projectData.map((project, index) => (
              <button
                key={index}
                className="flex flex-col gap-1 py-6 h-[250px] justify-center items-center bg_project_card rounded-2xl w-[400px]"
                onClick={showProject({ project })}
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
        )}
      </PageLayout>
    </>
  );
}
