import { useQuery } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

interface ProductData {
  products: Product[];
}

const fetchProductList = async () => {
  return await axios.get<ProductData>("/product");
};

const ProductSkeleton = () => {
  return (
    <motion.div
      className="group relative p-4 bg-white rounded-2xl shadow-lg animate-pulse"
    >
      <div className="h-48 w-full bg-gray-200 rounded-lg"></div>
      <div className="mt-4 h-4 bg-gray-300 w-3/4 rounded"></div>
      <div className="mt-2 h-3 bg-gray-300 w-1/2 rounded"></div>
    </motion.div>
  );
};

const Product = () => {
  const { data, isFetching } = useQuery({ queryKey: ["productList"], queryFn: fetchProductList });
  const navigate = useNavigate();

  return (
    <motion.div className="container mx-auto px-6 py-12 min-h-screen bg-gray-50">
      <motion.button
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl"
        onClick={() => navigate("./add")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        +
      </motion.button>

      <div className="bg-white p-8 rounded-xl shadow-md">
        <motion.h2
          className="text-4xl font-bold text-gray-900 text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Featured Products
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {isFetching ? (
            Array.from({ length: 8 }).map((_, index) => <ProductSkeleton key={index} />)
          ) : (
            data?.data.products.map((product) => (
              <motion.div
                key={product.id}
                className="relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition"
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                  <p className="mt-3 text-lg font-bold text-blue-600">${product.price}</p>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Product;