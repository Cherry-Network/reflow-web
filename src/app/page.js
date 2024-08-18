"use client";
import Form from "@/components/forms";
import Navbar from "@/components/navbar";
import { useState } from "react";
import AddProjectButtons from "@/components/add-project";
import DeviceConfig from "@/components/analytics/device-config";

const projects = [
  { project_id: '1', project_name: 'Project One' },
  { project_id: '2', project_name: 'Project Two' },
];

export default function Home() {
  const sidebarItems = [
    { name: "Add Project", icon: "/icons/add.svg" },
    { name: "Analytics", icon: "/icons/analytics.svg" },
    { name: "Ai Analytics", icon: "/icons/analytics.svg" },
    { name: "Subscription", icon: "/icons/subscription.svg" },
    { name: "Provide Access", icon: "/icons/access.svg" },
  ];
  const [activeButton, setActiveButton] = useState(sidebarItems[0].name);

  const dispatchComponent = (action) => {
    switch (action) {
      case "Add Project":
        return <AddProjectButtons projects={projects} />;
      case "Analytics":
        return <DeviceConfig />;
      case "Ai Analytics":
        return <div>Analytics seasoned with AI masala</div>;
      case "Subscription":
        return <div>Subscription</div>;
      case "Provide Access":
        return <div>Access</div>;
      case "Settings":
        return <div>Settings</div>;
      default:
        return <Form />;
    }
  };
  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
        <Navbar />
        <div className="flex w-full h-full">
          <div className="">
            <div className="w-[300px] flex flex-col justify-center gap-3 pt-4 h-full bg-[#1B1B1B]">
              <div className="rounded-full bg-white p-4 w-fit mx-auto">
                <img
                  src="/assets/company-logo.svg"
                  alt="logo"
                  className="h-20 w-20"
                />
              </div>
              <div className="text-white text-center text-xl tracking-wide">
                Company Name
              </div>
              <div className="mt-7 grid grid-cols-1 items-start gap-4 px-5">
                {sidebarItems.map((item, index) => (
                  <button
                    className={`${(activeButton === item.name)
                      ? "bg-white text-[#1B1B1B]"
                      : "bg-[#1B1B1B] text-white"
                      } flex justify-center items-center gap-3 rounded-full w-full py-2`}
                    key={index}
                    onClick={() => setActiveButton(item.name)}
                  >
                    <span className="">
                      <img
                        src={item.icon}
                        className="w-5 h-auto"
                        alt={item.name}
                      />
                    </span>
                    <span className="font-medium tracking-wide text-lg">
                      {item.name}
                    </span>
                  </button>
                ))}
                <button
                  className={`${activeButton.includes("Settings")
                    ? "bg-white text-[#1B1B1B]"
                    : "bg-[#1B1B1B] text-white"
                    } flex justify-center items-center gap-3 rounded-full w-full py-2`}
                  onClick={() => setActiveButton("Settings")}
                >
                  <span className="">
                    <img
                      src={"/icons/settings.svg"}
                      className="w-5 h-auto"
                      alt={"Settings"}
                    />
                  </span>
                  <span className="font-medium tracking-wide text-lg">
                    {"Settings"}
                  </span>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill={
                        activeButton.includes("Settings")
                          ? "#1B1B1B"
                          : "#D2D2D2"
                      }
                    >
                      <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-5">{dispatchComponent(activeButton)}</div>
          </div>
        </div>
      </div>
    </>
  );
}
