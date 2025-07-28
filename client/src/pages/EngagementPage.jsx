// import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";
import { useEffect, useState } from "react";

const EngagementPage = () => {
  const { type, id } = useParams(); // type: "dataset" or "project"
  const navigate = useNavigate();
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchEngagement = async () => {
      try {
        const [likeRes, commentRes] = await Promise.all([
          axiosInstance.get(
            type === "dataset"
              ? `/admin/like/${id}`
              : `/admin/like/project/${id}`
          ),
          axiosInstance.get(
            type === "dataset"
              ? `/admin/comment/${id}`
              : `/admin/comment/project/${id}`
          ),
        ]);

        setLikes(likeRes.data.likedBy || []);
        setComments(commentRes.data.comments || []);

        console.log("TYPE:", type, "ID:", id);
      } catch (error) {
        console.error("Error fetching engagement data:", error);
      }
    };

    fetchEngagement();
  }, [type, id]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-semibold mb-6 capitalize">
        {type} Engagement Details
      </h1>

      {/* Likes Section */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          👍 Likes ({likes.length})
        </h2>
        {likes.length ? (
          <ul className="list-disc list-inside">
            {likes.map((like, i) => (
              <li key={i}>
                {like.user?.name ?? "Unknown"} ({like.user?.email ?? "N/A"})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No likes yet.</p>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          💬 Comments ({comments.length})
        </h2>
        {comments.length ? (
          <ul className="space-y-4">
            {comments.map((comment, i) => (
              <li key={i} className="border p-3 rounded bg-gray-50">
                <p>{comment.comment}</p>
                <p className="text-sm text-gray-500 mt-1">
                  — {comment.user?.name ?? "Unknown"} (
                  {comment.user?.email ?? "N/A"}) <br />
                  🕒 {new Date(comment.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default EngagementPage;
