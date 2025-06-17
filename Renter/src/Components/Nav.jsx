import React from "react";
import logo from "../images/Nav/logo.png";

const Nav = (props) => {
  return (
    <>
      <div className="w-full flex gap-2 md:gap-8 bg-blue-500 py-6 px-3 md:px-8  items-center justify-between shadow-2xl shadow-black/50 fixed top-0">
        <div className="flex gap-8 ">
          <div className="flex items-center justify-center gap-1.5">
            <div>
              <img src={logo} alt="logo" />
            </div>
            <div className="font-bold text-xl sm:text-xl md:text-3xl">
              Go Rental
            </div>
          </div>
          <div className="bg-purple-300 py-2 rounded-2xl px-8 cursor-pointer hidden mg-block">
            <h1 className="text-lg md:text-xl">Become a renter</h1>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="flex items-center justify-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6 cursor-pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
              />
            </svg>
          </div>

          <>
            <div className="bg-blue-300 hover:shadow-sm shadow-black border-white rounded-tr-2xl rounded-bl-2xl px-3 sm:px-4 md:px-6 sm:py-1 md:py-2 cursor-pointer transition duration-300">
              <button className="cursor-pointer text-lg ">Login</button>
            </div>
            <div className=" border-white rounded-tr-2xl rounded-bl-2xl px-3 sm:px-4 md:px-6 sm:py-1 md:py-2 cursor-pointer transition duration-300 bg-blue-300 hover:shadow-sm shadow-black">
              <button className="cursor-pointer text-lg ">Signup</button>
            </div>
          </>
        </div>
      </div>
    </>
  );
};

Nav.propTypes = {};

export default Nav;
