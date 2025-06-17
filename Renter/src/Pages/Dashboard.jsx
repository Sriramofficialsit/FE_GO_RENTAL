import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import s1 from "../images/analytics/car.png";
import s3 from "../images/analytics/dollar.png";
import s4 from "../images/analytics/daily.png";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import CountUp from "react-countup";
import SideBar from "../Components/SideBar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const email = localStorage.getItem("email");
  const owner_id = localStorage.getItem("email");
  const [cars_count, setCars_count] = useState(0);
  const [bookingsCount, setBookings_count] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5, ease: "easeOut" },
    }),
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const lineChartData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Previous Week Income",
        data: [1200, 1500, 1300, 1700, 1900, 1600, 1400],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Current Week Income",
        data: [1400, 1600, 1450, 1800, 2000, 1750, 1550],
        borderColor: "rgba(79, 70, 229, 1)",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: window.innerWidth < 640 ? 12 : 14 } },
      },
      title: {
        display: true,
        text: "Weekly Income Comparison",
        font: { size: window.innerWidth < 640 ? 16 : 20 },
        color: "#1F2937",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Income (₹)",
          font: { size: window.innerWidth < 640 ? 12 : 14 },
          color: "#1F2937",
        },
        grid: { color: "rgba(209, 213, 219, 0.3)" },
      },
      x: {
        title: {
          display: true,
          text: "Days",
          font: { size: window.innerWidth < 640 ? 12 : 14 },
          color: "#1F2937",
        },
        grid: { display: false },
      },
    },
  };

  const barChartData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Daily Income",
        data: [1400, 1600, 1450, 1800, 2000, 1750, 1550],
        backgroundColor: "rgba(79, 70, 229, 0.6)",
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: window.innerWidth < 640 ? 12 : 14 } },
      },
      title: {
        display: true,
        text: "Daily Income",
        font: { size: window.innerWidth < 640 ? 16 : 20 },
        color: "#1F2937",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Income (₹)",
          font: { size: window.innerWidth < 640 ? 12 : 14 },
          color: "#1F2937",
        },
        grid: { color: "rgba(209, 213, 219, 0.3)" },
      },
      x: {
        title: {
          display: true,
          text: "Days",
          font: { size: window.innerWidth < 640 ? 12 : 14 },
          color: "#1F2937",
        },
        grid: { display: false },
      },
    },
  };

  const fetchData = async () => {
    if (!email) {
      setError("Email not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const carsResponse = await axios.get(
        "https://be-go-rental-hbsq.onrender.com/dashboard/car-count-renter",
        {
          params: { email }, // Sends email as ?email=value
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Auth header
          },
        }
      );

      setCars_count(carsResponse.data.count || 0);

      const bookingsResponse = await axios.get(
        "https://be-go-rental-hbsq.onrender.com/api/ticket/booking-count-renter",
        {
          params: { owner_id },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setBookings_count(bookingsResponse.data.count || 0);

      console.log(email);
      console.log(carsResponse.data, bookingsResponse.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <SideBar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-200 pt-[18vh] pb-[10vh] px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-3xl font-bold text-gray-800 mb-8 text-center animate-fade-in"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Renter Dashboard
        </motion.h1>

        {error && <p className="text-center text-red-600 mb-6">{error}</p>}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full lg:w-1/3">
            {[
              {
                title: "Total Cars",
                value: loading ? (
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Loading...
                  </span>
                ) : (
                  <CountUp
                    start={0}
                    end={cars_count}
                    duration={2.5}
                    separator=","
                    className="text-2xl sm:text-3xl font-bold text-gray-900"
                  />
                ),
                icon: s1,
                bg: "bg-gradient-to-r from-indigo-100 to-indigo-200",
                hover:
                  "hover:bg-gradient-to-r hover:from-indigo-200 hover:to-indigo-300",
                className: "sm:col-span-2 lg:col-span-2",
              },
              {
                title: "Total Turnover",
                value: "₹300K",
                icon: s3,
                bg: "bg-gradient-to-r from-blue-100 to-blue-200",
                hover:
                  "hover:bg-gradient-to-r hover:from-blue-200 hover:to-blue-300",
                className: "sm:col-span-1",
                iconClass: "w-12 h-12",
                titleClass: "text-xl sm:text-2xl",
                valueClass: "text-2xl sm:text-3xl font-bold text-gray-900",
              },
              {
                title: "Daily Trips",
                value: loading ? (
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Loading...
                  </span>
                ) : (
                  <CountUp
                    start={0}
                    end={bookingsCount}
                    duration={2.5}
                    separator=","
                    className="text-2xl sm:text-3xl font-bold text-gray-900"
                  />
                ),
                icon: s4,
                bg: "bg-gradient-to-r from-yellow-100 to-yellow-200",
                hover:
                  "hover:bg-gradient-to-r hover:from-yellow-200 hover:to-yellow-300",
                className: "sm:col-span-1",
                iconClass: "w-12 h-12",
                titleClass: "text-xl sm:text-2xl",
                valueClass: "text-2xl sm:text-3xl font-bold text-gray-900",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                className={`rounded-xl shadow-lg p-8 flex flex-col items-center justify-center gap-4 ${
                  card.bg
                } ${
                  card.hover
                } border border-gray-100 transition-colors duration-300 ${
                  card.className || ""
                }`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h1
                  className={`font-semibold text-gray-800 ${
                    card.titleClass || "text-lg sm:text-xl"
                  }`}
                >
                  {card.title}
                </h1>
                <div
                  className={
                    card.valueClass ||
                    "text-xl sm:text-2xl font-bold text-gray-900"
                  }
                >
                  {card.value}
                </div>
                <img
                  src={card.icon}
                  alt={`${card.title} Icon`}
                  className={card.iconClass || "w-8 h-10 object-contain"}
                />
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-6 w-full lg:w-2/3">
            <motion.div
              className="h-80 sm:h-96 lg:h-[50vh] w-full bg-white rounded-xl shadow-2xl border border-gray-100 p-6"
              variants={chartVariants}
              initial="hidden"
              animate="visible"
            >
              <Line data={lineChartData} options={lineChartOptions} />
            </motion.div>
            <motion.div
              className="h-80 sm:h-96 lg:h-[50vh] w-full bg-white rounded-xl shadow-2xl border border-gray-100 p-6"
              variants={chartVariants}
              initial="hidden"
              animate="visible"
            >
              <Bar data={barChartData} options={barChartOptions} />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
