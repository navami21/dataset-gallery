import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";
import { motion } from "framer-motion";
import {
  FaFileCsv,
  FaRulerCombined,
  FaEdit,
  FaTrash,
  FaDownload,
  FaHeart,
  FaCommentDots
} from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useEffect, useState } from "react";

const DatasetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dataset, setDataset] = useState(null);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userRole, setUserRole] = useState("");
  const [showCommentList, setShowCommentList] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("logintoken");
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("name") || localStorage.getItem("email");

  // Fetch dataset, likes, comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const datasetRes = await axiosInstance.get(`/datasets/${id}`, { headers: { token } });
        setDataset(datasetRes.data);

        const role = localStorage.getItem("role");
        setUserRole(role);

        // Get like status + total likes
        const likeStatusRes = await axiosInstance.get(`/likes/dataset/${id}/status`, {
          headers: { token },
        });
        setIsLiked(likeStatusRes.data.liked);
        setLikes(Array(likeStatusRes.data.totalLikes).fill({}));

        // Get comments
        const commentRes = await axiosInstance.get(`/comments/${id}`, { headers: { token } });
        setComments(commentRes.data);

        // Track activity
        await axiosInstance.post("/activity/addAccessedContent", {
          action: "viewed",
          datasetId: id,
        });
      } catch (err) {
        console.error("Error fetching dataset or engagement data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  const handleLike = async () => {
    const prevLiked = isLiked;
    const prevLikes = likes.length;

    setIsLiked(!prevLiked);
    setLikes(prev => (!prevLiked ? [...prev, {}] : prev.slice(0, -1)));

    try {
      const res = await axiosInstance.post(`/likes/dataset/${id}`, {}, { headers: { token } });
      setIsLiked(res.data.liked);
      setLikes(Array(res.data.totalLikes).fill({}));

      if (res.data.liked !== prevLiked) {
        setPopupMessage(res.data.liked ? "You liked this dataset!" : "You unliked this dataset!");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 1500);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      setIsLiked(prevLiked);
      setLikes(Array(prevLikes).fill({}));
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const tempComment = {
      _id: Date.now(),
      comment: newComment,
      user: { _id: userId, name: userName },
    };
    setComments(prev => [tempComment, ...prev]);
    setNewComment("");

    try {
      await axiosInstance.post(`/comments/${id}`, { comment: newComment }, { headers: { token } });
      const updated = await axiosInstance.get(`/comments/${id}`, { headers: { token } });
      setComments(updated.data);
    } catch (err) {
      console.error("Error posting comment:", err.response?.data?.message || err.message);
      setComments(prev => prev.filter(c => c._id !== tempComment._id));
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this dataset?")) {
      try {
        await axiosInstance.delete(`/datasets/${id}`, { headers: { token } });
        navigate(`/admin/datasets`);
      } catch (error) {
        console.error("Error deleting dataset:", error);
      }
    }
  };

  const handleDownloadCSV = async () => {
    try {
      await axiosInstance.post("/activity/addAccessedContent", {
        action: "downloaded",
        datasetId: id,
        user: userId,
      });

      const link = document.createElement("a");
      link.href = `http://localhost:3000${dataset.csvUrl}`;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error logging CSV download:", err);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!dataset) return <div className="text-center mt-10 text-red-500">Dataset not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {showPopup && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {popupMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Section */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-semibold mb-4">{dataset.title}</h1>

          {dataset.imageUrl && (
            <img
              src={`http://localhost:3000${dataset.imageUrl}`}
              alt={dataset.title}
              className="rounded-lg w-full h-40 object-cover mb-4 shadow"
            />
          )}

          <h2 className="text-xl font-semibold mb-2">Dataset Overview</h2>
          <p className="text-gray-700 whitespace-pre-line">{dataset.description}</p>

          <div className="flex flex-wrap gap-4 mt-6">
            <Link
              to={`/datasets/${dataset._id}/projects`}
              className="bg-[#0099cc] font-semibold text-white px-4 py-2 rounded hover:bg-[#00809D] transition"
            >
              View Projects
            </Link>

            {userRole === "admin" && (
              <button
                onClick={() => navigate(`/admin/engagement/dataset/${dataset._id}`)}
                className="bg-[#0099cc] font-semibold text-white px-4 py-2 rounded hover:bg-[#00809D] transition"
              >
                View Engagement
              </button>
            )}
          </div>

          {/* Engagement Section */}
          <div className="mt-8">
            <div className="flex items-center gap-6 mb-4">
              {/* Likes */}
              {userRole === "user" ? (
                <motion.button
                  onClick={handleLike}
                  whileTap={{ scale: 1.3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`flex items-center gap-1 ${isLiked ? "text-red-600" : "text-black-500"}`}
                  title="Like"
                >
                  {isLiked ? (
                    <FaHeart className="text-xl" />
                  ) : (
                    <FaHeart
                      className="text-xl"
                      style={{
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: 9,
                      }}
                    />
                  )}
                  <span className="font-semibold">{likes.length}</span>
                </motion.button>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <FaHeart className="text-xl" />
                  <span className="font-semibold">{likes.length}</span>
                </div>
              )}

              {/* Comments */}
              <button
                onClick={() => setShowCommentList(prev => !prev)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                title="Comments"
              >
                <FaCommentDots className="text-xl" />
                <span className="font-semibold">{comments.length}</span>
              </button>
            </div>

            {showCommentList && (
  <>
    {userRole === "user" && (
      <div className="mt-4">
        <textarea
          className="w-full p-3 border border-gray-300 rounded"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Post Comment
        </button>
      </div>
    )}

    <div className="mt-6">
      <h3 className="font-semibold text-lg mb-2">Comments</h3>

      <div className="max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-gray-100 p-3 mb-2 rounded">
            <p>{comment.comment}</p>
            <p className="text-sm text-gray-600 mt-1">
              — {comment.user?.name || comment.user?.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  </>
)}

          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm self-start">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Summary</h3>

          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <FaFileCsv />
            <span>{dataset.fileType || "CSV File"}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <MdGridView />
            <span>{dataset.columns?.length || 0} Columns</span>
          </div>

          {dataset.size && (
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <FaRulerCombined />
              <span>{dataset.size}</span>
            </div>
          )}

          {dataset.csvUrl ? (
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 mt-4 text-green-600 hover:text-green-700 font-medium"
            >
              <FaDownload />
              Download CSV
            </button>
          ) : (
            <p className="text-red-500 mt-4">CSV file not available</p>
          )}

          {userRole === "admin" && (
            <div className="mt-6 space-y-2">
              <button
                onClick={() => navigate(`/admin/datasets/edit/${dataset._id}`)}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full justify-center"
              >
                <FaEdit />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full justify-center"
              >
                <FaTrash />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatasetDetails;
