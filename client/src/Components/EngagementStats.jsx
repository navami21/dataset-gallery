import React from "react";

const EngagementStats = ({ likes, comments, onClose }) => {
  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-gray-100 rounded shadow relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-600 hover:text-red-500 font-bold text-xl"
        title="Close"
      >
        ✕
      </button>

      <h2 className="text-2xl font-semibold mb-6">📊 Engagement Summary</h2>

      <div className="mb-6">
        <p className="text-gray-800 mb-1">
          👍 <span className="font-medium">Total Likes:</span> {likes.length}
        </p>
        <p className="text-gray-800">
          💬 <span className="font-medium">Total Comments:</span> {comments.length}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">👍 Likes</h3>
        {likes.length === 0 ? (
          <p className="text-gray-600">No likes yet.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1">
            {likes.map((user, i) => (
              <li key={i}>
                {user.name} ({user.email})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">💬 Comments</h3>
        {comments.length === 0 ? (
          <p className="text-gray-600">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment, i) => (
              <li
                key={i}
                className="bg-white p-3 rounded shadow border border-gray-200"
              >
                <p className="text-gray-800">{comment.content}</p>
                <p className="text-sm text-gray-500 mt-1">
                  — {comment.user.name} ({comment.user.email}) <br />
                  🕒 {new Date(comment.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EngagementStats;
