import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/AxiosInstance";
import { motion } from "framer-motion";

const fetchCommentDetail = async (id: string | undefined) => {
  return await axios.get(`/comments/${id}`);
};

const updateComment = async (id: string | undefined, body: any) => {
  return await axios.put(`/comments/${id}`, { body });
};

const deleteComment = async (id: string | undefined) => {
  return await axios.delete(`/comments/${id}`);
};

const CommentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["commentDetail", id],
    queryFn: () => fetchCommentDetail(id),
  });
  
  const comment = data?.data;
  const [body, setBody] = useState(comment?.body || "");

  const updateMutation = useMutation({
    mutationFn: (data: string) => updateComment(id, data),
    onSuccess: () => navigate(`/comments/${id}`),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteComment(id),
    onSuccess: () => navigate("/comments", { replace: true }),
  });

  useEffect(() => {
    if (updateMutation.isSuccess) {
      navigate("/comments", { replace: true });
    }
  }, [updateMutation.isSuccess]);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.6 } }}
    >
      <motion.div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl text-center border border-gray-300" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Edit Comment</h1>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full p-3 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        <div className="flex justify-center gap-4 mt-4">
          <motion.button
            onClick={() => updateMutation.mutate(body)}
            className="bg-green-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            💾 Save
          </motion.button>
          <motion.button
            onClick={() => {
              if (confirm("Are you sure you want to delete this comment?")) {
                deleteMutation.mutate();
              }
            }}
            className="bg-red-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-600 transition-transform transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ❌ Delete
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CommentEdit;
