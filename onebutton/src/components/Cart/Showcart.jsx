import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Cart() {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [cartId, setCartId] = useState(localStorage.getItem("cart_id"));
  const deliveryCharge = 100;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const token = localStorage.getItem("token");
  const location = useLocation();

  // Redirect non-logged-in users
  useEffect(() => {
      if (!token) {
        if (!localStorage.getItem("redirectAfterLogin")) {
          localStorage.setItem("redirectAfterLogin", location.pathname);
        }
        toast.error("Please log in first!");
        navigate("/login");
      }
    }, [token, navigate, location]);



  const fetchCartData = async () => {
    if (!token) return {}; // Prevent fetching if not logged in

    const cartResponse = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const cartId = cartResponse.data.id;
    setCartId(cartId);
    localStorage.setItem("cart_id", cartId);

    const cartDetails = await axios.get(`${import.meta.env.VITE_API_URL}/cart/${cartId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return cartDetails.data;
  };

  const fetchCoupons = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/coupons`);
    return res.data;
  };

  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCartData,
    retry: false,
  });

  const { data: availableCoupons } = useQuery({
    queryKey: ["coupons"],
    queryFn: fetchCoupons,
  });

  // const removeItemMutation = useMutation({
  //   mutationFn: async (product_id) => {
  //     await axios.delete(`${import.meta.env.VITE_API_URL}/cart/${product_id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //   },
  //   onSuccess: () => queryClient.invalidateQueries(["cart"]),
  // });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ product_id, quantity }) => {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/cart/${product_id}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    },
    onSuccess: () => queryClient.invalidateQueries(["cart"]),
  });

  const subtotal = cartData?.items?.reduce(
    (acc, item) => acc + (item.product?.price || 0) * (item.quantity || 0),
    0
  ) || 0;

  const total = subtotal - discount + deliveryCharge;
  localStorage.setItem("cart_total", total);

  const applyCoupon = () => {
    if (!token || !cartId) {
      toast.error("You must be logged in and have a valid cart.");
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/apply-coupon`,
        { code: coupon, cart_id: cartId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
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
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to apply coupon.");
      });
    setCoupon("");
  };

  const removeCoupon = () => {
    const appliedCoupon = localStorage.getItem("applied_coupon");
    if (!appliedCoupon || !cartId) {
      toast.error("No coupon or cart found.");
      return;
    }
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/remove-coupon`,
        { cart_id: cartId, code: appliedCoupon },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setDiscount(0);
        setAppliedCoupon(null);
        localStorage.removeItem("applied_coupon");
        toast.success(res.data.message);
        queryClient.invalidateQueries(["cart"]);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to remove coupon.");
      });
  };

  



  // 1) update addToWishlist to return the response or throw on error
const addToWishlist = async (productId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You need to login first.");
      throw new Error("no-token");
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

    return response.data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    if (error.response && error.response.status === 401) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("token");
    } else if (error.message === "no-token") {
      // already handled above
    } else {
      toast.error("Failed to add to wishlist.");
    }
    throw error; // rethrow so caller can decide what to do
  }
};

// 2) ensure remove mutation reads token from localStorage inside mutationFn
const removeItemMutation = useMutation({
  mutationFn: async (product_id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("no-token");
    }
    // IMPORTANT: confirm your API expects product_id or cart item id here.
    // If it expects cart item id, pass item.id instead.
    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/cart/${product_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries(["cart"]);
    // optionally invalidate wishlist if you show it:
    queryClient.invalidateQueries(["wishlist"]);
  },
  onError: (err) => {
    console.error("Failed to remove from cart:", err);
    toast.error("Failed to remove item from cart.");
  },
});

// 3) handler that awaits wishlist add then remove (safe)
const handleMoveToWishlist = async (productId) => {
  try {
    // prevent double clicks if you want
    if (removeItemMutation.isLoading) return;

    // 1) add to wishlist and wait for success
    await addToWishlist(productId);

    // 2) remove from cart after wishlist addition succeeded
    await removeItemMutation.mutateAsync(productId);

    // optional toast already shown by addToWishlist
    toast.success("Moved to wishlist");
  } catch (err) {
    // keep user informed
    if (err.message === "no-token") {
      // already handled in addToWishlist; nothing more to do
      return;
    }
    console.error("Move to wishlist failed:", err);
    toast.error("Could not move item to wishlist. Try again.");
  }
};




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
        {/* Shopping Cart */}
        <div className="bg-white/90 backdrop-blur-md p-3">
          <h2 className="text-2xl text-center font-semibold mb-6 tracking-wide">
            BAG
          </h2>

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
                  item.product &&
                  navigate(`/product/${item.product.id}`, {
                    state: item.product,
                  })
                }
              />

              {/* Product Info */}
              <div className="flex-1 ml-6 flex flex-col justify-between">
                {/* Product Name + Delete */}
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

                {/* Size */}
                <p className="text-gray-600 text-sm mt-2">
                  SIZE: <span className="font-semibold">{item.size?.toUpperCase()}</span>
                </p>

                {/* Quantity Selector (below size) */}
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

                {/* Wishlist + Price at Bottom */}
                <div className="flex items-center justify-between mt-8">
                  {/* <button className="text-sm font-semibold text-gray-900 hover:underline"
                  >
                    MOVE TO WISHLIST
                  </button> */}

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

        {/* Order Summary */}
        <div className="bg-white/90 backdrop-blur-md  p-3">
          <h2 className="text-2xl text-center font-semibold mb-6 tracking-wide">
            PRICE DETAILS
          </h2>

          {/* Coupon */}
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

          {/* Price Details */}
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

