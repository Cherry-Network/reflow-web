import { useState, useEffect } from "react";

const DeviceConfig = ({ closeFunction, deviceDetails }) => {
  const [deviceInput, setDeviceInput] = useState({
    MIN1: "",
    MAX1: "",
    FAC1: 0, // Set initial value as an integer
    CAL1: "",
    SNO1: "",
    MIN2: "",
    MAX2: "",
    FAC2: 0, // Set initial value as an integer
    CAL2: "",
    SNO2: "",
    MIN3: "",
    MAX3: "",
    FAC3: 0, // Set initial value as an integer
    CAL3: "",
    SNO3: "",
  });

  const [loading, setLoading] = useState(true);
  const [realTimeReadings, setRealTimeReadings] = useState({
    RawCH1: "",
    RawCH2: "",
    RawCH3: "",
  });

  const [calibratedReadings, setCalibratedReadings] = useState({
    CalibratedCH1: "",
    CalibratedCH2: "",
    CalibratedCH3: "",
  });

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const response = await fetch(
          `/api/mqtt-configTable?serialId=${deviceDetails.id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.length > 0) {
          const fetchedData = data[0];
          setDeviceInput({
            MIN1: fetchedData.MIN1,
            MAX1: fetchedData.MAX1,
            FAC1: fetchedData.FAC1,
            CAL1: fetchedData.CAL1,
            SNO1: fetchedData.SNO1,
            MIN2: fetchedData.MIN2,
            MAX2: fetchedData.MAX2,
            FAC2: fetchedData.FAC2,
            CAL2: fetchedData.CAL2,
            SNO2: fetchedData.SNO2,
            MIN3: fetchedData.MIN3,
            MAX3: fetchedData.MAX3,
            FAC3: fetchedData.FAC3,
            CAL3: fetchedData.CAL3,
            SNO3: fetchedData.SNO3,
          });
        }
      } catch (error) {
        console.error("Error fetching device data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRealTimeData = async () => {
      try {
        const response = await fetch(
          `/api/mqtt-readings?serialId=${deviceDetails.id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRealTimeReadings(data);
      } catch (error) {
        console.error("Error fetching real-time readings:", error);
      }
    };

    fetchDeviceData();
    const intervalId = setInterval(fetchRealTimeData, 3000); // Fetch data every 3 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [deviceDetails.id]);

  const calculateCalibratedReading = (reading, calibration, factor) => {
    switch (factor) {
      case 0: // Addition
        return reading + calibration;
      case 1: // Subtraction
        return reading - calibration;
      case 2: // Multiplication
        return reading * calibration;
      case 3: // Division
        return calibration !== 0 ? reading / calibration : "N/A"; // Handle division by zero
      default:
        return reading;
    }
  };

  useEffect(() => {
    const newCalibratedReadings = {
      CalibratedCH1: calculateCalibratedReading(
        Number(realTimeReadings.RawCH1),
        Number(deviceInput.CAL1),
        Number(deviceInput.FAC1)
      ),
      CalibratedCH2: calculateCalibratedReading(
        Number(realTimeReadings.RawCH2),
        Number(deviceInput.CAL2),
        Number(deviceInput.FAC2)
      ),
      CalibratedCH3: calculateCalibratedReading(
        Number(realTimeReadings.RawCH3),
        Number(deviceInput.CAL3),
        Number(deviceInput.FAC3)
      ),
    };

    setCalibratedReadings(newCalibratedReadings);
    console.log("Updated Calibrated Readings:", newCalibratedReadings);
  }, [realTimeReadings, deviceInput]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    // Update the device input state
    const updatedValue = type === "number" ? Number(value) : value;
    setDeviceInput((prevState) => {
      const newState = {
        ...prevState,
        [name]: updatedValue,
      };

      // Ensure FAC values are integers
      if (name.startsWith("FAC")) {
        newState[name] = Number(updatedValue);
      }

      return newState;
    });

    // Get the index from the name (e.g., CAL1 -> 1)
    const index = name.charAt(3); // '1', '2', or '3'

    // Fetch the current raw reading and the current calibration and factor
    const reading = Number(realTimeReadings[`RawCH${index}`]);
    const calibration = Number(updatedValue);
    const factor = Number(deviceInput[`FAC${index}`]);

    // Calculate and log the calibrated reading
    const calibratedReading = calculateCalibratedReading(
      reading,
      calibration,
      factor
    );
    console.log(`Calibrated Reading CH${index}:, calibratedReading`);
  };

  const deviceData = [
    {
      type: "header",
      name: { name: "serial number", value: "Serial No." },
      range: {
        name: "Range",
        value: [
          { name: "min", value: "Min" },
          { name: "max", value: "Max" },
        ],
      },
      calibration: { name: "cal", value: "Calibration" },
      factor: { name: "fac", value: "Factor" },
      alert: {
        name: "Threshold",
        value: [
          { name: "min", value: "Min" },
          { name: "max", value: "Max" },
        ],
      },
      readings: { name: "read", value: "Readings" },
      calibratedReadings: { name: "cal_read", value: "Calibrated Readings" },
    },
    {
      name: { name: "SNO1", value: deviceInput.SNO1 },
      range: {
        value: [
          { name: "MIN1", value: deviceInput.MIN1 },
          { name: "MAX1", value: deviceInput.MAX1 },
        ],
      },
      calibration: { name: "CAL1", value: deviceInput.CAL1 },
      factor: { name: "FAC1", value: deviceInput.FAC1 },
      alert: {
        value: [
          { name: "min", value: "" },
          { name: "max", value: "" },
        ],
      },
      readings: {
        name: realTimeReadings.RawCH1,
        value: realTimeReadings.RawCH1,
      },
      calibratedReadings: {
        name: "Calibrated CH1",
        value: calibratedReadings.CalibratedCH1,
      },
    },
    {
      name: { name: "SNO2", value: deviceInput.SNO2 },
      range: {
        value: [
          { name: "MIN2", value: deviceInput.MIN2 },
          { name: "MAX2", value: deviceInput.MAX2 },
        ],
      },
      calibration: { name: "CAL2", value: deviceInput.CAL2 },
      factor: { name: "FAC2", value: deviceInput.FAC2 },
      alert: {
        value: [
          { name: "min", value: "" },
          { name: "max", value: "" },
        ],
      },
      readings: {
        name: realTimeReadings.RawCH2,
        value: realTimeReadings.RawCH2,
      },
      calibratedReadings: { name: "", value: calibratedReadings.CalibratedCH2 },
    },
    {
      name: { name: "SNO3", value: deviceInput.SNO3 },
      range: {
        value: [
          { name: "MIN3", value: deviceInput.MIN3 },
          { name: "MAX3", value: deviceInput.MAX3 },
        ],
      },
      calibration: { name: "CAL3", value: deviceInput.CAL3 },
      factor: { name: "FAC3", value: deviceInput.FAC3 },
      alert: {
        value: [
          { name: "min", value: "" },
          { name: "max", value: "" },
        ],
      },
      readings: {
        name: realTimeReadings.RawCH3,
        value: realTimeReadings.RawCH3,
      },
      calibratedReadings: { name: "", value: calibratedReadings.CalibratedCH3 },
    },
  ];

  const displayFactorValue = (value) => {
    switch (value) {
      case 0:
        return "Addition";
      case 1:
        return "Subtraction";
      case 2:
        return "Multiplication";
      case 3:
        return "Division";
      default:
        return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (deviceInput.CAL1 < 0 || deviceInput.CAL2 < 0 || deviceInput.CAL3 < 0) {
      alert("Calibration value cannot be negative");
    } else {
      try {
        const topic = generateMqttTopic(deviceDetails.id);

        // Create a new object to ensure FAC values are integers
        const publishData = {
          ...deviceInput,
          FAC1: Number(deviceInput.FAC1), // Convert to integer
          FAC2: Number(deviceInput.FAC2), // Convert to integer
          FAC3: Number(deviceInput.FAC3), // Convert to integer
        };

        const response = await fetch("/api/mqtt-input", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deviceInput: publishData, topic }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Data published successfully:", result);
        alert("Data published successfully");
      } catch (error) {
        console.error("Error publishing data:", error);
        alert("Failed to publish data");
      }
    }
  };

  const generateMqttTopic = (serialId) => {
    const prefix = serialId.slice(0, 3);
    const suffix = serialId.slice(3, 5);
    return `${prefix}/${suffix}/INPUT`;
  };

  const tableCellStyle = "py-5 px-2 border-r border-b text-center";
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col gap-2 pb-10">
            <div className="text-3xl font-bold text-[#1D1D1D]">
              Welcome to{" "}
              {JSON.parse(sessionStorage.getItem("selectedProjectID")).name}
            </div>
            <div className="text-lg font-semibold flex gap-8 pl-1 text-theme_black/40">
              <span>Device - {deviceDetails && deviceDetails.name}</span>
              <span>S.NO. - {deviceDetails && deviceDetails.id}</span>
            </div>
          </div>
          <div className="bg-theme_black/10 p-6 rounded-xl flex flex-col gap-8">
            <div className="flex flex-col">
              {deviceData.map((device, index) => (
                <form
                  key={index}
                  className={`grid grid-cols-7 font-medium ${
                    device.type
                      ? "bg-theme_black text-theme_white rounded-t-xl"
                      : "text-theme_black bg-theme_white"
                  }`}
                >
                  <div
                    className={`${tableCellStyle} border-l ${
                      device.type && "rounded-tl-xl"
                    } ${device.type ? "" : "border-theme_black"}`}
                  >
                    <input
                      type="text"
                      name={device.name.name}
                      value={device.name.value}
                      onChange={handleInputChange}
                      className={`text-center w-11/12 ${
                        device.type && "bg-theme_black text-lg text-theme_white"
                      }`}
                      disabled={device.type}
                    />
                  </div>
                  <div className="grid grid-cols-2">
                    <div
                      className={`${tableCellStyle} col-span-2 ${
                        device.range.name ? "" : "hidden"
                      }`}
                    >
                      {device.range.name}
                    </div>
                    {device.range.value.map((data, index) => (
                      <div
                        className={`${tableCellStyle} ${
                          device.type ? "" : "border-theme_black"
                        }`}
                        key={index}
                      >
                        <input
                          type={device.type ? "text" : "number"}
                          name={data.name}
                          value={data.value}
                          onChange={handleInputChange}
                          className={`text-center w-11/12 ${
                            device.type &&
                            "bg-theme_black text-lg text-theme_white"
                          }`}
                          disabled={device.type}
                        />
                      </div>
                    ))}
                  </div>
                  <div
                    className={`${tableCellStyle} ${
                      device.type ? "" : "border-theme_black"
                    }`}
                  >
                    <input
                      type={device.type ? "text" : "number"}
                      name={device.calibration.name}
                      value={device.calibration.value}
                      onChange={handleInputChange}
                      className={`text-center w-11/12 ${
                        device.type && "bg-theme_black text-lg text-theme_white"
                      }`}
                      disabled={device.type}
                    />
                  </div>
                  <div
                    className={`${tableCellStyle} ${
                      device.type ? "" : "border-theme_black"
                    }`}
                  >
                    {device.type ? (
                      device.factor.value
                    ) : (
                      <select
                        name={device.factor.name}
                        value={device.factor.value}
                        onChange={handleInputChange}
                        className="-ml-1 bg-theme_black/10 py-2 px-2 rounded-full"
                      >
                        <option disabled>
                          {displayFactorValue(device.factor.value)}
                        </option>
                        <option value={0}>Addition</option>
                        <option value={1}>Subtraction</option>
                        <option value={2}>Multiplication</option>
                        <option value={3}>Division</option>
                      </select>
                    )}
                  </div>
                  <div
                    className={`grid grid-cols-${device.alert.value.length}`}
                  >
                    <div
                      className={`${tableCellStyle} col-span-2 ${
                        device.alert.name ? "" : "hidden"
                      }`}
                    >
                      {device.alert.name}
                    </div>
                    {device.alert.value.map((data, index) => (
                      <div
                        className={`${tableCellStyle} ${
                          device.type ? "" : "border-theme_black"
                        }`}
                        key={index}
                      >
                        {data.value}
                      </div>
                    ))}
                  </div>
                  <div
                    className={`${tableCellStyle} ${
                      device.type ? "" : "border-theme_black"
                    }`}
                  >
                    {device.readings.value}
                  </div>
                  <div
                    className={`${tableCellStyle} ${
                      device.type ? "rounded-t-xl" : "border-theme_black"
                    }`}
                  >
                    {device.calibratedReadings.value !== undefined
                      ? device.calibratedReadings.value
                      : "N/A"}
                  </div>
                </form>
              ))}
            </div>
            <div className="flex justify-end gap-6">
              <button
                className="bg-theme_black text-theme_white text-center w-36 py-3 rounded-full text-lg border border-theme_black"
                onClick={handleSubmit}
              >
                Save
              </button>
              <button
                className="bg-theme_black/40 text-theme_white border border-theme_black/30 text-center w-36 py-3 rounded-full text-lg"
                onClick={closeFunction}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeviceConfig;
