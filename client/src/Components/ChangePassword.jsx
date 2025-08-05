// import React, { useState } from "react";
// import axiosInstance from "../axiosinterceptor";

// const ChangePassword = () => {
//   const [formData, setFormData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmNewPassword: "",
//   });

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");
//     setLoading(true);

//     try {
//       const response = await axiosInstance.put("/users/change-password", formData);
//       setMessage(response.data.message);
//       setFormData({
//         currentPassword: "",
//         newPassword: "",
//         confirmNewPassword: "",
//       });
//     } catch (err) {
//       const errMsg =
//         err.response?.data?.message || "Failed to change password. Try again.";
//       setError(errMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow bg-white">
//       <h2 className="text-xl font-semibold mb-4 text-center">Change Password</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block font-medium mb-1">Current Password</label>
//           <input
//             type="password"
//             name="currentPassword"
//             required
//             value={formData.currentPassword}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-1">New Password</label>
//           <input
//             type="password"
//             name="newPassword"
//             required
//             value={formData.newPassword}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Confirm New Password</label>
//           <input
//             type="password"
//             name="confirmNewPassword"
//             required
//             value={formData.confirmNewPassword}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-300"
//         >
//           {loading ? "Updating..." : "Change Password"}
//         </button>

//         {message && <p className="text-green-600 text-center mt-2">{message}</p>}
//         {error && <p className="text-red-600 text-center mt-2">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default ChangePassword;
import React, { useState } from "react";
import axiosInstance from "../axiosinterceptor";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [visible, setVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleVisibility = (field) => {
    setVisible((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.put("/users/change-password", formData);
      setMessage(response.data.message);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "Failed to change password. Try again.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordField = (label, name) => (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          type={visible[name] ? "text" : "password"}
          name={name}
          required
          value={formData[name]}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded pr-10"
        />
        <span
          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
          onClick={() => toggleVisibility(name)}
        >
          {visible[name] ? <FiEyeOff /> : <FiEye />}
        </span>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow bg-white">
      <h2 className="text-xl font-semibold mb-4 text-center">Change Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {renderPasswordField("Current Password", "currentPassword")}
        {renderPasswordField("New Password", "newPassword")}
        {renderPasswordField("Confirm New Password", "confirmNewPassword")}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0099cc] hover:bg-[#007aab] text-white font-semibold py-2 rounded transition duration-300"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>

        {message && <p className="text-green-600 text-center mt-2">{message}</p>}
        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default ChangePassword;
