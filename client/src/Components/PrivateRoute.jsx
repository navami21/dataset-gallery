// import React from "react";
// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ children, allowedRoles }) => {
//   const token = localStorage.getItem("logintoken");
//   const role = localStorage.getItem("role");

//   if (!token) return <Navigate to="/login" replace />;
//   if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;

//   return children;
// };

// export default PrivateRoute;
