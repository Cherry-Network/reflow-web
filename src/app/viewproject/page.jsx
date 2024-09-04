"use client";
import PageLayout from "@/components/layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Form from "@/components/forms";
import DataTable from "@/components/analytics/device-stat";

const ViewProject = () => {
  const router = useRouter();
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    const projectData = JSON.parse(sessionStorage.getItem("selectedProjectID"));
    setCurrentProject(projectData);
  }, []);

  const handleFormSuccess = () => {
    setShowAddDevice(false);
  };

  const deviceConfig = ({ serialNumber, name }) => {
    sessionStorage.setItem("configDeviceData", JSON.stringify({ id:serialNumber, name:name }));
    router.push("/configpanel");
  };
  return (
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
            <div className="p-10 bg-theme_black/5 rounded-2xl">
              <Form
                projectID={currentProject?._id}
                onSuccess={handleFormSuccess}
              />
            </div>
          )}
        </div>

        {/* Render DataTables for each device */}
        <div className="grid grid-cols-1 gap-3">
        {!showAddDevice &&
          currentProject?.devices?.length > 0 &&
          currentProject.devices.map((device, index) => (
            <DataTable
              key={index}
              editFunction={() => {
                deviceConfig({
                  serialNumber: device.serial_no,
                  name: device.name,
                });
              }}
              deviceSerialNumber={device.serial_no}
              deviceName={device.name}
            />
          ))}
          </div>
      </div>
    </PageLayout>
  );
};

export default ViewProject;
