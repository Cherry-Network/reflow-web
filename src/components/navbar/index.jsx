import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = ({ dashboardRoute }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    setCurrentUser(sessionStorage.getItem("username"));
  }, []);
  return (
    <>
      <div className="bg-white fixed w-full border-b border-stone-300 py-4 px-10 flex justify-between items-center z-10">
        <div className="">
          <img src="/assets/nav-logo.svg" alt="logo" className="h-12 w-auto" />
        </div>
        <div className="flex gap-10 justify-center items-center">
          <button
            className="bg-[#1B1B1B] text-white text-sm font-medium tracking-wide rounded-full px-5 py-3"
            onClick={() => {
              if (dashboardRoute) {
                router.push('/');
              } else {
                sessionStorage.removeItem("username");
                router.push("https://reflowtech.in/loginned");
              }
            }}
          >
            {dashboardRoute ? "Back to Dashboard" : "Back to Home"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
