

// import React, { useEffect, useState } from "react";
// import axiosInstance from "../axiosinterceptor";
// import { FaSearch, FaEye } from "react-icons/fa";

// const AdminAllUserActivity = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedUser, setSelectedUser] = useState(null);
//   const [userSessions, setUserSessions] = useState([]);
//   const [userActions, setUserActions] = useState([]);
//   const [loadingActivity, setLoadingActivity] = useState(false);

//   const [emailFilter, setEmailFilter] = useState("");
//   const [filterDate, setFilterDate] = useState("");

//   // Fetch all logs, deduplicate users by latest login
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axiosInstance.get("/admin/all-user-activity");


//         setUsers(res.data);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const filtered = users.filter((u) => {
//   const emailMatch = u.user?.email
//     ?.toLowerCase()
//     .includes(emailFilter.toLowerCase());

//   const timestamp = new Date(u.lastLogin || u.lastLogout);
//   const filter = filterDate ? new Date(filterDate) : null;

//   const inDate =
//     !filter ||
//     (timestamp.getFullYear() === filter.getFullYear() &&
//       timestamp.getMonth() === filter.getMonth() &&
//       timestamp.getDate() === filter.getDate());

//   return emailMatch && inDate;
// });


//   const handleViewActivity = async (userId) => {
//     setSelectedUser(userId);
//     setLoadingActivity(true);
//     try {
//       const res = await axiosInstance.get(`/admin/user-activity/${userId}`);
//       setUserSessions(res.data.sessions || []);
//       setUserActions(res.data.allActions || []);
//     } catch (error) {
//       console.error("Error fetching user activity:", error);
//     } finally {
//       setLoadingActivity(false);
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="p-4 overflow-x-auto">
//       <h2 className="text-xl font-semibold mb-4">User Activity Overview</h2>

      
//       <div className="flex flex-wrap gap-4 mb-4 items-center">
//         <div className="relative">
//           <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//           <input
//             type="text"
//             placeholder="Filter by email"
//             className="border pl-10 pr-3 py-2 rounded"
//             value={emailFilter}
//             onChange={(e) => setEmailFilter(e.target.value)}
//           />
//         </div>
//         <input
//           type="date"
//           className="border px-3 py-2 rounded"
//           value={filterDate}
//           onChange={(e) => setFilterDate(e.target.value)}
//         />
//       </div>

//       {/* Table */}
//      <table className="min-w-full border border-gray-200 rounded-lg shadow-md overflow-hidden">
//   <thead className="bg-[#0099cc] text-white">
//     <tr>
//       <th className="py-3 px-4 text-left font-semibold">#</th>
//       <th className="py-3 px-4 text-left font-semibold">User</th>
//       <th className="py-3 px-4 text-left font-semibold">Last Login</th>
//       <th className="py-3 px-4 text-left font-semibold">Last Logout</th>
//       <th className="py-3 px-4 text-center font-semibold">View</th>
//     </tr>
//   </thead>
//   <tbody>
//     {filtered.length === 0 ? (
//       <tr>
//         <td colSpan="5" className="text-center py-6 text-gray-500">
//           No matching users.
//         </td>
//       </tr>
//     ) : (
//       filtered.map((u, index) => (
//         <tr
//           key={index}
//           className={`border-b hover:bg-blue-50 transition-colors ${
//             index % 2 === 0 ? "bg-white" : "bg-gray-50"
//           }`}
//         >
//           <td className="py-3 px-4">{index + 1}</td>
//           <td className="py-3 px-4">
//             <div className="font-medium text-gray-900">{u.user?.name || "—"}</div>
//             <div className="text-sm text-gray-600">{u.user?.email || "—"}</div>
//           </td>
//           <td className="py-3 px-4">
//             <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
//             {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "—"}
//             </span>
//           </td>
//           <td className="py-3 px-4">
//             {u.lastLogout && u.lastLogin && new Date(u.lastLogout) > new Date(u.lastLogin) ? (
//               <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm">
//                 {new Date(u.lastLogout).toLocaleString()}
//               </span>
//             ) : (
//               <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
//                 Active
//               </span>
//             )}
//           </td>
//           <td className="py-3 px-4 text-center">
//             <FaEye
//               className="text-blue-600 cursor-pointer hover:text-blue-800 hover:scale-110 transition-transform"
//               onClick={() => handleViewActivity(u.user._id)}
//             />
//           </td>
//         </tr>
//       ))
//     )}
//   </tbody>
// </table>



