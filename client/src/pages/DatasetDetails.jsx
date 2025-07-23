import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";
import { FaFileCsv, FaRulerCombined, FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import { MdGridView } from "react-icons/md";

const DatasetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataset, setDataset] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // You can replace this with actual role check

  useEffect(() => {
    const token = localStorage.getItem("logintoken");

    axiosInstance.get(`/datasets/${id}`, {
      headers: { token },
    })
    .then(res => {
      setDataset(res.data);
    })
    .catch(err => console.error("Failed to fetch dataset:", err));

    // Dummy check - replace with your actual auth logic
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this dataset?")) {
      try {
        await axiosInstance.delete(`/datasets/${id}`, {
          headers: {
            token: localStorage.getItem("logintoken"),
          },
        });
        navigate(`/admin/datasets/${datasetId}`);

      } catch (error) {
        console.error("Error deleting dataset:", error);
      }
    }
  };

  if (!dataset) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Section */}
      <div className="md:col-span-2">
        <h1 className="text-3xl font-semibold mb-4">{dataset.title}</h1>

        {dataset.imageUrl && (
          <img
            src={`http://localhost:3000${dataset.imageUrl}`}
            alt={dataset.title}
            className="rounded-lg w-full h-64 object-cover mb-4 shadow"
          />
        )}

        <h2 className="text-xl font-semibold mb-2">Dataset Overview</h2>
        <p className="text-gray-700 whitespace-pre-line">{dataset.description}</p>

        <div className="flex gap-4 mt-6">
          <button className="bg-[#0099cc] font-semibold text-white px-4 py-2 rounded hover:bg-[#00809D] transition">
            View Projects
          </button>
          <button className="bg-[#0099cc] font-semibold text-white px-4 py-2 rounded hover:bg-[#00809D] transition">
            View Likes & Comments
          </button>
        </div>
      </div>

      {/* Right Section: Summary */}
      <div className="bg-gray-50 border-l px-4 py-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Summary</h3>
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <FaFileCsv />
          <span>{dataset.fileType || "CSV File"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <MdGridView />
          <span>{dataset.columns?.length || 0} Columns</span>
        </div>
        {dataset.size && (
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <FaRulerCombined />
            <span>{dataset.size}</span>
          </div>
                    )}
                  {dataset.csvUrl ? (
              <a
              href={`http://localhost:3000${dataset.csvUrl}`}
                download
                className="flex items-center gap-2 mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                <FaDownload />
                Download CSV
              </a>
            ) : (
              <p className="text-red-500 mt-4">CSV file not available</p>
            )}

        {/* Admin Actions */}
        {isAdmin && (
          <div className="mt-6 space-y-2">
            <button
              onClick={() => navigate(`/admin/datasets/edit/${dataset._id}`)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full justify-center"
            >
              <FaEdit />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full justify-center"
            >
              <FaTrash />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetDetails;
