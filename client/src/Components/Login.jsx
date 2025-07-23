import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axiosInstance.post("/users/login", { email, password });

      const { token, user } = res.data;

      // Save token and role to localStorage
      localStorage.setItem("logintoken", token);
      localStorage.setItem("role", user.role);

      // Navigate based on role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/userdashboard");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold mb-6 text-[#008ecf]">LOG IN</h2>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="mb-6 flex items-center border rounded-md bg-white px-3 py-2 shadow-sm">
            <Mail className="text-gray-500 mr-3" size={20} />
            <input
              type="email"
              placeholder="Email"
              className="w-full outline-none bg-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4 flex items-center border rounded-md bg-white px-3 py-2 shadow-sm">
            <Lock className="text-gray-500 mr-3" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full outline-none bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <p className="text-sm text-center mb-6 text-gray-600 cursor-pointer hover:underline">
            Forgot password?
          </p>

          <button
            type="submit"
            className="w-full bg-[#008ecf] text-white font-semibold py-2 rounded-md hover:bg-[#007bb5] transition duration-300"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
