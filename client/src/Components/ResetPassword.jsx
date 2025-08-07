import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosinterceptor";
import { toast } from "react-toastify";
import axiosInstance from "../axiosinterceptor";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post(`/users/reset-password/${token}`, {
        newPassword,
        confirmPassword,
      });
      toast.success(res.data.message || "Password reset successful");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D2E0FB] to-[#F8F6E3] px-4">
      <form
        onSubmit={handleReset}
        className="bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-md transition-all"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-[#8EACCD]">
          Reset Your Password
        </h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">New Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8EACCD] transition"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter new password"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8EACCD] transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Re-enter new password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md font-semibold transition duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#8EACCD] hover:bg-[#96B6C5] text-white"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
