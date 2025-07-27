import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductGrid() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true); // <-- loading state added

  useEffect(() => {
    fetchWishlist();
    fetchProducts();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWishlist(response.data.map((item) => item.product_id));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {
        headers: { "Content-Type": "application/json" },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // <-- stop loading after products fetched
    }
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

  const minimalProducts = products.filter(
    (product) => product.category?.toLowerCase() === "notsobasic"
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-10">
      <div className="text-center px-4 py-3 mb-4">
        <h2 className="text-xl font-bold">Not So Basic</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {minimalProducts.length > 0 ? (
          minimalProducts.map((product) => (
            <div
              key={product.id}
              className="relative hover:border border-neutral-300 rounded-lg shadow-md p-4 flex flex-col"
            >
              <button
                className={`absolute top-5 right-5 ${wishlist.includes(product.id) ? "text-red-500" : "text-gray-500"} hover:text-red-500`}
                onClick={() => addToWishlist(product.id)}
              >
                <Heart className="w-6 h-6" fill={wishlist.includes(product.id) ? "red" : "none"} />
              </button>

              <img
                src={`${import.meta.env.VITE_BASE_URL}/storage/${product.image}`}
                alt={product.name}
                className="w-full h-60 lg:h-100 object-cover"
                onClick={() => navigate(`/product/${product.id}`, { state: product })}
                onMouseEnter={(e) =>
                  (e.currentTarget.src = `${import.meta.env.VITE_BASE_URL}/storage/${product.hover_image}`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.src = `${import.meta.env.VITE_BASE_URL}/storage/${product.image}`)
                }
              />

              <h3 className="text-sm sm:text-base md:text-lg font-semibold mt-2">
                {product.name}
              </h3>

              <p className="text-gray-600">{product.price}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">No minimal products available.</p>
        )}
      </div>
    </div>
  );
}
