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
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [userName, setUserName] = useState("Loading...");
  const [loading, setLoading] = useState(false); // Spinner state

  useEffect(() => {
    setUserName(sessionStorage.getItem("username"));
    const projectData = JSON.parse(sessionStorage.getItem("selectedProjectID"));
    setCurrentProject(projectData);

    // Set default selected device if available
    if (projectData?.devices?.length > 0) {
      setSelectedDevice(projectData.devices[0]);
    }
  }, []);

  const handleFormSuccess = () => {
    setShowAddDevice(false);
  };

  const deviceConfig = ({ serialNumber, name }) => {
    sessionStorage.setItem(
      "configDeviceData",
      JSON.stringify({ id: serialNumber, name: name })
    );
    router.push("/configpanel");
  };

  const handleDeviceChange = async (e) => {
    const serialNo = e.target.value;
    setLoading(true); // Show spinner

    const device = currentProject.devices.find(
      (device) => device.serial_no === serialNo
    );
    setSelectedDevice(device);

    // Simulate a delay to show spinner
    await new Promise((resolve) => setTimeout(resolve, 500));

    setLoading(false); // Hide spinner
  };

  return (
    <PageLayout pageName={"My Projects"}>
      <div className="">
        <div className="p-10">
          <div
            className={
              showAddDevice ? "hidden" : `p-10 bg-theme_black/10 rounded-2xl`
            }
          >
            <div className="text-4xl font-bold text-theme_black/40">
              Hello! "{userName.toUpperCase()}"
            </div>
            <div className="text-4xl font-bold text-theme_black/90 mt-2">
              Welcome to {currentProject?.name}
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

        {/* Dropdown for selecting device */}
        <div className="p-10">
          <div className="text-lg font-bold text-theme_black/60 mb-4">
            Select Device:
          </div>
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={selectedDevice?.serial_no || ""}
            onChange={handleDeviceChange}
          >
            {currentProject?.devices?.map((device) => (
              <option key={device.serial_no} value={device.serial_no}>
                {device.name} - {device.serial_no}
              </option>
            ))}
          </select>
        </div>

        {/* Render DataTable for the selected device */}
        {selectedDevice && (
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
              </div>
            )}
            <DataTable
              editFunction={() => {
                deviceConfig({
                  serialNumber: selectedDevice.serial_no,
                  name: selectedDevice.name,
                });
              }}
              deviceSerialNumber={selectedDevice.serial_no}
              deviceName={selectedDevice.name}
            />
          </div>
        )}

        {/* Add Device Button */}
        {!showAddDevice && (
          <div className="p-10 flex justify-center">
            <button
              className="bg-theme_black/90 text-white w-[450px] text-xl font-semibold tracking-wide py-4 rounded-full mt-4 flex gap-3 justify-center items-center"
              onClick={(e) => {
                e.preventDefault();
                router.push("/adddevice");
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
        )}
      </div>
    </PageLayout>
  );
};

export default ViewProject;