//       {/* Modal */}
//       {selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white rounded-lg p-6 w-[700px] max-h-[80vh] overflow-y-auto">
//             <h3 className="text-lg font-semibold mb-4">Activity Details</h3>

//             {loadingActivity ? (
//               <p>Loading...</p>
//             ) : (
//               <>
//                 {/* Sessions */}
//                 <h4 className="font-semibold mb-2">Sessions</h4>
//                 {userSessions.length === 0 ? (
//                   <p className="text-gray-500 mb-4">No sessions found.</p>
//                 ) : (
//                   userSessions.map((session, idx) => (
//                     <div key={idx} className="mb-3 border p-3 rounded">
//                       <p>
//                         <strong>Login:</strong>{" "}
//                         {new Date(session.loginTime).toLocaleString()}
//                       </p>
//                       <p>
//                         <strong>Logout:</strong>{" "}
//                         {session.logoutTime
//                           ? new Date(session.logoutTime).toLocaleString()
//                           : "Active"}
//                       </p>
//                       <p>
//                         <strong>Duration:</strong>{" "}
//                         {session.durationMinutes} min
//                       </p>
//                       {session.interactions?.length > 0 && (
//                         <div className="mt-2">
//                           <strong>Interactions:</strong>
//                           <ul className="list-disc ml-5">
//                             {session.interactions.map((a, i) => (
//                               <li key={i}>
//                                 {a.action} — {a.dataset?.title || "—"} (
//                                 {new Date(a.timestamp).toLocaleString()})
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       )}
//                     </div>
//                   ))
//                 )}

//                 {/* All Actions */}
//                 <h4 className="font-semibold mt-4 mb-2">All Actions</h4>
//                 {userActions.length === 0 ? (
//                   <p className="text-gray-500">No actions found.</p>
//                 ) : (
//                   <ul className="list-disc ml-5">
//                     {userActions.map((a, i) => (
//                       <li key={i}>
//                         {a.action} — {a.dataset || "—"} (
//                         {new Date(a.timestamp).toLocaleString()})
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </>
//             )}

//             <button
//               className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
//               onClick={() => setSelectedUser(null)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminAllUserActivity;

import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosinterceptor";
import { FaSearch, FaEye } from "react-icons/fa";

