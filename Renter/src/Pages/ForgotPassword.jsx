import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await axios.post(
        "https://be-go-rental-hbsq.onrender.com/auth/forgot-password",
        {
          email,
        }
      );

      setSuccessMsg(
        response.data.message || "Password reset email sent successfully."
      );

      setTimeout(() => navigate("/reset-password"), 3000);
    } catch (error) {
      console.error("Forgot password failed", error);
      if (error.response) {
        setErrorMsg(
          error.response.data.message || "Failed to send reset email."
        );
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
          Forgot Password
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-white mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            disabled={loading}
            onClick={handleForgotPassword}
            className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
