"use client";

import PageLayout from "@/components/layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Form from "@/components/forms";
import DataTable from "@/components/analytics/device-stat";

const ViewProject = () => {
  const router = useRouter();
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [currentProject, getCurrentProject] = useState();

  useEffect(() => {
    getCurrentProject(JSON.parse(sessionStorage.getItem("selectedProjectID")));
  }, []);


  return (
    <>
      <PageLayout pageName={"Project Details"}>
        <div className="">
          <div className="p-10">
            <div
              className={
                showAddDevice ? "hidden" : `p-10 bg-theme_black/10 rounded-2xl`
              }
            >
              <div className="text-4xl font-bold text-theme_black/40">
                Hello! "Name"
              </div>
              <div className="text-4xl font-bold text-theme_black/90 mt-2">
                Welcome to {currentProject?.name}
              </div>
              <div className="flex flex-wrap gap-3"></div>
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
                <Form projectID={projectID} />
              </div>
            )}
          </div>
          <DataTable
            editFunction={() => {
              setEditTable(true);
            }}
            addNewDevice={() => {
              router.push("/viewproject");
            }}
            viewAllProjects={() => {
              router.push("/");
            }}
          />
          </div>
      </PageLayout>
    </>
  );
};

export default ViewProject;
