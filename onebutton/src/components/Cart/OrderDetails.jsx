
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import userApi from "../Api/apiUser";

// const fetchOrders = async () => {
//   const token = localStorage.getItem("token");
//   const res = await userApi.get(`/allorders`);
//   return res.data;
// };

// const fetchCartById = async (cartId) => {
//   const token = localStorage.getItem("token");
//   const res = await userApi.get(`/cart/${cartId}`);
//   return res.data.items;
// };

// export default function OrderDetails() {
//   const { id } = useParams(); // order id from URL
//   const navigate = useNavigate();
//   const location = useLocation();
//   const token = localStorage.getItem("token");
//   const [canceling, setCanceling] = useState(false);

//   useEffect(() => {
//     if (!token) {
//       if (!localStorage.getItem("redirectAfterLogin")) {
//         localStorage.setItem("redirectAfterLogin", location.pathname);
//       }
//       toast.error("Please log in first!");
//       navigate("/login");
//     }
//   }, [token, navigate, location]);

//   // Fetch all orders
//   const {
//     data: allOrders = [],
//     isLoading: ordersLoading,
//     error: ordersError,
//   } = useQuery({
//     queryKey: ["orders"],
//     queryFn: fetchOrders,
//     enabled: !!token,
//   });

//   // Find current order
//   const order = allOrders.find((o) => o.id === parseInt(id));

//   // Fetch cart for this order
//   const {
//     data: cartItems = [],
//     isLoading: cartLoading,
//     error: cartError,
//   } = useQuery({
//     queryKey: ["cart", order?.cart_id],
//     queryFn: () => fetchCartById(order.cart_id),
//     enabled: !!order && !!token,
//   });

//   const isPageLoading = ordersLoading || cartLoading;

//   const handleCancelOrder = async () => {
//     try {
//       setCanceling(true);
//       await userApi.post(
//         `/update-order-status`,
//         { id: order.id, order_status: "Cancelled" },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success("Order cancelled successfully.");
//       navigate("/orders"); // back to order list
//     } catch (err) {
//       toast.error("Failed to cancel order.");
//     } finally {
//       setCanceling(false);
//     }
//   };

//   if (isPageLoading) {
//     return (
//       <div className="flex justify-center items-center h-60">
//         <p className="text-gray-800 font-medium text-lg">Loading order details...</p>
//       </div>
//     );
//   }

//   if (ordersError || cartError || !order) {
//     return (
//       <div className="flex justify-center items-center h-60">
//         <p className="text-red-500 font-medium text-lg">Failed to load order.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full lg:w-3/5 mx-auto px-4 py-10 bg-white">
//       <Toaster position="top-center" reverseOrder={false} />

//       {/* Order Header */}
//       <div className="mb-6">
//         <h2 className="text-gray-700 mb-1">
//           ORDER NUMBER: {order.id}
//         </h2>
//         <p className="text-gray-700">
//           ORDER DATE:{" "}
//           {new Date(order.created_at).toLocaleDateString("en-IN", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//           })}
//         </p>
//         <p className="text-black mt-1">
//           STATUS: <span className="font-semibold uppercase text-orange-400">{order.order_status}</span>
//         </p>
//       </div>

//       {/* Products */}
//       <div className="space-y-6">
//         {cartItems.map((item) => (
//           <div key={item.product.id} className="flex items-center pl-0">
//             <img
//               src={`${import.meta.env.VITE_BASE_URL}/storage/${item.product.image}`}
//               alt={item.product.name}
//               className="w-18 h-28 object-contain"
//             />
//             <div className="ml-4">
//               <p className="font-medium text-gray-900">{item.product.name}</p>
//               <p className="text-gray-600">Size: {item.size.toUpperCase()}</p>
//               <p className="text-gray-600">Quantity: {item.quantity}</p>
//               <p className="text-gray-800 font-semibold">
//                 Price: ₹{item.product.price}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Shipping Address */}
//       <div className="mt-10 pl-0">
//         <h3 className="text-xl font-semibold   mb-2 uppercase">
//           Shipping Address
//         </h3>
//         <p className="text-gray-700">
//           {order.name}, {order.street1}, {order.city}, {order.state} -{" "}
//           {order.pincode}
//         </p>
//         <p className="text-gray-700">Mobile: {order.mobile}</p>
//       </div>

// {/* Bag Total */}
// <div className="mt-6 pl-0">
//   <h3 className="text-xl  font-semibold uppercase mb-3">
//     Bag Total
//   </h3>
//   <div className="flex justify-between items-center">
//     <span className="text-gray-700 font-medium">Total</span>
//     <span className="text-gray-900 font-semibold">₹{order.cart_total}</span>
//   </div>
// </div>

