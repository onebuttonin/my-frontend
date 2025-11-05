import React from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Ticker3 from "../Ticker3";

const fetchProducts = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {
    headers: { "Content-Type": "application/json" },
    withCredentials: false,
  });

  const allProducts = response.data;

  const notSoBasicProducts = allProducts
    .filter((product) => product.category?.toLowerCase() === "oversize tshirt")
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4);

  const minimalProducts = allProducts
    .filter((product) => product.category?.toLowerCase() === "tshirt")
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4);

  return [...notSoBasicProducts, ...minimalProducts];
};

export default function Homep() {
  const navigate = useNavigate();

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
  queryKey: ["filtered-products"],
  queryFn: fetchProducts,
  staleTime: 1000 * 60 * 10, // 10 minutes
  cacheTime: 1000 * 60 * 20, // Keep in cache even when not in use
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading popular picks...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-red-500">Failed to load products.</p>
      </div>
    );
  }

return (
  <div className="container mx-auto px-2 lg:px-10">
    {/* Preload hover images */}
    <div className="hidden">
      {products.map((product) => (
        <link
          key={`hover-${product.id}`}
          rel="preload"
          as="image"
          href={`${import.meta.env.VITE_BASE_URL}/storage/${product.hover_image}`}
        />
      ))}
    </div>

    {/* Title Section */}
     <div className="text-center px-4 py-3 mb-6">
       <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide uppercase">
         New Popular
       </h2>
     </div>

    {/* Product Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {products.map((product) => (
        <div
          key={product.id}
           className="relative flex flex-col border border-neutral-200"
        >
          {/* Wishlist Button */}
          <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
            <Heart className="w-6 h-6" />
          </button>

         {/* Product Image */}
<div className="bg-white flex justify-center items-center">
  <img
    loading="lazy"
    src={`${import.meta.env.VITE_BASE_URL}/storage/${product.image}`}
    alt={product.name}
    className="w-full h-auto sm:max-h-80 lg:max-h-[450px] object-contain"
    onClick={() =>
      navigate(`/product/${product.id}`, { state: product })
    }
    onMouseEnter={(e) =>
      (e.currentTarget.src = `${import.meta.env.VITE_BASE_URL}/storage/${product.hover_image}`)
    }
    onMouseLeave={(e) =>
      (e.currentTarget.src = `${import.meta.env.VITE_BASE_URL}/storage/${product.image}`)
    }
  />
</div>


          {/* Product Details */}
          <div className="px-2 py-2">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold leading-tight">
              {product.name}
            </h3>
            <p className="text-gray-600">₹{product.price}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

}
