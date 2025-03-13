import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/AxiosInstance";
import { motion } from "framer-motion";

const fetchTodoDetail = async (id: string | undefined) => {
  const response = await axios.get(`/todos/${id}`);
  return response.data;
};

const updateTodo = async (id: string | undefined, updatedTodo: { todo: string; completed: boolean }) => {
  return await axios.put(`/todos/${id}`, updatedTodo);
};

const deleteTodo = async (id: string | undefined) => {
  return await axios.delete(`/todos/${id}`);
};

const TodoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: todo, isLoading, isError } = useQuery({
    queryKey: ["todoDetail", id],
    queryFn: () => fetchTodoDetail(id),
    enabled: !!id,
  });

  const [todoText, setTodoText] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (todo) {
      setTodoText(todo.todo);
      setCompleted(todo.completed);
    }
  }, [todo]);

  const updateMutation = useMutation({
    mutationFn: (updatedTodo: { todo: string; completed: boolean }) => updateTodo(id, updatedTodo),
    onSuccess: () => navigate(`/todos/${id}`),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTodo(id),
    onSuccess: () => navigate("/todos", { replace: true }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.p className="text-gray-700 text-xl" animate={{ opacity: [0, 1] }} transition={{ duration: 0.5 }}>
          Loading todo details...
        </motion.p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.p className="text-red-600 text-xl" animate={{ opacity: [0, 1] }} transition={{ duration: 0.5 }}>
          Error fetching todo details.
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-6 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.6 } }}
    >
      <motion.div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl text-center border border-gray-300" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
        <h1 className="text-2xl font-bold text-gray-800">Edit Todo</h1>
        <motion.input
          type="text"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          className="w-full p-3 mt-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          whileFocus={{ scale: 1.02 }}
        />
        <div className="mt-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-gray-800">Completed</span>
          </label>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <motion.button
            onClick={() => updateMutation.mutate({ todo: todoText, completed })}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            💾 Save
          </motion.button>
          <motion.button
            onClick={() => {
              if (confirm("Are you sure you want to delete this todo?")) {
                deleteMutation.mutate();
              }
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
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

export default TodoDetail;
