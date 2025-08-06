// import React, { useState } from "react";
// import { Mail, Lock } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../axiosinterceptor";
// import {  Link } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");

//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setErrorMsg("");

//     try {
//       const res = await axiosInstance.post("/users/login", { email, password });

//       const { token, user } = res.data;

//       // Save token and role to localStorage
//       localStorage.setItem("logintoken", token);
//       localStorage.setItem("role", user.role);

//       // Navigate based on role
//       if (user.role === "admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/userdashboard");
//       }
//     } catch (err) {
//       setErrorMsg(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center">
//       <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
//         <h2 className="text-center text-2xl font-semibold mb-6 text-[#008ecf]">LOG IN</h2>

//         {errorMsg && (
//           <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
//             {errorMsg}
//           </div>
//         )}

//         <form onSubmit={handleLogin}>
//           {/* Email Field */}
//           <div className="mb-6 flex items-center border rounded-md bg-white px-3 py-2 shadow-sm">
//             <Mail className="text-gray-500 mr-3" size={20} />
//             <input
//               type="email"
//               placeholder="Email"
//               className="w-full outline-none bg-transparent"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           {/* Password Field */}
//           <div className="mb-4 flex items-center border rounded-md bg-white px-3 py-2 shadow-sm">
//             <Lock className="text-gray-500 mr-3" size={20} />
//             <input
//               type="password"
//               placeholder="Password"
//               className="w-full outline-none bg-transparent"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <Link
//             to="/forgot-password"
//             className="text-sm font-medium text-center mb-6 text-gray-600  hover:text-[#0099cc] hover:underline block"
//           >
//           Forgot password?
//         </Link>

//           <button
//             type="submit"
//             className="w-full text-white font-semibold py-2 rounded-md bg-gradient-to-r from-[#0099cc] to-[#00b4d8] hover:bg-[#007bb5] transition duration-300"
//           >
//             Log In
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fadeIn, setFadeIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Trigger fade-in after mount
    setTimeout(() => setFadeIn(true), 50);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axiosInstance.post("/users/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("logintoken", token);
      localStorage.setItem("role", user.role);

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        className={`bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all duration-700 ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        } hover:scale-[1.02]`}
      >
        {/* Logo / Title */}
        <div className="text-center mb-6">
          <img src="/assets/LOGO.png" alt="Logo" className="h-14 mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-[#0099cc] tracking-wide">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm mt-1">Please log in to continue</p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center border border-red-200 animate-shake">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 shadow-sm focus-within:ring-2 focus-within:ring-[#00b4d8]">
            <Mail className="text-gray-400 mr-3" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field with Eye Toggle */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 shadow-sm focus-within:ring-2 focus-within:ring-[#00b4d8] relative">
            <Lock className="text-gray-400 mr-3" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-400 hover:text-[#0099cc]"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-[#0099cc] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#0099cc] to-[#00b4d8] text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
