'use client';

import PageLayout from "@/components/layout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Form from "@/components/forms";

const ViewProject = () => {
    const router = useRouter();
    const [showAddDevice, setShowAddDevice] = useState(false);
    const thisproject = JSON.parse(localStorage.getItem("projectDetail"));
    console.log(thisproject);
  return (
    <>
      <PageLayout pageName={"Add Project"}>
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
              Welcome to "
              {thisproject
                ? thisproject?.project?.project_name
                : "Project Name"}
              "
            </div>
            <div className="flex flex-wrap gap-3">
              {thisproject?.project?.devices?.map((device, index) => (
                <button
                  key={index}
                  className="bg-white p-5 rounded-2xl w-[250px] h-[200px] flex flex-col gap-2 justify-center items-center"
                  onClick={(e) => {
                    localStorage.setItem(
                      "deviceDetail",
                      JSON.stringify(device)
                    );
                    router.push("/analytics");
                  }}
                >
                  <span className="text-2xl font-bold">
                    {device.dropdownValue}
                  </span>
                  <span className="text-sm font-semibold text-gray-300">
                    ID: {device.serialNumber}
                  </span>
                </button>
              ))}
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
              <Form projectID={thisproject?.project?.project_id} />
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
};

export default ViewProject;
