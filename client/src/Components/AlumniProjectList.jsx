// import React from "react";
// import { useNavigate } from "react-router-dom";

// const AlumniProjectsList = ({ alumniProjects }) => {
//   const navigate = useNavigate();

//   const handleViewDetails = (id) => {
//     navigate(`/project/${id}`);
//   };

//   return (
//     <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
//       {alumniProjects.map((project) => (
//         <div
//           key={project._id}
//           className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
//         >
//           {project.images && project.images.length > 0 && (
//             <img
//               src={project.images[0]}
//               alt={project.title}
//               className="w-full h-48 object-cover"
//             />
//           )}
//           <div className="p-4">
//             <h2 className="text-lg font-semibold text-gray-800 mb-2">
//               {project.title}
//             </h2>
//             <button
//               onClick={() => handleViewDetails(project._id)}
//               className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
//             >
//               View Details
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AlumniProjectsList;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";

const AlumniProjectsList = () => {
  const [alumniProjects, setAlumniProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axiosInstance
      .get("/projects", {
        headers: { Authorization: `Bearer ${token}` },
      })
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Alumni Projects</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {alumniProjects.length > 0 ? (
          alumniProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
            >
              {project.images && project.images.length > 0 && (
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {project.title}
                </h2>
                <button
                  onClick={() => handleViewDetails(project._id)}
                  className="bg-[#0099cc] font-semibold text-white px-4 py-2 rounded hover:bg-[#00809D] transition"
                >
                  View Details
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
