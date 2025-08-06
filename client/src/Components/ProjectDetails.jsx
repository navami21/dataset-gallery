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
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 flex flex-col items-center">
      
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6"> Project Details</h1>

      {/* Back Button */}
      <div className="self-start mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-[#0099cc] hover:bg-[#5EABD6] text-white shadow-lg transition duration-300"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Card */}
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <div className="flex flex-col lg:flex-row">
          {/* Image Carousel */}
          <div className="lg:w-1/2 relative h-64 lg:h-auto">
            {imageArray.length > 0 && (
              <>
                <img
                  src={displayedImage}
                  alt="Project Visual"
                  className="w-full h-full object-cover"
                />
                {imageArray.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute top-1/2 left-3 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute top-1/2 right-3 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Details */}
          <div className="lg:w-1/2 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>

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
              
              <p className="text-gray-700 text-sm mb-3">{project.description}</p>

              <p className="text-sm flex items-center gap-2 mb-3">
                <strong>Dataset:</strong>
                {project.dataset?.title ? (
                  <span className="bg-gradient-to-r from-[#0099cc] to-[#00b4d8] text-white px-3 py-1 rounded-full text-xs font-medium shadow">
                    {project.dataset.title}
                  </span>
                ) : (
                  <span className="text-gray-500">Not linked</span>
                )}
              </p>

              <div className="flex flex-wrap gap-3">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:underline text-xs"
                  >
                    🔗 GitHub Repository
                  </a>
                )}
                {project.report && (() => {
                  const backendUrl = "http://localhost:3000";
                  const fileUrl = `${backendUrl}${project.report}`;
                  const ext = project.report.split(".").pop().toLowerCase();

                  if (ext === "pdf") {
                    return (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 font-medium hover:underline text-xs"
                      >
                        📄 View PDF Report
                      </a>
                    );
                  } else if (["doc", "docx"].includes(ext)) {
                    return (
                      <a
                        href={fileUrl}
                        download
                        className="text-green-600 font-medium hover:underline text-xs"
                      >
                        📄 Download Word Report
                      </a>
                    );
                  }
                })()}
              </div>
            </div>

            {/* Likes & Comments */}
            <div className="pt-4 border-t border-gray-200">
              {userRole !== "admin" ? (
                <div className="flex items-center gap-6">
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
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-1">👍 Likes ({likes})</h3>
                    <ul className="list-disc pl-4 text-xs text-gray-700 space-y-1 max-h-32 overflow-y-auto">
                      {likesList.map((like, index) => (
                        <li key={index}>{like.name} ({like.email})</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1">💬 Comments ({comments.length})</h3>
                    <ul className="space-y-2 text-xs max-h-40 overflow-y-auto">
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

        {/* Comments section for non-admin */}
        {userRole !== "admin" && showComments && (
          <div className="p-6 border-t border-gray-200">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
            />
            <button
              onClick={handleComment}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Post Comment
            </button>

            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-semibold mb-2">💬 Comments</h3>
              {comments.map((c, i) => (
                <div key={i} className="bg-gray-100 p-3 rounded">
                  <p className="text-sm">{c.comment}</p>
                  <p className="text-xs text-gray-600 mt-1">— {c.user?.name || c.user?.email}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
