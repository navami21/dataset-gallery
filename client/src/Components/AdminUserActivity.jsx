

import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosinterceptor";
import { FaSearch } from "react-icons/fa";

const AdminAllUserActivity = () => {
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [emailFilter, setEmailFilter] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axiosInstance.get("/admin/all-user-activity");
        const activities = res.data;

        const sortedLogs = activities.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        const enrichedLogs = [];
        const loginMap = {};

        sortedLogs.forEach((log) => {
          const userId = log.user?._id;
          const timestamp = new Date(log.timestamp);

          if (log.action === "login") {
            loginMap[userId] = {
              user: log.user,
              loginTime: timestamp,
              action: "login",
              datasetOrPage: "—",
              logoutTime: "—",
            };
          } else if (log.action === "logout" && loginMap[userId]) {
            enrichedLogs.push({
              ...loginMap[userId],
              action: "session",
              logoutTime: timestamp,
            });
            delete loginMap[userId];
          } else {
            enrichedLogs.push({
              user: log.user,
              loginTime: "—",
              logoutTime: "—",
              action: log.action,
              datasetOrPage: log.dataset?.title || log.page || "—",
              timestamp,
            });
          }
        });

        setAllLogs(enrichedLogs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const filteredLogs = allLogs
  .filter((log) => log.user?.role !== "admin") // exclude admin activity
  .filter((log) => {
    const emailMatch = log.user?.email
      ?.toLowerCase()
      .includes(emailFilter.toLowerCase());

    const timestamp = new Date(log.timestamp || log.loginTime);
    const filter = filterDate ? new Date(filterDate) : null;
    console.log(log.user); // check role value


    const inDate =
      !filter ||
      (timestamp.getFullYear() === filter.getFullYear() &&
        timestamp.getMonth() === filter.getMonth() &&
        timestamp.getDate() === filter.getDate());

    return emailMatch && inDate;
  });


  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">All User Activity Logs</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Filter by email"
            className="border pl-10 pr-3 py-2 rounded"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
          />
        </div>
        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="py-2 px-4 border">#</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Login Time</th>
            <th className="py-2 px-4 border">Action</th>
            <th className="py-2 px-4 border">Dataset/Page</th>
            <th className="py-2 px-4 border">Logout Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No matching activity logs.
              </td>
            </tr>
          ) : (
            filteredLogs.map((log, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{log.user?.name || "—"}</td>
                <td className="py-2 px-4 border">{log.user?.email || "—"}</td>
                <td className="py-2 px-4 border">
                  {log.loginTime === "—"
                    ? "—"
                    : new Date(log.loginTime).toLocaleString()}
                </td>
                <td className="py-2 px-4 border capitalize">{log.action}</td>
                <td className="py-2 px-4 border">{log.datasetOrPage}</td>
                <td className="py-2 px-4 border">
                  {log.logoutTime === "—"
                    ? "—"
                    : new Date(log.logoutTime).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAllUserActivity;
