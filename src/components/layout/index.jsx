import Navbar from "@/components/navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PageLayout = ({ children, pageName, routeToDashboard }) => {
  const router = useRouter();

  const sidebarItems = [
    {
      name: "My Projects",
      icon: "/icons/add.svg",
      icon_dark: "/icons/add-black.svg",
      path: "/",
    },
    {
      name: "Provide Access",
      icon: "/icons/access.svg",
      icon_dark: "/icons/access-black.svg",
      path: "/provide-access",
    },
    {
      name: "Settings",
      icon: "/icons/settings.svg",
      icon_dark: "/icons/settings-black.svg",
      path: "/",
    },
  ];

  const [activeButton, setActiveButton] = useState(pageName);

  return (
    <>
      <div className="flex flex-col min-h-screen overflow-auto">
        <Navbar dashboardRoute={routeToDashboard} />
        <div className="flex w-full h-full">
          <div className="min-h-screen">
            <div className="w-[225px] flex flex-col h-full bg-[#1B1B1B]">
              <div className="flex flex-col items-center justify-center flex-grow gap-4 px-5">
                <div className="bg-white/95 p-5 mb-3 rounded-full">
                  <img
                    src="/assets/company-logo.svg"
                    alt="logo"
                    className="h-14 w-14"
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
                        src={activeButton === item.name ? item.icon_dark : item.icon}
                        className="w-4 h-auto"
                        alt={item.name}
                      />
                    </span>
                    <span className="font-medium tracking-wide text-base">
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
          <div className="flex-1 mt-16">
            <div className="p-4">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageLayout;
