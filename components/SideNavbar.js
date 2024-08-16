import React from "react";
import Image from "next/image";  // Import Image component from Next.js
import { GiHamburgerMenu } from "react-icons/gi";
import { Disclosure } from "@headlessui/react";
import { MdOutlineAnalytics, MdOutlineSettings } from "react-icons/md";
import { FaRegComments } from "react-icons/fa";
import { BiChevronDown, BiPlusCircle } from "react-icons/bi";  
import { FiUserPlus } from "react-icons/fi";

function SideNavbar() {
  return (
    <div>
      <Disclosure as="nav">
        <Disclosure.Button className="absolute top-4 right-4 inline-flex items-center peer justify-center rounded-md p-2 text-white hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white group">
          <GiHamburgerMenu
            className="block md:hidden h-6 w-6"
            aria-hidden="true"
          />
        </Disclosure.Button>
        <div className="p-6 w-1/2 h-screen bg-black fixed top-0 -left-96 lg:left-0 lg:w-60 peer-focus:left-0 peer:transition ease-out delay-150 duration-200">
          <div className="flex flex-col justify-start items-center">
            {/* Logo */}
            <div className="mb-4">
              <Image
                src="/unnamed.png"  // Use Next.js Image component for the logo
                alt="Company Logo"
                width={60}  // specify width
                height={60} // specify height
                className="object-contain"
              />
            </div>
            <h1 className="text-base text-center cursor-pointer font-bold text-white pb-4 w-full">
              Company Name
            </h1>
            <div className="my-4 pb-4 w-full">
              <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-700 p-2 rounded-md group cursor-pointer hover:shadow-lg w-full">
                <BiPlusCircle className="text-2xl text-white" />
                <h3 className="text-base text-white font-semibold">Projects</h3>
              </div>
              <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-700 p-2 rounded-md group cursor-pointer hover:shadow-lg w-full">
                <MdOutlineAnalytics className="text-2xl text-white" />
                <h3 className="text-base text-white font-semibold">
                  AI Analytics
                </h3>
              </div>
              <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-700 p-2 rounded-md group cursor-pointer hover:shadow-lg w-full">
                <FaRegComments className="text-2xl text-white" />
                <h3 className="text-base text-white font-semibold">
                  Subscriptions
                </h3>
              </div>
              <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-700 p-2 rounded-md group cursor-pointer hover:shadow-lg w-full">
                <FiUserPlus className="text-2xl text-white" />
                <h3 className="text-base text-white font-semibold">
                  Provide Access
                </h3>
              </div>
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex justify-between items-center w-full mb-2 gap-4 pl-5 hover:bg-gray-700 p-2 rounded-md group cursor-pointer hover:shadow-lg">
                      <div className="flex items-center gap-4">
                        <MdOutlineSettings className="text-2xl text-white" />
                        <h3 className="text-base text-white font-semibold">
                          Settings
                        </h3>
                      </div>
                      <BiChevronDown
                        className={`${
                          open ? "transform rotate-180" : ""
                        } text-white transition-transform duration-200`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="flex flex-col gap-2 pl-12">
                      <div className="hover:bg-gray-700 p-2 rounded-md cursor-pointer">
                        <h4 className="text-sm text-white">Profile</h4>
                      </div>
                      <div className="hover:bg-gray-700 p-2 rounded-md cursor-pointer">
                        <h4 className="text-sm text-white">Account</h4>
                      </div>
                      <div className="hover:bg-gray-700 p-2 rounded-md cursor-pointer">
                        <h4 className="text-sm text-white">Notifications</h4>
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
        </div>
      </Disclosure>
    </div>
  );
}

export default SideNavbar;
