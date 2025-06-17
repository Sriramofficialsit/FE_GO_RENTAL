import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../Components/SideBar";
import axios from "axios";

const SearchUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState({ users: [], profiles: [] });
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://be-go-rental-hbsq.onrender.com/auth/user-info",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const userData = Array.isArray(response.data.user)
        ? response.data.user
        : [];
      const profileData = Array.isArray(response.data.profile)
        ? response.data.profile
        : [];
      setData({ users: userData, profiles: profileData });
      if (!response.data.success) {
        setError("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setError("An error occurred while fetching data");
      setData({ users: [], profiles: [] });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = data.users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProfiles = data.profiles.filter(
    (profile) =>
      `${profile.name} ${profile.lastname}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (item, type) => {
    setSelectedItem({ ...item, type });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedItem(null);
  };

  const deleteUser = async (email) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user and their profile?"
      )
    )
      return;
    try {
      const response = await axios.delete(
        `https://be-go-rental-hbsq.onrender.com/auth/user-and-info-del/${email}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setData((prev) => ({
          ...prev,
          users: prev.users.filter((user) => user.email !== email),
          profiles: prev.profiles.filter((profile) => profile.email !== email),
        }));
      } else {
        setError(response.data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
      setError("Failed to delete user");
    }
  };

  const deleteProfile = async (email) => {
    if (!window.confirm("Are you sure you want to delete this profile?"))
      return;
    try {
      const response = await axios.delete(
        `https://be-go-rental-hbsq.onrender.com/auth/user-info-del/${email}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setData((prev) => ({
          ...prev,
          profiles: prev.profiles.filter((profile) => profile.email !== email),
        }));
      } else {
        setError(response.data.message || "Failed to delete profile");
      }
    } catch (error) {
      console.error("Error deleting profile:", error.message);
      setError("Failed to delete profile");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem.type === "profile") {
        if (!/^\d{10}$/.test(selectedItem.phone)) {
          setError("Invalid phone number");
          return;
        }
        if (!/^\d{12}$/.test(selectedItem.aadhaarNo)) {
          setError("Invalid Aadhaar number");
          return;
        }
      }

      const endpoint =
        selectedItem.type === "user"
          ? `https://be-go-rental-hbsq.onrender.com/auth/user-and-info-update/${selectedItem.email}`
          : `https://be-go-rental-hbsq.onrender.com/auth/user-info-update/${selectedItem.email}`;

      const payload =
        selectedItem.type === "user"
          ? {
              name: selectedItem.name,
              email: selectedItem.email,
              mobileno: selectedItem.mobileno,
              role: selectedItem.role,
            }
          : {
              name: selectedItem.name,
              lastname: selectedItem.lastname,
              gender: selectedItem.gender,
              email: selectedItem.email,
              phone: selectedItem.phone,
              address: selectedItem.address,
              aadhaarNo: selectedItem.aadhaarNo,
            };

      const response = await axios.put(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setData((prev) => ({
          ...prev,
          [selectedItem.type === "user" ? "users" : "profiles"]: prev[
            selectedItem.type === "user" ? "users" : "profiles"
          ].map((item) =>
            item.email === selectedItem.email
              ? { ...item, ...selectedItem }
              : item
          ),
        }));
        closeModal();
      } else {
        setError(response.data.message || "Failed to save changes");
      }
    } catch (error) {
      console.error("Error updating item:", error.message);
      setError("Failed to save changes");
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <>
      <SideBar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-200 pt-[14vh] px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex justify-end mb-8 mt-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            name="search"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setError("");
            }}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-5 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
          />
        </motion.div>

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
            className="text-gray-500 text-sm mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Loading data...
          </motion.p>
        )}

        {!isLoading && (
          <>
            {/* Users Section */}
            <motion.div
              className="w-full overflow-x-auto bg-white rounded-xl shadow-2xl border border-gray-100 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl font-bold text-gray-800 p-6 border-b border-gray-100">
                Users
              </h2>
              <table className="min-w-full">
                <thead className="bg-indigo-100 text-indigo-800 text-xs uppercase">
                  <tr>
                    <th className="py-4 px-6 text-left">Name</th>
                    <th className="py-4 px-6 text-left">Email</th>
                    <th className="py-4 px-6 text-left">Mobile No</th>
                    <th className="py-4 px-6 text-left">Role</th>
                    <th className="py-4 px-6 text-center" colSpan="2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        className="hover:bg-indigo-50 transition duration-200"
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                      >
                        <td className="py-4 px-6">{user.name}</td>
                        <td className="py-4 px-6">{user.email}</td>
                        <td className="py-4 px-6">{user.mobileno}</td>
                        <td className="py-4 px-6">{user.role}</td>
                        <td className="py-4 px-3 text-center">
                          <motion.button
                            onClick={() => openModal(user, "user")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-md"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Details
                          </motion.button>
                        </td>
                        <td className="py-4 px-3 text-center">
                          <motion.button
                            onClick={() => deleteUser(user.email)}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-md"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Delete
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-6 px-6 text-center text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>

            {/* Profiles Section */}
            <motion.div
              className="w-full overflow-x-auto bg-white rounded-xl shadow-2xl border border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-gray-800 p-6 border-b border-gray-100">
                Profiles
              </h2>
              <table className="min-w-full">
                <thead className="bg-indigo-100 text-indigo-800 text-xs uppercase">
                  <tr>
                    <th className="py-4 px-6 text-left">Name</th>
                    <th className="py-4 px-6 text-left">Email</th>
                    <th className="py-4 px-6 text-left">Phone</th>
                    <th className="py-4 px-6 text-center" colSpan="2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {filteredProfiles.length > 0 ? (
                    filteredProfiles.map((profile, index) => (
                      <motion.tr
                        key={profile._id}
                        className="hover:bg-indigo-50 transition duration-200"
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                      >
                        <td className="py-4 px-6">{`${profile.name} ${profile.lastname}`}</td>
                        <td className="py-4 px-6">{profile.email}</td>
                        <td className="py-4 px-6">{profile.phone}</td>
                        <td className="py-4 px-3 text-center">
                          <motion.button
                            onClick={() => openModal(profile, "profile")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-md"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Details
                          </motion.button>
                        </td>
                        <td className="py-4 px-3 text-center">
                          <motion.button
                            onClick={() => deleteProfile(profile.email)}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-md"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Delete
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-6 px-6 text-center text-gray-500"
                      >
                        No profiles found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
          </>
        )}

        <AnimatePresence>
          {isOpen && selectedItem && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-6 lg:mx-8"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 animate-fade-in">
                    {selectedItem.type === "user"
                      ? "User Details"
                      : "Profile Details"}
                  </h2>
                  <motion.button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-red-600 text-2xl font-bold focus:outline-none"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                </div>

                <div className="p-8">
                  <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-gray-800 animate-fade-in">
                      {selectedItem.type === "user"
                        ? "User Information"
                        : "Profile Information"}
                    </h3>

                    {selectedItem.type === "user" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <motion.div
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          custom={0}
                        >
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={selectedItem.name}
                            onChange={handleInputChange}
                            placeholder="Name"
                            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                          />
                        </motion.div>
                        <motion.div
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          custom={1}
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
                            value={selectedItem.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-800 sm:text-sm"
                            readOnly
                          />
                        </motion.div>
                        <motion.div
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          custom={2}
                        >
                          <label
                            htmlFor="mobileno"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Mobile No
                          </label>
                          <input
                            type="text"
                            name="mobileno"
                            value={selectedItem.mobileno}
                            onChange={handleInputChange}
                            placeholder="Mobile No"
                            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                          />
                        </motion.div>
                        <motion.div
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          custom={3}
                        >
                          <label
                            htmlFor="role"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Role
                          </label>
                          <input
                            type="text"
                            name="role"
                            value={selectedItem.role}
                            onChange={handleInputChange}
                            placeholder="Role"
                            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                          />
                        </motion.div>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <motion.div
                            variants={rowVariants}
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
                              value={selectedItem.name}
                              onChange={handleInputChange}
                              placeholder="First Name"
                              className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                            />
                          </motion.div>
                          <motion.div
                            variants={rowVariants}
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
                              value={selectedItem.lastname}
                              onChange={handleInputChange}
                              placeholder="Last Name"
                              className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                            />
                          </motion.div>
                        </div>
                        <motion.div
                          variants={rowVariants}
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
                                checked={selectedItem.gender === "male"}
                                onChange={handleInputChange}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
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
                                checked={selectedItem.gender === "female"}
                                onChange={handleInputChange}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                              />
                              <span className="ml-3 text-sm font-medium text-gray-700">
                                Female
                              </span>
                            </label>
                          </div>
                        </motion.div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <motion.div
                            variants={rowVariants}
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
                              value={selectedItem.email}
                              onChange={handleInputChange}
                              placeholder="Email"
                              className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-800 sm:text-sm"
                              readOnly
                            />
                          </motion.div>
                          <motion.div
                            variants={rowVariants}
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
                              value={selectedItem.phone}
                              onChange={handleInputChange}
                              placeholder="Phone"
                              className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                            />
                          </motion.div>
                        </div>
                        <motion.div
                          variants={rowVariants}
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
                            value={selectedItem.address}
                            onChange={handleInputChange}
                            placeholder="Address"
                            rows="4"
                            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                          ></textarea>
                        </motion.div>
                        <motion.div
                          variants={rowVariants}
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
                            value={selectedItem.aadhaarNo}
                            onChange={handleInputChange}
                            placeholder="Aadhaar Number"
                            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-800 sm:text-sm transition duration-200"
                          />
                        </motion.div>
                        <motion.div
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          custom={7}
                        >
                          <label
                            htmlFor="aadhaarFile"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Aadhaar Document
                          </label>
                          {selectedItem.aadhaarFile ? (
                            <a
                              href={`https://be-go-rental-hbsq.onrender.com/${selectedItem.aadhaarFile}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              View Aadhaar Document
                            </a>
                          ) : (
                            <p className="text-gray-500">
                              No document uploaded
                            </p>
                          )}
                        </motion.div>
                      </>
                    )}

                    <motion.div
                      className="flex justify-center mt-8"
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      custom={8}
                    >
                      <motion.button
                        type="button"
                        className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                      >
                        Save
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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

export default SearchUser;