//       {/* Cancel Button */}
//       {order.order_status === "Order Confirmed" && (
//         <div className="mt-8">
//           <button
//             onClick={handleCancelOrder}
//             disabled={canceling}
//             className="w-full bg-black text-white py-3 transition disabled:opacity-50"
//           >
//             {canceling ? "Cancelling..." : "CANCEL"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import userApi from "../Api/apiUser";

// Fetch all orders
const fetchOrders = async () => {
  const res = await userApi.get("/allorders");
  return res.data;
};

// Fetch cart items by cartId
const fetchCartById = async (cartId) => {
  const res = await userApi.get(`/cart/${cartId}`);
  return res.data.items;
};

export default function OrderDetails() {
  const { id } = useParams(); // Order ID from URL
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("user_access_token"); // unified token key
  const [canceling, setCanceling] = useState(false);
  const [tokenReady, setTokenReady] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      if (!localStorage.getItem("redirectAfterLogin")) {
        localStorage.setItem("redirectAfterLogin", location.pathname);
      }
      toast.error("Please log in first!");
      navigate("/login");
    }
  }, [token, navigate, location]);



useEffect(() => {
  const token = localStorage.getItem("user_access_token");
  if (token) {
    setTokenReady(true);
  } else {
    // Try refreshing once before allowing queries
    userApi.post("/user/refresh-token", {}, { withCredentials: true })
      .then((res) => {
        localStorage.setItem("user_access_token", res.data.access_token);
        setTokenReady(true);
      })
      .catch(() => setTokenReady(false));
  }
}, []);

  const {
    data: allOrders = [],
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    enabled: tokenReady,
     refetchOnWindowFocus: false, // prevent re-fetch on tab switch
  refetchOnReconnect: false,   // prevent re-fetch on reconnect
  });

  // 🧩 Find the current order from all orders
  const order = allOrders?.find((o) => o.id === parseInt(id));

  // 🧩 Fetch cart items for the selected order
  const {
    data: cartItems = [],
    isLoading: cartLoading,
    error: cartError,
  } = useQuery({
    queryKey: ["cart", order?.cart_id],
    queryFn: () => fetchCartById(order.cart_id),
    enabled: !!order && !!token,
  });

  const isPageLoading = ordersLoading || cartLoading;

  // 🧩 Cancel order
  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      setCanceling(true);
      await userApi.post("/update-order-status", {
        id: order.id,
        order_status: "Cancelled",
      });
      toast.success("Order cancelled successfully.");
      navigate("/orders");
    } catch (err) {
      console.error("Cancel order error:", err);
      toast.error("Failed to cancel order.");
    } finally {
      setCanceling(false);
    }
  };

  // 🧩 Loading state
  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-800 font-medium text-lg">
          Loading order details...
        </p>
      </div>
    );
  }

  // 🧩 Error or invalid order
  if (ordersError || cartError || !order) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-red-500 font-medium text-lg">
          Failed to load order.
        </p>
      </div>
    );
  }

  // 🧩 Render order details
  return (
    <div className="w-full lg:w-3/5 mx-auto px-4 py-10 bg-white">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Order Header */}
      <div className="mb-6">
        <h2 className="text-gray-700 mb-1">
          ORDER NUMBER: {order.id}
        </h2>
        <p className="text-gray-700">
          ORDER DATE:{" "}
          {new Date(order.created_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
        <p className="text-black mt-1">
          STATUS:{" "}
          <span className="font-semibold uppercase text-orange-400">
            {order.order_status}
          </span>
        </p>
      </div>

      {/* Product List */}
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center">
            <img
              src={`${import.meta.env.VITE_BASE_URL}/storage/${item.product.image}`}
              alt={item.product.name}
              className="w-18 h-28 object-contain"
            />
            <div className="ml-4">
              <p className="font-medium text-gray-900">
                {item.product.name}
              </p>
              <p className="text-gray-600">Size: {item.size.toUpperCase()}</p>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-gray-800 font-semibold">
                Price: ₹{item.product.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Shipping Address */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-2 uppercase">
          Shipping Address
        </h3>
        <p className="text-gray-700">
          {order.name}, {order.street1}, {order.city}, {order.state} -{" "}
          {order.pincode}
        </p>
        <p className="text-gray-700">Mobile: {order.mobile}</p>
      </div>

      {/* Bag Total */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold uppercase mb-3">
          Bag Total
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Total</span>
          <span className="text-gray-900 font-semibold">
            ₹{order.cart_total}
          </span>
        </div>
      </div>

      {/* Cancel Button */}
      {order.order_status === "Order Confirmed" && (
        <div className="mt-8">
          <button
            onClick={handleCancelOrder}
            disabled={canceling}
            className="w-full bg-black text-white py-3 transition disabled:opacity-50"
          >
            {canceling ? "Cancelling..." : "CANCEL"}
          </button>
        </div>
      )}
    </div>
  );
}
