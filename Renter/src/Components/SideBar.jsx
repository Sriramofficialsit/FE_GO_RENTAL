import React, { useEffect, useState } from "react";
import logo from "../images/Nav/logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SideBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("name");
    setDisplayName(name || "User");
  }, [user]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    {
      path: "/MyProfile",
      label: "My Profile",
      icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
    },

    {
      path: "/Transcations",
      label: "Transactions",
      icon: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z",
    },
    {
      path: "/Approvals",
      label: "Approvals",
      icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z",
    },
    {
      path: "/Vehicles",
      label: "Vehicles",
      icon: "M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12",
    },
    {
      path: "/Bookings",
      label: "Bookings",
      icon: "M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75",
    },
    {
      path: "/",
      label: "Logout",
      icon: "M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75",
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <header className="fixed w-full h-24 bg-gradient-to-t from-slate-800 to-slate-900 flex items-center justify-between px-4 z-20 shadow-lg">
        <div className="flex items-center space-x-4">
          <button onClick={toggleSidebar} aria-label="Toggle Sidebar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 md:w-8 md:h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Go Rental Logo" className="w-10 h-10" />
            <h1 className="text-xl md:text-3xl font-bold text-white">
              Go Rental
            </h1>
          </div>
        </div>
        <div>
          <h2 className="text-white font-semibold text-md md:text-lg">
            Welcome, {displayName}
          </h2>
        </div>
      </header>

      <nav
        className={`fixed top-24 left-0 h-[calc(100vh-6rem)] bg-slate-800 text-white transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 z-10 shadow-xl`}
      >
        <ul className="flex flex-col h-full items-center justify-center space-y-6 py-8">
          {menuItems.map((item, index) => (
            <li
              key={index}
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault();
                  item.onClick();
                } else {
                  navigate(item.path);
                  setIsOpen(false);
                }
              }}
              className="flex items-center space-x-4 w-48 px-4 py-3 rounded-lg cursor-pointer hover:bg-slate-600 transition-all duration-200"
              role="button"
              aria-label={`Navigate to ${item.label}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={item.icon}
                />
              </svg>
              <span className="text-base font-medium">{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default SideBar;
