import React, { useState } from "react";
import axios from "../axiosinterceptor";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axiosInstance.post("/users/forgot-password", { email });
      toast.success(res.data.message || "Reset link sent to your email");
      setEmailSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      setEmailSent(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7ff] to-[#cceeff] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-[#0099cc]/20"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-[#0099cc]">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your email address and we’ll send you a link to reset your password.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099cc] transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 font-semibold rounded-lg transition ${
            loading
              ? "bg-[#7cc6de] cursor-not-allowed"
              : "bg-[#0099cc] hover:bg-[#0084b0]"
          } text-white`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {emailSent && (
          <>
            <p className="mt-5 text-center text-green-600 text-sm font-medium">
              If an account exists with this email, a reset link has been sent.
            </p>
            <p className="mt-6 text-center text-sm text-gray-600">
              <span
                className="text-[#0099cc] hover:underline cursor-pointer font-medium"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </span>
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
