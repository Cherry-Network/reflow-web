import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="bg-white border-b border-stone-300 py-5 px-10 flex justify-between items-center">
        <div className="">
          <img src="/assets/nav-logo.svg" alt="logo" className="h-16 w-auto" />
        </div>
        <div className="flex gap-10 justify-center items-center">
          <buttton className="bg-[#1B1B1B] text-white text-lg tracking-wide rounded-full px-5 py-3">
            Log Out
          </buttton>
          <div>
            <button className="flex items-center gap-3 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
              <div className="rounded-full p-3 bg-[#D2D2D2]">
                <img
                  alt="user image"
                  src="/icons/user.svg"
                  className="h-5 w-auto"
                />
              </div>
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#1B1B1B"
                >
                  <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#1B1B1B"
                >
                  <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
