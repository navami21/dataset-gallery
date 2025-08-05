
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import axiosInstance from "../axiosinterceptor";

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [categoryCount, setCategoryCount] = useState(0);

//   useEffect(() => {
//     const token = localStorage.getItem("logintoken");

//     const fetchCategoryCount = async () => {
//       try {
//         const res = await axiosInstance.get("/category/category-count", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setCategoryCount(res.data.count);
//       } catch (error) {
//         console.error("Failed to fetch category count:", error);
//       }
//     };

//     const fetchRecentUsers = async () => {
//       try {
//         const res = await axiosInstance.get("/admin/recent-users", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUsers(res.data);
//       } catch (error) {
//         console.error("Failed to fetch users:", error);
//       }
//     };

//     fetchCategoryCount();
//     fetchRecentUsers();
//   }, []);

//   return (
//     <div className="space-y-8">
//       <h1 className="text-2xl font-bold text-gray-800">Welcome Admin</h1>

//       {/* Summary cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         <div className="bg-white shadow rounded-lg p-6">
//           <h2 className="text-gray-500 text-sm font-medium">Total Users</h2>
//           <p className="text-3xl font-bold text-blue-600">{users.length}</p>
//         </div>
//         <div className="bg-white shadow rounded-lg p-6">
//           <h2 className="text-gray-500 text-sm font-medium">Datasets</h2>
//           <p className="text-3xl font-bold text-green-600">35</p>
//         </div>
//         <div className="bg-white shadow rounded-lg p-6">
//           <h2 className="text-gray-500 text-sm font-medium">Categories</h2>
//           <p className="text-3xl font-bold text-purple-600">{categoryCount}</p>
//         </div>
//       </div>

//       {/* Recent users */}
//       <div className="bg-white shadow rounded-lg p-6">
//         <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Users</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="text-left text-gray-500 border-b">
//                 <th className="pb-2">Name</th>
//                 <th className="pb-2">Email</th>
//                 <th className="pb-2">Status</th>
//                 <th className="pb-2">Last Active</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr key={user._id} className="border-b last:border-none">
//                   <td className="py-2 font-medium text-gray-800">{user.name}</td>
//                   <td className="py-2 text-gray-600">{user.email}</td>
//                   <td className="py-2">
//                     <span
//                       className={`inline-block h-3 w-3 rounded-full mr-2 ${
//                         user.isOnline ? "bg-green-500" : "bg-red-400"
//                       }`}
//                       title={user.isOnline ? "Online" : "Offline"}
//                     ></span>
//                     {user.isOnline ? "Online" : "Offline"}
//                   </td>
//                   <td className="py-2 text-gray-500">
//                     {user.lastActive
//                       ? new Date(user.lastActive).toLocaleString()
//                       : "N/A"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../axiosinterceptor";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [categoryCount, setCategoryCount] = useState(0);
  const [datasetCount, setDatasetCount] = useState(0);

  const token = localStorage.getItem("logintoken");

  // Fetch data functions
  const fetchCategoryCount = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/category/category-count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategoryCount(res.data.count);
    } catch (error) {
      console.error("Failed to fetch category count:", error);
    }
  };

  const fetchDatasetCount = async () => {
    try {
      const res = await axiosInstance.get("/datasets/count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDatasetCount(res.data.count);
    } catch (error) {
      console.error("Failed to fetch dataset count:", error);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      const res = await axiosInstance.get("/admin/recent-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchCategoryCount();
    fetchDatasetCount();
    fetchRecentUsers();

    // Optional: Polling every 10 seconds for live status
    const interval = setInterval(() => {
      fetchRecentUsers();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Welcome Admin</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm font-medium">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm font-medium">Datasets</h2>
          <p className="text-3xl font-bold text-green-600">{datasetCount}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm font-medium">Categories</h2>
          <p className="text-3xl font-bold text-purple-600">{categoryCount}</p>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2 min-w-[150px]">Name</th>
                <th className="pb-2 min-w-[200px]">Email</th>
                <th className="pb-2 min-w-[100px]">Status</th>
                <th className="pb-2 min-w-[180px]">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b last:border-none">
                  <td className="py-2 font-medium text-gray-800">{user.name || "N/A"}</td>
                  <td className="py-2 text-gray-600">{user.email}</td>
                  <td className="py-2">
                    <span
                      className={`inline-block h-3 w-3 rounded-full mr-2 ${
                        user.isOnline ? "bg-green-500" : "bg-red-400"
                      }`}
                      title={user.isOnline ? "Online" : "Offline"}
                    ></span>
                    {user.isOnline ? "Online" : "Offline"}
                  </td>
                  <td className="py-2 text-gray-500">
                    {user.lastActive
                      ? new Date(user.lastActive).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-4">
                    No recent users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
