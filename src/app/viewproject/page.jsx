"use client";
import PageLayout from "@/components/layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Form from "@/components/forms";
import DataTable from "@/components/analytics/device-stat";
import { CSVLink } from "react-csv";
import { set } from "mongoose";

const ViewProject = () => {
  const router = useRouter();
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [fullName, setFullName] = useState("Loading..."); // Changed from userName to fullName
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch full name from session storage
    const storedFullName = sessionStorage.getItem("fullName");
    if (storedFullName) {
      setFullName(storedFullName);
    } else {
      setFullName("User"); // Fallback if name is not available
    }

    // Fetch project details from session storage
    const projectData = JSON.parse(sessionStorage.getItem("selectedProjectID"));
    setCurrentProject(projectData);

    // Set the first device as the selected device by default
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
    setLoading(true);

    const device = currentProject.devices.find(
      (device) => device.serial_no === serialNo
    );
    setSelectedDevice(device);

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setLoading(false);
  };
  const [startPeriod, setStartPeriod] = useState({ date: "", time: "" });
  const [endPeriod, setEndPeriod] = useState({ date: "", time: "" });
  const [exportedData, setExportedData] = useState([]);
  const [loadingExport, setLoadingExport] = useState(false);
  const [readyToDownload, setReadyToDownload] = useState(false);
  const [exportedDataHeaders, setExportedDataHeaders] = useState([]);

  const exportDeviceData = async () => {
    setLoadingExport(true);
    if (
      !startPeriod.date ||
      !startPeriod.time ||
      !endPeriod.date ||
      !endPeriod.time
    ) {
      alert("Please select start and end datetime");
      setLoadingExport(false);
    } else {
      const myHeaders = new Headers();
      myHeaders.append("dev-id", selectedDevice.serial_no);
      myHeaders.append(
        "start-timestamp",
        `${startPeriod.date} ${startPeriod.time}+05:30`
      );
      myHeaders.append(
        "end-timestamp",
        `${endPeriod.date} ${endPeriod.time}+05:30`
      );

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "/api/export/device-reading/",
          requestOptions
        );
        const result = await response.json();
        console.log(selectedDevice.serial_no);
        console.log(result);
        setExportedData(result);
        if (sessionStorage.getItem("configDeviceData") !== null) {
          const config = JSON.parse(sessionStorage.getItem("configDeviceData"));
          setExportedDataHeaders([
            { label: "Timestamp", key: "timestamp" },
            { label: config?.SNO1 ? config?.SNO1 : "Channel 1", key: "sno1" },
            { label: config?.SNO2 ? config?.SNO2 : "Channel 2", key: "sno2" },
            { label: config?.SNO3 ? config?.SNO3 : "Channel 3", key: "sno3" },
          ]);
        } else {
          setExportedDataHeaders([
            { label: "Timestamp", key: "timestamp" },
            { label: "Channel 1", key: "SNO1" },
            { label: "Channel 2", key: "SNO2" },
            { label: "Channel 3", key: "SNO3" },
          ]);
        }
        setReadyToDownload(true);
      } catch (error) {
        console.error(error);
      }
    }
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
            {/* Display the full name instead of username */}
            <div className="text-4xl font-bold text-theme_black/40">
              Hello! {fullName}
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
        <div className={currentProject?.devices.length > 0 ? "p-10" : "hidden"}>
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
          <div className="relative px-5 mx-10 rounded-2xl bg-black/10">
            {loading && (
              <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
              </div>
            )}
            <div className="flex justify-center items-end">
              <div>
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
              <div className="pb-7">
                <div className="flex w-full justify-end pt-1 pb-4">
                  <button
                    className="mr-2"
                    onClick={() => {
                      deviceConfig({
                        serialNumber: selectedDevice.serial_no,
                        name: selectedDevice.name,
                      });
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="36px"
                      viewBox="0 -960 960 960"
                      width="36px"
                      fill="#000000"
                    >
                      <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm112-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z" />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col bg-white border-2 border-black rounded-2xl">
                  <div className="bg-black text-lg rounded-t-xl text-white text-center flex w-full justify-evenly items-center py-6 font-bold">
                    <span>Export Data</span>
                  </div>
                  <div className="p-4 flex flex-col h-full">
                    {readyToDownload ? (
                      <div className="flex flex-col justify-center items-center gap-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="28px"
                          viewBox="0 -960 960 960"
                          width="28px"
                          fill="#186a3b"
                        >
                          <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z" />
                        </svg>
                        <div className="text-black text-lg font-mono font-semibold text-center">
                          {exportedData.length} records exported and ready to
                          Download
                        </div>
                        <CSVLink
                          data={exportedData}
                          headers={exportedDataHeaders}
                          onClick={() => {
                            setReadyToDownload(false);
                            setLoadingExport(false);
                          }}
                          filename={`${selectedDevice.serial_no} Device Data from ${startPeriod.date}T${startPeriod.time} to ${endPeriod.date}T${endPeriod.time}`}
                        >
                          <div className="w-full py-2 px-10 bg-black text-base text-white rounded-3xl text-center">
                            Download
                          </div>
                        </CSVLink>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-4">
                          <label className="block text-gray-700">
                            Start Date and Time:
                          </label>
                          <div className="flex gap-1">
                            <input
                              type="date"
                              value={startPeriod.date}
                              max={new Date().toISOString().split("T")[0]}
                              onChange={(e) =>
                                setStartPeriod({
                                  ...startPeriod,
                                  date: e.target.value,
                                })
                              }
                              className="w-full p-1 border border-gray-300 rounded-2xl text-black"
                              style={{ height: "2rem" }}
                            />
                            <input
                              type="time"
                              value={startPeriod.time}
                              onChange={(e) =>
                                setStartPeriod({
                                  ...startPeriod,
                                  time: e.target.value,
                                })
                              }
                              className="w-full p-1 border border-gray-300 rounded-2xl text-black"
                              style={{ height: "2rem" }}
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700">
                            End Date and Time:
                          </label>
                          <div className="flex gap-1">
                            <input
                              type="date"
                              value={endPeriod.date}
                              max={new Date().toISOString().split("T")[0]}
                              onChange={(e) =>
                                setEndPeriod({
                                  ...endPeriod,
                                  date: e.target.value,
                                })
                              }
                              className="w-full p-1 border border-gray-300 rounded-2xl text-black"
                              style={{ height: "2rem" }}
                            />
                            <input
                              type="time"
                              value={endPeriod.time}
                              onChange={(e) =>
                                setEndPeriod({
                                  ...endPeriod,
                                  time: e.target.value,
                                })
                              }
                              className="w-full p-1 border border-gray-300 rounded-2xl text-black"
                              style={{ height: "2rem" }}
                            />
                          </div>
                        </div>
                        <button
                          className="w-full py-2 bg-black text-white rounded-3xl"
                          onClick={exportDeviceData}
                        >
                          {loadingExport ? (
                            <svg
                              className="animate-spin mx-auto h-6 w-6 text-white"
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
                            "Export"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
