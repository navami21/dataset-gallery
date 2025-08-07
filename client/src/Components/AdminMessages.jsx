import { useEffect, useState } from "react";
import axiosInstance from "../axiosinterceptor";
import { FaReply, FaEnvelopeOpenText, FaSearch } from "react-icons/fa"; 

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axiosInstance.get("/contact").then(res => setMessages(res.data));
  }, []);

  const sendReply = async (id, hasUserId) => {
    if (!hasUserId) {
      alert("Cannot reply to guest users.");
      return;
    }
    if (!replyText.trim()) return;

    try {
      await axiosInstance.post(`/contact/reply/${id}`, { reply: replyText });
      setMessages(messages.map(m =>
        m._id === id ? { ...m, reply: replyText, status: "replied" } : m
      ));
      setReplyText("");
      setActiveReplyId(null);
    } catch (err) {
      console.error("Error sending reply:", err);
    }
  };

  // 🔍 Filter messages by email
  const filteredMessages = messages.filter(msg =>
    msg.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-black flex items-center gap-2">
        <FaEnvelopeOpenText className="text-black" size={26} />
        Contact Messages
      </h2>

      {/* 🔍 Search Bar */}
      <div className="mb-6 relative max-w-md">
        <FaSearch className="absolute left-3 top-3.5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by email..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099cc]"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredMessages.length === 0 ? (
        <p className="text-gray-500 text-center">No messages found.</p>
      ) : (
        filteredMessages.map(msg => (
          <div
            key={msg._id}
            className="bg-white rounded-xl shadow-md p-5 mb-5 border-l-4 border-[#0099cc] hover:shadow-lg transition-shadow duration-300"
          >
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800">{msg.name}</h3>
              <p className="text-sm text-gray-500">{msg.email}</p>
              <p className="mt-2 text-gray-700">{msg.message}</p>
            </div>

            {msg.reply ? (
              <p className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg mt-3">
                <strong>Reply:</strong> {msg.reply}
              </p>
            ) : msg.userId ? (
              activeReplyId === msg._id ? (
                <div className="mt-4">
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099cc]"
                    placeholder="Type your reply..."
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => sendReply(msg._id, true)}
                      className="bg-[#0099cc] text-white px-4 py-2 rounded-lg hover:bg-[#007da8] flex items-center gap-2"
                    >
                      <FaReply /> Send Reply
                    </button>
                    <button
                      onClick={() => {
                        setActiveReplyId(null);
                        setReplyText("");
                      }}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setActiveReplyId(msg._id)}
                  className="mt-3 bg-[#0099cc] text-white px-4 py-2 rounded-lg hover:bg-[#007da8] flex items-center gap-2"
                >
                  <FaReply /> Reply
                </button>
              )
            ) : (
              <p className="mt-3 text-sm text-gray-500 italic">
                <span className="font-medium text-red-500">Guest User:</span> Reply is not available.
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminMessages;
