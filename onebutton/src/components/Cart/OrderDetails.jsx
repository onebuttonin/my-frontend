// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "/src/components/Hooks/useAuth";
// import { useNavigate } from "react-router-dom";
// import ReviewForm from "./ReviewForm";

// export default function OrderDetails() {
//   const [orders, setOrders] = useState([]);
//   const [cartDetails, setCartDetails] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [pastOrders, setPastOrders] = useState([]);  // For cancelled/delivered orders
//   const navigate = useNavigate();
//   const isLoggedIn = useAuth();

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!isLoggedIn) {
//       toast.error("Please log in.");
//       const timeout = setTimeout(() => {
//         navigate("/login");
//       }, 1500);
  
//       return () => clearTimeout(timeout); // Cleanup if the component unmounts
//     }
//   }, [isLoggedIn, navigate]);
  

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Authentication token missing.");
//         setLoading(false);
//         navigate("/login");
//         return;
//       }

//       try {
//         // ✅ Fetch only the logged-in user's orders
//         const orderResponse = await axios.get("http://127.0.0.1:8000/api/allorders", {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         const allOrders = orderResponse.data;

//         // Separate current and past orders
//         const currentOrders = allOrders.filter(
//           (order) => order.order_status !== "cancelled" && order.order_status !== "Delivered"
//         );

//         const filteredPastOrders = allOrders.filter(
//           (order) => order.order_status === "cancelled" || order.order_status === "Delivered"
//         );

//         setOrders(currentOrders);

//         // Fetch cart details for past orders
//         const pastOrdersWithDetails = await Promise.all(
//           filteredPastOrders.map(async (order) => {
//             try {
//               const cartResponse = await axios.get(`http://127.0.0.1:8000/api/cart/${order.cart_id}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//               });

//               return {
//                 ...order,
//                 items: cartResponse.data.items,
//               };
//             } catch (error) {
//               console.error(`Failed to fetch cart details for cart_id: ${order.cart_id}`, error);
//               return { ...order, items: [] };
//             }
//           })
//         );

//         setPastOrders(pastOrdersWithDetails);

//         // Fetch cart details for current orders
//         allOrders.forEach(async (order) => {
//           try {
//             const cartResponse = await axios.get(`http://127.0.0.1:8000/api/cart/${order.cart_id}`, {
//               headers: { Authorization: `Bearer ${token}` }
//             });

//             setCartDetails((prevCartDetails) => ({
//               ...prevCartDetails,
//               [order.cart_id]: cartResponse.data.items,
//             }));
//           } catch {
//             setError("Failed to fetch cart details.");
//           }
//         });

//       } catch (error) {
//         console.error("Failed to fetch orders:", error);
//         setError("Failed to fetch orders.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   // ✅ Cancel Order Function
//   const cancelOrder = async (orderId) => {
//     const token = localStorage.getItem("token");

//     if (window.confirm("Are you sure you want to cancel this order?")) {
//       try {
//         await axios.post("http://127.0.0.1:8000/api/update-order-status", {
//           id: orderId,
//           order_status: "cancelled"
//         }, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         // Remove the cancelled order from current orders
//         const updatedOrders = orders.filter((order) => order.id !== orderId);
//         setOrders(updatedOrders);

//         alert("Order cancelled successfully!");
//       } catch (error) {
//         console.error("Failed to cancel order:", error);
//         alert("Failed to cancel order.");
//       }
//     }
//   };

//   const trackOrder = (orderId) => alert(`Tracking order ID: ${orderId}`);

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h2 className="text-2xl font-bold mb-4">Order Details</h2>
//       {loading && <p className="text-yellow-500">Loading orders...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {/* Current Orders */}
//       {orders.length > 0 ? (
//         orders.map((order) => (
//           <div key={order.id} className="border p-4 mb-4 rounded-lg shadow">
//             <h3 className="text-lg font-semibold">Order ID: {order.id}</h3>
//             <p><span className="font-semibold">Customer:</span> {order.name}</p>
//             <p><span className="font-semibold">Address:</span> {order.street1}, {order.city}, {order.state} - {order.pincode}</p>
//             <p><span className="font-semibold">Mobile:</span> {order.mobile}</p>

//             <div className="mt-4">
//               <h4 className="font-semibold">Ordered Products:</h4>
//               {cartDetails[order.cart_id] ? (
//                 <ul>
//                   {cartDetails[order.cart_id].map((item) => (
//                     <li key={item.product.id} className="flex items-center mb-2 border-b pb-2">
//                       <img
//                         src={`http://127.0.0.1:8000/storage/${item.product.image}`}
//                         alt={item.product.name}
//                         className="w-20 h-20 object-cover rounded-lg mr-2"
//                       />
//                       <div>
//                         <p className="font-semibold">{item.product.name}</p>
//                         <p>Size: {item.size.toUpperCase()}</p>
//                         <p>Quantity: {item.quantity}</p>
//                         <p>Price: ₹{item.product.price}</p>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-gray-500">Fetching product details...</p>
//               )}
//             </div>

//             <p className="mt-4 font-semibold">
//               Order Status: <span className="px-2 py-1 rounded bg-gray-200">{order.order_status}</span>
//             </p>
//             <p className="mt-4 font-semibold">
//               Bag Total: <span className="px-2 py-1 rounded bg-gray-200">₹{order.cart_total}</span>
//             </p>

//             <div className="mt-4 flex space-x-4">
//               <button
//                 onClick={() => trackOrder(order.id)}
//                 className="bg-neutral-500 text-white px-4 py-2 rounded hover:bg-neutral-600"
//               >
//                 Track Order
//               </button>
//               <button
//                 onClick={() => cancelOrder(order.id)}
//                 className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//               >
//                 Cancel Order
//               </button>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-500">No current orders found.</p>
//       )}

// {pastOrders.length > 0 && (
//         <>
//           <h2 className="text-2xl font-bold mb-4 mt-8">Past Orders</h2>
//           {pastOrders.map((pastOrder) => (
//             <div key={pastOrder.id} className="border p-4 mb-4 rounded-lg shadow">
//               <h3 className="text-lg font-semibold">Order ID: {pastOrder.id}</h3>
//               <p>Status: {pastOrder.order_status}</p>

//               {/* Display product details in past orders */}
//               <div className="mt-4">
//                 {pastOrder.items.map((item) => (
//                   <div key={item.id} className="flex items-center mb-4">
//                     <img
//                       src={`http://127.0.0.1:8000/storage/${item.product.image}`}
//                       alt={item.product.name}
//                       className="w-20 h-20 object-cover rounded-lg mr-4"
//                     />
//                     <div>
//                       <p>{item.product.name}</p>
//                       <p>Size: {item.size}</p>
//                       <p>Quantity: {item.quantity}</p>
//                       <p>Price: ₹{item.product.price}</p>
                      
//                       {pastOrder.order_status === "Delivered" && (
//                       <ReviewForm productId={item.product.id} accessToken={token} />
//                        )}
                    
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </>
//       )}
//     </div>
//   );
// }


// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "/src/components/Hooks/useAuth";
// import { useQuery, useQueries } from "@tanstack/react-query";
// import axios from "axios";
// import ReviewForm from "./ReviewForm";

// const fetchOrders = async () => {
//   const token = localStorage.getItem("token");
//   const res = await axios.get("http://127.0.0.1:8000/api/allorders", {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.data;
// };

// const fetchCartById = async (cartId) => {
//   const token = localStorage.getItem("token");
//   const res = await axios.get(`http://127.0.0.1:8000/api/cart/${cartId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.data.items;
// };

// export default function OrderDetails() {
//   const navigate = useNavigate();
//   const isLoggedIn = useAuth();

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!isLoggedIn) {
//       toast.error("Please log in.");
//       const timeout = setTimeout(() => {
//         navigate("/login");
//       }, 1500);

//       return () => clearTimeout(timeout);
//     }
//   }, [isLoggedIn, navigate]);

//   const {
//     data: allOrders = [],
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["orders"],
//     queryFn: fetchOrders,
//     enabled: !!token,
//   });

//   const currentOrders = allOrders.filter(
//     (order) => order.order_status !== "cancelled" && order.order_status !== "Delivered"
//   );

//   const pastOrdersList = allOrders.filter(
//     (order) => order.order_status === "cancelled" || order.order_status === "Delivered"
//   );

//   const cartQueries = useQueries({
//     queries: currentOrders.map((order) => ({
//       queryKey: ["cart", order.cart_id],
//       queryFn: () => fetchCartById(order.cart_id),
//     })),
//   });

//   const pastCartQueries = useQueries({
//     queries: pastOrdersList.map((order) => ({
//       queryKey: ["pastCart", order.cart_id],
//       queryFn: () => fetchCartById(order.cart_id),
//     })),
//   });

//   const cancelOrder = async (orderId) => {
//     if (window.confirm("Are you sure you want to cancel this order?")) {
//       try {
//         await axios.post(
//           "http://127.0.0.1:8000/api/update-order-status",
//           { id: orderId, order_status: "cancelled" },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         window.location.reload();
//       } catch (error) {
//         console.error("Failed to cancel order:", error);
//         alert("Failed to cancel order.");
//       }
//     }
//   };

//   const trackOrder = (orderId) => alert(`Tracking order ID: ${orderId}`);

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h2 className="text-2xl font-bold mb-4">Order Details</h2>
//       {isLoading && <p className="text-yellow-500">Loading orders...</p>}
//       {error && <p className="text-red-500">{error.message}</p>}

//       {currentOrders.length > 0 ? (
//         currentOrders.map((order, index) => (
//           <div key={order.id} className="border p-4 mb-4 rounded-lg shadow">
//             <h3 className="text-lg font-semibold">Order ID: {order.id}</h3>
//             <p><span className="font-semibold">Customer:</span> {order.name}</p>
//             <p><span className="font-semibold">Address:</span> {order.street1}, {order.city}, {order.state} - {order.pincode}</p>
//             <p><span className="font-semibold">Mobile:</span> {order.mobile}</p>

//             <div className="mt-4">
//               <h4 className="font-semibold">Ordered Products:</h4>
//               {cartQueries[index]?.data ? (
//                 <ul>
//                   {cartQueries[index].data.map((item) => (
//                     <li key={item.product.id} className="flex items-center mb-2 border-b pb-2">
//                       <img
//                         src={`http://127.0.0.1:8000/storage/${item.product.image}`}
//                         alt={item.product.name}
//                         className="w-20 h-20 object-cover rounded-lg mr-2"
//                       />
//                       <div>
//                         <p className="font-semibold">{item.product.name}</p>
//                         <p>Size: {item.size.toUpperCase()}</p>
//                         <p>Quantity: {item.quantity}</p>
//                         <p>Price: ₹{item.product.price}</p>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-gray-500">Fetching product details...</p>
//               )}
//             </div>

//             <p className="mt-4 font-semibold">
//               Order Status: <span className="px-2 py-1 rounded bg-gray-200">{order.order_status}</span>
//             </p>
//             <p className="mt-4 font-semibold">
//               Bag Total: <span className="px-2 py-1 rounded bg-gray-200">₹{order.cart_total}</span>
//             </p>

//             <div className="mt-4 flex space-x-4">
//               <button
//                 onClick={() => trackOrder(order.id)}
//                 className="bg-neutral-500 text-white px-4 py-2 rounded hover:bg-neutral-600"
//               >
//                 Track Order
//               </button>
//               <button
//                 onClick={() => cancelOrder(order.id)}
//                 className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//               >
//                 Cancel Order
//               </button>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-500">No current orders found.</p>
//       )}

//       {pastOrdersList.length > 0 && (
//         <>
//           <h2 className="text-2xl font-bold mb-4 mt-8">Past Orders</h2>
//           {pastOrdersList.map((order, index) => (
//             <div key={order.id} className="border p-4 mb-4 rounded-lg shadow">
//               <h3 className="text-lg font-semibold">Order ID: {order.id}</h3>
//               <p>Status: {order.order_status}</p>

//               <div className="mt-4">
//                 {pastCartQueries[index]?.data?.map((item) => (
//                   <div key={item.id} className="flex items-center mb-4">
//                     <img
//                       src={`http://127.0.0.1:8000/storage/${item.product.image}`}
//                       alt={item.product.name}
//                       className="w-20 h-20 object-cover rounded-lg mr-4"
//                     />
//                     <div>
//                       <p>{item.product.name}</p>
//                       <p>Size: {item.size}</p>
//                       <p>Quantity: {item.quantity}</p>
//                       <p>Price: ₹{item.product.price}</p>

//                       {order.order_status === "Delivered" && (
//                         <ReviewForm productId={item.product.id} accessToken={token} />
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </>
//       )}
//     </div>
//   );
// }





// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "/src/components/Hooks/useAuth";
// import { useQuery, useQueries } from "@tanstack/react-query";
// import axios from "axios";
// import ReviewForm from "./ReviewForm";
// import toast, { Toaster } from "react-hot-toast";

// const fetchOrders = async () => {
//   const token = localStorage.getItem("token");
//   const res = await axios.get("http://127.0.0.1:8000/api/allorders", {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.data;
// };

// const fetchCartById = async (cartId) => {
//   const token = localStorage.getItem("token");
//   const res = await axios.get(`http://127.0.0.1:8000/api/cart/${cartId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.data.items;
// };

// export default function OrderDetails() {
//   const navigate = useNavigate();
//   const isLoggedIn = useAuth();
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!isLoggedIn) {
//       toast.error("Please log in.");
//       const timeout = setTimeout(() => {
//         navigate("/login");
//       }, 1500);
//       return () => clearTimeout(timeout);
//     }
//   }, [isLoggedIn, navigate]);

//   const {
//     data: allOrders = [],
//     isLoading: ordersLoading,
//     error,
//   } = useQuery({
//     queryKey: ["orders"],
//     queryFn: fetchOrders,
//     enabled: !!token,
//     retry: false, // Avoid retrying on 404
//   });

//   const currentOrders = allOrders.filter(
//     (order) => order.order_status !== "cancelled" && order.order_status !== "Delivered"
//   );

//   const pastOrdersList = allOrders.filter(
//     (order) => order.order_status === "cancelled" || order.order_status === "Delivered"
//   );

//   const cartQueries = useQueries({
//     queries: currentOrders.map((order) => ({
//       queryKey: ["cart", order.cart_id],
//       queryFn: () => fetchCartById(order.cart_id),
//       enabled: !!token,
//     })),
//   });

//   const pastCartQueries = useQueries({
//     queries: pastOrdersList.map((order) => ({
//       queryKey: ["pastCart", order.cart_id],
//       queryFn: () => fetchCartById(order.cart_id),
//       enabled: !!token,
//     })),
//   });

//   const cartLoading =
//     cartQueries.some((q) => q.isLoading) || pastCartQueries.some((q) => q.isLoading);

//   const isPageLoading = ordersLoading || cartLoading;

//   const cancelOrder = async (orderId) => {
//     if (window.confirm("Are you sure you want to cancel this order?")) {
//       try {
//         await axios.post(
//           "http://127.0.0.1:8000/api/update-order-status",
//           { id: orderId, order_status: "cancelled" },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         window.location.reload();
//       } catch (error) {
//         console.error("Failed to cancel order:", error);
//         toast.error("Failed to cancel order.");
//       }
//     }
//   };

//   const trackOrder = (orderId) => toast(`Tracking order ID: ${orderId}`);

//   const showNoOrders =
//     !isPageLoading && currentOrders.length === 0 && pastOrdersList.length === 0;

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <Toaster position="top-center" reverseOrder={false} />
//       <h2 className="text-2xl font-bold mb-4 text-center">Order Details</h2>

//       {/* Loading */}
//       {isPageLoading && (
//         <div className="flex justify-center items-center h-40">
//           <p className="text-black font-semibold text-lg">Loading your orders, please wait...</p>
//         </div>
//       )}

//       {/* Show only clean message if no orders */}
//       {showNoOrders && (
//         <div className="flex justify-center items-center h-40">
//           <p className="text-gray-700 font-semibold text-lg">No orders found.</p>
//         </div>
//       )}

//       {/* Show current orders */}
//       {!isPageLoading &&
//         currentOrders.length > 0 &&
//         currentOrders.map((order, index) => (
//           <div key={order.id} className="border p-4 mb-4 rounded-lg shadow">
//             <h3 className="text-lg font-semibold">Order ID: {order.id}</h3>
//             <p><span className="font-semibold">Customer:</span> {order.name}</p>
//             <p><span className="font-semibold">Address:</span> {order.street1}, {order.city}, {order.state} - {order.pincode}</p>
//             <p><span className="font-semibold">Mobile:</span> {order.mobile}</p>

//             <div className="mt-4">
//               <h4 className="font-semibold">Ordered Products:</h4>
//               <ul>
//                 {cartQueries[index]?.data?.map((item) => (
//                   <li key={item.product.id} className="flex items-center mb-2 border-b pb-2">
//                     <img
//                       src={`http://127.0.0.1:8000/storage/${item.product.image}`}
//                       alt={item.product.name}
//                       className="w-20 h-20 object-cover rounded-lg mr-2"
//                     />
//                     <div>
//                       <p className="font-semibold">{item.product.name}</p>
//                       <p>Size: {item.size.toUpperCase()}</p>
//                       <p>Quantity: {item.quantity}</p>
//                       <p>Price: ₹{item.product.price}</p>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <p className="mt-4 font-semibold">
//               Order Status: <span className="px-2 py-1 rounded bg-gray-200">{order.order_status}</span>
//             </p>
//             <p className="mt-4 font-semibold">
//               Bag Total: <span className="px-2 py-1 rounded bg-gray-200">₹{order.cart_total}</span>
//             </p>

//             <div className="mt-4 flex space-x-4">
//               <button
//                 onClick={() => trackOrder(order.id)}
//                 className="bg-neutral-500 text-white px-4 py-2 rounded hover:bg-neutral-600"
//               >
//                 Track Order
//               </button>
//               <button
//                 onClick={() => cancelOrder(order.id)}
//                 className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//               >
//                 Cancel Order
//               </button>
//             </div>
//           </div>
//         ))}

//       {/* Past orders section */}
//       {!isPageLoading && pastOrdersList.length > 0 && (
//         <>
//           <h2 className="text-2xl font-bold mb-4 mt-8 text-center">Past Orders</h2>
//           {pastOrdersList.map((order, index) => (
//             <div key={order.id} className="border p-4 mb-4 rounded-lg shadow">
//               <h3 className="text-lg font-semibold">Order ID: {order.id}</h3>
//               <p>Status: {order.order_status}</p>

//               <div className="mt-4">
//                 {pastCartQueries[index]?.data?.map((item) => (
//                   <div key={item.id} className="flex items-center mb-4">
//                     <img
//                       src={`http://127.0.0.1:8000/storage/${item.product.image}`}
//                       alt={item.product.name}
//                       className="w-20 h-20 object-cover rounded-lg mr-4"
//                     />
//                     <div>
//                       <p>{item.product.name}</p>
//                       <p>Size: {item.size}</p>
//                       <p>Quantity: {item.quantity}</p>
//                       <p>Price: ₹{item.product.price}</p>
//                       {order.order_status === "Delivered" && (
//                         <ReviewForm productId={item.product.id} accessToken={token} />
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </>
//       )}
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import { useNavigate,useLocation } from "react-router-dom";
// import { useAuth } from "/src/components/Hooks/useAuth";
// import { useQuery, useQueries } from "@tanstack/react-query";
// import axios from "axios";
// import ReviewForm from "./ReviewForm";
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

// export default function OrderDetails() {
//   const navigate = useNavigate();
//   const isLoggedIn = useAuth();
//   const token = localStorage.getItem("token");
//   const [cancelOrderId, setCancelOrderId] = useState(null);
//   const location = useLocation();

//   // useEffect(() => {
//   //   if (!isLoggedIn) {
//   //     toast.error("Please log in.");
//   //     const timeout = setTimeout(() => {
//   //       navigate("/login");
//   //     }, 1500);
//   //     return () => clearTimeout(timeout);
//   //   }
//   // }, [isLoggedIn, navigate]);

//   useEffect(() => {
//       if (!token) {
//         if (!localStorage.getItem("redirectAfterLogin")) {
//           localStorage.setItem("redirectAfterLogin", location.pathname);
//         }
//         toast.error("Please log in first!");
//         navigate("/login");
//       }
//     }, [token, navigate, location]);

//   const {
//     data: allOrders = [],
//     isLoading: ordersLoading,
//     error,
//   } = useQuery({
//     queryKey: ["orders"],
//     queryFn: fetchOrders,
//     enabled: !!token,
//     retry: false,
//     staleTime: 1000 * 60 * 5,
//     cacheTime: 1000 * 60 * 10,
//   });

//   const currentOrders = allOrders.filter(
//     (order) => order.order_status !== "cancelled" && order.order_status !== "Delivered"
//   );

//   const pastOrdersList = allOrders.filter(
//     (order) => order.order_status === "cancelled" || order.order_status === "Delivered"
//   );

//   const cartQueries = useQueries({
//     queries: currentOrders.map((order) => ({
//       queryKey: ["cart", order.cart_id],
//       queryFn: () => fetchCartById(order.cart_id),
//       enabled: !!token,
//       staleTime: 1000 * 60 * 5,
//       cacheTime: 1000 * 60 * 10,
//     })),
//   });

//   const pastCartQueries = useQueries({
//     queries: pastOrdersList.map((order) => ({
//       queryKey: ["pastCart", order.cart_id],
//       queryFn: () => fetchCartById(order.cart_id),
//       enabled: !!token,
//       staleTime: 1000 * 60 * 5,
//       cacheTime: 1000 * 60 * 10,
//     })),
//   });

//   const cartLoading =
//     cartQueries.some((q) => q.isLoading) || pastCartQueries.some((q) => q.isLoading);

//   const isPageLoading = ordersLoading || cartLoading;

//   const trackOrder = (orderId) => toast(`Tracking order ID: ${orderId}`);

//   const showNoOrders =
//     !isPageLoading && currentOrders.length === 0 && pastOrdersList.length === 0;

//   return (
//   <div className="container mx-auto px-4 py-10 bg-gradient-to-br from-gray-50 via-white to-gray-100">
//     <Toaster position="top-center" reverseOrder={false} />

//     <h2 className="text-2xl font-semibold mb-8 text-center tracking-wide text-gray-900">
//       ORDER DETAILS
//     </h2>

//     {/* Loading */}
//     {isPageLoading && (
//       <div className="flex justify-center items-center h-40">
//         <p className="text-gray-800 font-medium text-lg">
//           Loading your orders, please wait...
//         </p>
//       </div>
//     )}

//     {/* No Orders */}
//     {showNoOrders && (
//       <div className="flex justify-center items-center h-40">
//         <p className="text-gray-600 font-medium text-lg">No orders found.</p>
//       </div>
//     )}

//     {/* Current Orders */}
//     {!isPageLoading &&
//       currentOrders.length > 0 &&
//       currentOrders.map((order, index) => (
//         <div
//           key={order.id}
//           className="bg-white shadow-md p-6 mb-6 border border-gray-200"
//         >
//           <h3 className="text-xl font-semibold mb-2 text-gray-900">
//             Order ID: {order.id}
//           </h3>
//           <p className="text-gray-700">
//             <span className="font-medium">Customer:</span> {order.name}
//           </p>
//           <p className="text-gray-700">
//             <span className="font-medium">Address:</span> {order.street1},{" "}
//             {order.city}, {order.state} - {order.pincode}
//           </p>
//           <p className="text-gray-700">
//             <span className="font-medium">Mobile:</span> {order.mobile}
//           </p>

//           <div className="mt-6">
//             <h4 className="font-semibold text-gray-900 mb-3">
//               Ordered Products:
//             </h4>
//             <ul>
//               {cartQueries[index]?.data?.map((item) => (
//                 <li
//                   key={item.product.id}
//                   className="flex items-center mb-4 pb-4 border-b border-gray-200"
//                 >
//                   <img
//                     src={`${import.meta.env.VITE_BASE_URL}/storage/${item.product.image}`}
//                     alt={item.product.name}
//                     className="w-24 h-24 object-cover mr-4 shadow-sm"
//                   />
//                   <div>
//                     <p className="font-medium text-gray-900">
//                       {item.product.name}
//                     </p>
//                     <p className="text-gray-600">
//                       Size: {item.size.toUpperCase()}
//                     </p>
//                     <p className="text-gray-600">Quantity: {item.quantity}</p>
//                     <p className="text-gray-800">
//                       Price: ₹{item.product.price}
//                     </p>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <p className="mt-4 font-semibold text-gray-900">
//             Order Status:{" "}
//             <span className="bg-gray-100 px-2 py-1">{order.order_status}</span>
//           </p>
//           <p className="mt-2 font-semibold text-gray-900">
//             Bag Total:{" "}
//             <span className="bg-gray-100 px-2 py-1">₹{order.cart_total}</span>
//           </p>

//           <div className="mt-6 flex space-x-4">
//             <button
//               onClick={() => trackOrder(order.id)}
//               className="bg-gray-900 text-white px-5 py-2 hover:bg-gray-800 transition"
//             >
//               Track Order
//             </button>
//             {order.order_status === "Order Placed" && (
//               <button
//                 onClick={() => setCancelOrderId(order.id)}
//                 className="bg-red-600 text-white px-5 py-2 hover:bg-red-700 transition"
//               >
//                 Cancel Order
//               </button>
//             )}
//           </div>
//         </div>
//       ))}

//     {/* Past Orders */}
//     {!isPageLoading && pastOrdersList.length > 0 && (
//       <>
//         <h2 className="text-3xl font-semibold mb-8 mt-12 text-center tracking-wide text-gray-900">
//           Past Orders
//         </h2>
//         {pastOrdersList.map((order, index) => (
//           <div
//             key={order.id}
//             className="bg-white shadow-md p-6 mb-6 border border-gray-200"
//           >
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">
//               Order ID: {order.id}
//             </h3>
//             <p className="text-gray-700">Status: {order.order_status}</p>

//             <div className="mt-6">
//               {pastCartQueries[index]?.data?.map((item) => (
//                 <div key={item.id} className="flex items-center mb-6">
//                   <img
//                     src={`${import.meta.env.VITE_BASE_URL}/storage/${item.product.image}`}
//                     alt={item.product.name}
//                     className="w-24 h-24 object-cover mr-4 shadow-sm"
//                   />
//                   <div>
//                     <p className="font-medium text-gray-900">
//                       {item.product.name}
//                     </p>
//                     <p className="text-gray-600">Size: {item.size}</p>
//                     <p className="text-gray-600">Quantity: {item.quantity}</p>
//                     <p className="text-gray-800">
//                       Price: ₹{item.product.price}
//                     </p>
//                     {order.order_status === "Delivered" && (
//                       <ReviewForm
//                         productId={item.product.id}
//                         accessToken={token}
//                       />
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </>
//     )}

//     {/* Cancel Modal */}
//     {cancelOrderId && (
//       <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//         <div className="bg-white p-8 shadow-lg max-w-sm w-full text-center">
//           <h3 className="text-xl font-semibold mb-4 text-gray-900">
//             Cancel Order
//           </h3>
//           <p className="mb-6 text-gray-700">
//             Are you sure you want to cancel this order?
//           </p>
//           <div className="flex justify-center space-x-4">
//             <button
//               onClick={() => setCancelOrderId(null)}
//               className="bg-gray-300 px-5 py-2 hover:bg-gray-400 transition"
//             >
//               No
//             </button>
//             <button
//               onClick={async () => {
//                 try {
//                   await axios.post(
//                     `${import.meta.env.VITE_API_URL}/update-order-status`,
//                     { id: cancelOrderId, order_status: "cancelled" },
//                     { headers: { Authorization: `Bearer ${token}` } }
//                   );
//                   toast.success("Order cancelled successfully.");
//                   setCancelOrderId(null);
//                   window.location.reload();
//                 } catch (error) {
//                   console.error("Failed to cancel order:", error);
//                   toast.error("Failed to cancel order.");
//                   setCancelOrderId(null);
//                 }
//               }}
//               className="bg-red-600 text-white px-5 py-2 hover:bg-red-700 transition"
//             >
//               Yes, Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     )}
//   </div>
// );
// }





import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

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

export default function OrderDetails() {
  const { id } = useParams(); // order id from URL
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (!token) {
      if (!localStorage.getItem("redirectAfterLogin")) {
        localStorage.setItem("redirectAfterLogin", location.pathname);
      }
      toast.error("Please log in first!");
      navigate("/login");
    }
  }, [token, navigate, location]);

  // Fetch all orders
  const {
    data: allOrders = [],
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    enabled: !!token,
  });

  // Find current order
  const order = allOrders.find((o) => o.id === parseInt(id));

  // Fetch cart for this order
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

  const handleCancelOrder = async () => {
    try {
      setCanceling(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/update-order-status`,
        { id: order.id, order_status: "cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order cancelled successfully.");
      navigate("/orders"); // back to order list
    } catch (err) {
      toast.error("Failed to cancel order.");
    } finally {
      setCanceling(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-800 font-medium text-lg">Loading order details...</p>
      </div>
    );
  }

  if (ordersError || cartError || !order) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-red-500 font-medium text-lg">Failed to load order.</p>
      </div>
    );
  }

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
          STATUS: <span className="font-semibold uppercase">{order.order_status}</span>
        </p>
      </div>

      {/* Products */}
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div key={item.product.id} className="flex items-center pl-0">
            <img
              src={`${import.meta.env.VITE_BASE_URL}/storage/${item.product.image}`}
              alt={item.product.name}
              className="w-18 h-28 object-contain"
            />
            <div className="ml-4">
              <p className="font-medium text-gray-900">{item.product.name}</p>
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
      <div className="mt-10 pl-0">
        <h3 className="text-xl font-semibold   mb-2 uppercase">
          Shipping Address
        </h3>
        <p className="text-gray-700">
          {order.name}, {order.street1}, {order.city}, {order.state} -{" "}
          {order.pincode}
        </p>
        <p className="text-gray-700">Mobile: {order.mobile}</p>
      </div>

{/* Bag Total */}
<div className="mt-6 pl-0">
  <h3 className="text-xl  font-semibold uppercase mb-3">
    Bag Total
  </h3>

  <div className="flex justify-between items-center">
    <span className="text-gray-700 font-medium">Total</span>
    <span className="text-gray-900 font-semibold">₹{order.cart_total}</span>
  </div>
</div>


      {/* Cancel Button */}
      {order.order_status === "Order Placed" && (
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
