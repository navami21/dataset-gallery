

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../axiosinterceptor';
import { Link } from "react-router-dom";


const UserDashboard = () => {
  const [categories, setCategories] = useState([]);

  // Fetch categories from backend
  useEffect(() => {
     const token = localStorage.getItem("logintoken");
  if (!token) return;
    const fetchCategories = async () => {
      try {
        // const res = await axios.get("http://localhost:5000/api/category/all", {
        //   headers: {
        //     Authorization: Bearer ${localStorage.getItem("token")}
        //   }
        // });
        const res = await axiosInstance.get("/category/all", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("logintoken")}`
  }
});
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-white min-h-screen px-4 sm:px-6 py-6">
      {/* Banner */}
      <div className="relative rounded-lg overflow-hidden max-w-screen-xl mx-auto">
        <img
          src="/assets/image.png"
          alt="Banner"
          className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Info Cards */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-screen-xl mx-auto">
        {[
          { title: 'Discover', icon: 'https://img.icons8.com/ios/50/search--v1.png' },
          { title: 'Practice', icon: 'https://img.icons8.com/ios/50/maintenance--v1.png' },
          { title: 'Grow', icon: 'https://img.icons8.com/ios/50/combo-chart--v1.png' },
        ].map((item, index) => (
          <div
            key={index}
            className="border p-6 rounded-md shadow-sm hover:shadow-lg transition text-center"
          >
            <img src={item.icon} alt={item.title} className="mx-auto mb-4 h-12 w-12" />
            <p className="font-medium text-lg">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Dynamic Categories */}
      <div className="mt-16 text-center max-w-screen-xl mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold mb-8">Explore Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category._id}
              className="rounded-md shadow-md p-4 border hover:shadow-xl transition flex flex-col"
            >
              <img
                src={category.imageUrl || "/assets/default.png"}
                alt={category.name}
                className="w-full h-40 object-cover rounded"
              />
              <p className="text-lg font-semibold mt-4">{category.name}</p>
              <p className="text-gray-600 text-sm mt-1">{category.description}</p>
              {/* <button className="mt-3 bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600">
                View
              </button> */}
             <Link to={`/category/${category._id}/datasets`}

             className="mt-3 bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 text-center"
              >
             View
            </Link>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-6 gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;