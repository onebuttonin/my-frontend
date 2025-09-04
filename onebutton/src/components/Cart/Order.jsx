// import React, { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useQuery, useQueries } from "@tanstack/react-query";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";

// const fetchOrders = async () => {
//   const token = localStorage.getItem("token");
//   const res = await axios.get(`${import.meta.env.VITE_API_URL}/allorders`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.data;
// };

// const fetchCartById = async (cartId) => {
//   const token = localStorage.getItem("token");
//   const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart/${cartId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.data.items;
// };

// export default function Order() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!token) {
//       if (!localStorage.getItem("redirectAfterLogin")) {
//         localStorage.setItem("redirectAfterLogin", location.pathname);
//       }
//       toast.error("Please log in first!");
//       navigate("/login");
//     }
//   }, [token, navigate, location]);

//   const {
//     data: allOrders = [],
//     isLoading,
//   } = useQuery({
//     queryKey: ["orders"],
//     queryFn: fetchOrders,
//     enabled: !!token,
//     retry: false,
//     staleTime: 1000 * 60 * 5,
//     cacheTime: 1000 * 60 * 10,
//   });

//   const cartQueries = useQueries({
//     queries: allOrders.map((order) => ({
//       queryKey: ["cart", order.cart_id],
//       queryFn: () => fetchCartById(order.cart_id),
//       enabled: !!token,
//       staleTime: 1000 * 60 * 5,
//       cacheTime: 1000 * 60 * 10,
//     })),
//   });

//   const cartLoading = cartQueries.some((q) => q.isLoading);
//   const isPageLoading = isLoading || cartLoading;

//   return (
//     <div className="container mx-auto px-4 py-10 ">
//       <Toaster position="top-center" reverseOrder={false} />

//       <h2 className="text-2xl font-semibold mb-8 text-center tracking-wide text-gray-900">
//         ORDERS
//       </h2>

//       {/* Loading */}
//       {isPageLoading && (
//         <div className="flex justify-center items-center h-40">
//           <p className="text-gray-800 font-medium text-lg">
//             Loading your orders, please wait...
//           </p>
//         </div>
//       )}

//       {/* No Orders */}
//       {!isPageLoading && allOrders.length === 0 && (
//         <div className="flex justify-center items-center h-40">
//           <p className="text-gray-600 font-medium text-lg">No orders found.</p>
//         </div>
//       )}

//       {/* Orders List */}
//       {!isPageLoading &&
//         allOrders.map((order, index) => (
//           <div
//             key={order.id}
//             className="bg-white py-4 mb-8 cursor-pointer hover:bg-gray-50 transition"
//             onClick={() => navigate(`/OrderDetails/${order.id}`)} // 👈 navigate to OrderDetails
//           >
//             {/* Order Info Top */}
//             <div className="pl-4 mb-4">
//               <h3 className="text-lg font-semibold text-gray-900 uppercase">
//                 Order Number: {order.id}
//               </h3>
//               <p className="text-gray-600 uppercase">
//                 Order Date:{" "}
//                 {new Date(order.created_at).toLocaleDateString("en-IN", {
//                   day: "2-digit",
//                   month: "short",
//                   year: "numeric",
//                 })}
//               </p>
//             </div>

//             {/* Products */}
//             <div>
//               {cartQueries[index]?.data?.map((item) => (
//                 <div
//                   key={item.product.id}
//                   className="flex items-center py-3 pl-0"
//                 >
//                   {/* Left - Product Image */}
//                   <img
//                     src={`${import.meta.env.VITE_BASE_URL}/storage/${item.product.image}`}
//                     alt={item.product.name}
//                     className="w-24 h-24 object-contain"
//                   />

//                   {/* Right - Product Info */}
//                   <div className="ml-4">
//                     <p className="font-medium text-gray-900">
//                       {item.product.name}
//                     </p>
//                     <p className="text-sm text-gray-700 mt-1 uppercase">
//                       Status:{" "}
//                       <span className="font-semibold">{order.order_status}</span>
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//     </div>
//   );
// }



import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueries } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ReviewForm from "./ReviewForm"; // 👈 import the review form

const fetchOrders = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/allorders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const fetchCartById = async (cartId) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart/${cartId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.items;
};

export default function Order() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      if (!localStorage.getItem("redirectAfterLogin")) {
        localStorage.setItem("redirectAfterLogin", location.pathname);
      }
      toast.error("Please log in first!");
      navigate("/login");
    }
  }, [token, navigate, location]);

  const {
    data: allOrders = [],
    isLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const cartQueries = useQueries({
    queries: allOrders.map((order) => ({
      queryKey: ["cart", order.cart_id],
      queryFn: () => fetchCartById(order.cart_id),
      enabled: !!token,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
    })),
  });

  const cartLoading = cartQueries.some((q) => q.isLoading);
  const isPageLoading = isLoading || cartLoading;

  return (
    <div className="container mx-auto px-4 py-10">
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="text-2xl font-semibold mb-8 text-center tracking-wide text-gray-900">
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
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-600 font-medium text-lg">No orders found.</p>
        </div>
      )}

     {/* Orders List */}
{!isPageLoading &&
  [...allOrders] // clone so we don't mutate react-query cache
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // 👈 newest first
    .map((order, index) => (
      <div
        key={order.id}
        className="bg-white py-4 mb-8 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => navigate(`/OrderDetails/${order.id}`)}
      >
        {/* Order Info Top */}
        <div className="pl-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 uppercase">
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

        {/* Products */}
        <div>
          {cartQueries[index]?.data?.map((item) => (
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
                <p className="font-medium text-gray-900">{item.product.name}</p>
                <p className="text-sm text-gray-700 mt-1 uppercase">
                  Status:{" "}
                  <span className="font-semibold">{order.order_status}</span>
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
      </div>
    ))}

    </div>
  );
}
