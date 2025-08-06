import React, { useState } from "react";
import axios from "../axiosinterceptor";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("/users/forgot-password", { email });
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#0099cc]">
          Forgot Password
        </h2>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Enter Your Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0099cc] font-semibold text-white py-2 rounded-md hover:bg-[#00809D] transition"
        >
          {loading ? "Sending..." : "Send Reset Link"}
          
        </button>
       {emailSent && (
  <>
    <p className="mt-4 text-center text-green-600 text-sm">
      If an account exists with this email, a reset link has been sent.
    </p>
    <p className="mt-6 text-center text-sm text-gray-600">
      <span
        className="text-[#0099cc] hover:underline cursor-pointer"
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
