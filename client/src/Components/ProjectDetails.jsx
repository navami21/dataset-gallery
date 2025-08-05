
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";
import {FaArrowLeft, FaHeart, FaEdit, FaTrash } from "react-icons/fa";
import { MdComment } from "react-icons/md";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [userRole, setUserRole] = useState(""); // Get from backend in real setup
const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axiosInstance.get(`/projects/${id}`);
        setProjectData(res.data);
        setUserRole(res.data.role); // Assuming role comes from response
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleLike = async () => {
  try {
    await axiosInstance.post(`/projects/${id}/like`);
    const updated = await axiosInstance.get(`/projects/${id}`);
    setProjectData(updated.data);  // Refresh like count
  } catch (err) {
    if (err.response?.status === 400) {
      alert("You've already liked this project.");
    } else {
      console.error("Like error:", err);
    }
  }
};

  const handleComment = async () => {
    try {
      if (!commentText.trim()) return;
      await axiosInstance.post(`/projects/${id}/comment`, { comment: commentText });
      setCommentText("");
      const res = await axiosInstance.get(`/projects/${id}`);
      setProjectData(res.data);
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const handleEdit = () => navigate(`/admin/edit-project/${id}`);
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this project?")) {
      await axiosInstance.delete(`/projects/${id}`);
      navigate("/admin/projects");
    }
  };

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (!projectData) return <p className="text-red-500 text-center mt-10">Failed to load project.</p>;

  const { project, likes, comments } = projectData;

  const imageUrl = typeof project.image === "string" && project.image.startsWith("http")
  ? project.image
  : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}${project.image ?? ""}`;



  return (
    <div className="min-h-screen bg-[#f9fafb] py-12 px-4">
        <div className="w-full max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-6">
          <button
  onClick={() => navigate(-1)}
  className="flex items-center text-blue-600 hover:underline mb-4"
>
  <FaArrowLeft className="mr-2" />
  Back
</button>

        <h2 className="text-4xl font-bold text-[#0A1A40] text-center">
          {project.title}
        </h2>

     <div className="w-full h-64 overflow-hidden rounded-xl border border-gray-200">
  <img
    src={imageUrl}
    alt="Project Visual"
    className="w-full h-full object-cover"
  />
</div>

        <div className="space-y-4 text-[#0A1A40]">
          <p className="text-lg">{project.description}</p>

          <p className="text-md">
            <strong>Dataset:</strong>{" "}
            {project.dataset?.title || (
              <span className="text-gray-500">Not linked</span>
            )}
          </p>

          <div className="space-x-4">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium hover:underline"
            >
              🔗 GitHub Repository
            </a>

            {project.report && (
              <a
                href={project.report}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 font-medium hover:underline"
              >
                📄 Project Report
              </a>
            )}
          </div>
        </div>

        {/* Actions: Like / Comment */}
        <div className="border-t pt-6 space-y-4">
          {userRole === "admin" ? (
            <>
              {/* Admin view likes/comments */}
              <div>
                <h3 className="text-xl font-semibold mb-2">👍 Likes ({likes?.length || 0})</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  {likes?.map((like, index) => (
                    <li key={index}>{like.userEmail || "User"}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">💬 Comments ({comments?.length || 0})</h3>

                <ul className="space-y-2 text-sm">
                  {comments?.map((c, i) => (
                    <li key={i} className="border-b py-1">
                      <strong>{c.userEmail || "User"}:</strong> {c.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </>
          ) : (
            <>
              {/* User view: like + comment */}
              <div className="border-t pt-6 space-y-4">
  <div className="flex items-center gap-6">
    <button
      onClick={handleLike}
      className="text-red-600 hover:text-red-700 flex items-center gap-2 font-semibold"
    >
      <FaHeart className="text-xl" />
      {likes?.length || 0} Likes
    </button>

   <button
  onClick={() => setShowComments(prev => !prev)}
  className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-semibold"
>
  <MdComment className="text-xl" />
  {comments?.length || 0} Comments
</button>

  </div>

  {showComments && (
    <div className="mt-4">
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write a comment..."
        className="w-full p-3 border border-gray-300 rounded"
        rows={3}
      />
      <button
        onClick={handleComment}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Post Comment
      </button>

      <div className="mt-4">
  <h3 className="text-xl font-semibold mb-2">💬 Comments</h3>
  {comments?.map((c, i) => (
    <div key={i} className="bg-gray-100 p-3 mb-2 rounded">
      <p>{c.text}</p>
      <p className="text-sm text-gray-600 mt-1">— {c.user?.name || c.user?.email}</p>
    </div>
  ))}
</div>

    </div>
  )}
</div>
        
    </>
          )}
        </div> 
      </div> 
    </div>
);
};

export default ProjectDetails;
