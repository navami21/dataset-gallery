import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosinterceptor";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("logintoken");
    if (!token) return;

    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/category/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="relative max-w-screen-xl mx-auto px-6 pt-10 text-center">
        <img
          src="/assets/image.png"
          alt="Banner"
          className="w-full max-h-[420px] object-cover rounded-2xl shadow-lg"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-8">
          Welcome to the Dataset Gallery
        </h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Discover, explore, and grow your skills with our curated collection of
          datasets and learning resources.
        </p>
      </div>

      {/* Feature Cards - Old Clean Design */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-screen-xl mx-auto px-6">
        {[
          {
            title: "Discover",
            icon: "https://img.icons8.com/ios/50/search--v1.png",
            desc: "Find high-quality datasets for your projects and research.",
          },
          {
            title: "Practice",
            icon: "https://img.icons8.com/ios/50/maintenance--v1.png",
            desc: "Sharpen your skills with practical data challenges.",
          },
          {
            title: "Grow",
            icon: "https://img.icons8.com/ios/50/combo-chart--v1.png",
            desc: "Advance your career by mastering real-world datasets.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-center group"
          >
            <img
              src={item.icon}
              alt={item.title}
              className="h-12 w-12 mx-auto mb-4"
            />
            <h3 className="mt-2 text-lg font-semibold text-gray-800">
              {item.title}
            </h3>
            <p className="text-gray-500 text-sm mt-2">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="mt-16 max-w-screen-xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Explore Categories
        </h2>
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <img
  src={
    category.imageUrl
      ? `http://localhost:3000${category.imageUrl}`
      : "/assets/default.png"
  }
  alt={category.name}
  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
/>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {category.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-3">
                    {category.description}
                  </p>
                  <Link
                    to={`/category/${category._id}/datasets`}
                    className="mt-4 bg-gradient-to-r from-[#0099cc] to-[#00b4d8] text-white py-2 px-4 rounded-md text-center hover:opacity-90 transition-all"
                  >
                    View Datasets
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No categories found.</p>
        )}
      </div>

      {/* Footer Dots */}
      <div className="flex justify-center mt-10 gap-2">
        <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
        <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
        <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
      </div>
    </div>
  );
};

export default UserDashboard;
