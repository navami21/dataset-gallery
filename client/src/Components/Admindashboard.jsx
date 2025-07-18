import React from "react";

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome Admin</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm font-medium">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">120</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm font-medium">Datasets</h2>
          <p className="text-3xl font-bold text-green-600">35</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm font-medium">Categories</h2>
          <p className="text-3xl font-bold text-purple-600">8</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
