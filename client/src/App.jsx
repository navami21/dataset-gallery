import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "./Components/Admindashboard";
import AdminLayout from "./Components/AdminLayout"; // new layout

const App = () => {
  return (
    <Routes>
      {/* Public Route */}

      {/* Admin Routes with Sidebar */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        {/* You can add more nested routes here */}
      </Route>
    </Routes>
  );
};

export default App;
