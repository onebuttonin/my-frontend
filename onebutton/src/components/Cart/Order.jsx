
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueries } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import userApi from "../Api/apiUser";
import ReviewForm from "./ReviewForm";

const fetchOrders = async () => {
  const res = await userApi.get(`/allorders`);
  return res.data;
};

const fetchCartById = async (cartId) => {
  const res = await userApi.get(`/cart/${cartId}`);
  return res.data.items;
};

export default function Order() {
  const navigate = useNavigate();
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

  // ✅ Fetch orders
  const {
    data: allOrders = [],
    isLoading: ordersLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

// ✅ Sort before querying carts
const sortedOrders = (allOrders || []).slice().sort(
  (a, b) => new Date(b.created_at) - new Date(a.created_at)
);

// ✅ Create queries in sorted order
const cartQueries = useQueries({
  queries: sortedOrders.map((order) => ({
    queryKey: ["cart", order.cart_id],
    queryFn: () => fetchCartById(order.cart_id),
    enabled: !!token && !!order.cart_id,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  })),
});



  // ✅ Always call useQueries (even if orders empty)
  // const cartQueries = useQueries({
  //   queries: (allOrders || []).map((order) => ({
  //     queryKey: ["cart", order.cart_id],
  //     queryFn: () => fetchCartById(order.cart_id),
  //     enabled: !!token && !!order.cart_id,
  //     staleTime: 1000 * 60 * 5,
  //     cacheTime: 1000 * 60 * 10,
  //   })),
  // });

  const cartLoading = cartQueries.some((q) => q.isLoading);
  const isPageLoading = ordersLoading || cartLoading;

  // ✅ Error handling
  // if (isError) {
  //   return (
  //     <div className="flex justify-center items-center h-40 text-gray-700">
  //       Something went wrong while fetching your orders.
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto px-4 py-3">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-xl font-semibold mb-8 text-center tracking-wide text-gray-900">
        ORDERS
      </h2>

      {/* Loading */}
      {isPageLoading && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-800 font-medium text-lg">
            Loading your orders, please wait...
          </p>
        </div>
      )}

      {/* No Orders */}
{!isPageLoading && allOrders.length === 0 && (
  <div className="flex flex-col justify-center items-center h-60">
    <p className="flex justify-center items-center h-10 text-gray-700">
      No orders found.
    </p>
    <button
      onClick={() => navigate("/category/AllProducts")}
      className="px-6 py-3 bg-black text-white text-sm font-medium tracking-wide transition hover:bg-gray-800"
    >
      Continue Shopping
    </button>
  </div>
)}


      {/* Orders List */}
      {!isPageLoading &&
        allOrders
          .slice()
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((order, index) => {
            const cartItems = cartQueries[index]?.data || [];

            return (
              <div
                key={order.id}
                className="bg-white py-4 mb-8 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => navigate(`/OrderDetails/${order.id}`)}
              >
                <div className="pl-4 mb-4">
                  <h3 className="text-gray-600 uppercase">
                    Order Number: {order.id}
                  </h3>
                  <p className="text-gray-600 uppercase">
                    Order Date:{" "}
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Cart Items */}
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-start py-3 pl-0 pr-4"
                  >
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}/storage/${item.product.image}`}
                      alt={item.product.name}
                      className="w-24 h-24 object-contain"
                    />
                    <div className="ml-4 flex-1">
                      <p className="font-medium text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-700 mt-1 uppercase">
                        Status:{" "}
                        <span className="font-semibold text-orange-400">
                          {order.order_status}
                        </span>
                      </p>

                      {order.order_status === "Delivered" && (
                        <div
                          className="mt-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ReviewForm
                            productId={item.product.id}
                            accessToken={token}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
    </div>
  );
}

