"use client";
import PageLayout from "@/components/layout";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LineGraph from "@/components/analytics/line-graph";
import { getFromDateIST, getToDateIST } from "@/functions/get-date";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const DisplayGraph = ({
  channelName,
  graphData,
  dataKey,
  minValue,
  maxValue,
  fromDateTime,
  toDateTime,
}) => {
  return (
    <div className="flex flex-col w-full rounded-lg bg-yellow-50/20 py-6 h-[500px] px-1 gap-2 shadow-md border border-black/10 overflow-hidden chart-trend-analysis">
      <span className="text-blue-800 text-xl font-mono font-semibold tracking-wide px-3 py-2">
        Channel - {channelName} Trend{" "}
        <span className="font-medium text-lg">
          {"("}
          {fromDateTime} - {toDateTime}
          {")"}
        </span>
      </span>
      {graphData?.length > 0 ? (
        <>
          <LineGraph
            data={graphData}
            LinedataKey={dataKey}
            YMinValue={minValue || 0}
            YMaxValue={maxValue || 100}
            XdataKey="timestamp"
          />
        </>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <span className="text-lg font-medium text-black/70">
            No Data Available
          </span>
        </div>
      )}
    </div>
  );
};

const DeviceTrend = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deviceInfo, setDeviceInfo] = useState({ id: "", name: "" });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const twoHoursPrior = () => {
    const now = new Date();
    now.setHours(now.getHours() - 2); // Subtract 2 hours
    return now.toISOString().split("T")[1].split(":").slice(0, 2).join(":"); // Format HH:MM:SS
  };

  const [configOptions, setConfigOptions] = useState({
    fromDate: `${getFromDateIST().year}-${getFromDateIST().month}-${
      getFromDateIST().day
    }`,
    fromTime: "07:00",
    toDate: `${getToDateIST().year}-${getToDateIST().month}-${
      getToDateIST().day
    }`,
    toTime: new Intl.DateTimeFormat("en-Us", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }).format(new Date()),
    period: "15_min",
  });

  const [graphValueRange, setGraphValueRange] = useState({});

  const calculateSensorMinMax = (data) => {
    // Initialize an object to store min and max values for each sensor
    const results = {};

    // List of sensor names
    const sensorNames = ["sno1", "sno2", "sno3", "sno4", "sno5", "sno6"];

    // Calculate min and max for each sensor
    sensorNames.forEach((sensorName) => {
      const values = data.map((entry) => entry[sensorName]);

      results[sensorName] = {
        min: Math.min(...values),
        max: Math.max(...values),
      };
    });

    return results;
  };

  const fetchData = async () => {
    const myHeaders = new Headers();
    myHeaders.append("dev-id", searchParams.get("device"));
    myHeaders.append(
      "start-timestamp",
      `${configOptions.fromDate} ${configOptions.fromTime}`
    );
    myHeaders.append(
      "end-timestamp",
      `${configOptions.toDate} ${configOptions.toTime}`
    );

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "/api/export/device-reading",
        requestOptions
      );
      const result = await response.json();
      if (response.ok) {
        setLoading(false);
        return result;
      } else {
        setLoading(false);
        throw new Error(result);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
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

    fetchData().then((result) => {
      setData(result);
      setFilteredData(result);
      setGraphValueRange(calculateSensorMinMax(result));
      setLoading(false);
    });
  }, [
    configOptions.fromDate,
    configOptions.fromTime,
    configOptions.toDate,
    configOptions.toTime,
  ]);

  useEffect(() => {
    setLoading(true);
    if (data?.length > 0) {
      const period = configOptions.period;
      const periodInMinutes = parseInt(period.split("_")[0]);
      try {
        const filteredDataGaps = data.filter((entry, index, array) => {
          if (index === 0) return true; // Keep the first entry

          const firstTimestamp = new Date(array[0].timestamp);
          const currentTimestamp = new Date(entry.timestamp);

          // Check if the difference is a multiple of 60 minutes
          const diffInMinutes =
            (currentTimestamp - firstTimestamp) / (1000 * 60);
          return diffInMinutes % periodInMinutes === 0;
        });
        filteredDataGaps.length > 10000 &&
          alert(
            "The data is too large to display. Please select a smaller range."
          );
        filteredDataGaps.length > 10000 &&
          setConfigOptions({
            fromDate: `${getFromDateIST().year}-${getFromDateIST().month}-${
              getFromDateIST().day
            }`,
            fromTime: "07:00",
            toDate: `${getToDateIST().year}-${getToDateIST().month}-${
              getToDateIST().day
            }`,
            toTime: new Intl.DateTimeFormat("en-Us", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              timeZone: "Asia/Kolkata",
            }).format(new Date()),
            period: "15_min",
          });
        setFilteredData(filteredDataGaps);
        setGraphValueRange(calculateSensorMinMax(filteredDataGaps));

        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      setLoading(false);
    }
  }, [configOptions.period, data]);

  const downloadImage = async (elementToPrintId) => {
    const element = document.getElementById(elementToPrintId);
    if (!element) {
      throw new Error(`Element with id ${elementToPrintId} not found`);
    }
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      margin: 0,
    });
    const data = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = data;
    link.download = "trend_analysis.png";
    link.click();
  };

  const [printingPage, setPrintingPage] = useState(false);

  const generatePDF = async (elementToPrintId) => {
    setPrintingPage(true);
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    let yOffset = 0;

    // Step 1: Add static component first
    const staticElement = document.getElementById(
      "trend-analysis-device-info-config"
    );
    if (staticElement) {
      const staticCanvas = await html2canvas(staticElement, { scale: 2 });
      const staticImg = staticCanvas.toDataURL("image/png");

      const staticProps = pdf.getImageProperties(staticImg);
      const staticHeight = (staticProps.height * pdfWidth) / staticProps.width;

      pdf.addImage(staticImg, "PNG", 0, yOffset, pdfWidth, staticHeight);

      yOffset += staticHeight + 10; // leave some spacing before charts
    }
    const charts = document.querySelectorAll(".chart-trend-analysis"); // give each chart a class
    for (let i = 0; i < charts.length; i++) {
      const canvas = await html2canvas(charts[i], { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // If chart doesn't fit in remaining space → new page
      if (yOffset + imgHeight > pdfHeight) {
        pdf.addPage();
        yOffset = 0;
      }

      // Add chart image at current offset
      pdf.addImage(imgData, "PNG", 0, yOffset, pdfWidth, imgHeight);

      // Move offset down for next chart
      yOffset += imgHeight + 5; // add spacing
    }

    pdf.save("trend_analysis.pdf");
    setPrintingPage(false);
  };

  useEffect(() => {
    const handleCtrlP = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        generatePDF("device-trend-page");
      }
    };
    window.addEventListener("keydown", handleCtrlP);
    return () => window.removeEventListener("keydown", handleCtrlP);
  }, []);

  return (
    <>
      <PageLayout pageName={"My Projects"} routeToDashboard={true}>
        <div
          className="flex flex-col items-center h-full w-full gap-5 pb-5"
          id="device-trend-page"
        >
          <div
            className="flex flex-col items-center w-full gap-5"
            id="trend-analysis-device-info-config"
          >
            <div className="bg-black/10 p-6 rounded-lg mt-5 w-full">
              <div className="flex justify-between items-center w-full">
                <div className="font-bold text-xl text-black">
                  {String(deviceInfo.name).toLocaleUpperCase()} -{" "}
                  {deviceInfo.id}
                </div>
                <div className="flex flex-row gap-4 items-center justify-end">
                  <button
                    className="bg-black text-white px-5 py-2 rounded-full font-medium tracking-wide"
                    onClick={() => generatePDF("device-trend-page")}
                    disabled={printingPage || loading || !deviceInfo}
                  >
                    {printingPage ? (
                      <>
                        <span className="flex flex-row gap-2 items-center">
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
                          <span>Generating PDF...</span>
                        </span>
                      </>
                    ) : (
                      "Generate PDF"
                    )}
                  </button>
                  <button
                    className="bg-black text-white px-5 py-2 rounded-full font-medium tracking-wide"
                    onClick={() => router.push("/viewproject")}
                  >
                    Switch Device
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full rounded-lg bg-black/5 pb-6 shadow-sm border border-black/10">
              <span className="bg-black text-white text-lg font-semibold py-3 text-center rounded-t-lg tracking-wider">
                Configuration Options
              </span>
              <div className="flex justify-center items-stretch gap-5 font-medium text-black mt-4 px-4">
                <div className="flex flex-col bg-white border border-black rounded-md gap-3 w-2/5">
                  <span className="w-full text-center font-semibold border-b border-black py-2 text-lg tracking-wider">
                    From
                  </span>
                  <div className="flex flex-col h-full items-center justify-center mx-auto gap-5 py-3 w-4/5">
                    <input
                      type="date"
                      name="fromDate"
                      max={new Date().toISOString().split("T")[0]}
                      className="w-full text-center px-2 border border-black/50 rounded-full"
                      value={configOptions.fromDate}
                      onChange={(e) => {
                        setConfigOptions({
                          ...configOptions,
                          fromDate: e.target.value,
                        });
                      }}
                    />
                    <input
                      type="time"
                      name="fromTime"
                      className="w-full text-center px-2 border border-black/50 rounded-full mb-3"
                      value={configOptions.fromTime}
                      onChange={(e) => {
                        setConfigOptions({
                          ...configOptions,
                          fromTime: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col bg-white border border-black rounded-md gap-3 w-2/5">
                  <span className="w-full text-center font-semibold border-b border-black py-2 text-lg tracking-wider">
                    To
                  </span>
                  <div className="flex flex-col h-full items-center justify-center mx-auto gap-5 py-3 w-4/5">
                    <input
                      type="date"
                      name="toDate"
                      max={new Date().toISOString().split("T")[0]}
                      min={configOptions.fromDate}
                      className="w-full text-center px-2 border border-black/50 rounded-full"
                      value={configOptions.toDate}
                      onChange={(e) => {
                        setConfigOptions({
                          ...configOptions,
                          toDate: e.target.value,
                        });
                      }}
                    />
                    <input
                      type="time"
                      name="toTime"
                      className="w-full text-center px-2 border border-black/50 rounded-full mb-3"
                      value={configOptions.toTime}
                      onChange={(e) => {
                        setConfigOptions({
                          ...configOptions,
                          toTime: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col bg-white border border-black rounded-md gap-3 w-1/3">
                  <span className="w-full text-center font-semibold border-b border-black py-2 text-lg tracking-wider">
                    Period
                  </span>
                  <fieldset
                    className="flex flex-col justify-center mx-auto gap-3 py-3 w-4/5"
                    id="period"
                  >
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="period"
                        value="1_min"
                        className="mr-2"
                        onChange={(e) => {
                          setConfigOptions({
                            ...configOptions,
                            period: e.target.value,
                          });
                        }}
                        checked={configOptions.period === "1_min"}
                      />
                      1 Min Interval
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="period"
                        value="15_min"
                        className="mr-2"
                        onChange={(e) => {
                          setConfigOptions({
                            ...configOptions,
                            period: e.target.value,
                          });
                        }}
                        checked={configOptions.period === "15_min"}
                      />
                      15 Min Interval
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="period"
                        value="30_min"
                        className="mr-2"
                        onChange={(e) => {
                          setConfigOptions({
                            ...configOptions,
                            period: e.target.value,
                          });
                        }}
                        checked={configOptions.period === "30_min"}
                      />
                      30 Min Interval
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="period"
                        value="60_min"
                        className="mr-2"
                        onChange={(e) => {
                          setConfigOptions({
                            ...configOptions,
                            period: e.target.value,
                          });
                        }}
                        checked={configOptions.period === "60_min"}
                      />
                      1 Hour Interval
                    </label>
                  </fieldset>
                </div>
              </div>
              <div className="flex justify-between items-center gap-3 mt-5 w-full px-4">
                <button className="text-green-800 min-w-36 px-5 py-2 rounded-full text-lg font-semibold font-mono tracking-wide">
                  {loading
                    ? "...Calculating Data-Points"
                    : `${filteredData?.length} Data-Points Found`}
                </button>
                <button
                  className="bg-red-950 text-lg text-white min-w-28 px-5 py-2 rounded-full font-medium font-mono tracking-wide"
                  onClick={() => {
                    setConfigOptions({
                      fromDate: `${getFromDateIST().year}-${
                        getFromDateIST().month
                      }-${getFromDateIST().day}`,
                      fromTime: "07:00",
                      toDate: `${getToDateIST().year}-${getToDateIST().month}-${
                        getToDateIST().day
                      }`,
                      toTime: new Intl.DateTimeFormat("en-Us", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        timeZone: "Asia/Kolkata",
                      }).format(new Date()),
                      period: "15_min",
                    });
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          {deviceInfo?.configInfo ? (
            <>
              {loading ? (
                <>
                  <div className="flex flex-col justify-center items-center h-full w-full mt-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                  </div>
                </>
              ) : (
                <>
                  {deviceInfo?.configInfo?.SNO1 && (
                    <>
                      <DisplayGraph
                        channelName={deviceInfo?.configInfo?.SNO1}
                        graphData={filteredData}
                        dataKey="sno1"
                        minValue={graphValueRange?.sno1?.min - 1}
                        maxValue={graphValueRange?.sno1?.max + 1}
                        fromDateTime={`${configOptions.fromDate} ${configOptions.fromTime}`}
                        toDateTime={`${configOptions.toDate} ${configOptions.toTime}`}
                      />
                    </>
                  )}
                  {deviceInfo?.configInfo?.SNO2 && (
                    <>
                      <DisplayGraph
                        channelName={deviceInfo?.configInfo?.SNO2}
                        graphData={filteredData}
                        dataKey="sno2"
                        minValue={graphValueRange?.sno2?.min - 1}
                        maxValue={graphValueRange?.sno2?.max + 1}
                        fromDateTime={`${configOptions.fromDate} ${configOptions.fromTime}`}
                        toDateTime={`${configOptions.toDate} ${configOptions.toTime}`}
                      />
                    </>
                  )}
                  {deviceInfo?.configInfo?.SNO3 && (
                    <>
                      <DisplayGraph
                        channelName={deviceInfo?.configInfo?.SNO3}
                        graphData={filteredData}
                        dataKey="sno3"
                        minValue={graphValueRange?.sno3?.min - 1}
                        maxValue={graphValueRange?.sno3?.max + 1}
                        fromDateTime={`${configOptions.fromDate} ${configOptions.fromTime}`}
                        toDateTime={`${configOptions.toDate} ${configOptions.toTime}`}
                      />
                    </>
                  )}
                  {deviceInfo?.configInfo?.SNO4 && (
                    <>
                      <DisplayGraph
                        channelName={deviceInfo?.configInfo?.SNO4}
                        graphData={filteredData}
                        dataKey="sno4"
                        minValue={graphValueRange?.sno4?.min - 1}
                        maxValue={graphValueRange?.sno4?.max + 1}
                        fromDateTime={`${configOptions.fromDate} ${configOptions.fromTime}`}
                        toDateTime={`${configOptions.toDate} ${configOptions.toTime}`}
                      />
                    </>
                  )}
                  {deviceInfo?.configInfo?.SNO5 && (
                    <>
                      <DisplayGraph
                        channelName={deviceInfo?.configInfo?.SNO5}
                        graphData={filteredData}
                        dataKey="sno5"
                        minValue={graphValueRange?.sno5?.min - 1}
                        maxValue={graphValueRange?.sno5?.max + 1}
                        fromDateTime={`${configOptions.fromDate} ${configOptions.fromTime}`}
                        toDateTime={`${configOptions.toDate} ${configOptions.toTime}`}
                      />
                    </>
                  )}
                  {deviceInfo?.configInfo?.SNO6 && (
                    <>
                      <DisplayGraph
                        channelName={deviceInfo?.configInfo?.SNO6}
                        graphData={filteredData}
                        dataKey="sno6"
                        minValue={graphValueRange?.sno6?.min - 1}
                        maxValue={graphValueRange?.sno6?.max + 1}
                        fromDateTime={`${configOptions.fromDate} ${configOptions.fromTime}`}
                        toDateTime={`${configOptions.toDate} ${configOptions.toTime}`}
                      />
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-full w-full">
              <span className="text-lg font-medium text-black/70">
                No Device Configuration Data Available
              </span>
            </div>
          )}
        </div>
        <br />
      </PageLayout>
    </>
  );
};

export default DeviceTrend;
