// src/Components/AlumniProjectCard.jsx
import React from "react";
import { FaHeart, FaComment } from "react-icons/fa";

const AlumniProjectCard = ({ project, totalLikes = 0, totalComments = 0 }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition duration-300">
      <h2 className="text-xl font-semibold text-blue-700 mb-2">{project.title}</h2>
      <p className="text-gray-600 mb-3">{project.description}</p>

      {project.videoLink && (
        <div className="mb-3">
          <iframe
            src={project.videoLink}
            title="Project Video"
            className="w-full h-48 rounded"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div className="flex justify-between text-gray-600 mt-4">
        <span className="flex items-center gap-1">
          <FaHeart className="text-red-500" /> {totalLikes}
        </span>
        <span className="flex items-center gap-1">
          <FaComment className="text-blue-500" /> {totalComments}
        </span>
      </div>
    </div>
  );
};

export default AlumniProjectCard;
