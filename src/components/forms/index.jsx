"use client";

import React, { useState, useEffect } from "react";
import { InputField } from "./ui";
import { useRouter } from "next/navigation";
import { set } from "mongoose";

const formConfig = [
  {
    type: "deviceName",
    name: "deviceName",
    label: "Device Name",
  },
  {
    type: "serialNumber",
    name: "serialNumber",
    label: "Serial Number",
    pattern: "^[A-Za-z]{2}\\d{3,}$",
  },
  {
    type: "activationCode",
    name: "activationCode",
    label: "Activation Code",
    pattern: "[A-Z0-9]{6}",
  },
];

const Form = ({ projectID, onSuccess }) => {
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

  const [secretKey, setSecretKey] = useState(null);
  const [error, setError] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      device_serial_number: formData.serialNumber,
      secret_key: formData.activationCode,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch("/api/get-secret-key/", requestOptions);
      const result = await response.json();
      if (result.status === "verified") {
        const deviceData = {
          name: formData.deviceName,
          serial_no: formData.serialNumber,
          activation_code: formData.activationCode,
          status: formData.activationCode ? "active" : "inactive",
        };

        try {
          const response = await fetch(
            `/api/projects/${projectID}/add-device`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(deviceData),
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log("Device added:", data);
            alert("Device added successfully!");
            onSuccess();
          } else if (response.status === 400) {
            const errorMessage = await response.text();
            alert(errorMessage);
          } else {
            alert("Failed to add device");
          }
        } catch (error) {
          console.log("Error adding device:", error);
          alert("Failed to add device");
        }
      } else {
        alert("Invalid device serial number or secret key");
      }
    } catch (error) {
      console.error(error);
      alert("Error fetching secret key");
    }
    setSubmitting(false);
  };

  return (
    <main className="flex flex-col items-start p-6">
      <h1 className="text-xl font-bold mb-6">Fill the details</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full p-8 bg-theme_black/5 rounded-xl"
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
          disabled={submitting}
        >
          {submitting ? (
            <svg
              className="animate-spin mx-auto h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Add Device"
          )}
        </button>
      </form>
    </main>
  );
};

export default Form;
