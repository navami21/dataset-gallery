// import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";
import {
  FaFileCsv,
  FaRulerCombined,
  FaEdit,
  FaTrash,
  FaDownload,
  FaHeart,
  FaCommentDots,
} from "react-icons/fa";
import {  FaRegHeart } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useEffect } from "react";
import { useState } from "react";

const DatasetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataset, setDataset] = useState(null);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userRole, setUserRole] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
const [showCommentList, setShowCommentList] = useState(false);
const [popupMessage, setPopupMessage] = useState("");
const [showPopup, setShowPopup] = useState(false);
const [isLiked, setIsLiked] = useState(false);



  const token = localStorage.getItem("logintoken");

  useEffect(() => {
    const fetchDatasetAndEngagement = async () => {
      try {
        const [datasetRes, likeRes, commentRes] = await Promise.all([
          axiosInstance.get(`/datasets/${id}`, { headers: { token } }),
          axiosInstance.get(`/likes/${id}`, { headers: { token } }),
          axiosInstance.get(`/comments/${id}`, { headers: { token } }),
        ]);

        setDataset(datasetRes.data);
        setLikes(likeRes.data);
        setComments(commentRes.data);
        setUserRole(localStorage.getItem("role"));
        // ✅ Log activity
       const userId = localStorage.getItem("userId");
      const likedByUser = likeRes.data.some(like => like.user?._id === userId);
      setIsLiked(likedByUser);

      await axiosInstance.post("/activity/addAccessedContent", {
        action: "viewed",
        datasetId: id,
      });
    } catch (err) {
      console.error("Error fetching dataset or engagement data:", err);
    }
  };
    fetchDatasetAndEngagement();
    
  }, [id]);

 const handleLike = async () => {
  try {
    await axiosInstance.post(`/likes/${id}`, {}, { headers: { token } });
    const updated = await axiosInstance.get(`/likes/${id}`, { headers: { token } });
    setLikes(updated.data);

    // Toggle isLiked
    const userId = localStorage.getItem("userId");
    const likedByUser = updated.data.some(like => like.user?._id === userId);
    setIsLiked(likedByUser);

  } catch (err) {
    console.error(err);
    setPopupMessage("Something went wrong while liking/unliking.");
    setShowPopup(true);
  }
};

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axiosInstance.post(
  `/comments/${id}`,
  { comment: newComment }, // backend expects `comment`, not `content`

);
const updated = await axiosInstance.get(`/comments/${id}`, { headers: { token } });

      setComments(updated.data);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err.response?.data?.message || err.message);
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
    // Log the download activity
    await axiosInstance.post("/activity/addAccessedContent", {
      action: "viewed",
      datasetId: id,
       user: localStorage.getItem("userId"),
    });

    // Trigger download
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

  if (!dataset) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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
{showPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 text-center w-[300px]">
      <p className="text-gray-800 mb-4">{popupMessage}</p>
      <button
        onClick={() => setShowPopup(false)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        OK
      </button>
    </div>
  </div>
)}


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
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center text-red-600 gap-1 font-semibold">
                <FaHeart />
                {likes.length} Likes
              </span>
             <span
  onClick={() => setShowCommentList(prev => !prev)}
  className="flex items-center text-blue-600 gap-1 font-semibold cursor-pointer"
  title="Show/Hide Comments"
>
  <FaCommentDots />
  {comments.length} Comments
</span>

            </div>
            {/* {userRole === "user" && (
  <div className="flex items-center gap-4">
    <button
      onClick={handleLike}
      className="text-red-600 hover:text-red-700 flex items-center gap-1"
      title="Like"
    >
      <FaHeart className="text-xl" />
    </button>
    <button
      onClick={() => setShowCommentBox(!showCommentBox)}
      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
      title="Comment"
    >
      <FaCommentDots className="text-xl" />
    </button>
  </div>
)} */}
{userRole === "user" && (
  <div className="flex items-center gap-4">
    <button
      onClick={handleLike}
      className={`flex items-center gap-1 ${isLiked ? "text-red-600" : "text-gray-500"} hover:text-red-700`}
      title={isLiked ? "Unlike" : "Like"}
    >
      {isLiked ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
    </button>
    <button
      onClick={() => setShowCommentBox(!showCommentBox)}
      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
      title="Comment"
    >
      <FaCommentDots className="text-xl" />
    </button>
  </div>
)}

{showCommentBox && (
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
{/* {userRole !== "admin" && (
  <div className="mt-6">
    <h3 className="font-semibold text-lg mb-2">Comments</h3>
    {comments.map((comment) => (
      <div key={comment._id} className="bg-gray-100 p-3 mb-2 rounded">
        <p>{comment.comment}</p>
        <p className="text-sm text-gray-600 mt-1">— {comment.user?.email}</p>

      </div>
    ))}
  </div>
)} */}

{userRole !== "admin" && showCommentList && (
  <div className="mt-6">
    <h3 className="font-semibold text-lg mb-2">Comments</h3>
    {comments.map((comment) => (
      <div key={comment._id} className="bg-gray-100 p-3 mb-2 rounded">
        <p>{comment.comment}</p>
        <p className="text-sm text-gray-600 mt-1">— {comment.user?.name || comment.user?.email}</p>

      </div>
    ))}
  </div>
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

          {/* {dataset.csvUrl ? (
            <a
              href={`http://localhost:3000${dataset.csvUrl}`}
              download
              className="flex items-center gap-2 mt-4 text-green-600 hover:text-green-700 font-medium"
            >
              <FaDownload />
              Download CSV
            </a>
          ) : (
            <p className="text-red-500 mt-4">CSV file not available</p>
          )} */}
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