const AdminAllUserActivity = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [userSessions, setUserSessions] = useState([]);
  const [userActions, setUserActions] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  const [emailFilter, setEmailFilter] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [activityFilterDate, setActivityFilterDate] = useState(""); // NEW

  // Fetch all logs, deduplicate users by latest login
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/admin/all-user-activity");
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const emailMatch = u.user?.email
      ?.toLowerCase()
      .includes(emailFilter.toLowerCase());

    const timestamp = new Date(u.lastLogin || u.lastLogout);
    const filter = filterDate ? new Date(filterDate) : null;

    const inDate =
      !filter ||
      (timestamp.getFullYear() === filter.getFullYear() &&
        timestamp.getMonth() === filter.getMonth() &&
        timestamp.getDate() === filter.getDate());

    return emailMatch && inDate;
  });

  const handleViewActivity = async (userId) => {
    setSelectedUser(userId);
    setLoadingActivity(true);
    try {
      const res = await axiosInstance.get(`/admin/user-activity/${userId}`);
      setUserSessions(res.data.sessions || []);
      setUserActions(res.data.allActions || []);
      setActivityFilterDate(""); // reset filter when opening modal
    } catch (error) {
      console.error("Error fetching user activity:", error);
    } finally {
      setLoadingActivity(false);
    }
  };

  // NEW: Filtered sessions and actions inside modal
  const filteredSessions = userSessions.filter((session) => {
    if (!activityFilterDate) return true;
    const filter = new Date(activityFilterDate);
    const loginDate = new Date(session.loginTime);
    return (
      loginDate.getFullYear() === filter.getFullYear() &&
      loginDate.getMonth() === filter.getMonth() &&
      loginDate.getDate() === filter.getDate()
    );
  });

  const filteredActions = userActions.filter((a) => {
    if (!activityFilterDate) return true;
    const filter = new Date(activityFilterDate);
    const actionDate = new Date(a.timestamp);
    return (
      actionDate.getFullYear() === filter.getFullYear() &&
      actionDate.getMonth() === filter.getMonth() &&
      actionDate.getDate() === filter.getDate()
    );
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">User Activity Overview</h2>

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

      {/* Table */}
      <table className="min-w-full border border-gray-200 rounded-lg shadow-md overflow-hidden">
        <thead className="bg-[#0099cc] text-white">
          <tr>
            <th className="py-3 px-4 text-left font-semibold">#</th>
            <th className="py-3 px-4 text-left font-semibold">User</th>
            <th className="py-3 px-4 text-left font-semibold">Last Login</th>
            <th className="py-3 px-4 text-left font-semibold">Last Logout</th>
            <th className="py-3 px-4 text-center font-semibold">View</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                No matching users.
              </td>
            </tr>
          ) : (
            filtered.map((u, index) => (
              <tr
                key={index}
                className={`border-b hover:bg-blue-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">
                    {u.user?.name || "—"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {u.user?.email || "—"}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                    {u.lastLogin
                      ? new Date(u.lastLogin).toLocaleString()
                      : "—"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {u.lastLogout &&
                  u.lastLogin &&
                  new Date(u.lastLogout) > new Date(u.lastLogin) ? (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm">
                      {new Date(u.lastLogout).toLocaleString()}
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                      Active
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  <FaEye
                    className="text-blue-600 cursor-pointer hover:text-blue-800 hover:scale-110 transition-transform"
                    onClick={() => handleViewActivity(u.user._id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal */}
{/* Modal */}
{selectedUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg p-6 w-[700px] max-h-[80vh] overflow-y-auto shadow-lg">
      
      {/* Modal Header */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">Activity Details</h3>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
          onClick={() => setSelectedUser(null)}
        >
          Close
        </button>
      </div>

      {/* Date filter inside modal */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Filter by Date
        </label>
        <input
          type="date"
          className="border px-3 py-2 rounded w-full"
          value={activityFilterDate}
          onChange={(e) => setActivityFilterDate(e.target.value)}
        />
      </div>

      {loadingActivity ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Sessions */}
          <h4 className="font-semibold mb-2 text-gray-800">Sessions</h4>
          {filteredSessions.length === 0 ? (
            <p className="text-gray-500 mb-4">No sessions found.</p>
          ) : (
            filteredSessions.map((session, idx) => (
              <div
                key={idx}
                className="mb-3 border p-3 rounded bg-gray-50 shadow-sm"
              >
                <p>
                  <strong>Login:</strong>{" "}
                  {new Date(session.loginTime).toLocaleString()}
                </p>
                <p>
                  <strong>Logout:</strong>{" "}
                  {session.logoutTime
                    ? new Date(session.logoutTime).toLocaleString()
                    : "Active"}
                </p>
                <p>
                  <strong>Duration:</strong> {session.durationMinutes} min
                </p>
                {session.interactions?.length > 0 && (
                  <div className="mt-2">
                    <strong>Interactions:</strong>
                    <ul className="list-disc ml-5">
                      {session.interactions.map((a, i) => (
                        <li key={i}>
                          {a.action} — {a.dataset?.title || "—"} (
                          {new Date(a.timestamp).toLocaleString()})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}

          {/* All Actions */}
          <h4 className="font-semibold mt-4 mb-2 text-gray-800">All Actions</h4>
          {filteredActions.length === 0 ? (
            <p className="text-gray-500">No actions found.</p>
          ) : (
            <ul className="list-disc ml-5">
              {filteredActions.map((a, i) => (
                <li key={i}>
                  {a.action} — {a.dataset || "—"} (
                  {new Date(a.timestamp).toLocaleString()})
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default AdminAllUserActivity;
