import React from "react";
import PropTypes from "prop-types";
import locationIcon from "../images/Ticket/Location.png";
import ticketIcon from "../images/Ticket/Ticket.png";
import calendarIcon from "../images/Ticket/calendar.png";

const Ticket = ({ ticketData }) => {
  const { image, location, permitted_city, car_number, from, to, status } =
    ticketData;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const statusStyles = {
    pending: "bg-green-400 text-white border-green-500",
    expired: "bg-red-500 text-white border-red-600",
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-200 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-700 ease-in-out transform hover:-translate-y-2">
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl">
          <div className="flex items-center gap-3 animate-slide-in-left">
            <img src={locationIcon} alt="Location" className="w-6 h-6" />
            <p className="text-white font-semibold text-lg capitalize">
              {location}
            </p>
          </div>
          <div className="animate-pulse">
            <img src={ticketIcon} alt="Ticket" className="w-8 h-8" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row p-6 gap-6">
          <div className="flex-shrink-0 animate-fade-in">
            <img
              src={`https://be-go-rental-hbsq.onrender.com/${image}`}
              alt="Car"
              className="w-32 h-auto rounded-lg shadow-md object-cover"
              onError={(e) => {
                e.target.src = "/path/to/fallback-image.jpg";
              }}
            />
          </div>

          <div className="flex flex-col gap-4 text-gray-800">
            <div className="flex items-center gap-2 animate-slide-in-right">
              <span className="font-medium">Location:</span>
              <span className="capitalize">{location}</span>
            </div>
            <div className="flex items-center gap-2 animate-slide-in-right animation-delay-200">
              <span className="font-medium">Permitted City:</span>
              <span className="capitalize">{permitted_city}</span>
            </div>
            <div className="flex items-center gap-2 animate-slide-in-right animation-delay-400">
              <span className="font-medium">Car Number:</span>
              <span className="bg-gray-100 px-2 py-1 rounded uppercase">
                {car_number}
              </span>
            </div>
            <div className="flex items-center gap-4 animate-slide-in-right animation-delay-600">
              <div className="flex items-center gap-1">
                <img src={calendarIcon} alt="Calendar" className="w-5 h-5" />
                <p>{formatDate(from)}</p>
              </div>
              <span>-</span>
              <div className="flex items-center gap-1">
                <img src={calendarIcon} alt="Calendar" className="w-5 h-5" />
                <p>{formatDate(to)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 rounded-b-2xl border-t">
          <div
            className={`px-4 py-2 rounded-lg font-semibold border animate-bounce-in ${
              statusStyles[status] || "bg-gray-400 text-white border-gray-500"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.7s ease-out forwards;
        }
        .animate-bounce-in {
          animation: bounceIn 0.5s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          60% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

Ticket.propTypes = {
  ticketData: PropTypes.shape({
    image: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    permitted_city: PropTypes.string.isRequired,
    car_number: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default Ticket;
