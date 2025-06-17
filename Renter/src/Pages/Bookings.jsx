import React, { useEffect, useState } from "react";
import axios from "axios";
import Ticket from "../Components/Ticket";
import SideBar from "../Components/SideBar";

const Bookings = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const owner_id = localStorage.getItem("email");

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://be-go-rental-hbsq.onrender.com/api/ticket/get-tickets-renter?owner_id=${owner_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setTickets(response.data.tickets);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="pt-[13vh] flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-gray-200">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-[13vh] flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-gray-200">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <>
      <SideBar />
      <div className="pt-[13vh] min-h-screen bg-gradient-to-br from-blue-100 to-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Your Bookings
        </h1>
        {tickets.length === 0 ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-gray-600 text-lg">No bookings found.</div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-6 p-4">
            {tickets.map((ticket) => (
              <Ticket key={ticket._id} ticketData={ticket} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Bookings;
