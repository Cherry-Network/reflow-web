
"use client";

import React, { useState } from "react";
import { InputField } from "./ui";
import { useRouter } from "next/navigation";
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




const Form = ({ projectID }) => {
  const [formData, setFormData] = useState(() =>
    formConfig.reduce((acc, item) => ({ ...acc, [item.name]: "" }), {})
  );

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const deviceData = {
      name: formData.serialNumber,
      serial_no: formData.serialNumber, // Assuming serial number is used as the serial_no
      status: formData.activationCode ? "active" : "inactive",
    };

    try {
      const response = await fetch(`/api/projects/${projectID}/add-device`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deviceData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Device added:", data);
        router.push("/some-page"); // Redirect as necessary
      } else {
        console.error("Error adding device:", await response.text());
      }
    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

  return (
    <main className="flex flex-col items-start p-10">
      <h1 className="text-3xl font-bold mb-8">Fill the details</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full p-10 bg-theme_black/5 rounded-xl"
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