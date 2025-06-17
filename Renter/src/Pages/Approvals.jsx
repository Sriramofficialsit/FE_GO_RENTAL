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
  const [cityFilter, setCityFilter] = useState("");
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

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://be-go-rental-hbsq.onrender.com/api/approvals/request-get-all-renter",
        {
          params: { email },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const allRequests = response.data.data || [];
      console.log("Fetched Requests:", allRequests);

      allRequests.forEach((req, index) => {
        console.log(
          `Request ${index + 1} - permited_city:`,
          req.permited_city,
          "Type:",
          typeof req.permited_city
        );
      });

      const sanitizedRequests = allRequests.map((req) => ({
        ...req,
        permited_city: validCities.includes(req.permited_city)
          ? req.permited_city
          : "N/A",
      }));

      dispatch({ type: "SET_REQUESTS", payload: sanitizedRequests });
    } catch (error) {
      console.error(error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRequests = requests
    .filter((req) => {
      if (cityFilter && cityFilter !== "all") {
        return req.permited_city === cityFilter;
      }
      return true;
    })
    .filter((req) => req.status === activeTab);

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
          ? ` in ${cityFilter.charAt(0).toUpperCase() + cityFilter.slice(1)}.`
          : "."}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-gray-600 text-lg text-center mt-20">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-lg text-center mt-20">{error}</div>
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
              className="w-full max-w-xs border rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            >
              <option value="all">All Cities</option>
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
