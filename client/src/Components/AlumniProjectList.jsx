import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";
import { FaArrowRight, FaSearch,FaPlusCircle } from "react-icons/fa";

const AlumniProjectsList = () => {
  const [alumniProjects, setAlumniProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/projects")
      .then((res) => {
        setAlumniProjects(res.data);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
      });
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/projects/${id}`);
  };

  // Filter projects based on search
  const filteredProjects = alumniProjects.filter((project) =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Alumni Projects
      </h1> */}
       <div className="flex flex-col items-center sm:flex-row justify-between  mb-6 gap-4">
    <h1 className="text-3xl font-bold text-gray-800 text-center">
      Alumni Projects
    </h1>

    <button
      onClick={() => navigate("/admin/projects/add")}
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0099cc] hover:bg-[#007aab] rounded-lg shadow-md transition w-full sm:w-auto"
    >
      <FaPlusCircle className="text-white" />
      Add Project
    </button>
  </div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-8">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
        />
      </div>
<div className="flex flex-wrap justify-center gap-8">

        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
           <div
  key={project._id}
  className="w-full max-w-xs bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
>

              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                {project.image && project.image.length > 0 ? (
                  <img
                    src={`http://localhost:3000${project.image[0]}`}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              {/* Project Details */}
              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-3">
                  {project.title}
                </h2>
                <p className="text-gray-500 text-sm line-clamp-3 mt-2">
                  {project.description || "No description available."}
                </p>

                <button
                  onClick={() => handleViewDetails(project._id)}
                  className="mt-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#00b4d8] to-[#0096c7] text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all w-full sm:w-auto text-sm"
                >
                  View Details
                  <FaArrowRight size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No projects found.
          </p>
        )}
      </div>
    </div>
  );
};

export default AlumniProjectsList;
