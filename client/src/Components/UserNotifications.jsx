// import { useEffect, useState } from "react";
// import axiosInstance from "../axiosinterceptor";

// const UserNotifications = () => {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     axiosInstance.get("/contact/my-messages").then(res => setNotifications(res.data));
//   }, []);

//   return (
//     <div>
//       <h2>Notifications</h2>
//       {notifications.map(msg => (
//         <div key={msg._id} className="border p-4 my-2">
//           <p><strong>Your Message:</strong> {msg.message}</p>
//           {msg.reply ? (
//             <p className="text-green-600"><strong>Reply:</strong> {msg.reply}</p>
//           ) : (
//             <p className="text-gray-500">No reply yet</p>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default UserNotifications;

import { useEffect, useState } from "react";
import axiosInstance from "../axiosinterceptor";
import { FaEnvelopeOpenText, FaCheckCircle, FaClock } from "react-icons/fa";

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axiosInstance.get("/contact/my-messages").then(res => setNotifications(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-[#0099cc] mb-6 flex items-center gap-2">
        <FaEnvelopeOpenText /> Your Notifications
      </h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center">No messages yet.</p>
      ) : (
        notifications.map(msg => (
          <div
            key={msg._id}
            className="bg-white shadow-lg rounded-xl p-5 mb-4 border-l-4 border-[#0099cc] hover:shadow-xl transition-shadow duration-300"
          >
            <p className="text-gray-800 mb-2">
              <strong>Your Message:</strong> {msg.message}
            </p>

            {msg.reply ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3 mt-3">
                <FaCheckCircle className="mt-1" />
                <div>
                  <strong>Reply:</strong> {msg.reply}
                  {msg.repliedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Replied on: {new Date(msg.repliedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg flex items-center gap-3 mt-3">
                <FaClock />
                <span>No reply yet</span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserNotifications;
