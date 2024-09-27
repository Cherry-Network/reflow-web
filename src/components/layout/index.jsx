import Navbar from "@/components/navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PageLayout = ({ children, pageName, routeToDashboard }) => {
  const router = useRouter();

  const sidebarItems = [
    { name: "My Projects", icon: "/icons/add.svg", path: "/" },
    {
      name: "Provide Access",
      icon: "/icons/access.svg",
      path: "/provide-access",
    },
    { name: "Settings", icon: "/icons/settings.svg", path: "/settings" },
  ];

  const [activeButton, setActiveButton] = useState(pageName);

  return (
    <>
      <div className="flex flex-col min-h-screen overflow-auto">
        <Navbar dashboardRoute={routeToDashboard} />
        <div className="flex w-full h-full">
          <div className="min-h-screen">
            <div className="w-[300px] flex flex-col h-full bg-[#1B1B1B]">
              <div className="flex flex-col items-center justify-center flex-grow gap-2 px-5">
                <div className="bg-white p-6 mb-4 rounded-full">
                  <img
                    src="/assets/company-logo.svg"
                    alt="logo"
                    className="h-20 w-20"
                  />
                </div>
                {sidebarItems.map((item, index) => (
                  <button
                    className={`${
                      activeButton === item.name
                        ? "bg-white text-[#1B1B1B]"
                        : "bg-[#1B1B1B] text-white"
                    } flex justify-center items-center gap-3 rounded-full w-full py-2`}
                    key={index}
                    onClick={() => {
                      setActiveButton(item.name);
                      if (item.name === "Config Panel") {
                        if (
                          sessionStorage.getItem("selectedProjectID") &&
                          sessionStorage.getItem("configDeviceData")
                        ) {
                          router.push(item.path);
                        } else {
                          alert("Device Not Selected.");
                        }
                      } else {
                        router.push(item.path);
                      }
                    }}
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
                    {item.name === "Settings" && (
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill={
                            activeButton === "Settings" ? "#1B1B1B" : "#D2D2D2"
                          }
                        >
                          <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 mt-20">
            <div className="p-5">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageLayout;
