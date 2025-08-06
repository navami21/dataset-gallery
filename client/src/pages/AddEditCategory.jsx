


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";
import { toast } from "react-toastify";
import { UploadCloud } from "lucide-react";

const AddEditCategory = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(""); 
 const [isDragging, setIsDragging] = useState(false);
  
  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`/category/${id}`)
        .then((res) => {
          setFormData({
            name: res.data.name,
            description: res.data.description,
          });
          setPreviewUrl(res.data.imageUrl); 
        })
        .catch(() => toast.error("Failed to fetch category"));
    }
  }, [id]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
     setIsDragging(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    if (imageFile) {
      data.append("image", imageFile); 
    }

  
    try {
      if (id) {
        // Edit
        await axiosInstance.put(`/category/edit/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category updated");
      } else {
        // Add
        await axiosInstance.post("/category/add", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category added");
      }

      navigate("/admin/category");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Submission failed");
    }
  };

  useEffect(() => {
  if (formData.imageUrl && !previewUrl) {
    setPreviewUrl(formData.imageUrl); 
  }
}, [formData.imageUrl, previewUrl]);

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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
            rows={4}
            required
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Enter description"
          />
        </div>

        

          {/* Drag & Drop Zone */}
       <div>
  <label className="block font-semibold mb-1">Category Image</label>

  <div
    onDrop={handleImageDrop}
    onDragOver={handleDragOver}
    onDragLeave={() => setIsDragging(false)}
    onClick={() => document.getElementById("imageUploadInput").click()}
    className={`border-2 border-dashed rounded-lg p-6 cursor-pointer flex flex-col items-center justify-center text-center transition-all duration-200 ${
      isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-100"
    }`}
  >
    {previewUrl ? (
      <img
        src={
          previewUrl.startsWith("http") || previewUrl.startsWith("blob")
            ? previewUrl
            : `http://localhost:3000${previewUrl}`
        }
        alt="Preview"
        className="h-40 object-contain rounded-lg shadow-md"
      />
    ) : (
      <>
        <UploadCloud className="w-12 h-12 text-gray-400 mb-2" />
        <p className="text-gray-600">Drag & drop an image here or click to upload</p>
        <p className="text-xs text-gray-400 mt-1">Accepted: JPG, PNG, JPEG,WEBP</p>
      </>
    )}
  </div>

  <input
    type="file"
    accept="image/jpeg,image/jpg,image/png"
    id="imageUploadInput"
    onChange={handleImageSelect}
    className="hidden"
  />
</div>


        <div className="flex justify-end gap-3">
  <button
    type="button"
    onClick={() => navigate("/admin/category")}
    className="bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-lg hover:bg-gray-400"
  >
    Cancel
  </button>

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
