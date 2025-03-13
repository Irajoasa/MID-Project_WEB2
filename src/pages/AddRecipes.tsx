import { useMutation } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface RecipeData {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string;
}

const addRecipe = async (data: RecipeData) => {
    return await axios.post("/recipes/add", data);
};

const AddRecipes = () => {
    const [formData, setFormData] = useState<RecipeData>({
        title: "",
        description: "",
        ingredients: [],
        instructions: "",
    });

    const [ingredientsText, setIngredientsText] = useState("");

    const { mutate, isSuccess, isPending } = useMutation({
        mutationFn: addRecipe,
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            navigate("/recipes", { replace: true });
        }
    }, [isSuccess, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const ingredientsArray = ingredientsText
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0);

        mutate({
            ...formData,
            ingredients: ingredientsArray
        });
    };

    return (
        <motion.div
            className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-300 to-blue-400" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.6 } }}
        >
            <motion.form
                onSubmit={handleSubmit}
                className="relative bg-white p-10 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-200" 
            >
                {isPending && (
                    <motion.div className="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center rounded-3xl">
                        <div className="flex items-center bg-white px-6 py-3 rounded-full shadow-md border border-gray-300">
                            <span className="text-lg text-gray-800 font-semibold">Adding Recipe...</span>
                        </div>
                    </motion.div>
                )}

                <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Add Your Recipe</h2>

                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">Recipe Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        rows={4}
                        required
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">Ingredients (one per line)</label>
                    <textarea
                        value={ingredientsText}
                        onChange={(e) => setIngredientsText(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        rows={6}
                        required
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-gray-700 font-medium mb-2">Instructions</label>
                    <textarea
                        value={formData.instructions}
                        onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        rows={6}
                        required
                    />
                </div>

                <motion.button
                    type="submit"
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg transition-all duration-300 font-semibold shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Submit Recipe
                </motion.button>
            </motion.form>
        </motion.div>
    );
};

export default AddRecipes;
