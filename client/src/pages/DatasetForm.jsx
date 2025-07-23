import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosinterceptor";
import { useParams, useNavigate } from "react-router-dom";
import { FaFileCsv, FaImage, FaFont, FaAlignLeft, FaList, FaRulerCombined } from "react-icons/fa";

const DatasetForm = () => {
  const { datasetId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    csv: null,
    columns: "",
    size: "",
    imageUrl: "",
    csvUrl: "",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axiosInstance.get("/category/all")
    
      .then((res) => setCategories(res.data))
      
      .catch((err) => console.error("Error loading categories:", err));
      console.log("Selected category ID:", formData.category);

  }, []);

  useEffect(() => {
    console.log("Dataset ID from params:", datasetId);
    if (datasetId) {
      axiosInstance.get(`/datasets/${datasetId}`, {
        headers: { token: localStorage.getItem("logintoken") }
      })
      .then((res) => {
        const { title, description, category, columns, size, imageUrl, csvUrl } = res.data;
        setFormData({
          title,
          description,
          category: res.data.category._id || "",
          columns: columns?.join(", ") || "",
          size: size || "",
          imageUrl: imageUrl || "",
          csvUrl: csvUrl || "",
          image: null,
          csv: null
        });
      })
      .catch((err) => console.error("Error fetching dataset:", err));
    }
  }, [datasetId]);
  

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (formData.image) data.append("image", formData.image);
    if (formData.csv) data.append("csv", formData.csv);
    if (formData.columns) {
      const columnsArray = formData.columns.split(",").map((col) => col.trim());
      data.append("columns", JSON.stringify(columnsArray));
    }
    if (formData.size) data.append("size", formData.size);

    try {
      if (datasetId) {
        await axiosInstance.put(`/datasets/edit/${datasetId}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("logintoken")}`,
          },
        });
      } else {
        await axiosInstance.post("/datasets/add", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setFormData({
          title: "",
          description: "",
          category: "",
          image: null,
          csv: null,
          columns: "",
          size: "",
          imageUrl: "",
          csvUrl: "",
        });
      }

      navigate("/admin/datasets");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-6 sm:px-10 bg-white rounded-xl shadow-lg mt-6">
  <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
    {datasetId ? "Edit Dataset" : "Add New Dataset"}
  </h2>

  <form onSubmit={handleSubmit} className="space-y-5">
    {/* Title */}
    <div className="relative">
      <FaFont className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Dataset Title"
        className="w-full pl-10 pr-3 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 text-sm"
        required
      />
    </div>

    {/* Description */}
    <div className="relative">
      <FaAlignLeft className="absolute left-3 top-3 text-gray-400" />
      <textarea
        name="description"
        rows={3}
        value={formData.description}
        onChange={handleChange}
        placeholder="Short description"
        className="w-full pl-10 pr-3 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 text-sm resize-y"
        required
      />
    </div>

    {/* Category */}
    <div className="relative">
      <FaList className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full pl-10 pr-10 py-2 border rounded-lg text-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 text-sm"
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>
    </div>

          {/* Cover image */}
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Cover Image
  </label>
  <div className="relative flex items-center">
    <label
      htmlFor="image"
      className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-200 transition text-sm"
    >
      <FaImage className="text-blue-600" />
      Choose Image
    </label>
    <input
      id="image"
      type="file"
      name="image"
      accept="image/*"
      onChange={handleChange}
      className="hidden"
    />
    <span className="ml-4 text-sm text-gray-600 truncate">
      {formData.image ? formData.image.name : formData.imageUrl && formData.imageUrl.split("/").pop()}
    </span>
  </div>

  {formData.imageUrl && !formData.image && (
    <img
      src={`http://localhost:3000${formData.imageUrl}`}
      alt="Preview"
      className="mt-3 w-40 h-24 object-cover rounded-lg border shadow"
    />
  )}
</div>

{/* CSV Upload */}
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    CSV File
  </label>
  <div className="relative flex items-center">
    <label
      htmlFor="csv"
      className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-green-200 transition text-sm"
    >
      <FaFileCsv className="text-green-600" />
      Choose CSV
    </label>
    <input
      id="csv"
      type="file"
      name="csv"
      accept=".csv"
      onChange={handleChange}
      className="hidden"
    />
    <span className="ml-4 text-sm text-gray-600 truncate">
      {formData.csv ? formData.csv.name : formData.csvUrl && formData.csvUrl.split("/").pop()}
    </span>
  </div>

  {formData.csvUrl && !formData.csv && (
    <p className="text-xs mt-2 text-blue-600 font-medium">
      Existing CSV:{" "}
      <a
        href={`http://localhost:3000${formData.csvUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        {formData.csvUrl.split("/").pop()}
      </a>
    </p>
  )}
</div>

    {/* Submit */}
    <button
      type="submit"
      className="w-full bg-[#0099cc] hover:bg-[#007aab] text-white font-semibold py-2.5 rounded-lg transition duration-300"
    >
      {datasetId ? "Update Dataset" : "Add Dataset"}
    </button>
  </form>
</div>

  );
};

export default DatasetForm;