"use client";
import DataTable from "@/components/analytics/device-stat";
import DeviceConfig from "@/components/analytics/device-config";
import PageLayout from "@/components/layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Analytics = () => {
  const router = useRouter();
  const [data, setData] = useState({});
  const [deviceData, setDeviceData] = useState({});
  return (
    <>
      <PageLayout pageName={"Analytics"}>
        <div className="px-8 mt-20">
          <>
            <DeviceConfig closeFunction={() => router.push('/viewproject')} />
          </>
        </div>
      </PageLayout>
    </>
  );
};

export default Analytics;
