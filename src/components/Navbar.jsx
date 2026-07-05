import React from 'react'
import { FaUser } from 'react-icons/fa'
import { HiSun } from 'react-icons/hi'
import { RiSettings3Fill } from 'react-icons/ri'
import { IoMoon } from "react-icons/io5";

const Navbar = ({ theme, toggleTheme }) => {
  return (
    <>
      <div
        className={`nav flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-[100px] h-[80px] md:h-[90px] border-b-[1px]
        ${theme === "dark"
            ? "bg-black border-gray-800 text-white"
            : "bg-white border-gray-300 text-black"
          }`}
      >
        <div className="logo">
          <h3 className={`text-[25px] font-bold bg-gradient-to-r bg-clip-text text-transparent ${theme === "dark"
              ? "from-teal-400 to-teal-600"
              : "from-indigo-500 to-purple-600"
            }`}>
            GenUI
          </h3>
        </div>

        <div className="icons flex items-center gap-[10px] md:gap-[15px]">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-[40px] h-[40px] md:w-[45px] md:h-[45px] rounded-xl flex items-center justify-center text-[18px] md:text-[20px] transition-all duration-300
            ${theme === "dark"
                ? "bg-[#141319] hover:bg-[#222] border border-gray-700"
                : "bg-gray-100 hover:bg-gray-200 border border-gray-300"
              }`}
          >
            {theme === "dark" ? <HiSun /> : <IoMoon />}
          </button>

          <div
            className={`w-[40px] h-[40px] md:w-[45px] md:h-[45px] rounded-xl flex items-center justify-center text-[16px] md:text-[18px]
            ${theme === "dark"
                ? "bg-[#141319] border border-gray-700"
                : "bg-gray-100 border border-gray-300"
              }`}
          >
            <FaUser />
          </div>

          <div
            className={`w-[40px] h-[40px] md:w-[45px] md:h-[45px] rounded-xl flex items-center justify-center text-[16px] md:text-[18px]
            ${theme === "dark"
                ? "bg-[#141319] border border-gray-700"
                : "bg-gray-100 border border-gray-300"
              }`}
          >
            <RiSettings3Fill />
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar