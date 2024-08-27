"use client";
import React, { useState, useEffect } from "react";

const fetchData = async () => {
  try {
    const response = await fetch("/api/mqtt-output");
    const result = await response.json();

    const formattedData = [
      {
        serialNo: 1,
        readings: result[0]?.CH1 || "N/A",
        calibratedReadings: result[0]?.CalibratedValue1 || "N/A",
        readingsLevel: calculateLevel(result[0]?.CH1 || 0),
        status: [0, 1, 2].includes(result[0]?.ERR1) ? "Online" : "Offline",
      },
      {
        serialNo: 2,
        readings: result[0]?.CH2 || "N/A",
        calibratedReadings: result[0]?.CalibratedValue2 || "N/A",
        readingsLevel: calculateLevel(result[0]?.CH2 || 0),
        status: [0, 1, 2].includes(result[0]?.ERR2) ? "Online" : "Offline",
      },
      {
        serialNo: 3,
        readings: result[0]?.CH3 || "N/A",
        calibratedReadings: result[0]?.CalibratedValue3 || "N/A",
        readingsLevel: calculateLevel(result[0]?.CH3 || 0),
        status: [0, 1, 2].includes(result[0]?.ERR3) ? "Online" : "Offline",
      },
    ];

    return formattedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const calculateLevel = (reading) => {
  const maxReading = 100;
  return (reading / maxReading) * 100;
};

const DataTable = ({ editFunction, deviceSerialNumber, deviceName }) => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();
      setData(result);
    };

    getData();

    const intervalId = setInterval(getData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const columns = [
    { key: "serialNo", label: "Serial No" },
    { key: "readings", label: "Readings" },
    { key: "calibratedReadings", label: "Calibrated Readings" },
    { key: "readingsLevel", label: "Readings Level" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="px-10">
      <div className="w-full h-full bg-theme_black/10 p-7 rounded-xl">
        <div className="text-lg font-bold flex gap-8 pl-2 text-theme_black/60 pb-6">
          <span>Device - {deviceName}</span>
          <span>S.NO. - {deviceSerialNumber}</span>
        </div>
        <div className="bg-white border-4 border-black rounded-3xl overflow-hidden flex">
          <div className="flex-grow">
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
                        } border-black ${
                          column.key === "status" ? "text-black" : "text-black"
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
          </div>

          <div className="w-64 flex flex-col bg-white border-l-2 border-black">
            <div className="bg-black text-white text-center flex justify-evenly items-center py-6 font-bold border-l-2 border-white">
              <span>Export Data</span>
              <button onClick={editFunction}>
                <img src="/icons/edit.svg" alt="Edit" className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 flex flex-col h-full">
              <div className="mb-4">
                <label className="block text-gray-700">Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded-2xl text-black"
                  style={{ height: "2rem" }}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded-2xl text-black"
                  style={{ height: "2rem" }}
                />
              </div>
              <button className="w-full py-2 bg-gray-800 text-white rounded-3xl hover:bg-gray-600">
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
