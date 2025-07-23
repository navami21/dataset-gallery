// import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";
import { FaTrash,  FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";

const DatasetView = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDatasets = async () => {
    try {
      const token = localStorage.getItem("logintoken");
      const response = await axiosInstance.get("/datasets", {
        headers: { token },
      });

      setDatasets(response.data);
    } catch (error) {
      console.error("Error fetching datasets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dataset?")) return;
    try {
      const token = localStorage.getItem("logintoken");
      await axiosInstance.delete(`/datasets/${id}`, {
        headers: { token },
      });
      setDatasets(datasets.filter((ds) => ds._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  if (loading) {
    return <div className="text-center text-lg mt-10">Loading datasets...</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Available Datasets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {datasets.map((dataset) => (
          <div
            key={dataset._id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
          >
            <img
              src={`http://localhost:3000${dataset.imageUrl}`}
              alt="dataset"
              className="w-full h-40 object-cover rounded-t-xl"
            />

            <div className="p-4">
              <h3 className="text-lg font-semibold text-center mb-2">
                {dataset.title}
              </h3>

              <div className="text-sm text-center text-gray-600">
              <span className="font-bold text-[#0099cc]">{dataset.fileType}</span> | &nbsp;
                {dataset.size || "N/A"} &nbsp; | &nbsp;
                {dataset.columnCount || 0} Columns
              </div>

              <div className="mt-4 flex justify-center gap-3">
                <Link
                  to={ `/admin/datasets/${dataset._id}`}
                  className="px-4 py-1.5 rounded-lg bg-[#0099cc] text-white text-sm font-medium shadow hover:bg-gray-200 hover:text-[#0F828C] transition"
                >
                  View
                </Link>
                                <Link
                  to={`/admin/datasets/edit/${dataset._id}`}
                  className="text-green-700 hover:green-blue-900 py-2 transition text-xl"
                  title="Edit"
                >
                  <FaEdit />
                </Link>
                <button
                  onClick={() => handleDelete(dataset._id)}
                  className="text-red-500 hover:text-red-700 transition"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatasetView;
