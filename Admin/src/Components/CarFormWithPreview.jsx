import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import s1 from "../images/Actual_card/company.png";
import s2 from "../images/Actual_card/ac.png";
import s3 from "../images/Actual_card/user.png";
import s4 from "../images/Actual_card/transmission.png";
import s5 from "../images/Actual_card/Seat.png";
import s7 from "../images/Actual_card/doors.png";
import s8 from "../images/Actual_card/calendar.png";

const CarFormWithPreview = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    priceperday: "",
    ac: false,
    passengers: "",
    transmission: "",
    seats: "",
    doors: "",
    modelYear: "",
    ratings: "",
    reviews: "",
    fuelType: "Petrol",
    carNumber: "",
    from: "",
    to: "",
    permited_city: "",
    email: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false); // New: Loading state for image
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  // Dynamically set minimum date for datetime-local inputs (current date and time)
  const getCurrentDateTime = () => {
    const now = new Date("2025-06-16T23:03:00+05:30"); // Current date and time: June 16, 2025, 11:03 PM IST
    return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
  };

  const minDateTime = getCurrentDateTime();

  useEffect(() => {
    const emailFromStorage = localStorage.getItem("email");
    if (emailFromStorage) {
      setFormData((prev) => ({ ...prev, email: emailFromStorage }));
    } else {
      setError("No email found in localStorage. Please log in.");
    }
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;
    // Convert carNumber to uppercase
    if (name === "carNumber") {
      newValue = value.toUpperCase();
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "radio" ? value : newValue,
    }));
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file (e.g., PNG, JPG).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.");
        return;
      }
      setImageFile(file);
      setImageLoading(true); // Set loading state
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageLoading(false); // Clear loading state
      };
      reader.onerror = () => {
        setError("Failed to read the image file.");
        setImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.priceperday ||
      !formData.passengers ||
      !formData.transmission ||
      !formData.seats ||
      !formData.doors ||
      !formData.modelYear ||
      !formData.ratings ||
      !formData.reviews ||
      !formData.fuelType ||
      !formData.carNumber ||
      !formData.from ||
      !formData.to ||
      !formData.permited_city ||
      !formData.email ||
      !imageFile
    ) {
      setError(
        "All fields are required, including an image, availability dates, permitted city, and email."
      );
      return;
    }

    if (isNaN(formData.priceperday) || formData.priceperday <= 0) {
      setError("Price per day must be a positive number.");
      return;
    }

    if (
      isNaN(formData.passengers) ||
      formData.passengers <= 0 ||
      formData.passengers > 8
    ) {
      setError("Passengers must be a number between 1 and 8.");
      return;
    }

    if (isNaN(formData.seats) || formData.seats <= 0 || formData.seats > 8) {
      setError("Seats must be a number between 1 and 8.");
      return;
    }

    if (isNaN(formData.doors) || formData.doors <= 0 || formData.doors > 6) {
      setError("Doors must be a number between 1 and 6.");
      return;
    }

    if (
      isNaN(formData.modelYear) ||
      formData.modelYear < 1900 ||
      formData.modelYear > new Date().getFullYear() + 1
    ) {
      setError(
        `Model year must be between 1900 and ${new Date().getFullYear() + 1}.`
      );
      return;
    }

    if (
      isNaN(formData.ratings) ||
      formData.ratings < 0 ||
      formData.ratings > 5
    ) {
      setError("Ratings must be a number between 0 and 5.");
      return;
    }

    if (isNaN(formData.reviews) || formData.reviews < 0) {
      setError("Reviews must be a non-negative number.");
      return;
    }

    if (!["Auto", "Manual"].includes(formData.transmission)) {
      setError("Transmission must be either Auto or Manual.");
      return;
    }

    if (!["Petrol", "Diesel", "Electric"].includes(formData.fuelType)) {
      setError("Fuel type must be Petrol, Diesel, or Electric.");
      return;
    }

    if (!/^[A-Z]{2}-\d{4}$/.test(formData.carNumber)) {
      setError("Car number must be in the format XX-XXXX (e.g., AB-1234).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please provide a valid email address.");
      return;
    }

    const fromDate = new Date(formData.from);
    const toDate = new Date(formData.to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      setError("Please provide valid dates for availability.");
      return;
    }

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
    if (!validCities.includes(formData.permited_city)) {
      setError(`Permitted city must be one of: ${validCities.join(", ")}`);
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("priceperday", formData.priceperday);
    data.append("ac", formData.ac);
    data.append("passengers", formData.passengers);
    data.append("transmission", formData.transmission);
    data.append("seats", formData.seats);
    data.append("doors", formData.doors);
    data.append("modelYear", formData.modelYear);
    data.append("ratings", formData.ratings);
    data.append("reviews", formData.reviews);
    data.append("fuelType", formData.fuelType);
    data.append("carNumber", formData.carNumber);
    data.append("from", formData.from);
    data.append("to", formData.to);
    data.append("permited_city", formData.permited_city);
    data.append("email", formData.email);
    data.append("file", imageFile);

    console.log("Sending FormData for car-insert:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value instanceof File ? value.name : value);
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "https://be-go-rental-hbsq.onrender.com/dashboard/car-insert",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess("Car added successfully!");
        setTimeout(() => navigate("/vehicles"), 2000);
      } else {
        setError(
          "Failed to add car: " + (response.data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error adding car:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(
          error.response?.data?.message || "Failed to add car. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SideBar />
      <div className="pt-[13vh] min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100 flex justify-center items-start p-6">
        <motion.div
          className="w-full max-w-5xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-fade-in font-sans">
                Add New Car
              </h2>
              {error && (
                <p className="text-red-600 text-sm mb-4 animate-slide-in-right bg-red-50 p-3 rounded-lg">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-green-600 text-sm mb-4 animate-slide-in-right bg-green-50 p-3 rounded-lg">
                  {success}
                </p>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Car Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                    placeholder="e.g., Honda Civic"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Car Number (e.g., AB-1234)
                  </label>
                  <input
                    type="text"
                    name="carNumber"
                    value={formData.carNumber}
                    onChange={handleInputChange}
                    className="mt-1 w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                    placeholder="e.g., AB-1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price (₹/day)
                  </label>
                  <input
                    type="number"
                    name="priceperday"
                    value={formData.priceperday}
                    onChange={handleInputChange}
                    className="mt-1 w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                    placeholder="e.g., 1000"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="ac"
                    checked={formData.ac}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    AC
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Passengers
                  </label>
                  <input
                    type="number"
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleInputChange}
                    className="mt-1 w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                    placeholder="e.g., 4"
                    min="1"
                    max="8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Transmission
                  </label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="mt-1 w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  >
                    <option value="">Select Transmission</option>
                    <option value="Auto">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Seats
                  </label>
                  <input
                    type="number"
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    className="mt-1 w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                    placeholder="e.g., 4"
                    min="1"
                    max="8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Doors
                  </label>
                  <input
                    type="number"
                    name="doors"
                    value={formData.doors}
                    onChange={handleInputChange}
                    className="mt-1 w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                    placeholder="e.g., 4"
                    min="1"
                    max="6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Model Year
                  </label>
                  <input
                    type="number"
                    name="modelYear"
                    value={formData.modelYear}
                    onChange={handleInputChange}
                    className="mt-1 w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                    placeholder="e.g., 2022"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ratings (0 to 5)
                  </label>
                  <input
                    type="number"
                    name="ratings"
                    value={formData.ratings}
                    onChange={handleInputChange}
                    className="mt-1 w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                    placeholder="e.g., 4.5"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Number of Reviews
                  </label>
                  <input
                    type="number"
                    name="reviews"
                    value={formData.reviews}
                    onChange={handleInputChange}
                    className="mt-1 w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                    placeholder="e.g., 10"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fuel Type
                  </label>
                  <div className="mt-2 flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="fuelType"
                        value="Petrol"
                        checked={formData.fuelType === "Petrol"}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Petrol</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="fuelType"
                        value="Diesel"
                        checked={formData.fuelType === "Diesel"}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Diesel</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="fuelType"
                        value="Electric"
                        checked={formData.fuelType === "Electric"}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Electric
                      </span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Available From
                  </label>
                  <input
                    type="datetime-local"
                    name="from"
                    value={formData.from}
                    onChange={handleInputChange}
                    min={minDateTime}
                    className="mt-1 w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Available To
                  </label>
                  <input
                    type="datetime-local"
                    name="to"
                    value={formData.to}
                    onChange={handleInputChange}
                    min={formData.from || minDateTime}
                    className="mt-1 w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Permitted City
                  </label>
                  <select
                    name="permited_city"
                    value={formData.permited_city}
                    onChange={handleInputChange}
                    className="mt-1 w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  >
                    <option value="">Select City</option>
                    <option value="chennai">Chennai</option>
                    <option value="coimbatore">Coimbatore</option>
                    <option value="madurai">Madurai</option>
                    <option value="trichy">Trichy</option>
                    <option value="hyderbad">Hyderabad</option>
                    <option value="banglore">Bangalore</option>
                    <option value="kochi">Kochi</option>
                    <option value="goa">Goa</option>
                    <option value="cdm">CDM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                    placeholder="e.g., user@example.com"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Car Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 w-full border rounded-lg px-4 py-2 text-gray-700 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
                <div className="flex gap-4">
                  <motion.button
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-teal-500 px-6 py-3 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition disabled:bg-gray-400"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        Saving
                        <svg
                          className="animate-spin h-5 w-5 text-white"
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
                      </>
                    ) : (
                      <>
                        Save Car
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 7.293a1 1 0 011 1v7.414a1 1 0 01-1 1H3.293a1 1 0 01-1-1V8.707a1 1 0 011-1h13.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => navigate("/vehicles")}
                    className="flex items-center gap-2 bg-gray-500 px-6 py-3 text-white rounded-xl text-sm font-medium shadow-md hover:bg-gray-600 transition"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.47 5.47a.75 0 011.06 0L12 10.94l5.47-5.47a.75 0 111.06 1.06L13.06 12l5.47 5.47a.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.button>
                </div>
              </form>
            </div>
            <div className="w-full lg:w-1/2 p-8 bg-gradient-to-b from-gray-50 to-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-fade-in font-sans">
                Preview
              </h2>
              <motion.div
                className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 relative"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-teal-50 rounded-t-2xl">
                  <div className="bg-gradient-to-r from-teal-400 to-teal-500 rounded-lg px-3 py-1 text-white font-semibold text-sm shadow-sm">
                    {formData.priceperday
                      ? `₹${formData.priceperday}/day`
                      : "Price N/A"}
                  </div>
                </div>

                <div className="flex items-center justify-center p-4 bg-gray-50">
                  {imageLoading ? (
                    <div className="w-[200px] h-[150px] flex items-center justify-center">
                      <svg
                        className="animate-spin h-8 w-8 text-indigo-600"
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
                    </div>
                  ) : (
                    <motion.img
                      src={imagePreview || "https://via.placeholder.com/200x150"}
                      alt={formData.name || "Car preview"}
                      className="w-[200px] h-[150px] object-contain rounded-xl shadow-sm"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/200x150";
                      }}
                    />
                  )}
                </div>

                <div className="px-4 py-2 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <img src={s1} alt="Brand Icon" className="w-6 h-6" />
                    <p className="text-lg font-semibold text-gray-900 truncate font-sans">
                      {formData.name || "Car Name"}
                    </p>
                  </div>
                  <div className="mt-2 bg-indigo-50 px-3 py-1 rounded-lg text-sm text-indigo-800 font-medium animate-slide-in-right">
                    {formData.carNumber || "XX-00-XX-0000"}
                  </div>
                  <div className="mt-1 bg-gray-100 px-3 py-1 rounded-lg text-sm text-gray-700 font-medium">
                    {formData.modelYear || "Year N/A"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-3 text-gray-600 text-sm">
                  {[
                    { icon: s2, value: formData.ac ? "Yes" : "No", alt: "AC" },
                    {
                      icon: s3,
                      value: formData.passengers
                        ? `${formData.passengers} Passengers`
                        : "0 Passengers",
                      alt: "Passengers",
                    },
                    {
                      icon: s4,
                      value: formData.transmission || "N/A",
                      alt: "Transmission",
                    },
                    {
                      icon: s5,
                      value: formData.seats
                        ? `${formData.seats} Seats`
                        : "0 Seats",
                      alt: "Seats",
                    },
                    {
                      icon: s7,
                      value: formData.doors
                        ? `${formData.doors} Doors`
                        : "0 Doors",
                      alt: "Doors",
                    },
                    {
                      icon: s3,
                      value: formData.fuelType || "N/A",
                      alt: "Fuel Type",
                    },
                    {
                      icon: s5,
                      value: formData.ratings
                        ? `${formData.ratings} Stars`
                        : "0 Stars",
                      alt: "Ratings",
                    },
                    {
                      icon: s3,
                      value: formData.reviews
                        ? `${formData.reviews} Reviews`
                        : "0 Reviews",
                      alt: "Reviews",
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
                      <img
                        src={feature.icon}
                        alt={feature.alt}
                        className="w-5 h-5"
                      />
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
                    custom={8}
                  >
                    <img
                      src={s8}
                      alt="Availability"
                      className="w-5 h-5 flex-shrink-0"
                    />
                    <span className="flex-1 whitespace-normal break-words">
                      {formatAvailability(formData.from, formData.to)}
                    </span>
                  </motion.div>
                </div>

                <div className="flex items-center justify-center p-4">
                  <motion.button
                    className="flex items-center gap-2 bg-indigo-600 px-6 py-3 text-white rounded-xl text-sm font-medium shadow-md opacity-50 cursor-not-allowed"
                    disabled
                  >
                    Rent Now
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.72 7.72a.75 0 011.06 0l3.75 3.75a.75 0 010 1.06l-3.75 3.75a.75 0 11-1.06-1.06l2.47-2.47H3a.75 0 010-1.5h16.19l-2.47-2.47a.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <style jsx>{`
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
          .animate-slide-in-right {
            animation: slideInRight 0.5s ease-out forwards;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
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
        `}</style>
      </div>
    </>
  );
};

export default CarFormWithPreview;