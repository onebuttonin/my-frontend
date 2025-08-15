
import React from "react";
import Ticker2 from '/src/components/Ticker2'
import { Menu, X, Search, User, Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch products from Laravel API
    axios.get(`${import.meta.env.VITE_API_URL}/products`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: false,  // Ensure no issues with CORS credentials
    })
    .then(response => setProducts(response.data))
    .catch(error => console.error("Error fetching products:", error));
  }, []);

// Filter products where category is 'minimals'
  const minimalProducts = products.filter(
    (product) => product.category?.toLowerCase() === "minimals"
  );
  

  return (
    <div className="container mx-auto p-4 lg:p-10">
      
      {/* Minimal & Show All Section with Thick Background */}
      <div className="text-center bg-neutral-100 px-4 py-3 mb-4">
        <h2 className="text-xl font-bold">Minimals</h2>
      </div>

      {/* Responsive Product Grid - No Gaps */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {minimalProducts.map((product) => (
          <div key={product.id} className="relative hover:border border-neutral-300 rounded-lg shadow-md p-4 flex flex-col">
            
            {/* Wishlist Icon in Top-Right */}
            <button className="absolute top-5 right-5 text-gray-500 hover:text-red-500">
              <Heart className="w-6 h-6" />
            </button>

            {/* Product Image with Hover Effect */}
            <img 
              src={`${import.meta.env.VITE_BASE_URL}/storage/${product.image}`} 
              alt={product.name} 
              className="w-full h-60 lg:h-100 object-cover transition-all duration-300"
              onClick={() => navigate(`/product/${product.id}`, { state: product })}
              onMouseEnter={(e) => e.currentTarget.src = `${import.meta.env.VITE_BASE_URL}/storage/${product.hover_image}`}  
              onMouseLeave={(e) => e.currentTarget.src = `${import.meta.env.VITE_BASE_URL}/storage/${product.image}`}
            />

            {/* Product Name */}
            <h3 className="text-sm sm:text-base md:text-lg font-semibold mt-2">
              {product.name}
            </h3>

            {/* Product Price */}
            <p className="text-gray-600">₹{product.price}</p>
          </div>
        ))}
      </div>
            
      {/* View All Button */}
      <button 
        className="border border-zinc-200 hover:border-black px-6 py-3 rounded-md text-base text-black mx-auto block mt-5"
        onClick={() => window.location.href = "/category/minimals"} 
      >
        View All
      </button>
    </div>
  );
}
