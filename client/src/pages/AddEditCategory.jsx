import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";
import { toast } from "react-toastify";

const AddEditCategory = () => {
  const { id } = useParams(); // If present, it's an edit
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`/category/all`)
        .then((res) => {
          const match = res.data.find((cat) => cat._id === id);
          if (match) setFormData(match);
          else toast.error("Category not found");
        })
        .catch(() => toast.error("Failed to fetch category"));
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Edit mode
        await axiosInstance.put(`/category/edit/${id}`, formData);
        toast.success("Category updated");
      } else {
        // Add mode
        await axiosInstance.post("/category/add", formData);
        toast.success("Category added");
      }
      navigate("/admin/category");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {id ? "Edit Category" : "Add New Category"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Category Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Enter category name"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Enter description"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Paste image URL"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#0099cc] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#007aab]"
          >
            {id ? "Update" : "Add"} Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditCategory;
