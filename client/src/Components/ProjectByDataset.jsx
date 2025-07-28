// src/pages/ProjectByDataset.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";

const ProjectByDataset = () => {
  const { id } = useParams();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get(`/projects/dataset/${id}`, {
          headers: { token: localStorage.getItem("logintoken") },
        });
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Alumni Projects</h1>
      {projects.length === 0 ? (
        <p className="text-gray-600">No projects found for this dataset.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white p-4 rounded shadow">
              {project.image && (
                <img
                  src={`http://localhost:3000${project.image}`}
                  alt={project.title}
                  className="h-40 w-full object-cover rounded mb-3"
                />
              )}
              <h2 className="text-xl font-bold">{project.title}</h2>
              <p className="text-gray-700">{project.description}</p>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline block mt-2"
                >
                  View Project
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectByDataset;
