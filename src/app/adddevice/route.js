'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

const AddDevice = ({ projectId }) => {
  const router = useRouter();
  const [device, setDevice] = useState({
    name: "",
    type: "",
    status: "active",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDevice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          devices: [device], // Add a single device
        }),
      });

      if (response.ok) {
        console.log("Device added successfully");
        router.push(`/projects/${projectId}`);
      } else {
        console.error("Error adding device:", await response.text());
      }
    } catch (error) {
      console.error("Error adding device:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields for device */}
      <input
        type="text"
        name="name"
        value={device.name}
        onChange={handleChange}
        placeholder="Device Name"
        required
      />
      <input
        type="text"
        name="type"
        value={device.type}
        onChange={handleChange}
        placeholder="Device Type"
        required
      />
      <select name="status" value={device.status} onChange={handleChange}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <button type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add Device"}
      </button>
    </form>
  );
};

export default AddDevice;
