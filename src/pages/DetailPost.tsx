import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/AxiosInstance";
import { motion } from "framer-motion";

const fetchPostDetail = async (id: string | undefined) => {
  return await axios.get(`/posts/${id}`);
};

const updatePost = async (id: string | undefined, body: any) => {
  return await axios.put(`/post/${id}`, body);
};

const deletePost = async (id: string | undefined) => {
  return await axios.delete(`/post/${id}`);
};

const PostEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["postDetail", id],
    queryFn: () => fetchPostDetail(id),
  });

  const post = data?.data;
  const [title, setTitle] = useState(post?.title || "");
  const [body, setBody] = useState(post?.body || "");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
    }
  }, [post]);

  const updateMutation = useMutation({
    mutationFn: () => updatePost(id, { title, body }),
    onSuccess: () => navigate(`/post/${id}`),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(id),
    onSuccess: () => navigate("/posts", { replace: true }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold text-gray-700">Loading post details...</h2>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-indigo-500 to-pink-500 p-6 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.6 } }}
    >
      <motion.div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl text-center border border-gray-300" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Edit Post</h1>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full p-3 mt-4 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={4}
        />
        <div className="flex justify-center gap-4 mt-4">
          <motion.button
            onClick={() => updateMutation.mutate()}
            className="bg-green-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            💾 Save
          </motion.button>
          <motion.button
            onClick={() => {
              if (confirm("Are you sure you want to delete this post?")) {
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

export default PostEdit;
