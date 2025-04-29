import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  const fetchProducts = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/products`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: false,
    })
    .then(response => {
      const allProducts = response.data;

      // Shuffle the products randomly
      const shuffledProducts = allProducts.sort(() => Math.random() - 0.5);

      setProducts(shuffledProducts);
      setLoading(false); // Done loading
    })
    .catch(error => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });
  };

  const fetchWishlist = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: false,
    })
    .then(response => {
      const wishlistItems = response.data.map(item => item.product_id);
      setWishlist(wishlistItems);
    })
    .catch(error => console.error("Error fetching wishlist:", error));
  };

  const addToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You need to login first.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/wishlist`,
        { product_id: productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message);

      setWishlist((prev) =>
        prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
      );
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        toast.error("Failed to add to wishlist.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-10">

      {/* Title Section */}
      <div className="text-center bg-zinc-100 px-4 py-3 mb-4">
        <h2 className="text-xl font-bold">All Products</h2>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {products.map((product) => (
          <div key={product.id} className="relative hover:border border-neutral-300 rounded-lg shadow-md p-4 flex flex-col">

            {/* Wishlist Icon */}
            <button
              className={`absolute top-5 right-5 ${wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
              onClick={() => addToWishlist(product.id)}
            >
              <Heart className="w-6 h-6" fill={wishlist.includes(product.id) ? "red" : "none"}/>
            </button>

            {/* Product Image with Hover Effect */}
            <img 
              src={`${import.meta.env.VITE_BASE_URL}/storage/${product.image}`} 
              alt={product.name} 
              className="w-full h-60 lg:h-100 object-cover transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`, { state: product })}
              onMouseEnter={(e) => e.currentTarget.src = `${import.meta.env.VITE_BASE_URL}/storage/${product.hover_image}`}  
              onMouseLeave={(e) => e.currentTarget.src = `${import.meta.env.VITE_BASE_URL}/${product.image}`}
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
    </div>
  );
}
