
import React, { useState } from "react";
import axiosInstance from "../axiosinterceptor";
import { UploadCloud } from "lucide-react"; 

const UserUploadPreview = () => {
  const [previewUsers, setPreviewUsers] = useState([]);
  const [checkedEmails, setCheckedEmails] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [dragging, setDragging] = useState(false);

  
  const isValidExcelFile = (file) => {
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];
  const allowedExtensions = ["xlsx", "xls"];
  const fileExtension = file.name.split(".").pop().toLowerCase();

  return allowedTypes.includes(file.type) && allowedExtensions.includes(fileExtension);
};

const handleFileChange = (e) => {
  const uploadedFile = e.target.files[0];
  if (uploadedFile) {
    if (!isValidExcelFile(uploadedFile)) {
      alert("Only Excel files (.xlsx or .xls) are allowed.");
      return;
    }

    setFile(uploadedFile);
    setPreviewUsers([]);
    setCheckedEmails([]);
    setMessage("");
  }
};


  const handleDrop = (e) => {
  e.preventDefault();
  setDragging(false);
  const droppedFile = e.dataTransfer.files[0];
  if (droppedFile) {
    if (!isValidExcelFile(droppedFile)) {
      alert("Only Excel files (.xlsx or .xls) are allowed.");
      return;
    }

    setFile(droppedFile);
    setPreviewUsers([]);
    setCheckedEmails([]);
    setMessage("");
  }
};


  const handlePreview = async () => {
    if (!file) return alert("Please upload an Excel file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axiosInstance.post("/admin/preview-users", formData);
      setPreviewUsers(res.data.users || []);
    } catch (err) {
      console.error("Preview failed:", err);
    }
  };

  const handleCheckboxChange = (email) => {
    setCheckedEmails((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  const handleSendEmails = async () => {
    if (checkedEmails.length === 0) return alert("Select users to send emails");

    try {
      const res = await axiosInstance.post("/admin/upload-users", {
        emails: checkedEmails,
      });

      const { success = [], exists = [], failed = [] } = res.data;
      const messageLines = [];

      if (success.length > 0)
        messageLines.push(`Emails sent to: ${success.join(", ")}`);
      if (exists.length > 0)
        messageLines.push(`⚠ Already in database: ${exists.join(", ")}`);
      if (failed.length > 0)
        messageLines.push(` Failed to send: ${failed.join(", ")}`);

      setMessage(messageLines.join("\n"));
      setShowModal(true);

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("Failed to send emails:", err);
      setMessage("An unexpected error occurred.");
      setShowModal(true);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold text-center mb-6">Upload User Excel File</h2>

      {/* Drag & Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        className={`border-2 border-dashed ${
          dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } rounded-lg p-8 text-center transition mb-4 cursor-pointer`}
        onClick={() => document.getElementById("fileInput").click()}
      >
        <UploadCloud className="mx-auto text-[bg-#0099cc] mb-2" size={40} />
        <p className="text-gray-700 font-medium">
          Drag and drop your Excel file here, or click to select
        </p>
        <p className="text-sm text-gray-400 mt-1">Accepted: .xlsx, .xls</p>
       <input
  id="fileInput"
  type="file"
  accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
  onChange={handleFileChange}
  className="hidden"
/>

        {file && (
          <p className="mt-2 text-sm text-green-600 font-semibold">
            Selected file: {file.name}
          </p>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={handlePreview}
          className="bg-[#0099cc] font-semibold text-white px-4 py-2 rounded hover:bg-[#00809D] transition inline-block mt-2"
        >
          Preview
        </button>
      </div>

      {/* User Table */}
      {previewUsers.length > 0 && (
        <>
          <table className="mt-6 w-full border text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2">Select</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {previewUsers.map((user, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange(user.email)}
                    />
                  </td>
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center mt-4">
            <button
              onClick={handleSendEmails}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
            >
              Send Email to Selected Users
            </button>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-md w-full text-center">
            <h3 className="text-lg font-semibold text-green-700 mb-2">Result</h3>
            <p className="text-gray-700 mb-4 whitespace-pre-line">{message}</p>
            <button
              onClick={() => {
                setShowModal(false);
                setMessage("");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserUploadPreview;
