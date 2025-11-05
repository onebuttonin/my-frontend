
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import userApi, { clearAccessToken } from "../Api/apiUser";

export default function Cart() {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [cartId, setCartId] = useState(localStorage.getItem("cart_id"));
  const deliveryCharge = 100;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  const token = localStorage.getItem("user_access_token");

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!token) {
      if (!localStorage.getItem("redirectAfterLogin")) {
        localStorage.setItem("redirectAfterLogin", location.pathname);
      }
      toast.error("Please log in first!");
      navigate("/login");
    }
  }, [token, navigate, location]);

  // ✅ Fetch Cart Data
  const fetchCartData = async () => {
    const cartResponse = await userApi.get(`/cart`);
    const id = cartResponse.data.id;
    setCartId(id);
    localStorage.setItem("cart_id", id);

    const cartDetails = await userApi.get(`/cart/${id}`);
    return cartDetails.data;
  };

  // ✅ Fetch Coupons
  const fetchCoupons = async () => {
    const res = await userApi.get(`/user-coupons`);
    return res.data;
  };

  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCartData,
    retry: false,
    enabled: !!token,
  });

  const { data: availableCoupons } = useQuery({
    queryKey: ["coupons"],
    queryFn: fetchCoupons,
  });

  // ✅ Update Quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ product_id, quantity }) => {
      await userApi.put(`/cart/${product_id}`, { quantity });
    },
    onSuccess: () => queryClient.invalidateQueries(["cart"]),
  });

  // ✅ Remove Item
  const removeItemMutation = useMutation({
    mutationFn: async (product_id) => {
      const res = await userApi.delete(`/cart/${product_id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      queryClient.invalidateQueries(["wishlist"]);
    },
    onError: () => toast.error("Failed to remove item from cart."),
  });

  // ✅ Add to Wishlist
  const addToWishlist = async (productId) => {
    try {
      const res = await userApi.post(`/wishlist`, { product_id: productId });
      return res.data;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      if (error.response?.status === 401) {
        clearAccessToken();
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else {
        toast.error("Failed to add to wishlist.");
      }
      throw error;
    }
  };

  // ✅ Move to Wishlist
  const handleMoveToWishlist = async (productId) => {
    try {
      if (removeItemMutation.isLoading) return;
      await addToWishlist(productId);
      await removeItemMutation.mutateAsync(productId);
      toast.success("Moved to wishlist");
    } catch (err) {
      toast.error("Could not move item to wishlist.");
    }
  };

  // ✅ Apply Coupon
  const applyCoupon = async () => {
    if (!cartId) return toast.error("Cart not found.");
    try {
      const res = await userApi.post(`/apply-coupon`, { code: coupon, cart_id: cartId });
      if (res.data?.message === "Coupon applied successfully") {
        setDiscount(Number(res.data.discount));
        setAppliedCoupon({
          code: coupon,
          discount: res.data.discount,
          newTotal: res.data.new_total,
        });
        localStorage.setItem("applied_coupon", coupon);
        toast.success(`Coupon applied! Discount: ₹${res.data.discount}`);
      } else {
        toast.error("Invalid or expired coupon.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply coupon.");
    } finally {
      setCoupon("");
    }
  };

  // ✅ Remove Coupon
  const removeCoupon = async () => {
    const appliedCoupon = localStorage.getItem("applied_coupon");
    if (!appliedCoupon || !cartId) return toast.error("No coupon or cart found.");
    try {
      const res = await userApi.post(`/remove-coupon`, { cart_id: cartId, code: appliedCoupon });
      setDiscount(0);
      setAppliedCoupon(null);
      localStorage.removeItem("applied_coupon");
      toast.success(res.data.message);
      queryClient.invalidateQueries(["cart"]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove coupon.");
    }
  };

  // ✅ Price Calculations
  const subtotal =
    cartData?.items?.reduce(
      (acc, item) => acc + (item.product?.price || 0) * (item.quantity || 0),
      0
    ) || 0;

  const total = subtotal - discount + deliveryCharge;
  localStorage.setItem("cart_total", total);

  // ✅ Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="font-semibold text-lg">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-2">
      <Toaster position="top-center" reverseOrder={false} />

      {!cartData?.items || cartData.items.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-60">
          <p className="text-gray-500 text-lg font-medium tracking-wide mb-6">
            No Item Found In Cart
          </p>
          <button
            onClick={() => navigate("/category/AllProducts")}
            className="px-6 py-3 bg-black text-white text-sm font-medium tracking-wide transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[60%_auto] gap-8 items-start">
          {/* Cart Section */}
          <div className="bg-white/90 backdrop-blur-md p-3">
            <h2 className="text-2xl text-center font-semibold mb-6 tracking-wide">BAG</h2>

            {cartData.items.map((item) => (
              <div
                key={item.product_id}
                className="flex items-start justify-between border-b border-gray-200 pb-6 mb-6"
              >
                {/* Product Image */}
                <img
                  src={
                    item.product?.image
                      ? `${import.meta.env.VITE_BASE_URL}/storage/${item.product.image}`
                      : "/placeholder.png"
                  }
                  alt={item.product?.name || "Product"}
                  className="w-28 h-40 object-contain cursor-pointer"
                  onClick={() =>
                    navigate(`/product/${item.product.id}`, { state: item.product })
                  }
                />

                {/* Product Info */}
                <div className="flex-1 ml-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-medium text-gray-900 truncate">
                      {item.product?.name}
                    </h3>
                    <button
                      onClick={() => removeItemMutation.mutate(item.product_id)}
                      className="text-gray-600 hover:text-black text-lg ml-4"
                    >
                      🗑
                    </button>
                  </div>

                  <p className="text-gray-600 text-sm mt-2">
                    SIZE: <span className="font-semibold">{item.size?.toUpperCase()}</span>
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-sm text-gray-600">QTY</span>
                    <div className="flex items-center border border-gray-300 rounded-lg shadow-sm">
                      <button
                        onClick={() =>
                          item.quantity > 1 &&
                          updateQuantityMutation.mutate({
                            product_id: item.product_id,
                            quantity: item.quantity - 1,
                          })
                        }
                        className="px-3 py-1 text-gray-700 hover:bg-gray-100 transition rounded-l-lg"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantityMutation.mutate({
                            product_id: item.product_id,
                            quantity: item.quantity + 1,
                          })
                        }
                        className="px-3 py-1 text-gray-700 hover:bg-gray-100 transition rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-8">
                    <button
                      onClick={() => handleMoveToWishlist(item.product_id)}
                      disabled={removeItemMutation.isLoading}
                      className="text-sm font-semibold text-gray-900 hover:underline"
                    >
                      {removeItemMutation.isLoading ? "Processing..." : "MOVE TO WISHLIST"}
                    </button>

                    <p className="text-lg font-semibold text-gray-900">
                      ₹{item.product?.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white/90 backdrop-blur-md p-3">
            <h2 className="text-2xl text-center font-semibold mb-6 tracking-wide">
              PRICE DETAILS
            </h2>

            {/* Coupon Input */}
            <div className="flex items-center mb-6">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 border border-gray-300 px-4 py-2 tracking-wide focus:outline-none"
              />
              <button
                onClick={applyCoupon}
                className="ml-3 px-5 py-2 bg-black text-white tracking-wide hover:bg-gray-800 transition"
              >
                Apply
              </button>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between items-center bg-green-100 p-3 border border-green-300 mb-6">
                <span className="text-green-700 font-semibold">
                  Coupon: {appliedCoupon.code}
                </span>
                <button
                  onClick={removeCoupon}
                  className="bg-red-500 text-white px-3 py-1 hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="space-y-3 text-gray-800">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>COD Charge:</span>
                <span>₹{deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-gray-300 pt-3">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="mt-6 w-full bg-black text-white py-3 tracking-wide hover:bg-gray-800 transition"
              onClick={() => navigate("/PlaceOrder")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
