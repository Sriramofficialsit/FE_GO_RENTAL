import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://be-go-rental-hbsq.onrender.com/auth/reset-password",
        {
          token,
          newPassword,
        }
      );

      setSuccessMsg(response.data.message || "Password successfully reset.");
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      console.error("Reset password failed", error);
      if (error.response) {
        setErrorMsg(error.response.data.message || "Failed to reset password.");
      } else if (error.request) {
        setErrorMsg("Server not responding. Please try again later.");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl p-10 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Reset Password
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-white mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-white mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          {errorMsg && (
            <p className="text-red-400 text-sm text-center">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="text-green-400 text-sm text-center">{successMsg}</p>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || !token}
            onClick={handleResetPassword}
            className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>
          <p className="text-sm text-white text-center mt-4">
            Back to{" "}
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
