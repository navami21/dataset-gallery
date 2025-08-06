

import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";
import { toast } from "react-toastify";

const ViewCategories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/category/all");
      setCategories(res.data);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axiosInstance.delete(`/category/delete/${id}`);
      toast.success("Category deleted");
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Categories</h1>

      {/* Responsive Grid without overlap */}
      <div className="grid gap-8 justify-center sm:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 flex flex-col hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-44 object-cover"
              />
              {userRole === "admin" && (
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => navigate(`/admin/category/edit/${cat._id}`)}
                  className="p-2 bg-white/80 hover:bg-white rounded-full shadow transition"
                  title="Edit"
                >
                  <Pencil size={16} className="text-blue-500" />
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="p-2 bg-white/80 hover:bg-white rounded-full shadow transition"
                  title="Delete"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
              )}
            </div>

            {/* Details */}
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">{cat.name}</h2>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{cat.description}</p>

              {/* View Button */}
              <button
                onClick={() => navigate(`/category/${cat._id}/datasets`)}
                className="mt-auto w-full font-semibold bg-gradient-to-r from-[#0099cc] to-[#00b4d8] text-white hover:from-[#00b4d8] hover:to-[#0099cc] px-4 py-2 rounded-lg text-sm shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewCategories;
