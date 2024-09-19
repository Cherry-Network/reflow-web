"use client";
import React, { useState, useEffect } from "react";

const fetchData = async (serialId) => {
  try {
    const response = await fetch(`/api/mqtt-output?serialId=${serialId}`);
    const result = await response.json();
    console.log("Fetched data:", result); // Debug line

    if (result.length === 0) return { data: [], lastUpdatedTime: null };

    const dataObject = result[0];
    const lastUpdatedTime = parseUpdateTime(dataObject.UpdateTimeStamp);
    const isDeviceOnline = checkIfDeviceOnline(lastUpdatedTime);

    const formattedData = [
      {
        serialNo: 1,
        readings: dataObject.RawCH1 || "N/A",
        calibratedReadings: dataObject.CH1 || "N/A",
        readingsLevel: calculateLevel(dataObject.ERR1 || 0),
        status: isDeviceOnline ? "Online" : "Offline",
      },
      {
        serialNo: 2,
        readings: dataObject.RawCH2 || "N/A",
        calibratedReadings: dataObject.CH2 || "N/A",
        readingsLevel: calculateLevel(dataObject.ERR2 || 0),
        status: isDeviceOnline ? "Online" : "Offline",
      },
      {
        serialNo: 3,
        readings: dataObject.RawCH3 || "N/A",
        calibratedReadings: dataObject.CH3 || "N/A",
        readingsLevel: calculateLevel(dataObject.ERR3 || 0),
        status: isDeviceOnline ? "Online" : "Offline",
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
  console.log(`Parsed date: ${parsedDate}`); // Debug line
  return parsedDate;
};

const checkIfDeviceOnline = (lastUpdatedTime) => {
  const now = new Date();
  const timeDifference = now - lastUpdatedTime;
  console.log(`Current time: ${now}`);
  console.log(`Last updated time: ${lastUpdatedTime}`);
  console.log(`Time difference: ${timeDifference} milliseconds`);
  const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
  return timeDifference <= twoDaysInMilliseconds;
};

const DataTable = ({ editFunction, deviceSerialNumber, deviceName }) => {
  const [data, setData] = useState([]);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData(deviceSerialNumber);
      if (JSON.stringify(result.data) !== JSON.stringify(data)) {
        setData(result.data);
        setRefreshKey(Date.now()); // Force re-render
      }
      if (result.lastUpdatedTime !== lastUpdatedTime) {
        setLastUpdatedTime(result.lastUpdatedTime);
      }
      if (loading) {
        setLoading(false);
      }
    };

    getData();

    const intervalId = setInterval(getData, 5000);

    return () => clearInterval(intervalId);
  }, [deviceSerialNumber]);

  const columns = [
    { key: "serialNo", label: "Serial No" },
    { key: "readings", label: "Readings" },
    { key: "calibratedReadings", label: "Calibrated Readings" },
    { key: "readingsLevel", label: "Readings Level" },
    { key: "status", label: "Status" },
  ];

  return (
    <div key={refreshKey} className="">
      <div className="w-full h-full p-7 rounded-xl">
        <div className="text-lg font-bold flex gap-8 pl-2 text-theme_black/60 pb-6">
          <span>Device - {deviceName}</span>
          <span>S.NO. - {deviceSerialNumber}</span>
          <span>
            Last Updated - {lastUpdatedTime ? lastUpdatedTime : "N/A"}
          </span>
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
                <tbody className="">
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
    </div>
  );
};

export default DataTable;
