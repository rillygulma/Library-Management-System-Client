import { useState, useEffect } from "react";
import Logo from "./fubk-logo.jpg";
import { Bars3BottomRightIcon, XMarkIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const links = [
    { name: 'HOME', link: "/" },
    { name: 'STAFF', link: "/login" },
    { name: 'STUDENT', link: "/login" },
    { name: 'ADMIN', link: "/login" },
  ];

  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust the breakpoint as needed
    };

    // Initial check on mount
    handleResize();

    // Event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  
  return (
    <div className={`sticky-navbar shadow-md w-full top-0 left-0 sticky bg-blue-300`}>
      <div className={`md:px-10 py-4 px-7 md:flex justify-between items-center ${isMobile ? 'flex-col' : ''}`}>
        {/* logo */}
        <a href="/login" className="flex text-2xl cursor-pointer items-center gap-3">
          <img src={Logo} alt="logo" className={`inline-block w-20 rounded ${isMobile ? 'mb-2' : 'mx-2'}`} />
          <span className="font-MyFont font-bold hover:text-white">FUBK LIBRARY MANAGEMENT SYSTEM</span>
        </a>

        {/* Menu icon */}
        <div onClick={() => setIsOpen(!isOpen)} className="w-7 h-7 absolute right-8 top-6 cursor-pointer md:hidden">
          {
            isOpen ? <XMarkIcon/> : <Bars3BottomRightIcon/>
          }
        </div>

        {/* Navbar Links */}
        {(isMobile || !isMobile) && (
          <ul className={`flex ${isMobile ? 'flex-col pl-9' : 'space-x-6'}`}>

            {/* Render links for mobile only when the menu is open */}
            {isMobile && isOpen && links.map((link, index) => (
              <li key={index} className="mb-2">
                <a href={link.link} className="block text-black hover:text-white font-semibold">
                  {link.name}
                </a>
              </li>
            ))}

            {/* Render all links for non-mobile or when the menu is closed */}
            {!isMobile && links.map((link, index) => (
              <li key={index}>
                <a href={link.link} className="text-black hover:text-white font-semibold">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;
