

import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";
import { ArrowLeft } from "lucide-react";
import { FaSearch } from "react-icons/fa";

const CategoryDatasets = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [datasets, setDatasets] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const res = await axiosInstance.get(`/category/${categoryId}`);
        setCategoryName(res.data.name);
      } catch (err) {
        console.error("Error fetching category name:", err);
      }
    };

    const fetchDatasets = async () => {
      try {
        const res = await axiosInstance.get(`/datasets/category/${categoryId}`);
        setDatasets(res.data);
      } catch (err) {
        console.error("Error fetching datasets:", err);
      }
    };

    if (categoryId) {
      fetchCategoryName();
      fetchDatasets();
    }
  }, [categoryId]);

  const handleAccessContent = async (datasetId) => {
    try {
      await axiosInstance.post("/activity/addAccessedContent", {
        action: "viewed",
        datasetId,
      });
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  // Filter datasets by search term
  const filteredDatasets = datasets.filter(
    (dataset) =>
      dataset.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex flex-col">
      {/* Back Button */}
      {/* <div className="flex justify-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-[#0099cc] hover:bg-[#5EABD6] text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all duration-300"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div> */}
      <div className="mb-6">
   <button
    onClick={() => navigate(-1)}
    className="p-2 rounded-full bg-[#0099cc] hover:bg-[#5EABD6] text-white shadow-lg transition duration-300"
  >
    <ArrowLeft size={24} />
  </button>
  </div>

      {/* Title */}
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        {categoryName ? `Datasets in ${categoryName}` : "Datasets"}
      </h2>

      {/* Search Bar */}
      <div className="relative max-w-md mb-8 mx-auto w-full">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search datasets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0099cc]"
        />
      </div>

      {/* Datasets Grid or Empty State */}
      {filteredDatasets.length > 0 ? (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 justify-center">
            {filteredDatasets.map((dataset) => (
              <div
                key={dataset._id}
                className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 flex flex-col hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                {/* Image with Badge */}
                <div className="relative">
                  <img
                    src={`http://localhost:3000${dataset.imageUrl}`}
                    alt={dataset.title}
                    className="w-full h-44 object-cover"
                  />
                  {categoryName && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-[#0099cc] to-[#00b4d8] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      {categoryName}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">
                    {dataset.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {dataset.description}
                  </p>

                  {/* View Details Button */}
                  <Link
                    to={`/dataset/details/${dataset._id}`}
                    onClick={() => handleAccessContent(dataset._id)}
                    className="mt-auto inline-block text-center font-semibold bg-gradient-to-r from-[#0099cc] to-[#00b4d8] text-white hover:from-[#00b4d8] hover:to-[#0099cc] px-4 py-2 rounded-lg text-sm shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 text-lg">No datasets found.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryDatasets;
