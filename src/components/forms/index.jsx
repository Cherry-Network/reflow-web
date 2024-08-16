"use client";

import React, { useState } from "react";
import { InputField } from "./ui";
const formConfig = [
  {
    type: "serialNumber",
    name: "serialNumber",
    label: "Serial Number",
    pattern: "\\d{4}-\\d{4}",
  },
  {
    type: "activationCode",
    name: "activationCode",
    label: "Activation Code",
    pattern: "[A-Z0-9]{6}",
  },
  {
    type: "dropdown",
    name: "dropdownValue",
    label: "Select an Option",
    options: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
    ],
  },
];

const Form = () => {
  const [formData, setFormData] = useState(() =>
    formConfig.reduce((acc, item) => ({ ...acc, [item.name]: "" }), {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <main className="flex flex-col items-start p-10">
      <h1 className="text-3xl font-bold mb-8">Dynamic Form</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-3xl p-10 bg-[#F0F0F0] rounded-md shadow-md"
      >
        {formConfig.map((item, index) => (
          <InputField
            key={index}
            type={item.type}
            onChange={handleChange}
            value={formData[item.name]}
            name={item.name}
            label={item.label}
            pattern={item.pattern}
            {...(item.options && { options: item.options })}
          />
        ))}
        <button
          type="submit"
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 mt-5"
        >
          Next
        </button>
      </form>
    </main>
  );
};

export default Form;
