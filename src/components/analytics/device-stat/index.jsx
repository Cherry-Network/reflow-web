"use client";
import React, { useState, useEffect } from "react";

// Function to fetch data from the API endpoint
const fetchData = async (serialId) => {
  try {
    const response = await fetch(`/api/mqtt-output?serialId=${serialId}`);
    const result = await response.json();

    if (result.length === 0) return []; // Handle empty result case

    // Extracting the single object from the result
    const dataObject = result[0];

    // Mapping the data to the format expected in the table
    const formattedData = [
      {
        serialNo: 1,
        readings: dataObject.RawCH1 || "N/A",
        calibratedReadings: dataObject.CH1 || "N/A",
        readingsLevel: calculateLevel(dataObject.ERR1 || 0),
        status: dataObject.ERR1 ? "Online" : "Offline",
      },
      {
        serialNo: 2,
        readings: dataObject.RawCH2 || "N/A",
        calibratedReadings: dataObject.CH2 || "N/A",
        readingsLevel: calculateLevel(dataObject.ERR2 || 0),
        status: dataObject.ERR2 ? "Online" : "Offline",
      },
      {
        serialNo: 3,
        readings: dataObject.RawCH3 || "N/A",
        calibratedReadings: dataObject.CH3 || "N/A",
        readingsLevel: calculateLevel(dataObject.ERR3 || 0),
        status: dataObject.ERR3 ? "Online" : "Offline",
      },
    ];

    return formattedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// Function to calculate the level based on the reading
const calculateLevel = (reading) => {
  const maxReading = 100;
  return (reading / maxReading) * 100;
};

// DataTable component
const DataTable = ({ editFunction, deviceSerialNumber, deviceName }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Track initial loading state
  const [initialLoad, setInitialLoad] = useState(true); // Track if initial load is done

  useEffect(() => {
    const getData = async () => {
      if (initialLoad) {
        setLoading(true); // Show spinner during initial fetch
      }
      const result = await fetchData(deviceSerialNumber); // Pass serialNumber to fetchData
      setData(result);
      if (initialLoad) {
        setLoading(false); // Hide spinner after initial fetch
        setInitialLoad(false); // Mark initial load as done
      }
    };

    getData();

    const intervalId = setInterval(getData, 5000);

    return () => clearInterval(intervalId);
  }, [deviceSerialNumber]); // Add deviceSerialNumber to dependency array

  // Define the columns for the table
  const columns = [
    { key: "serialNo", label: "Serial No" },
    { key: "readings", label: "Readings" },
    { key: "calibratedReadings", label: "Calibrated Readings" },
    { key: "readingsLevel", label: "Readings Level" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="">
      <div className="w-full h-full p-7 rounded-xl">
        <div className="text-lg font-bold flex gap-8 pl-2 text-theme_black/60 pb-6">
          <span>Device - {deviceName}</span>
          <span>S.NO. - {deviceSerialNumber}</span>
        </div>
        <div className="bg-white border-4 border-black rounded-3xl overflow-hidden flex">
          <div className="flex-grow">
            {loading && initialLoad ? (
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
                          } border-black ${
                            column.key === "status"
                              ? "text-black"
                              : "text-black"
                          }`}
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
