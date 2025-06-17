import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import s1 from "../images/analytics/car.png";
import s2 from "../images/analytics/user.png";
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
  const navigate = useNavigate();
  const [cars_count, setCars_count] = useState(0);
  const [users_count, setUsers_count] = useState(0);
  const [bookingsCount, setBookings_count] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [totalTurnover, setTotalTurnover] = useState(0);

  const email = localStorage.getItem("email");

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

  const getWeekRange = (date) => {
    const day = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - day + (day === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
  };

  const currentDate = new Date("2025-06-15T13:19:00+05:30");
  const { startOfWeek: startOfCurrentWeek, endOfWeek: endOfCurrentWeek } =
    getWeekRange(currentDate);
  const startOfPreviousWeek = new Date(startOfCurrentWeek);
  startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7);
  const endOfPreviousWeek = new Date(endOfCurrentWeek);
  endOfPreviousWeek.setDate(endOfCurrentWeek.getDate() - 7);

  const currentWeekIncome = Array(7).fill(0);
  const previousWeekIncome = Array(7).fill(0);

  let turnover = 0;
  transactions.forEach((transaction) => {
    if (transaction.status !== "captured") return;

    const transactionDate = new Date(transaction.created_at * 1000);
    const amountInRupees = transaction.amount / 100;

    turnover += amountInRupees;

    if (
      transactionDate >= startOfCurrentWeek &&
      transactionDate <= endOfCurrentWeek
    ) {
      const dayIndex =
        transactionDate.getDay() === 0 ? 6 : transactionDate.getDay() - 1;
      currentWeekIncome[dayIndex] += amountInRupees;
    }

    if (
      transactionDate >= startOfPreviousWeek &&
      transactionDate <= endOfPreviousWeek
    ) {
      const dayIndex =
        transactionDate.getDay() === 0 ? 6 : transactionDate.getDay() - 1;
      previousWeekIncome[dayIndex] += amountInRupees;
    }
  });

  const formattedTurnover = `₹${Math.round(turnover).toLocaleString("en-IN")}`;

  useEffect(() => {
    setTotalTurnover(formattedTurnover);
  }, [transactions]);

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
        data: previousWeekIncome,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Current Week Income",
        data: currentWeekIncome,
        borderColor: "rgba(79, 70, 229, 1)",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        tension: 0.4,
        fill: false,
      },
    ],
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
        data: currentWeekIncome,
        backgroundColor: "rgba(79, 70, 229, 0.6)",
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 1,
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
    const token = localStorage.getItem("token");
    if (!token || !email) {
      setError("Please log in to access the dashboard.");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const carsResponse = await axios.get(
        "https://be-go-rental-hbsq.onrender.com/dashboard/car-count",
        config
      );
      setCars_count(carsResponse.data.count || 0);

      const usersResponse = await axios.get(
        "https://be-go-rental-hbsq.onrender.com/auth/user-count",
        config
      );
      setUsers_count(usersResponse.data.count || 0);

      const bookingsResponse = await axios.get(
        "https://be-go-rental-hbsq.onrender.com/api/ticket/booking-count",
        config
      );
      setBookings_count(bookingsResponse.data.count || 0);

      const transactionsResponse = await axios.get(
        "https://be-go-rental-hbsq.onrender.com/api/payments?count=100",
        config
      );
      setTransactions(transactionsResponse.data.items || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response && [401, 403].includes(error.response.status)) {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        setError("Session expired. Please log in again.");
        navigate("/login");
      } else {
        setError(
          error.response?.data?.message || "Failed to fetch dashboard data."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

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
          Admin Dashboard
        </motion.h1>

        {error && <p className="text-center text-red-600 mb-6">{error}</p>}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full lg:w-1/3">
            {[
              {
                title: "Total Cars",
                value: loading ? (
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    Loading...
                  </span>
                ) : (
                  <CountUp
                    start={0}
                    end={cars_count}
                    duration={2.5}
                    separator=","
                    className="text-xl sm:text-2xl font-bold text-gray-900"
                  />
                ),
                icon: s1,
                bg: "bg-indigo-100",
                hover: "hover:bg-indigo-200",
              },
              {
                title: "Total Customers",
                value: loading ? (
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    Loading...
                  </span>
                ) : (
                  <CountUp
                    start={0}
                    end={users_count}
                    duration={2.5}
                    separator=","
                    className="text-xl sm:text-2xl font-bold text-gray-900"
                  />
                ),
                icon: s2,
                bg: "bg-green-100",
                hover: "hover:bg-green-200",
              },
              {
                title: "Total Turnover",
                value: loading ? (
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    Loading...
                  </span>
                ) : (
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    {totalTurnover}
                  </span>
                ),
                icon: s3,
                bg: "bg-blue-100",
                hover: "hover:bg-blue-200",
              },
              {
                title: "Daily Trips",
                value: loading ? (
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    Loading...
                  </span>
                ) : (
                  <CountUp
                    start={0}
                    end={bookingsCount}
                    duration={2.5}
                    separator=","
                    className="text-xl sm:text-2xl font-bold text-gray-900"
                  />
                ),
                icon: s4,
                bg: "bg-yellow-100",
                hover: "hover:bg-yellow-200",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                className={`rounded-xl shadow-md p-6 flex flex-col items-center justify-center gap-3 ${card.bg} ${card.hover} border border-gray-100 transition-colors duration-300`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                whileHover={{ scale: 1.05 }}
              >
                <h1 className="font-semibold text-lg sm:text-xl text-gray-800">
                  {card.title}
                </h1>
                {card.value}
                <img
                  src={card.icon}
                  alt={`${card.title} Icon`}
                  className="w-8 h-10 object-contain"
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
