// src/pages/CategoryDatasets.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";

const CategoryDatasets = () => {
  const { categoryId } = useParams();
  const [datasets, setDatasets] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const res = await axiosInstance.get(`/category/${categoryId}`);
        setCategoryName(res.data.name); // Assuming category schema has 'name'
      } catch (err) {
        console.error("Error fetching category name:", err);
      }
    };
const handleAccessContent = async (datasetId) => {
  try {
    await axiosInstance.post("/activity/addAccessedContent", {
      action: "viewed",
      datasetId
    });
  } catch (error) {
    console.error("Error logging activity:", error);
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

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-black">
        {categoryName ? `Datasets in ${categoryName}` : "Datasets"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {datasets.map((dataset) => (
          <div key={dataset._id} className="bg-white shadow p-4 rounded-lg">
            <img
              src={`http://localhost:3000${dataset.imageUrl}`}
              alt={dataset.title}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <h3 className="font-semibold text-xl mt-2">{dataset.title}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {dataset.description}
            </p>
            <Link
              to={`/dataset/details/${dataset._id}`}
              className="inline-block bg-[#0099cc] hover:bg-[#5EABD6]  hover:text-black text-white text-sm px-4 py-2 mt-2 rounded transition"
                onClick={() => handleAccessContent(dataset._id)}

            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDatasets;
