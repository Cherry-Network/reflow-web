import React from "react";

const Dropdown = ({ options, onChange, value, label, name }) => {
  return (
    <div className="flex flex-col">
      <label className="text-gray-500 mb-1">{label}</label>
      <select
        name={name} // Ensure name is set
        className="p-2 border border-gray-300 rounded-xl bg-white text-lg focus:border-black focus:outline-none"
        onChange={onChange}
        value={value}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value} className="text-black">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
