import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  // State to handle dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Function to toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const goToProfile = () =>{
    alert("Your Profile");
  };
  const signOut = () =>{
    alert("Signed Out");
  }
  const dropdownMenu = [
    { name: "Profile", myFunction: goToProfile },
    { name: "Sign Out", myFunction: signOut },
  ];


  return (
    <nav className="fixed w-full h-24 shadow-md bg-white">
      <div className="flex justify-between items-center right-5 h-full w-full px-14 2xl:px-16">
        <Link href="/logo">
          <Image
            src="https://cdn.prod.website-files.com/65e87f68dc636e71667a539c/668264efd2ed89c50f518ce3_webflow-fullblue.svg"
            alt="Logo"
            width={195}
            height={145}
            className="cursor-pointer ml-6"
            priority
          />
        </Link>
        <div className="flex items-center">
          <button className="px-4 py-2 align-middle rounded-full mr-6 text-white bg-black">
            Log Out
          </button>
          <div className="relative ml-4">
            {/* User Image and Dropdown Trigger */}
            <div
              className="flex items-center cursor-pointer"
              onClick={toggleDropdown}
            >
              <img
                alt="user image"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                className="w-12 h-12 rounded-full object-cover object-center"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <ul
                role="menu"
                className="absolute text-black z-10 mt-2 right-0 flex min-w-[180px] flex-col gap-2 overflow-auto rounded-md border border-blue-gray-50 bg-white p-3 font-sans text-sm font-normal text-blue-gray-500 shadow-lg shadow-blue-gray-500/10 focus:outline-none"
              >
                {dropdownMenu.map((item,index)=>(
                     <li key={index}>
                     <button
                       role="menuitem"
                       onClick={item.myFunction}
                       className="flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-3 pt-[9px] pb-2 text-start leading-tight outline-none transition-all hover:bg-blue-gray-50 hover:text-blue-gray-900"
                     >
                       <svg
                         xmlns="http://www.w3.org/2000/svg"
                         className="h-5 w-5 text-gray-600"
                         fill="none"
                         viewBox="0 0 24 24"
                         stroke="currentColor"
                       >
                         <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M5.121 19.364l6.364-6.364m0 0l6.364-6.364m-6.364 6.364L5.121 5.636m6.364 6.364l6.364 6.364"
                         />
                     </svg>
                     {item.name}
                     
                     </button>
                   </li>
                ))}
               
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
