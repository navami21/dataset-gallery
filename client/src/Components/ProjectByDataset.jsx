import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";
import { ArrowLeft } from "lucide-react";

const ProjectsByDataset = () => {
  const { datasetId } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("logintoken");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get(`/projects/dataset/${datasetId}`, {
          headers: { token }
        });
        setProjects(res.data.projects);
      } catch (err) {
        console.error("Error fetching projects by dataset:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [datasetId]);

  if (loading) return <div className="text-center mt-10">Loading Projects...</div>;

  if (projects.length === 0) {
    return <div className="text-center mt-10 text-gray-600">No projects found for this dataset.</div>;
  }

  return (
    <div className="p-6">
      {/* Back Button */}
      
       <div className="self-start mb-4">
        <button
  onClick={() => navigate(-1)}
  className="fixed top-16 sm:top-4 left-4 z-50 p-2 rounded-full bg-[#0099cc] hover:bg-[#5EABD6] text-white shadow-lg transition duration-300"
>
  <ArrowLeft size={24} />
</button>

      </div>

      {/* Heading */}
      <h2 className="text-black text-center font-semibold text-2xl mb-6">
        Available Projects
      </h2>

      {/* Project Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
          >
            <img
              src={`http://localhost:3000${project.image}`}
              alt={project.title}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>

            <Link
              to={`/projects/${project._id}`}
              className="bg-[#0099cc] font-semibold text-white px-4 py-2 rounded hover:bg-[#00809D] transition inline-block mt-2"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsByDataset;
