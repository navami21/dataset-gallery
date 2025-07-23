import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";
import { toast } from "react-toastify";

const ViewCategories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">All Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white shadow-md rounded-xl overflow-hidden p-4 border border-gray-200 flex flex-col justify-between"
          >
            <div>
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h2 className="text-lg font-bold text-black">{cat.name}</h2>
              <p className="text-sm text-gray-600 mb-3">{cat.description}</p>
            </div>

            <div className="mt-auto flex flex-col gap-2">
              <button
              onClick={() => navigate(`/admin/category/${cat._id}/datasets`)}
                className="text-white font-bold bg-[#0099cc] hover:bg-[#5EABD6]  hover:text-black px-3 py-1 rounded-md text-sm"
              >
                View
              </button>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => navigate(`/admin/category/edit/${cat._id}`)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Edit"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewCategories;
