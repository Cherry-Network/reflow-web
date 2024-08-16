import React from "react";

const SerialNumber = ({ onChange, value, label, name }) => {
  return (
    <div className="flex flex-col">
      <label className="text-gray-500 mb-1">{label}</label>
      <input
        name={name} // Ensure name is set
        type="text"
        placeholder="Serial Number"
        className="p-2 border border-gray-300 rounded-xl bg-white text-lg"
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

export default SerialNumber;
