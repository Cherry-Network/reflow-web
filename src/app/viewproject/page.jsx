"use client";
import PageLayout from "@/components/layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Form from "@/components/forms";
import DataTable from "@/components/analytics/device-stat";
import { CSVLink } from "react-csv";
import Link from "next/link";

const ViewProject = () => {
  const router = useRouter();
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [fullName, setFullName] = useState("Loading..."); // Changed from userName to fullName
  const [loading, setLoading] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");

  const fetchConfigData = async (serialId) => {
    try {
      const response = await fetch(
        `/api/mqtt-configTable?serialId=${serialId}`
      );
      const result = await response.json();
      sessionStorage.setItem("configDeviceData", JSON.stringify(result));
      if (result.length > 0) {
        return result[0];
      } else {
        console.error("No config data found for serialId:", serialId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching config data:", error);
      return null;
    }
  };

  useEffect(() => {
    // fetch admin username from session storage
    const adminUsername = sessionStorage.getItem("username");
    setAdminUsername(adminUsername);
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

    fetchConfigData(serialNo).then((configData) => {
      setLoading(false);
    });
  };
  const [startPeriod, setStartPeriod] = useState({ date: "", time: "" });
  const [endPeriod, setEndPeriod] = useState({ date: "", time: "" });
  const [exportedData, setExportedData] = useState([]);
  const [loadingExport, setLoadingExport] = useState(false);
  const [readyToDownload, setReadyToDownload] = useState(false);
  const [exportedDataHeaders, setExportedDataHeaders] = useState([]);

  const formatTimeStamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toISOString().split("T")[0]} ${
      date.toTimeString().split(" ")[0]
    }`;
  };

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
      if (sessionStorage.getItem("configDeviceData")) {
        const config = JSON.parse(sessionStorage.getItem("configDeviceData"));
        if (String(selectedDevice.serial_no).startsWith("AX6")) {
          setExportedDataHeaders([
            { label: "Timestamp", key: "timestamp" },
            {
              label: config[0].SNO1 ? config[0].SNO1 : "Channel 1",
              key: "sno1",
            },
            {
              label: config[0].SNO2 ? config[0].SNO2 : "Channel 2",
              key: "sno2",
            },
            {
              label: config[0].SNO3 ? config[0].SNO3 : "Channel 3",
              key: "sno3",
            },
            {
              label: config[0].SNO4 ? config[0].SNO4 : "Channel 4",
              key: "sno4",
            },
            {
              label: config[0].SNO5 ? config[0].SNO5 : "Channel 5",
              key: "sno5",
            },
            {
              label: config[0].SNO6 ? config[0].SNO6 : "Channel 6",
              key: "sno6",
            },
          ]);
        } else if (String(selectedDevice.serial_no).startsWith("AX3")) {
          setExportedDataHeaders([
            { label: "Timestamp", key: "timestamp" },
            {
              label: config[0].SNO1 ? config[0].SNO1 : "Channel 1",
              key: "sno1",
            },
            {
              label: config[0].SNO2 ? config[0].SNO2 : "Channel 2",
              key: "sno2",
            },
            {
              label: config[0].SNO3 ? config[0].SNO3 : "Channel 3",
              key: "sno3",
            },
          ]);
        }
      } else {
        if (String(selectedDevice.serial_no).startsWith("AX6")) {
          setExportedDataHeaders([
            { label: "Timestamp", key: "timestamp" },
            { label: "Channel 1", key: "sno1" },
            { label: "Channel 2", key: "sno2" },
            { label: "Channel 3", key: "sno3" },
            { label: "Channel 4", key: "sno4" },
            { label: "Channel 5", key: "sno5" },
            { label: "Channel 6", key: "sno6" },
          ]);
        } else if (String(selectedDevice.serial_no).startsWith("AX3")) {
          setExportedDataHeaders([
            { label: "Timestamp", key: "timestamp" },
            { label: "Channel 1", key: "sno1" },
            { label: "Channel 2", key: "sno2" },
            { label: "Channel 3", key: "sno3" },
          ]);
        }
      }
      const myHeaders = new Headers();
      myHeaders.append("dev-id", selectedDevice.serial_no);
      myHeaders.append(
        "start-timestamp",
        `${startPeriod.date} ${startPeriod.time}`
      );
      myHeaders.append("end-timestamp", `${endPeriod.date} ${endPeriod.time}`);

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
        const sortedData = result.sort((a, b) => {
          return new Date(a.timestamp) - new Date(b.timestamp);
        });
        sortedData?.forEach((data) => {
          data.timestamp = formatTimeStamp(data.timestamp);
        });
        setExportedData(sortedData);
        setReadyToDownload(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteProject = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      projectId: currentProject?._id,
    });

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    if (confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch("/api/projects/delete", requestOptions);
        const result = await response.json();
        alert(result.message);
        router.push("/");
      } catch (error) {
        console.error(error);
      }
    } else {
      return;
    }
  };
  const [showEditModal, setEditModal] = useState(false);

  return (
    <PageLayout pageName={"My Projects"} routeToDashboard={true}>
      <div className="">
        <div className="p-8">
          <div
            className={
              showAddDevice ? "hidden" : `p-8 bg-theme_black/10 rounded-2xl`
            }
          >
            {/* Display the full name instead of username */}
            <div className="flex justify-between items-start">
              <div className="text-xl font-bold text-theme_black/40">
                Hello! {fullName}
              </div>
              <div className="-mt-8 -mr-4">
                <button
                  className={
                    showEditModal ? "p-3 bg-black/10 rounded-full" : "p-3"
                  }
                  onClick={() => {
                    currentProject?.owner === adminUsername
                      ? setEditModal(!showEditModal)
                      : alert(
                          "Not authroized to perform this action. Contact the project owner."
                        );
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="28px"
                    viewBox="0 -960 960 960"
                    width="28px"
                    fill={
                      currentProject?.owner === adminUsername
                        ? "#000000"
                        : "#666666"
                    }
                  >
                    <path d="m680-80-12-60q-12-5-22.5-10.5T624-164l-58 18-40-68 46-40q-2-12-2-26t2-26l-46-40 40-68 58 18q11-8 21.5-13.5T668-420l12-60h80l12 60q12 5 22.5 10.5T816-396l58-18 40 68-46 40q2 12 2 26t-2 26l46 40-40 68-58-18q-11 8-21.5 13.5T772-140l-12 60h-80Zm40-120q33 0 56.5-23.5T800-280q0-33-23.5-56.5T720-360q-33 0-56.5 23.5T640-280q0 33 23.5 56.5T720-200Zm-560 40q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v131q-35-25-76-38t-85-13q-118 0-198.5 82.5T440-281q0 32 7 62t21 59H160Z" />
                  </svg>
                </button>
                <div
                  className={showEditModal ? "absolute z-50 mt-1" : "hidden"}
                >
                  <div className="flex flex-col gap-3 justify-start bg-white/70 px-5 py-3 rounded-lg border border-black/50 -ml-24">
                    <div className="hidden">
                      <button className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="18px"
                          viewBox="0 -960 960 960"
                          width="18px"
                          fill="#000000"
                        >
                          <path d="M80 0v-160h800V0H80Zm80-240v-170l448-447q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L330-240H160Zm504-448 56-56-56-56-56 56 56 56Z" />
                        </svg>
                        <div className="text-sm font-bold text-theme_black/70 tracking-wide font-sans">
                          Edit
                        </div>
                      </button>
                    </div>
                    <button
                      className="flex items-center gap-2"
                      onClick={() => {
                        deleteProject();
                      }}
                      disabled={
                        currentProject?.owner === adminUsername ? false : true
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="18px"
                        viewBox="0 -960 960 960"
                        width="18px"
                        fill="#000000"
                      >
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z" />
                      </svg>
                      <div className="text-sm font-bold text-theme_black/70 tracking-wide font-sans">
                        Delete
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-theme_black/90 mt-4">
              Welcome to {currentProject?.name}
            </div>
          </div>

          {showAddDevice && (
            <div className="p-8 bg-theme_black/5 rounded-2xl">
              <Form
                projectID={currentProject?._id}
                onSuccess={handleFormSuccess}
              />
            </div>
          )}
        </div>

        {/* Dropdown for selecting device */}
        <div
          className={
            currentProject?.devices.length > 0 ? "px-10 pb-6" : "hidden"
          }
        >
          <div className="text-base font-bold text-theme_black/60 mb-2">
            Select Device:
          </div>
          <select
            className="p-2 border border-gray-300 rounded-md text-sm"
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
                <div className=""></div>
              </div>
            )}
            <div className="flex justify-stretch items-end h-full">
              <div className="h-full flex flex-col justify-center items-stretch border-4 border-black rounded-2xl mb-5">
                <div className="bg-black text-white font-sans font-bold text-center p-3 tracking-wide rounded-t-xl">
                  Panel
                </div>
                <Link
                  href={{
                    pathname: "/viewproject/trend",
                    query: {
                      device: selectedDevice.serial_no,
                    },
                  }}
                  className="flex flex-col justify-center items-center gap-2 text-black bg-white font-mono font-semibold tracking-wide text-lg px-4 py-3 border-b-2 border-black"
                  name="Graphical Analysis"
                  title="Graphical Analysis"
                  disabled={loading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="22px"
                    viewBox="0 -960 960 960"
                    width="22px"
                    fill="#000000"
                  >
                    <path d="M107-107v-98.09l103.17-103.17V-107H107Zm160.56 0v-258.65L371.3-469.39V-107H267.56Zm161.14 0v-362.39l103.17 103.61V-107H428.7Zm160.56 0v-259.91l103.18-103.18V-107H589.26Zm160.57 0v-420.91L853-631.09V-107H749.83ZM107-299.87v-149.74l293-293 160 160 293-293v149.74l-293 293-160-160-293 293Z" />
                  </svg>
                  <span className="text-center">Graph</span>
                </Link>
                <button
                  className="flex flex-col justify-center items-center gap-2 text-black bg-white font-mono font-semibold tracking-wide text-lg px-4 py-3 border-b-2 border-black"
                  onClick={() => {
                    deviceConfig({
                      serialNumber: selectedDevice.serial_no,
                      name: selectedDevice.name,
                    });
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="22px"
                    viewBox="0 -960 960 960"
                    width="22px"
                    fill="#000000"
                  >
                    <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm112-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z" />
                  </svg>
                  <span className="text-center">Config</span>
                </button>
                <Link
                  href={{
                    pathname: "/viewproject/schedule-reports",
                    query: {
                      device: selectedDevice.serial_no,
                    },
                  }}
                  className="flex flex-col justify-center items-center gap-2 text-black bg-white font-mono font-semibold tracking-wide text-lg px-4 py-3 rounded-b-xl"
                  name="Graphical Analysis"
                  title="Graphical Analysis"
                  disabled={loading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#000000"
                  >
                    <path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z" />
                  </svg>
                  <span className="text-center">Schedule Reports</span>
                </Link>
              </div>
              <div className="flex-1 custom-scrollbar">
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
              <div className="pb-6">
                <div className="flex flex-col text-sm h-72 bg-white border-2 border-black rounded-2xl">
                  <div className="bg-black text-base rounded-t-xl text-white text-center flex w-full justify-evenly items-center py-6 font-bold">
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
                          {exportedData?.length} records exported and ready to
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
          <div className="p-8 flex justify-center">
            <button
              className="bg-theme_black/90 text-white w-[450px] text-lg font-semibold tracking-wide py-4 rounded-full mt-4 flex gap-3 justify-center items-center"
              onClick={(e) => {
                e.preventDefault();
                router.push("/adddevice");
              }}
            >
              <img
                src="/icons/add-solid.svg"
                alt="add"
                className="w-5 h-auto"
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
