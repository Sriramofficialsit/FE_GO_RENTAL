import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import AdminCard1 from "../Components/AdminCard1";
import AdminCard2 from "../Components/AdminCard2";
import AdminCard3 from "../Components/AdminCard3";
import SideBar from "../Components/SideBar";

const requestReducer = (state, action) => {
  switch (action.type) {
    case "SET_REQUESTS":
      return action.payload;
    case "UPDATE_REQUEST_STATUS":
      return state.map((request) =>
        request._id === action.payload.id
          ? { ...request, status: action.payload.status }
          : request
      );
    default:
      return state;
  }
};

const Approvals = () => {
  const [requests, dispatch] = useReducer(requestReducer, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [cityFilter, setCityFilter] = useState("all");
  const email = localStorage.getItem("email");

  const validCities = [
    "chennai",
    "coimbatore",
    "madurai",
    "trichy",
    "hyderbad",
    "banglore",
    "kochi",
    "goa",
    "cdm",
  ];

  const formatDate = (dateStr) => {
    if (!dateStr || isNaN(new Date(dateStr).getTime())) return "N/A";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const email = localStorage.getItem("email");
      const token = localStorage.getItem("token");
      console.log("Email:", email);
      console.log("Token:", token);

      if (!email || !token) {
        throw new Error(
          "Email or token missing in localStorage. Please log in again."
        );
      }

      const response = await axios.get(
        "https://be-go-rental-hbsq.onrender.com/api/approvals/request-get-all",
        {
          params: { email },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );
      console.log("Raw API Response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch requests");
      }

      const allRequests = response.data.data || [];
      console.log("All Requests:", allRequests);

      if (allRequests.length === 0) {
        console.warn("No requests returned from API");
      }

      const sanitizedRequests = allRequests.map((req) => {
        const city = req.permited_city?.toLowerCase();
        if (!validCities.includes(city)) {
          console.warn(
            `Invalid permited_city: ${req.permited_city} for request ID: ${req._id}`
          );
        }
        return {
          ...req,
          permited_city: validCities.includes(city) ? city : "N/A",
          from: formatDate(req.from),
          to: formatDate(req.to),
        };
      });

      console.log("Sanitized Requests:", sanitizedRequests);
      dispatch({ type: "SET_REQUESTS", payload: sanitizedRequests });
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message || "Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [email]);

  const filteredRequests = requests
    .filter((req) => {
      if (cityFilter && cityFilter !== "all") {
        return req.permited_city === cityFilter;
      }
      return true;
    })
    .filter((req) => req.status === activeTab);

  console.log("Filtered Requests:", filteredRequests);

  const tabs = [
    {
      name: "Pending",
      status: "pending",
      requests: filteredRequests,
      CardComponent: AdminCard1,
      isPending: true,
    },
    {
      name: "Approved",
      status: "approved",
      requests: filteredRequests,
      CardComponent: AdminCard2,
      isPending: false,
    },
    {
      name: "Disapproved",
      status: "disapproved",
      requests: filteredRequests,
      CardComponent: AdminCard3,
      isPending: false,
    },
  ];

  const renderCards = () => {
    const currentTab = tabs.find((tab) => tab.status === activeTab);
    if (!currentTab) return null;

    const { requests, CardComponent, isPending } = currentTab;

    return requests.length > 0 ? (
      <div className="flex flex-col gap-6">
        {requests.map((item) =>
          isPending ? (
            <AdminCard1
              key={item._id}
              carData={item}
              dispatch={dispatch}
              onStatusChange={fetchData}
            />
          ) : (
            <CardComponent key={item._id} carData={item} />
          )
        )}
      </div>
    ) : (
      <div className="text-gray-500 text-lg text-center">
        No {currentTab.name.toLowerCase()} requests
        {cityFilter && cityFilter !== "all"
          ? ` in ${
              cityFilter === "N/A"
                ? "N/A"
                : cityFilter.charAt(0).toUpperCase() + cityFilter.slice(1)
            }.`
          : "."}
        {cityFilter !== "all" && (
          <button
            onClick={() => setCityFilter("all")}
            className="ml-2 text-blue-600 hover:underline"
          >
            View all cities
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600 text-lg text-center">
          {error}
          <button
            onClick={fetchData}
            className="ml-2 text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SideBar />
      <div className="min-h-screen pt-[12vh] bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 mt-4 animate-fade-in tracking-tight">
          Rental Requests
        </h1>

        <div className="w-full max-w-3xl mb-6">
          <div className="flex justify-center">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full max-w-xs bg-white p-2 rounded-xl shadow-md text-gray-700 text-base font-semibold focus:outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            >
              <option value="all">All Cities</option>
              <option value="N/A">N/A</option>
              {validCities.map((city) => (
                <option key={city} value={city}>
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full max-w-3xl mb-8">
          <div className="flex justify-center gap-3 bg-white p-2 rounded-xl shadow-md">
            {tabs.map((tab) => (
              <button
                key={tab.status}
                onClick={() => setActiveTab(tab.status)}
                className={`flex-1 py-3 px-6 rounded-lg text-base font-semibold transition-all duration-300 ease-in-out focus:outline-none
                  ${
                    activeTab === tab.status
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-800"
                  }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full">{renderCards()}</div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Approvals;
