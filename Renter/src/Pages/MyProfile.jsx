import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SideBar from "../Components/SideBar";
import axios from "axios";

const MyProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    gender: "",
    email: localStorage.getItem("email") || "",
    phone: "",
    address: "",
    aadhaarNo: "",
    drivingLicenceNo: "",
    aadhaar: null,
    drivinglicence: null,
    existingAadhaar: null,
    existingDrivingLicence: null,
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "First name is required";
    if (!formData.lastname) newErrors.lastname = "Last name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.aadhaarNo) newErrors.aadhaarNo = "Aadhaar number is required";
    else if (!/^\d{12}$/.test(formData.aadhaarNo))
      newErrors.aadhaarNo = "Aadhaar number must be 12 digits";
    if (!formData.drivingLicenceNo)
      newErrors.drivingLicenceNo = "Driving licence number is required";
    if (!formData.aadhaar && !formData.existingAadhaar)
      newErrors.aadhaar = "Aadhaar document is required";
    if (!formData.drivinglicence && !formData.existingDrivingLicence)
      newErrors.drivinglicence = "Driving licence document is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (files[0].size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [name]: "File size should not exceed 10MB",
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      if (!token || !email) {
        setMessage("User not authenticated. Please log in.");
        return;
      }

      setLoading(true);
      const response = await axios.get(
        "https://be-go-rental-hbsq.onrender.com/api/profile/get",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { email },
        }
      );
      const profile = response.data.profile;
      setFormData({
        name: profile.name || "",
        lastname: profile.lastname || "",
        gender: profile.gender || "",
        email: profile.email || email,
        phone: profile.phone || "",
        address: profile.address || "",
        aadhaarNo: profile.aadhaarNo || "",
        drivingLicenceNo: profile.drivingLicenceNo || "",
        aadhaar: null,
        drivinglicence: null,
        existingAadhaar: profile.aadhaarFile || null,
        existingDrivingLicence: profile.drivingLicenceFile || null,
      });
    } catch (error) {
      console.error("Error fetching profile:", error.message);
      setMessage(error.response?.data?.error || "Failed to fetch profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (
        key !== "existingAadhaar" &&
        key !== "existingDrivingLicence" &&
        formData[key]
      ) {
        formDataToSend.append(
          key,
          key === "gender" ? formData[key].toLowerCase() : formData[key]
        );
      }
    });

    console.log("Submitting FormData:", [...formDataToSend.entries()]);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("User not authenticated. Please log in.");
        return;
      }

      const response = await axios.put(
        "https://be-go-rental-hbsq.onrender.com/api/profile/save",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setFormData((prev) => ({
        ...prev,
        aadhaar: null,
        drivinglicence: null,
        existingAadhaar:
          response.data.profile.aadhaarFile || prev.existingAadhaar,
        existingDrivingLicence:
          response.data.profile.drivingLicenceFile ||
          prev.existingDrivingLicence,
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage(error.response?.data?.error || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <SideBar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-[18vh]">
        <motion.div
          className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/30"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="w-full flex items-center justify-center">
            <motion.h1
              className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              My Profile
            </motion.h1>
          </div>
          {loading && (
            <motion.p
              className="text-gray-600 text-sm text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Loading...
            </motion.p>
          )}
          {message && (
            <motion.div
              className={`text-center text-sm font-semibold mt-4 ${
                message.includes("Failed") ? "text-red-600" : "text-green-600"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message}
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-700">
              Personal Information
            </h2>
            <div className="flex gap-4">
              <motion.div
                className="flex-1"
                variants={fieldVariants}
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
                  placeholder="First Name"
                  className={`mt-1 w-full border rounded-lg py-2 px-3 text-sm ${
                    errors.name ? "border-red-500" : "border-gray-200"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 transition-all duration-200`}
                  disabled={loading}
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-red-500 text-xs mt-1">
                    {errors.name}
                  </p>
                )}
              </motion.div>
              <motion.div
                className="flex-1"
                variants={fieldVariants}
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
                  placeholder="Last Name"
                  className={`mt-1 w-full border rounded-lg py-2 px-3 text-sm ${
                    errors.lastname ? "border-red-500" : "border-gray-200"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 transition-all duration-200`}
                  disabled={loading}
                  aria-invalid={errors.lastname ? "true" : "false"}
                  aria-describedby={
                    errors.lastname ? "lastname-error" : undefined
                  }
                />
                {errors.lastname && (
                  <p id="lastname-error" className="text-red-500 text-xs mt-1">
                    {errors.lastname}
                  </p>
                )}
              </motion.div>
            </div>
            <motion.div variants={fieldVariants} custom={2}>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <div className="mt-2 flex gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    disabled={loading}
                    aria-describedby={
                      errors.gender ? "gender-error" : undefined
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">Male</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    disabled={loading}
                    aria-describedby={
                      errors.gender ? "gender-error" : undefined
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">Female</span>
                </label>
              </div>
              {errors.gender && (
                <p id="gender-error" className="text-red-500 text-xs mt-1">
                  {errors.gender}
                </p>
              )}
            </motion.div>
            <div className="flex gap-4">
              <motion.div
                className="flex-1"
                variants={fieldVariants}
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
                  placeholder="Email"
                  className={`mt-1 w-full border rounded-lg py-2 px-3 text-sm ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  } bg-gray-100 cursor-not-allowed`}
                  disabled
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-red-500 text-xs mt-1">
                    {errors.email}
                  </p>
                )}
              </motion.div>
              <motion.div
                className="flex-1"
                variants={fieldVariants}
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
                  placeholder="Phone (10 digits)"
                  className={`mt-1 w-full border rounded-lg py-2 px-3 text-sm ${
                    errors.phone ? "border-red-500" : "border-gray-200"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 transition-all duration-200`}
                  disabled={loading}
                  aria-invalid={errors.phone ? "true" : "false"}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-red-500 text-xs mt-1">
                    {errors.phone}
                  </p>
                )}
              </motion.div>
            </div>
            <motion.div variants={fieldVariants} custom={5}>
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
                placeholder="Address"
                rows="4"
                className={`mt-1 w-full border rounded-lg py-2 px-3 text-sm ${
                  errors.address ? "border-red-500" : "border-gray-200"
                } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 transition-all duration-200`}
                disabled={loading}
                aria-invalid={errors.address ? "true" : "false"}
                aria-describedby={errors.address ? "address-error" : undefined}
              ></textarea>
              {errors.address && (
                <p id="address-error" className="text-red-500 text-xs mt-1">
                  {errors.address}
                </p>
              )}
            </motion.div>
            <div className="flex gap-4">
              <motion.div
                className="flex-1"
                variants={fieldVariants}
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
                  placeholder="Aadhaar Number (12 digits)"
                  className={`mt-1 w-full border rounded-lg py-2 px-3 text-sm ${
                    errors.aadhaarNo ? "border-red-500" : "border-gray-200"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 transition-all duration-200`}
                  disabled={loading}
                  aria-invalid={errors.aadhaarNo ? "true" : "false"}
                  aria-describedby={
                    errors.aadhaarNo ? "aadhaarNo-error" : undefined
                  }
                />
                {errors.aadhaarNo && (
                  <p id="aadhaarNo-error" className="text-red-500 text-xs mt-1">
                    {errors.aadhaarNo}
                  </p>
                )}
              </motion.div>
              <motion.div
                className="flex-1"
                variants={fieldVariants}
                custom={7}
              >
                <label
                  htmlFor="drivingLicenceNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Driving Licence Number
                </label>
                <input
                  type="text"
                  name="drivingLicenceNo"
                  value={formData.drivingLicenceNo}
                  onChange={handleChange}
                  placeholder="Driving Licence Number"
                  className={`mt-1 w-full border rounded-lg py-2 px-3 text-sm ${
                    errors.drivingLicenceNo
                      ? "border-red-500"
                      : "border-gray-200"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 transition-all duration-200`}
                  disabled={loading}
                  aria-invalid={errors.drivingLicenceNo ? "true" : "false"}
                  aria-describedby={
                    errors.drivingLicenceNo
                      ? "drivingLicenceNo-error"
                      : undefined
                  }
                />
                {errors.drivingLicenceNo && (
                  <p
                    id="drivingLicenceNo-error"
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.drivingLicenceNo}
                  </p>
                )}
              </motion.div>
            </div>
            <div className="flex gap-4">
              <motion.div
                className="flex-1"
                variants={fieldVariants}
                custom={8}
              >
                <label
                  htmlFor="aadhaar"
                  className="block text-sm font-medium text-gray-700"
                >
                  Aadhaar Document (PDF, PNG, JPG, JPEG)
                </label>
                {formData.existingAadhaar && (
                  <div className="mb-2">
                    <a
                      href={`http://https://be-go-rental-hbsq.onrender.com/${formData.existingAadhaar}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                    >
                      View Existing Aadhaar
                    </a>
                  </div>
                )}
                <input
                  type="file"
                  name="aadhaar"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className={`mt-1 w-full border rounded-lg py-2 px-3 text-sm ${
                    errors.aadhaar ? "border-red-500" : "border-gray-200"
                  } file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition-all duration-200`}
                  disabled={loading}
                  aria-invalid={errors.aadhaar ? "true" : "false"}
                  aria-describedby={
                    errors.aadhaar ? "aadhaar-error" : undefined
                  }
                />
                {errors.aadhaar && (
                  <p id="aadhaar-error" className="text-red-500 text-xs mt-1">
                    {errors.aadhaar}
                  </p>
                )}
                {formData.aadhaar && (
                  <motion.p
                    className="text-gray-600 text-xs mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Selected: {formData.aadhaar.name}
                  </motion.p>
                )}
              </motion.div>
              <motion.div
                className="flex-1"
                variants={fieldVariants}
                custom={9}
              >
                <label
                  htmlFor="drivinglicence"
                  className="block text-sm font-medium text-gray-700"
                >
                  Driving Licence Document (PDF, PNG, JPG, JPEG)
                </label>
                {formData.existingDrivingLicence && (
                  <div className="mb-2">
                    <a
                      href={`https://be-go-rental-hbsq.onrender.com/${formData.existingDrivingLicence}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                    >
                      View Existing Driving Licence
                    </a>
                  </div>
                )}
                <input
                  type="file"
                  name="drivinglicence"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className={`mt-1 w-full border rounded-lg py-2 px-3 text-sm ${
                    errors.drivinglicence ? "border-red-500" : "border-gray-200"
                  } file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition-all duration-200`}
                  disabled={loading}
                  aria-invalid={errors.drivinglicence ? "true" : "false"}
                  aria-describedby={
                    errors.drivinglicence ? "drivinglicence-error" : undefined
                  }
                />
                {errors.drivinglicence && (
                  <p
                    id="drivinglicence-error"
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.drivinglicence}
                  </p>
                )}
                {formData.drivinglicence && (
                  <motion.p
                    className="text-gray-600 text-xs mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Selected: {formData.drivinglicence.name}
                  </motion.p>
                )}
              </motion.div>
            </div>
            <motion.div
              className="flex justify-center"
              variants={fieldVariants}
              custom={10}
            >
              <motion.button
                type="submit"
                className={`px-8 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Profile"}
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
