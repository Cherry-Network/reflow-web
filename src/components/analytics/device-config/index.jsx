import { useState } from "react";

const DeviceConfig = ({closeFunction}) => {
  const [deviceInput, setDeviceInput] = useState({
    MIN1: 10,
    MAX1: 50,
    FAC1: 0,
    CAL1: 1.0,
    SNO1: "A123",
    MIN2: 5,
    MAX2: 30,
    FAC2: 1,
    CAL2: 1.0,
    SNO2: "B456",
    MIN3: 20,
    MAX3: 80,
    FAC3: 2,
    CAL3: 1.0,
    SNO3: "C789",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (e.target.type === "text") {
      setDeviceInput((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setDeviceInput((prevState) => ({
        ...prevState,
        [name]: Number(value),
      }));
    }
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
        name: "Alert",
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
      readings: { name: "", value: "" },
      calibratedReadings: { name: "", value: "" },
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
      readings: { name: "", value: "" },
      calibratedReadings: { name: "", value: "" },
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
      readings: { name: "", value: "" },
      calibratedReadings: { name: "", value: "" },
    },
  ];

  const displayFactorValue = (value) => {
    switch (value) {
      case 0:
        return "Addition";
      case 1:
        return "Substraction";
      case 2:
        return "Multiplication";
      case 3:
        return "Division";
      default:
        return "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (deviceInput.CAL1 < 0 || deviceInput.CAL2 < 0 || deviceInput.CAL3 < 0) {
      alert("Calibration value cannot be negative");
    } else {
      console.log(deviceInput);
    }
  };
  const tableCellStyle = "py-5 px-2 border-r border-b text-center";
  return (
    <>
      <div className="flex flex-col gap-2 pb-10">
        <div className="text-3xl font-bold text-[#1D1D1D]">
          Welcome to Project Name
        </div>
        <div className="text-lg font-semibold flex gap-8 pl-1 text-theme_black/40">
          <span>Device - 1</span>
          <span>S.NO. - AX301</span>
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
              } `}
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
              <div className={`grid grid-cols-2`}>
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
                      className={`text-center w-11/12  ${
                        device.type && "bg-theme_black text-lg text-theme_white"
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
                  className={`text-center w-11/12  ${
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
                    <option value={1}>Substraction</option>
                    <option value={2}>Multiplication</option>
                    <option value={3}>Division</option>
                  </select>
                )}
              </div>
              <div className={`grid grid-cols-${device.alert.value.length}`}>
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
                  device.type && "rounded-t-xl"
                } ${device.type ? "" : "border-theme_black"}`}
              >
                {device.calibratedReadings.value}
              </div>
            </form>
          ))}
        </div>
        <div className="flex justify-end gap-6">
          <button
            className={`bg-theme_black text-theme_white text-center w-36 py-3 rounded-full text-lg border border-theme_black`}
            onClick={handleSubmit}
          >
            Save
          </button>
          <button className="bg-theme_black/40 text-theme_white border border-theme_black/30 text-center w-36 py-3 rounded-full text-lg"
          onClick={closeFunction}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default DeviceConfig;
