

import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinterceptor";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

const EngagementPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchEngagement = async () => {
      try {
        const [likeRes, commentRes] = await Promise.all([
          axiosInstance.get(
            type === "dataset"
              ? `/likes/${type}/${id}` 
              : `/likes/${type}/${id}` 
          ),
          axiosInstance.get(
            type === "dataset"
              ? `/comments/${id}`
              : `/comments/project/${id}`
          ),
        ]);

        // Ensure arrays even if undefined
        setLikes(likeRes.data.likedBy || []);
        setComments(commentRes.data.comments || commentRes.data || []);

      } catch (error) {
        console.error("Error fetching engagement data:", error);
      }
    };

    fetchEngagement();
  }, [type, id]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
     
       <div className="self-start mb-4">
<button
  onClick={() => navigate(-1)}
  className="fixed top-16 sm:top-4 left-4 z-50 p-2 rounded-full bg-[#0099cc] hover:bg-[#5EABD6] text-white shadow-lg transition duration-300"
>
  <ArrowLeft size={24} />
</button>

      </div>

      <h1 className="text-3xl font-semibold mb-6 capitalize">
        {type} Engagement Details
      </h1>

      {/* Likes Section */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          👍 Likes ({likes.length})
        </h2>
        {likes.length ? (
          <ul className="space-y-2">
            {likes.map((like, i) => (
              <li key={i} className="border p-3 rounded bg-gray-50">
                <p className="font-medium">
                  {like.name ?? like.user?.name ?? "Unknown"} (
                  {like.email ?? like.user?.email ?? "N/A"})
                </p>
                <p className="text-sm text-gray-500">
                  🕒 {like.createdAt ? new Date(like.createdAt).toLocaleString() : "No timestamp"}
                </p>
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
                  🕒 {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : "No timestamp"}
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
