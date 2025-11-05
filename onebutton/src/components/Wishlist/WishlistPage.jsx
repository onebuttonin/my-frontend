
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trash } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import userApi from "../Api/apiUser";

export default function ProductGrid() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [selectedSize, setSelectedSize] = useState(null);
  const [showSizeSelector, setShowSizeSelector] = useState(null);

  // ✅ use new token key
  const token = localStorage.getItem("user_access_token");
  const isLoggedIn = !!token;

  // ✅ redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      if (!localStorage.getItem("redirectAfterLogin")) {
        localStorage.setItem("redirectAfterLogin", location.pathname);
      }
      toast.error("Please log in first!");
      navigate("/login");
    }
  }, [isLoggedIn, navigate, location]);

  // ✅ Fetch wishlist (token handled by interceptor)
  const fetchWishlist = async () => {
    const { data: wishlistItems } = await userApi.get("/wishlist");

    if (!wishlistItems?.length) return [];

    const productDetails = await Promise.all(
      wishlistItems.map(async (item) => {
        const { data } = await userApi.get(`/products/${item.product_id}`);
        return { ...item, product: data };
      })
    );

    return productDetails;
  };

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
    enabled: isLoggedIn,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  // ✅ Delete item from wishlist
  const deleteMutation = useMutation({
    mutationFn: async (productId) => {
      await userApi.delete(`/wishlist/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
    },
  });

  // ✅ Add to cart
  const handleAddToCart = async (productId) => {
    if (!selectedSize) {
      toast.error("Please select a size!");
      return;
    }

    try {
      await userApi.post("/add-cart", {
        product_id: productId,
        size: selectedSize,
        quantity: 1,
      });

      toast.success("Product added to cart!");
      setShowSizeSelector(null);
      setSelectedSize(null);
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleDelete = (e, productId) => {
    e.stopPropagation();
    deleteMutation.mutate(productId);
  };

  // ✅ UI
  return (
    <div className="container mx-auto px-2 lg:px-10 py-10">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="text-center px-4 py-3 mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide uppercase">
          Wishlist
        </h2>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.length > 0 ? (
            wishlist.map((item) => (
              <div
                key={item.product_id}
                className="relative flex flex-col border border-neutral-200"
              >
                {/* Delete Button */}
                <button
                  className="absolute top-3 left-3 text-gray-500 hover:text-red-500"
                  onClick={(e) => handleDelete(e, item.product_id)}
                >
                  <Trash className="w-5 h-5" />
                </button>

                {/* Product Image */}
                <div className="bg-white flex justify-center items-center">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/storage/${item.product?.image || "default.jpg"}`}
                    alt={item.product?.name || "Product"}
                    className="w-full h-auto sm:max-h-80 lg:max-h-[450px] object-contain cursor-pointer transition-transform duration-500"
                    onClick={() =>
                      navigate(`/product/${item.product_id}`, {
                        state: item.product,
                      })
                    }
                    onMouseEnter={(e) => {
                      if (item.product?.hover_image) {
                        e.currentTarget.src = `${import.meta.env.VITE_BASE_URL}/storage/${item.product.hover_image}`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.src = `${import.meta.env.VITE_BASE_URL}/storage/${item.product?.image || "default.jpg"}`;
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="px-2 py-2 lg:pl-4">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold leading-tight">
                    {item.product?.name || "Unnamed Product"}
                  </h3>
                  <p className="text-gray-600">₹{item.product?.price || "N/A"}</p>

                  {/* Size Selector */}
                  {showSizeSelector === item.product_id ? (
                    <div className="flex flex-wrap justify-center gap-2 mt-3 px-2">
                      {["s", "m", "l", "xl", "xxl"].map((size) =>
                        item.product?.availableSizes &&
                        item.product.availableSizes[size] ? (
                          <button
                            key={size}
                            className={`px-3 py-1 border text-sm rounded transition 
                              ${
                                selectedSize === size
                                  ? "bg-black text-white"
                                  : "hover:bg-black hover:text-white border-gray-400"
                              }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSize(size);
                            }}
                          >
                            {size.toUpperCase()}
                          </button>
                        ) : null
                      )}
                    </div>
                  ) : (
                    <button
                      className="mt-3 w-full py-2 bg-black text-white text-sm font-medium tracking-wide hover:bg-gray-900 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSizeSelector(item.product_id);
                      }}
                    >
                      Add To Bag
                    </button>
                  )}

                  {/* Add Button */}
                  {showSizeSelector === item.product_id && (
                    <button
                      className="mt-2 w-full py-2 bg-black text-white text-sm font-medium tracking-wide hover:bg-gray-900 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item.product_id);
                      }}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center col-span-full py-16">
              <p className="text-gray-700 text-lg font-medium mb-4">
                Your wishlist is empty
              </p>
              <button
                onClick={() => navigate("/category/AllProducts")}
                className="px-6 py-3 bg-black text-white text-sm font-medium tracking-wide hover:bg-gray-900 transition"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
