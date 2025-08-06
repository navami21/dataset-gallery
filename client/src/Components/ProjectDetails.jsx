
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";
import { FaArrowLeft, FaHeart, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdComment } from "react-icons/md";
import { motion } from "framer-motion";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [userRole, setUserRole] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const token = localStorage.getItem("logintoken");
  const userName = localStorage.getItem("name") || localStorage.getItem("email");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axiosInstance.get(`/projects/${id}`, {
          headers: { token }
        });
        setProjectData(res.data);
        setUserRole(res.data.role);

        const likedByUser = res.data.likes?.some(
          (like) => like.userEmail === localStorage.getItem("email")
        );
        setIsLiked(likedByUser);
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, token]);

  const handleLike = async () => {
    try {
      const res = await axiosInstance.post(`/projects/${id}/like`, {}, { headers: { token } });
      setIsLiked(res.data.liked);
      setProjectData((prev) => ({
        ...prev,
        likes: res.data.liked
          ? [...prev.likes, { userEmail: localStorage.getItem("email") }]
          : prev.likes.filter((like) => like.userEmail !== localStorage.getItem("email"))
      }));
    } catch (err) {
      console.error("Like toggle error:", err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    const tempComment = {
      text: commentText,
      user: { name: userName },
      _id: Date.now()
    };

    setProjectData((prev) => ({
      ...prev,
      comments: [tempComment, ...prev.comments]
    }));
    setCommentText("");

    try {
      await axiosInstance.post(`/projects/${id}/comment`, { comment: commentText }, { headers: { token } });
      const updated = await axiosInstance.get(`/projects/${id}`, { headers: { token } });
      setProjectData(updated.data);
    } catch (err) {
      console.error("Comment error:", err);
      setProjectData((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== tempComment._id)
      }));
    }
  };

  const handleEdit = () => navigate(`/admin/edit-project/${id}`);
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await axiosInstance.delete(`/projects/${id}`, { headers: { token } });
      navigate("/admin/projects");
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

  const { project, likes, comments } = projectData;

  // Ensure images are always an array
  const imageArray = Array.isArray(project.image) ? project.image : [project.image].filter(Boolean);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const displayedImage = imageArray.length > 0
    ? `${baseUrl}${imageArray[currentImageIndex]}`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      {/* Back button */}
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#0099cc] to-[#00b4d8] hover:from-[#00b4d8] hover:to-[#0099cc] text-white px-5 py-2 rounded-lg shadow-lg transition-all duration-300"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      {/* Card */}
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-8 space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center">{project.title}</h2>

          {/* Image Carousel */}
          {imageArray.length > 0 && (
            <div className="relative w-full h-72 overflow-hidden rounded-xl border border-gray-200 shadow">
              <img
                src={displayedImage}
                alt="Project Visual"
                className="w-full h-full object-cover transition-transform duration-500"
              />
              {imageArray.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-4 text-gray-800 leading-relaxed">
            <p className="text-lg">{project.description}</p>
            <p className="text-md flex items-center gap-2">
  <strong>Dataset:</strong>
  {project.dataset?.title ? (
    <span className="bg-gradient-to-r from-[#0099cc] to-[#00b4d8] text-white px-3 py-1 rounded-full text-sm font-medium shadow">
      {project.dataset.title}
    </span>
  ) : (
    <span className="text-gray-500">Not linked</span>
  )}
</p>

            <div className="flex flex-wrap gap-4">
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

          {/* Likes/Comments Section */}
          {userRole === "admin" ? (
            <>
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
                      <strong>{c.user?.name || c.user?.email || "User"}:</strong> {c.text}
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
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center gap-6">
                  <motion.button
                    onClick={handleLike}
                    whileTap={{ scale: 1.3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center gap-2 font-semibold text-red-600"
                    title={isLiked ? "Unlike" : "Like"}
                  >
                    <FaHeart className="text-xl" />
                    <span>{likes?.length || 0}</span>
                  </motion.button>

                  <button
                    onClick={() => setShowComments((prev) => !prev)}
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
                      <h3 className="text-xl font-semibold mb-2">💬 Comments</h3>
                      {comments?.map((c, i) => (
                        <div key={i} className="bg-gray-100 p-3 rounded">
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
