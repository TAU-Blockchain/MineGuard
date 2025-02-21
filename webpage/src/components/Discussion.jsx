import { useState, useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";
import { apiService } from "../services/apiService";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { FaReply } from "react-icons/fa";

const Discussion = ({ contractAddress }) => {
  const { account } = useWeb3();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replyContent, setReplyContent] = useState("");
  const [activeDiscussion, setActiveDiscussion] = useState(null);

  useEffect(() => {
    if (contractAddress) {
      loadDiscussions();
    }
  }, [contractAddress, currentPage]);

  const loadDiscussions = async () => {
    try {
      setLoading(true);
      const result = await apiService.getDiscussions(
        contractAddress,
        currentPage
      );
      if (result) {
        setDiscussions(result.discussions);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error("Error loading discussions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    if (!newDiscussion.trim() || !account) return;

    try {
      setLoading(true);
      await apiService.createDiscussion({
        contractAddress,
        title: "Contract Discussion",
        content: newDiscussion,
        author: account,
      });
      setNewDiscussion("");
      loadDiscussions();
    } catch (error) {
      console.error("Error creating discussion:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (discussionId) => {
    if (!replyContent.trim() || !account) return;

    try {
      setLoading(true);
      await apiService.addReply(discussionId, {
        content: replyContent,
        author: account,
      });
      setReplyContent("");
      setActiveDiscussion(null);
      loadDiscussions();
    } catch (error) {
      console.error("Error adding reply:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (discussionId, voteType) => {
    if (!account) return;

    try {
      await apiService.voteDiscussion(discussionId, account, voteType);
      loadDiscussions();
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold mb-6 text-[#ED6A5A]">Discussions</h3>

      {/* New Discussion Form */}
      <form onSubmit={handleCreateDiscussion} className="mb-8">
        <textarea
          value={newDiscussion}
          onChange={(e) => setNewDiscussion(e.target.value)}
          placeholder="Start a new discussion..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#ED6A5A] focus:border-transparent"
          rows="3"
        />
        <button
          type="submit"
          disabled={!account || loading}
          className="mt-2 px-6 py-2 bg-[#ED6A5A] text-white rounded-lg hover:bg-[#e85a49] transition duration-300"
        >
          {loading ? "Sending..." : "Start Discussion"}
        </button>
      </form>

      {/* Discussion List */}
      <div className="space-y-6">
        {discussions.map((discussion) => (
          <div key={discussion._id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm">
                  by {formatAddress(discussion.author)} on{" "}
                  {formatDate(discussion.createdAt)}
                </p>
                <p className="mt-2">{discussion.content}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleVote(discussion._id, "upvote")}
                  className={`flex items-center ${
                    discussion.votes?.upvotes?.includes(account)
                      ? "text-green-500"
                      : "text-gray-500 hover:text-green-500"
                  }`}
                >
                  <BiUpvote className="text-xl" />
                  <span className="ml-1">
                    {discussion.votes?.upvotes?.length || 0}
                  </span>
                </button>
                <button
                  onClick={() => handleVote(discussion._id, "downvote")}
                  className={`flex items-center ${
                    discussion.votes?.downvotes?.includes(account)
                      ? "text-red-500"
                      : "text-gray-500 hover:text-red-500"
                  }`}
                >
                  <BiDownvote className="text-xl" />
                  <span className="ml-1">
                    {discussion.votes?.downvotes?.length || 0}
                  </span>
                </button>
              </div>
            </div>

            {/* Replies */}
            {discussion.replies?.length > 0 && (
              <div className="ml-8 mt-4 space-y-4">
                {discussion.replies.map((reply) => (
                  <div key={reply._id} className="border-l-2 pl-4">
                    <p className="text-gray-600 text-sm">
                      by {formatAddress(reply.author)} on{" "}
                      {formatDate(reply.createdAt)}
                    </p>
                    <p className="mt-1">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Form */}
            {activeDiscussion === discussion._id ? (
              <div className="mt-4 ml-8">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#ED6A5A] focus:border-transparent"
                  rows="2"
                />
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleAddReply(discussion._id)}
                    disabled={!account || loading}
                    className="px-4 py-1 bg-[#ED6A5A] text-white rounded-lg hover:bg-[#e85a49] transition duration-300"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => {
                      setActiveDiscussion(null);
                      setReplyContent("");
                    }}
                    className="px-4 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActiveDiscussion(discussion._id)}
                className="mt-4 flex items-center text-[#ED6A5A] hover:text-[#e85a49]"
              >
                <FaReply className="mr-1" />
                Reply
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === page
                  ? "bg-[#ED6A5A] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Discussion;
