"use client";
import DataTable from "@/components/analytics/device-stat";
import DeviceConfig from "@/components/analytics/device-config";
import PageLayout from "@/components/layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Analytics = () => {
  const router = useRouter();
  const [editTable, setEditTable] = useState(false);
  const [data, setData] = useState({});
  const [deviceData, setDeviceData] = useState({});
  useEffect(() => {
    if (localStorage.getItem("projectDetail")) {
      const project = JSON.parse(localStorage.getItem("projectDetail"));
      setData(project);
    }
    if (localStorage.getItem("deviceDetail")) {
      const device = JSON.parse(localStorage.getItem("deviceDetail"));
      setDeviceData(device);
    }
  }, []);
  return (
    <>
      <PageLayout pageName={"Analytics"}>
        <div className="px-8 mt-20">
          {editTable ? (
            <>
              <DeviceConfig closeFunction={() => setEditTable(false)} />
            </>
          ) : (
            <DataTable
              editFunction={() => {
                setEditTable(true);
              }}
              addNewDevice={() => {
                router.push("/viewproject");
              }}
              viewAllProjects={() => {
                localStorage.removeItem("projectDetail");
                router.push("/");
              }}
              projectData={data.project_name}
              deviceSerialNumber={deviceData.serialNumber}
            />
          )}
        </div>
      </PageLayout>
    </>
  );
};

export default Analytics;
