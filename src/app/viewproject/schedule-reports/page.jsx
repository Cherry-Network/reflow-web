"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout";
import { useSearchParams } from "next/navigation";

const ScheduleReport = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deviceInfo, setDeviceInfo] = useState({
    name: "",
    id: "",
    configInfo: {},
  });
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    device: "",
    channels: {},
    email: [],
    frequency: "",
  });
  const [numberOfChannels, setNumberOfChannels] = useState(0);
  const [productExists, setProductExists] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (!reportData.email.length) {
      alert("Please enter at least one email address");
      setSubmitting(false);
      return;
    } else if (!reportData.frequency) {
      alert("Please select a frequency");
      setSubmitting(false);
      return;
    } else if (
      !Object.entries(reportData.channels || {}).some(([_, value]) => value)
    ) {
      alert("Please select at least one channel");
      setSubmitting(false);
      return;
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      device: reportData.device,
      channels: reportData.channels,
      email: reportData.email,
      frequency: reportData.frequency,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "/api/email-config/post-device-info",
        requestOptions
      );
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        router.push("/viewproject");
        setSubmitting(false);
      } else {
        alert(result.message);
        console.error(result);
        setSubmitting(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteLoading(true);
    if (confirm("Are you sure you want to delete this schedule?")) {
      const myHeaders = new Headers();
      myHeaders.append("device", reportData.device);

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "/api/email-config/delete-schedule",
          requestOptions
        );
        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          router.push("/viewproject");
          setDeleteLoading(false);
        } else {
          alert(result.message);
          console.error(result);
          setDeleteLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const deviceArray = JSON.parse(
      sessionStorage.getItem("selectedProjectID")
    )?.devices;
    const device = deviceArray.find(
      (device) => device.serial_no === searchParams.get("device")
    );
    const deviceConfig = JSON.parse(sessionStorage.getItem("configDeviceData"));
    setDeviceInfo({
      id: searchParams.get("device"),
      name: device.name,
      configInfo: deviceConfig[0],
    });
    const deviceID = searchParams.get("device");
    const myHeaders = new Headers();
    myHeaders.append("device", deviceID);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("/api/email-config/get-device-info", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result && result.device) {
          setReportData(result);
          setProductExists(true);
          setLoading(false);
        } else {
          setReportData((prev) => ({
            ...prev,
            device: searchParams.get("device"),
          }));
          setLoading(false);
        }
      })
      .catch((error) => console.error(error));
    setNumberOfChannels(Number(deviceID[2]));
  }, []);

  return (
    <>
      <PageLayout pageName={"My Projects"} routeToDashboard={true}>
        <div className="flex flex-col items-center h-full w-full gap-5 pb-5">
          <div className="bg-black/10 p-6 rounded-lg mt-5 w-full">
            <div className="flex justify-between items-center w-full">
              <div className="font-bold text-xl text-black">
                {String(deviceInfo.name).toLocaleUpperCase()} - {deviceInfo.id}
              </div>
              <button
                className="bg-black text-white px-5 py-2 rounded-full font-medium tracking-wide"
                onClick={() => router.push("/viewproject")}
              >
                Switch Device
              </button>
            </div>
          </div>
          {loading ? (
            <>
              <div className="flex flex-col justify-center items-center h-[400px] w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                <span className="text-xl font-semibold text-gray-500 mt-10 tracking-widest">
                  Loading
                  <span className="animate-pulse tracking-widest"> . . .</span>
                </span>
              </div>
            </>
          ) : (
            <div className="bg-black/10 p-6 rounded-lg w-full">
              <div className="flex justify-between items-center w-full">
                <div className="font-bold text-xl text-black">
                  Schedule Report
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-5">
                <div className="flex flex-col gap-2">
                  <label className="text-black font-medium">Device</label>
                  <input
                    type="email"
                    className="p-2 w-full rounded-lg bg-white"
                    placeholder="Enter Email"
                    value={`${String(deviceInfo.name).toLocaleUpperCase()} - ${
                      deviceInfo.id
                    }`}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-black font-medium">Email</label>
                  <input
                    type="email"
                    className="p-2 w-full rounded-lg"
                    placeholder="Enter Email (Press Enter to add)"
                    value={reportData.currentEmail || ""}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        currentEmail: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        reportData.currentEmail?.trim()
                      ) {
                        e.preventDefault();
                        setReportData((prev) => ({
                          ...prev,
                          email: [...prev.email, prev.currentEmail.trim()],
                          currentEmail: "",
                        }));
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {reportData.email.map((email, index) => (
                      <div
                        key={index}
                        className="bg-white px-2 py-1 rounded-md text-base text-black flex items-center tracking-wide"
                      >
                        {email}
                        <button
                          type="button"
                          className="ml-2 text-black font-medium tracking-wide"
                          onClick={() =>
                            setReportData((prev) => ({
                              ...prev,
                              email: prev.email.filter((_, i) => i !== index),
                            }))
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-black font-medium">Frequency</label>
                  <select
                    className="p-2 w-full rounded-lg"
                    value={reportData.frequency}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        frequency: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Frequency</option>
                    <option value="6_hour">Every 6 Hours</option>
                    <option value="12_hour">Every 12 Hours</option>
                    <option value="24_hour">Every 24 Hours</option>
                    <option value="168_hour">Every 7 Days</option>
                  </select>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                  <label className="text-lg font-semibold text-gray-700">
                    Select Device Channels
                  </label>
                  {}
                  {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Array.from(
                        { length: numberOfChannels },
                        (_, i) => i + 1
                      ).map((num) => {
                        const channelKey = `ch_${num}`;
                        const isChecked =
                          reportData.channels?.[channelKey] || false;

                        return (
                          <div
                            key={channelKey}
                            className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer ${
                              isChecked
                                ? "bg-gray-100 border-gray-300"
                                : "bg-white border-gray-200 hover:border-gray-200"
                            }`}
                            onClick={() => {
                              setReportData((prev) => ({
                                ...prev,
                                channels: {
                                  ...prev.channels,
                                  [channelKey]: !isChecked,
                                },
                              }));
                            }}
                          >
                            <input
                              type="checkbox"
                              id={channelKey}
                              checked={isChecked}
                              className="hidden"
                              onChange={(e) => {
                                setReportData((prev) => ({
                                  ...prev,
                                  channels: {
                                    ...prev.channels,
                                    [channelKey]: e.target.checked,
                                  },
                                }));
                              }}
                            />
                            <div className="flex items-center h-5">
                              <div
                                className={`w-4 h-4 flex items-center justify-center rounded-sm border-2 mr-3 transition-colors ${
                                  isChecked
                                    ? "bg-black border-black"
                                    : "bg-white border-gray-400"
                                }`}
                              >
                                {isChecked && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <label
                              htmlFor={channelKey}
                              className="text-gray-700 cursor-pointer select-none"
                            >
                              {deviceInfo?.configInfo[`SNO${num}`] || ""}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Selected channels preview */}
                  {Object.entries(reportData.channels || {}).some(
                    ([_, value]) => value
                  ) && (
                    <div className="mt-2">
                      <span className="text-base text-gray-500">
                        Selected channels:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(reportData.channels || {}).map(
                          ([key, value]) =>
                            value && (
                              <div
                                key={key}
                                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-base flex items-center tracking-wide"
                              >
                                {deviceInfo?.configInfo[`SNO${key[3]}`] || ""}
                                <button
                                  type="button"
                                  className="ml-2 text-gray-800 hover:text-gray-700 font-medium tracking-wide"
                                  onClick={() =>
                                    setReportData((prev) => ({
                                      ...prev,
                                      channels: {
                                        ...prev.channels,
                                        [key]: false,
                                      },
                                    }))
                                  }
                                >
                                  ×
                                </button>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-6 mt-3">
                  <button
                    className="bg-red-950 text-theme_white border border-theme_black/30 text-center w-36 py-3 rounded-full text-lg font-medium tracking-wide"
                    onClick={() => router.push("/viewproject")}
                    disabled={submitting || deleteLoading}
                  >
                    Close
                  </button>
                  {productExists && (
                    <button
                      className="text-theme_white w-52 py-3 rounded-full text-lg border border-theme_black bg-amber-950 font-medium tracking-wide text-center"
                      onClick={handleDelete}
                      disabled={submitting || deleteLoading}
                    >
                      {deleteLoading ? "Deleting..." : "Delete Schedule"}
                    </button>
                  )}
                  <button
                    className="text-theme_white w-52 py-3 rounded-full text-lg border border-theme_black bg-green-950 font-medium tracking-wide text-center"
                    onClick={handleSubmit}
                    disabled={submitting || deleteLoading}
                  >
                    {productExists
                      ? submitting
                        ? "Updating..."
                        : "Update Schedule"
                      : submitting
                      ? "Creating..."
                      : "Create Schedule"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
};

export default ScheduleReport;
