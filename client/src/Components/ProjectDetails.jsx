import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdComment } from "react-icons/md";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userRole, setUserRole] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [likesList, setLikesList] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
const [showLikesPanel, setShowLikesPanel] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const token = localStorage.getItem("logintoken");
  const userName = localStorage.getItem("name") || localStorage.getItem("email");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project
        const res = await axiosInstance.get(`/projects/${id}`, { headers: { token } });
        setProjectData(res.data.project);
        setUserRole(res.data.role);

        // Likes
        if (res.data.role === "admin") {
          const likesRes = await axiosInstance.get(`/likes/project/${id}`, { headers: { token } });
          setLikes(likesRes.data.totalLikes);
          setLikesList(likesRes.data.likedBy);
        } else {
          const likesStatus = await axiosInstance.get(`/likes/project/${id}/status`, { headers: { token } });
          setIsLiked(likesStatus.data.liked);
          setLikes(likesStatus.data.totalLikes);
        }

        // Comments
        const commentRes = await axiosInstance.get(`/comments/project/${id}`, { headers: { token } });
        setComments(commentRes.data);

      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleLike = async () => {
    try {
      const res = await axiosInstance.post(`/likes/project/${id}`, {}, { headers: { token } });
      setIsLiked(res.data.liked);
      setLikes(res.data.totalLikes);
    } catch (err) {
      console.error("Like toggle error:", err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      await axiosInstance.post(`/comments/project/${id}`, { comment: commentText }, { headers: { token } });
      setCommentText("");
      const updatedComments = await axiosInstance.get(`/comments/project/${id}`, { headers: { token } });
      setComments(updatedComments.data);
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.image.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === project.image.length - 1 ? 0 : prev + 1
    );
  };

  if (loading)
    return <p className="text-gray-600 text-center mt-10 animate-pulse">Loading...</p>;
  if (!projectData)
    return <p className="text-red-500 text-center mt-10">Failed to load project.</p>;

  const { project } = { project: projectData };
  const imageArray = Array.isArray(project.image) ? project.image : [project.image].filter(Boolean);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const displayedImage = imageArray.length > 0
    ? `${baseUrl}${imageArray[currentImageIndex]}`
    : null;

return (
  <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e0f7fa] py-10 px-4">
    {/* Back Button */}
    <button
      onClick={() => navigate(-1)}
      className="fixed top-16 sm:top-4 left-4 z-50 p-2 rounded-full bg-[#0099cc] hover:bg-[#5EABD6] text-white shadow-lg transition duration-300"
    >
      <ArrowLeft size={24} />
    </button>

    {/* Page Heading */}
    <h1 className="text-4xl font-bold text-center text-[#004d61] mb-10 tracking-tight">
      Project Details
    </h1>

    {/* Main Card */}
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-10">

      {/* Image Section */}
      <div className="relative w-full h-64 lg:h-full rounded-xl overflow-hidden">
        {imageArray.length > 0 ? (
          <>
            <img
              src={displayedImage}
              alt="Project Visual"
              className="w-full h-full object-contain transition duration-500"
            />
            {imageArray.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
            No image available
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="flex flex-col justify-between space-y-6">
        {/* Title + Admin Controls */}
        <div className="flex justify-between items-start">
          <h2 className="text-3xl font-semibold text-gray-800">{project.title}</h2>
          {userRole === "admin" && (
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/admin/edit-project/${id}`)}
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                title="Edit Project"
              >
                <FaEdit />
              </button>
              <button
                onClick={async () => {
                  if (window.confirm("Are you sure you want to delete this project?")) {
                    try {
                      await axiosInstance.delete(`/projects/${id}`, { headers: { token } });
                      navigate(-1);
                    } catch (err) {
                      console.error("Delete error:", err);
                    }
                  }
                }}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                title="Delete Project"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed">{project.description}</p>

        {/* Dataset Info */}
        <div className="text-sm text-gray-700">
          <span className="font-medium">Dataset:</span>{" "}
          {project.dataset?.title ? (
            <span className="inline-block bg-[#00b4d8] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm ml-2">
              {project.dataset.title}
            </span>
          ) : (
            <span className="text-gray-400 ml-2">Not linked</span>
          )}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-3 text-xs mt-3">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium hover:underline"
            >
              🔗 GitHub Repository
            </a>
          )}
          {project.report && (() => {
            const fileUrl = `${baseUrl}${project.report}`;
            const ext = project.report.split(".").pop().toLowerCase();
            if (ext === "pdf") {
              return (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 font-medium hover:underline"
                >
                  📄 View PDF Report
                </a>
              );
            } else if (["doc", "docx"].includes(ext)) {
              return (
                <a
                  href={fileUrl}
                  download
                  className="text-green-600 font-medium hover:underline"
                >
                  📄 Download Word Report
                </a>
              );
            }
          })()}
        </div>

        {/* Likes & Comments */}
        <div className="border-t pt-4">
          {userRole !== "admin" ? (
            <div className="flex gap-6 items-center">
              <motion.button
                onClick={handleLike}
                whileTap={{ scale: 1.3 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`flex items-center gap-2 font-semibold ${isLiked ? "text-red-600" : "text-gray-500"}`}
                title={isLiked ? "Unlike" : "Like"}
              >
                <FaHeart className="text-xl" />
                <span>{likes}</span>
              </motion.button>

              <button
                onClick={() => setShowComments((prev) => !prev)}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-semibold"
              >
                <MdComment className="text-xl" />
                {comments.length} Comments
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              {/* <div>
                <h3 className="font-semibold mb-1">👍 Likes ({likes})</h3>
                <ul className="list-disc pl-4 text-gray-600 max-h-28 overflow-y-auto text-xs">
                  {likesList.map((like, index) => (
                    <li key={index}>
                      {like.name} ({like.email})
                    </li>
                  ))}
                </ul>
              </div> */}
  <div className="flex items-center justify-between mb-2">
    <h3 className="font-semibold text-gray-800">
      👍 Likes <span className="text-blue-600">({likes})</span>
    </h3>
    <button
      onClick={() => setShowLikesPanel((prev) => !prev)}
      className="text-sm px-3 py-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
    >
      {showLikesPanel ? "Hide Likes" : "View Likes"}
    </button>
  </div>

  {showLikesPanel && (
    <ul className="list-disc pl-4 text-gray-700 max-h-28 overflow-y-auto text-sm mt-2 space-y-1">
      {likesList.length > 0 ? (
        likesList.map((like, index) => (
          <li key={index}>
            <span className="font-medium">{like.name}</span>{" "}
            <span className="text-gray-500 text-xs">({like.email})</span>
          </li>
        ))
      ) : (
        <li className="text-gray-400 italic">No likes yet.</li>
      )}
    </ul>
  )}

              <div>
                <h3 className="font-semibold mb-1">💬 Comments ({comments.length})</h3>
                <ul className="space-y-2 max-h-40 overflow-y-auto text-xs">
                  {comments.map((c, i) => (
                    <li key={i} className="bg-gray-100 p-2 rounded">
                      <strong>{c.user?.name || c.user?.email}:</strong> {c.comment}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Comment Section for Users */}
    {userRole !== "admin" && showComments && (
      <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-md">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099cc]"
          rows={3}
        />
        <button
          onClick={handleComment}
          className="mt-3 bg-[#0099cc] hover:bg-[#007ea7] text-white px-5 py-2 rounded-lg transition duration-300"
        >
          Post Comment
        </button>

        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3">💬 Comments</h3>
          <div className="space-y-3">
            {comments.map((c, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm text-gray-700">{c.comment}</p>
                <p className="text-xs text-gray-500 mt-1">
                  — {c.user?.name || c.user?.email}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);

 
};

export default ProjectDetails;
