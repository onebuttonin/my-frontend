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
  <div className="container mx-auto px-2 lg:px-10 py-10">
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
        All Products
      </h2>
    </div>

    {/* Product Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="relative flex flex-col border border-neutral-200"
        >
          {/* Wishlist Button */}
          <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
            <Heart
              className="w-6 h-6"
              fill={wishlist.includes(product.id) ? "red" : "none"}
            />
          </button>

          {/* Product Image */}
          <div className="bg-white flex justify-center items-center">
            <img
              loading="lazy"
              src={`${import.meta.env.VITE_BASE_URL}/storage/${product.image}`}
              alt={product.name}
              className="w-full h-auto sm:max-h-80 lg:max-h-[450px] object-contain cursor-pointer transition-transform duration-500"
              onClick={() => navigate(`/product/${product.id}`, { state: product })}
              onMouseEnter={(e) =>
                (e.currentTarget.src = `${import.meta.env.VITE_BASE_URL}/storage/${product.hover_image}`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.src = `${import.meta.env.VITE_BASE_URL}/storage/${product.image}`)
              }
            />
          </div>

          {/* Product Details */}
         <div className="px-2 py-2 lg:pl-4">
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
