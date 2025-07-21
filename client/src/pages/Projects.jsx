import React from "react";
import { FaThumbsUp, FaCommentAlt } from "react-icons/fa";

const projectData = [
  {
    id: 1,
    image: "/assets/project1.jpg", // replace with actual image path
  },
  {
    id: 2,
    image: "/assets/project2.png", // replace with actual image path
  },
];

const Projects = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-12">
      <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow p-6 md:p-10">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-8">
          PROJECTS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center items-center">
          {projectData.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-lg shadow-md overflow-hidden w-64 mx-auto"
            >
              <img
                src={proj.image}
                alt="Project"
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <button className="bg-sky-600 hover:bg-sky-700 text-white w-full py-2 rounded-md mb-3">
                  View
                </button>
                <div className="flex justify-around text-purple-600 text-xl">
                  <FaThumbsUp />
                  <FaCommentAlt />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
