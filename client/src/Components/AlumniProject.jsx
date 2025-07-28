// // src/pages/AlumniProjects.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../axiosinterceptor";
import AlumniProjectCard from "../Components/AlumniProjectCard";

const AlumniProjects = () => {
  const [projects, setProjects] = useState([]);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [searchParams] = useSearchParams();

  const datasetId = searchParams.get("dataset"); // get optional dataset ID

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const url = datasetId
          ? `/projects?dataset=${datasetId}`
          : "/projects";

        const { data } = await axios.get(url, {
          headers: { token: localStorage.getItem("logintoken") },
        });

        setProjects(data);

        for (const project of data) {
          fetchLikes(project._id);
          fetchComments(project._id);
        }
      } catch (err) {
        console.error("Error fetching alumni projects:", err);
      }
    };

    const fetchLikes = async (projectId) => {
      try {
        const { data } = await axios.get(`/admin/like/${projectId}`);
        setLikes((prev) => ({ ...prev, [projectId]: data.totalLikes }));
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    const fetchComments = async (projectId) => {
      try {
        const { data } = await axios.get(`/admin/comment/${projectId}`);
        setComments((prev) => ({ ...prev, [projectId]: data.totalComments }));
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchProjects();
  }, [datasetId]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Alumni Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <AlumniProjectCard
            key={project._id}
            project={project}
            totalLikes={likes[project._id]}
            totalComments={comments[project._id]}
          />
        ))}
      </div>
    </div>
  );
};

export default AlumniProjects;
