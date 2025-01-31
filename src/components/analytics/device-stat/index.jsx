"use client";
import React, { useState, useEffect } from "react";

// Fetch config data once
const fetchConfigData = async (serialId) => {
  try {
    const response = await fetch(`/api/mqtt-configTable?serialId=${serialId}`);
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

const calculateReadingsLevel = (rawReadings, min, max) => {
  if (rawReadings === null || rawReadings === undefined) {
    return 0;
  }
  if (min === null || min === undefined || max === null || max === undefined) {
    return 0;
  }
  if (rawReadings < min) {
    return 0;
  } else if (rawReadings > max) {
    return 100;
  } else {
    return ((rawReadings - min) / (max - min)) * 100;
  }
};

// Fetch readings data (using config)
const fetchData = async (serialId, config) => {
  try {
    const response = await fetch(`/api/mqtt-output?serialId=${serialId}`);
    const result = await response.json();

    if (result.length === 0) return { data: [], lastUpdatedTime: null };

    const dataObject = result[0];
    const lastUpdatedTime = parseUpdateTime(dataObject.UpdateTimeStamp);
    console.log(config);
    const formattedData = [
      {
        serialNo: config.SNO1,
        readings: dataObject.RawCH1 || "N/A",
        calibratedReadings: dataObject.CH1 || "N/A",
        readingsLevel: calculateReadingsLevel(
          dataObject.RawCH1,
          config.MIN1,
          config.MAX1
        ),
        status: dataObject.ERR1 === 0 ? "Online" : "Offline",
      },
      {
        serialNo: config.SNO2,
        readings: dataObject.RawCH2 || "N/A",
        calibratedReadings: dataObject.CH2 || "N/A",
        readingsLevel: calculateReadingsLevel(
          dataObject.RawCH2,
          config.MIN2,
          config.MAX2
        ),
        status: dataObject.ERR2 === 0 ? "Online" : "Offline",
      },
      {
        serialNo: config.SNO3,
        readings: dataObject.RawCH3 || "N/A",
        calibratedReadings: dataObject.CH3 || "N/A",
        readingsLevel: calculateReadingsLevel(
          dataObject.RawCH3,
          config.MIN3,
          config.MAX3
        ),
        status: dataObject.ERR3 === 0 ? "Online" : "Offline",
      },
      {
        serialNo: config.SNO4,
        readings: dataObject.RawCH4 || "N/A",
        calibratedReadings: dataObject.CH4 || "N/A",
        readingsLevel: calculateReadingsLevel(
          dataObject.RawCH4,
          config.MIN4,
          config.MAX4
        ),
        status: dataObject.ERR4 === 0 ? "Online" : "Offline",
      },
      {
        serialNo: config.SNO5,
        readings: dataObject.RawCH5 || "N/A",
        calibratedReadings: dataObject.CH5 || "N/A",
        readingsLevel: calculateReadingsLevel(
          dataObject.RawCH5,
          config.MIN5,
          config.MAX5
        ),
        status: dataObject.ERR5 === 0 ? "Online" : "Offline",
      },
      {
        serialNo: config.SNO6,
        readings: dataObject.RawCH6 || "N/A",
        calibratedReadings: dataObject.CH6 || "N/A",
        readingsLevel: calculateReadingsLevel(
          dataObject.RawCH6,
          config.MIN6,
          config.MAX6
        ),
        status: dataObject.ERR6 === 0 ? "Online" : "Offline",
      },
    ];

    return { data: formattedData, lastUpdatedTime };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: [], lastUpdatedTime: null };
  }
};

const parseUpdateTime = (timestamp) => {
  const [date, time] = timestamp.split(" ");
  const [day, month, year] = date.split("/"); // Split the DD/MM/YY part
  const [hour, minute, second] = time.split(":"); // Split the HH:MM:SS part

  const fullYear = year.length === 2 ? `20${year}` : year;

  const parsedDate = new Date(
    `${fullYear}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}T${hour}:${minute}:${second}`
  );

  // Check if the date is valid
  if (isNaN(parsedDate.getTime())) {
    console.error("Invalid date format:", timestamp);
    return null;
  }

  return parsedDate;
};

const checkIfDeviceOnline = (lastUpdatedTime) => {
  if (!lastUpdatedTime) {
    console.log("No last updated time, assuming device is offline.");
    return false;
  }

  const now = new Date();
  const timeDifference = now - lastUpdatedTime;
  const fiveMinsInMilliseconds = 5 * 60 * 1000;

  const isOnline = timeDifference <= fiveMinsInMilliseconds;

  return isOnline;
};

const DataTable = ({ deviceSerialNumber, deviceName }) => {
  const [data, setData] = useState([]);
  const [config, setConfig] = useState(null);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(null);
  const [loading, setLoading] = useState(true);

  const [numRows, setNumRows] = useState(0);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      if (deviceSerialNumber.startsWith("AX3")) {
        setNumRows(3);
      } else if (deviceSerialNumber.startsWith("AX6")) {
        setNumRows(6);
      } else if (deviceSerialNumber.startsWith("AX1")) {
        setNumRows(1);
      } else {
        console.error("Invalid device serial number:", deviceSerialNumber);
        setLoading(false);
        return;
      }
      const configData = await fetchConfigData(deviceSerialNumber);
      if (configData) {
        setConfig(configData);

        const result = await fetchData(deviceSerialNumber, configData);
        setData(result.data);
        setLastUpdatedTime(result.lastUpdatedTime);
      } else {
        console.error("No config data found for:", deviceSerialNumber);
      }
      setLoading(false);
    };

    fetchInitialData();
  }, [deviceSerialNumber]);

  // Fetch data periodically after config is available
  useEffect(() => {
    if (config) {
      const newIntervalId = setInterval(async () => {
        const intervalResult = await fetchData(deviceSerialNumber, config);
        setData(intervalResult.data);
        setLastUpdatedTime(intervalResult.lastUpdatedTime); // Set last updated time here
      }, 3000);

      // Clear interval on component unmount
      return () => clearInterval(newIntervalId);
    }
  }, [config]);

  const columns = [
    { key: "serialNo", label: "Serial No" },
    { key: "calibratedReadings", label: "Readings" },
    { key: "readingsLevel", label: "Readings Level" },
    {
      key: "status",
      label: (
        <div className="flex justify-center items-center gap-2">
          Status
          <span
            className={`w-3 h-3 rounded-full ${
              checkIfDeviceOnline(lastUpdatedTime)
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          ></span>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full p-5 rounded-xl">
      <div className="text-base font-bold flex gap-8 pl-2 text-theme_black/60 pb-6">
        <span>Device - {deviceName}</span>
        <span>S.NO. - {deviceSerialNumber}</span>
        <span>
          Last Updated -{" "}
          {lastUpdatedTime
            ? `${lastUpdatedTime.toDateString()}, ${lastUpdatedTime.toLocaleTimeString()}`
            : "N/A"}
        </span>
      </div>
      <div className="bg-white border-4 border-black rounded-3xl overflow-hidden flex">
        <div className="flex-grow min-w-[650px] h-[290px] overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-72">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
          ) : (
            <table className="min-w-full bg-[#F0F0F0] border-collapse border-black min-h-72 text-sm ">
              <thead className="bg-black text-white tracking-wider">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={column.key}
                      className={`px-4 py-6 text-center ${
                        index === 0 ? "border-l-0" : ""
                      } ${
                        index === columns.length - 1
                          ? "border-r-0"
                          : "border-r-2"
                      } border-white`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, numRows).map((row, index) => (
                  <tr
                    key={index}
                    className="border-b-2 border-black font-semibold font-mono text-base"
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={column.key}
                        className={`px-4 py-6 text-center ${
                          colIndex === 0 ? "border-l-0" : ""
                        } ${
                          colIndex === columns.length - 1
                            ? "border-r-0"
                            : "border-r-2"
                        } border-black`}
                        style={{
                          backgroundColor:
                            column.key === "status"
                              ? row[column.key] === "Online"
                                ? "#d4edda"
                                : "#f8d7da"
                              : "inherit",
                          color:
                            column.key === "status"
                              ? row[column.key] === "Online"
                                ? "#145a32"
                                : "#641e16"
                              : "inherit",
                        }}
                      >
                        {column.key === "readingsLevel" ? (
                          <div className="relative">
                            <div
                              className="absolute top-0 left-0 bg-blue-500 h-full rounded-full"
                              style={{
                                width: `${row[column.key]}%`,
                                height: "100%",
                              }}
                            ></div>
                            <div className="bg-[#A5A5A5] h-4 w-full rounded-full"></div>
                          </div>
                        ) : (
                          row[column.key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-10 text-red-950 text-2xl bg-white font-mono tracking-wider font-bold"
                    >
                      Your Device is Offline
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
