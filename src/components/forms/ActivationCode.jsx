import React from "react";

const ActivationCode = ({ onChange, value, label, name }) => {
  return (
    <div className="flex flex-col">
      <label className="text-gray-500 mb-1">{label}</label>
      <input
        name={name} // Ensure name is set
        type="text"
        placeholder="Activation Code"
        className="p-2 border border-gray-300 rounded-xl bg-white text-lg"
        onChange={onChange}
        value={value}
        maxLength="6"
        pattern="[A-Za-z0-9]{6}"
        title="Please enter a 6-digit activation code"
      />
    </div>
  );
};

export default ActivationCode;
