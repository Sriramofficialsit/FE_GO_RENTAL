import React from "react";
import { motion } from "framer-motion";
import s1 from "../images/Actual_card/company.png";
import s2 from "../images/Actual_card/ac.png";
import s3 from "../images/Actual_card/user.png";
import s4 from "../images/Actual_card/transmission.png";
import s5 from "../images/Actual_card/Seat.png";
import s6 from "../images/Actual_card/Varient.png";
import s7 from "../images/Actual_card/doors.png";
import s8 from "../images/Actual_card/calendar.png";
import s9 from "../images/Actual_card/star.png";
import s10 from "../images/Actual_card/location.png"; 

const CollectionCarCard = ({
  price,
  car_name,
  carNumber,
  ac,
  passengers,
  transmission,
  seats,
  fuelType,
  car_png,
  doors,
  from,
  to,
  ratings,
  reviews,
  permited_city, 
  onUpdate,
  onDelete,
  onRent,
}) => {
  const imageURL = car_png
    ? car_png.replace(/\\/g, "/")
    : "https://via.placeholder.com/200x150";

  const formatDate = (date) => {
    if (!date || isNaN(new Date(date).getTime())) return "N/A";
    const d = new Date(date);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatAvailability = (from, to) => {
    const fromFormatted = formatDate(from);
    const toFormatted = formatDate(to);

    if (fromFormatted === "N/A" || toFormatted === "N/A") {
      return "N/A";
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);
    let durationText = "";
    if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
      const timeDiff = toDate - fromDate;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      durationText = ` (for ${daysDiff} days)`;
    }

    return `${fromFormatted} to ${toFormatted}${durationText}`;
  };

  const safeNumber = (value, fallback = "N/A") => {
    const num = Number(value);
    return isNaN(num) || value == null ? fallback : num;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      scale: 1.03,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <motion.div
      className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 relative"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-teal-50 rounded-t-2xl">
        <div className="bg-gradient-to-r from-teal-400 to-teal-500 rounded-lg px-3 py-1 text-white font-semibold text-sm shadow-sm">
          {price ? `₹${price}/day` : "Price N/A"}
        </div>
      </div>

      <div className="flex items-center justify-center p-4 bg-gray-50">
        <motion.img
          src={imageURL}
          alt={car_name || "Car"}
          className="w-[200px] h-[150px] object-cover rounded-xl shadow-sm"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <img src={s1} alt="Brand Icon" className="w-6 h-6" />
          <p className="text-lg font-semibold text-gray-900 truncate font-sans">
            {car_name || "Car Name"}
          </p>
        </div>
        <div className="mt-2 bg-indigo-50 px-3 py-1 rounded-lg text-sm text-indigo-800 font-medium animate-slide-in-right">
          {carNumber || "XX-00-XX-0000"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-3 text-gray-600 text-sm">
        {[
          { icon: s2, value: ac ? "Yes" : "No", alt: "AC" },
          {
            icon: s3,
            value: passengers ? `${passengers} Passengers` : "0 Passengers",
            alt: "Passengers",
          },
          { icon: s4, value: transmission || "N/A", alt: "Transmission" },
          {
            icon: s5,
            value: seats ? `${seats} Seats` : "0 Seats",
            alt: "Seats",
          },
          {
            icon: s7,
            value: doors ? `${doors} Doors` : "0 Doors",
            alt: "Doors",
          },
          { icon: s6, value: fuelType || "N/A", alt: "Fuel Type" },
          {
            icon: s9,
            value: ratings ? `${safeNumber(ratings)} Stars` : "0 Stars",
            alt: "Ratings",
          },
          {
            icon: s3,
            value: reviews ? `${safeNumber(reviews)} Reviews` : "0 Reviews",
            alt: "Reviews",
          },
          {
            icon: s10,
            value: permited_city
              ? permited_city.charAt(0).toUpperCase() + permited_city.slice(1)
              : "N/A",
            alt: "Permitted City",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-2"
            variants={featureVariants}
            initial="hidden"
            animate="visible"
            custom={index}
          >
            <img src={feature.icon} alt={feature.alt} className="w-5 h-5" />
            <span>{feature.value}</span>
          </motion.div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <motion.div
          className="flex items-center gap-2 text-gray-600 text-sm"
          variants={featureVariants}
          initial="hidden"
          animate="visible"
          custom={9}
        >
          <img src={s8} alt="Availability" className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1 whitespace-normal break-words">
            {formatAvailability(from, to)}
          </span>
        </motion.div>
      </div>

      <div className="flex items-center justify-between p-4 border-t border-gray-100">
        <motion.button
          onClick={onUpdate}
          className="flex items-center gap-2 bg-indigo-600 px-4 py-2 text-white rounded-xl text-sm font-medium shadow-md hover:bg-indigo-700 transition"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Update
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.199Z" />
          </svg>
        </motion.button>
        <motion.button
          onClick={onDelete}
          className="flex items-center gap-2 bg-red-600 px-4 py-2 text-white rounded-xl text-sm font-medium shadow-md hover:bg-red-700 transition"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Delete
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>
        <motion.button
          onClick={onRent}
          className="flex items-center gap-2 bg-green-600 px-4 py-2 text-white rounded-xl text-sm font-medium shadow-md hover:bg-green-700 transition"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Rent
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>
      </div>

      <style jsx>{`
        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-out forwards;
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
      `}</style>
    </motion.div>
  );
};

export default CollectionCarCard;
