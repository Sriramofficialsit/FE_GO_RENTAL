import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SideBar from "../Components/SideBar";
import axios from "axios";

const MyProfile = () => {
  const mail = localStorage.getItem("email");
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    gender: "",
    email: mail || "",
    phone: "",
    address: "",
    aadhaarNo: "",
    aadhaar: null,
  });
  const [error, setError] = useState("");
  const [existingAadhaarFile, setExistingAadhaarFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  const fetchData = async () => {
    if (!mail) {
      setError("No email found in local storage.");
      console.error("No email in localStorage");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://be-go-rental-hbsq.onrender.com/auth/user-info-admin?email=${mail}`,
        {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { success, data, message } = response.data;

      if (!success) {
        if (message === "User Not Found") {
          console.log("User not found, treating as new user.");
          return;
        }
        setError(message || "Failed to fetch profile data.");
        return;
      }

      setFormData({
        name: data.name || "",
        lastname: data.lastname || "",
        gender: data.gender || "",
        email: data.email || mail,
        phone: data.phone || "",
        address: data.address || "",
        aadhaarNo: data.aadhaarNo || "",
        aadhaar: null,
      });
      setExistingAadhaarFile(data.aadhaarFile || "");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      if (error.response?.status === 404 && errorMessage === "User Not Found") {
        console.log("User not found, treating as new user.");
      } else {
        setError(`Failed to fetch profile data: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (files[0].size > 10 * 1024 * 1024) {
        setError("File size should not exceed 10MB");
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedData = {
      name: formData.name.trim(),
      lastname: formData.lastname.trim(),
      gender: formData.gender.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      aadhaarNo: formData.aadhaarNo.trim(),
      aadhaar: formData.aadhaar,
    };

    if (
      !trimmedData.name ||
      !trimmedData.lastname ||
      !trimmedData.gender ||
      !trimmedData.email ||
      !trimmedData.phone ||
      !trimmedData.address ||
      !trimmedData.aadhaarNo
    ) {
      setError("All fields are required.");
      return;
    }

    const validGenders = ["male", "female"];
    if (!validGenders.includes(trimmedData.gender.toLowerCase())) {
      setError("Gender must be either 'male' or 'female'.");
      return;
    }

    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(trimmedData.aadhaarNo)) {
      setError("Aadhaar number must be a 12-digit number.");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(trimmedData.phone)) {
      setError("Phone number must be a 10-digit number.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(trimmedData.email)) {
      setError("Email is invalid.");
      return;
    }

    if (!trimmedData.aadhaar && !existingAadhaarFile) {
      setError("Aadhaar document is required.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("name", trimmedData.name);
    submissionData.append("lastname", trimmedData.lastname);
    submissionData.append("gender", trimmedData.gender.toLowerCase());
    submissionData.append("email", trimmedData.email);
    submissionData.append("phone", trimmedData.phone);
    submissionData.append("address", trimmedData.address);
    submissionData.append("aadhaarNo", trimmedData.aadhaarNo);
    if (trimmedData.aadhaar) {
      submissionData.append("aadhaar", trimmedData.aadhaar);
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `https://be-go-rental-hbsq.onrender.com/auth/update-user-info?email=${mail}`,
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          timeout: 10000,
        }
      );
      const { success, message, data } = response.data;

      if (!success) {
        setError(message || "Failed to update profile.");
        return;
      }

      alert("Profile updated successfully!");
      setExistingAadhaarFile(data.aadhaarFile || "");
      await fetchData();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      setError(`Failed to update profile: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    if (existingAadhaarFile) {
      const fileUrl = `https://be-go-rental-hbsq.onrender.com/${existingAadhaarFile}`;
      window.open(fileUrl, "_blank");
    } else {
      setError("No Aadhaar file available to preview.");
    }
  };

  return (
    <>
      <SideBar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-[18vh]">
        <motion.div
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-10 border border-gray-100"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center animate-fade-in">
            My Profile
          </h1>
          {error && (
            <motion.p
              className="text-red-500 text-sm mb-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
          {isLoading && (
            <motion.p
              className="text-gray-600 text-sm mb-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Loading...
            </motion.p>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                custom={0}
              >
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                  disabled={isLoading}
                />
              </motion.div>
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                custom={1}
              >
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                  disabled={isLoading}
                />
              </motion.div>
            </div>

            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <div className="mt-3 flex space-x-8">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    disabled={isLoading}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Male
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    disabled={isLoading}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Female
                  </span>
                </label>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                custom={3}
              >
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                  disabled
                />
              </motion.div>
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                custom={4}
              >
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone number"
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                  disabled={isLoading}
                />
              </motion.div>
            </div>

            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              custom={5}
            >
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                rows="4"
                className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                disabled={isLoading}
              ></textarea>
            </motion.div>

            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              custom={6}
            >
              <label
                htmlFor="aadhaarNo"
                className="block text-sm font-medium text-gray-700"
              >
                Aadhaar Number
              </label>
              <input
                type="text"
                name="aadhaarNo"
                value={formData.aadhaarNo}
                onChange={handleChange}
                placeholder="Enter 12-digit Aadhaar number"
                className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                disabled={isLoading}
              />
            </motion.div>

            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              custom={7}
            >
              <label
                htmlFor="aadhaar"
                className="block text-sm font-medium text-gray-700"
              >
                Aadhaar Document (PDF, PNG, JPG, JPEG)
              </label>
              <input
                type="file"
                name="aadhaar"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                disabled={isLoading}
              />
              {formData.aadhaar ? (
                <motion.p
                  className="mt-3 text-sm text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Selected file: {formData.aadhaar.name}
                </motion.p>
              ) : existingAadhaarFile ? (
                <div className="mt-3 flex items-center space-x-3">
                  <motion.p
                    className="text-sm text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Existing file: {existingAadhaarFile.split("/").pop()}
                  </motion.p>
                  <motion.button
                    type="button"
                    onClick={handlePreview}
                    className="px-4 py-1 bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                  >
                    Preview
                  </motion.button>
                </div>
              ) : (
                <motion.p
                  className="mt-3 text-sm text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  No Aadhaar file uploaded.
                </motion.p>
              )}
            </motion.div>

            <motion.div
              className="flex justify-center"
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              custom={8}
            >
              <motion.button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        <style jsx>{`
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default MyProfile;
