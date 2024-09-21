"use client";
import React, { useState, useEffect } from "react";

// Fetch config data once
const fetchConfigData = async (serialId) => {
  try {
    const response = await fetch(`/api/mqtt-configTable?serialId=${serialId}`);
    const result = await response.json();
    if (result.length > 0) {
      const config = result[0];
      console.log("Config Data:", config);
      return config;
    } else {
      console.error("No config data found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching config data:", error);
    return null;
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

    const formattedData = [
      {
        serialNo: config.SNO1,
        readings: dataObject.RawCH1 || "N/A",
        calibratedReadings: dataObject.CH1 || "N/A",
        readingsLevel: calculateLevel(dataObject.ERR1 || 0),
        status: dataObject.ERR1 === 0 ? "Online" : "Offline",
      },
      {
        serialNo: config.SNO2,
        readings: dataObject.RawCH2 || "N/A",
        calibratedReadings: dataObject.CH2 || "N/A",
        readingsLevel: calculateLevel(dataObject.ERR2 || 0),
        status: dataObject.ERR2 === 0 ? "Online" : "Offline",
      },
      {
        serialNo: config.SNO3,
        readings: dataObject.RawCH3 || "N/A",
        calibratedReadings: dataObject.CH3 || "N/A",
        readingsLevel: calculateLevel(dataObject.ERR3 || 0),
        status: dataObject.ERR3 === 0 ? "Online" : "Offline",
      },
    ];

    return { data: formattedData, lastUpdatedTime: dataObject.UpdateTimeStamp };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: [], lastUpdatedTime: null };
  }
};

const calculateLevel = (reading) => {
  const maxReading = 100;
  return (reading / maxReading) * 100;
};

const parseUpdateTime = (timestamp) => {
  const [date, time] = timestamp.split(" ");
  const [day, month, year] = date.split("/");
  const [hour, minute, second] = time.split(":");
  const parsedDate = new Date(
    `20${year}-${month}-${day}T${hour}:${minute}:${second}`
  );
  return parsedDate;
};

const DataTable = ({ deviceSerialNumber, deviceName }) => {
  const [data, setData] = useState([]);
  const [config, setConfig] = useState(null); // State for config data
  const [lastUpdatedTime, setLastUpdatedTime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      const configData = await fetchConfigData(deviceSerialNumber);
      if (configData) {
        setConfig(configData); // Set config only once

        // Fetch the readings once immediately after config is ready
        const result = await fetchData(deviceSerialNumber, configData);
        setData(result.data);
        setLastUpdatedTime(result.lastUpdatedTime);
        setLoading(false); // Set loading to false after first fetch

        // Set up the interval for fetching data periodically
        const intervalId = setInterval(async () => {
          const intervalResult = await fetchData(
            deviceSerialNumber,
            configData
          );
          setData(intervalResult.data);
          setLastUpdatedTime(intervalResult.lastUpdatedTime);
        }, 3000);

        // Cleanup on component unmount
        return () => clearInterval(intervalId);
      } else {
        setLoading(false); // Stop loading if config fetch fails
      }
    };

    fetchInitialData();
  }, [deviceSerialNumber]); // Dependency on deviceSerialNumber

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
              data.some((row) => row.status === "Online")
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          ></span>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full p-7 rounded-xl">
      <div className="text-lg font-bold flex gap-8 pl-2 text-theme_black/60 pb-6">
        <span>Device - {deviceName}</span>
        <span>S.NO. - {deviceSerialNumber}</span>
        <span>Last Updated - {lastUpdatedTime ? lastUpdatedTime : "N/A"}</span>
      </div>
      <div className="bg-white border-4 border-black rounded-3xl overflow-hidden flex">
        <div className="flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
          ) : (
            <table className="min-w-full bg-[#F0F0F0] border-collapse border-black">
              <thead className="bg-black text-white">
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
                {data.map((row, index) => (
                  <tr key={index} className="border-b-2 border-black">
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
                      className="text-center py-10 text-red-950 text-2xl bg-white font-mono tracking-wider font-bold "
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
