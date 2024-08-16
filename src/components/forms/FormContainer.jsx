"use client";
import React, { useState } from "react";
import Dropdown from "./Dropdown";
import SerialNumber from "./SerialNumber";
import ActivationCode from "./ActivationCode";

const formComponents = {
  dropdown: Dropdown,
  serialNumber: SerialNumber,
  activationCode: ActivationCode,
  // Add more components as needed
};

const FormContainer = ({ config }) => {
  const [formData, setFormData] = useState(() =>
    config.reduce((acc, item) => ({ ...acc, [item.name]: "" }), {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
      style={{ maxWidth: "1200px" }}
      className="flex flex-col gap-6 mx-auto p-10 bg-[#F0F0F0] rounded-md shadow-md"
    >
      {config.map((item, index) => {
        const Component = formComponents[item.type];
        return (
          <Component
            key={index}
            onChange={handleChange}
            value={formData[item.name]}
            name={item.name} // Ensure name is passed
            label={item.label}
            {...item.props}
          />
        );
      })}
      <button
        type="submit"
        className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 m-5"
      >
        Next
      </button>
    </form>
  );
};

export default FormContainer;
