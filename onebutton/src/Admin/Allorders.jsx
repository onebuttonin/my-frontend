// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function AdminOrders() {
//     const [orders, setOrders] = useState([]);
//     const [cartDetails, setCartDetails] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const navigate =  useNavigate();

//     const token = localStorage.getItem("admin_token");

//     // Fetch all orders
//     useEffect(() => {
//         axios
//             .get("http://127.0.0.1:8000/api/adminallorders",{
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                   }
//             })
//             .then(response => {
//                 setOrders(response.data);
//                 fetchCartDetails(response.data);  // Fetch cart details after setting orders
//             })
//             .catch(error => {
//                 console.error("Error fetching orders:", error);
//                 setError("Failed to load orders.");
//             })
//             .finally(() => setLoading(false));
//     }, []);

//     // Fetch cart details for each order
//     const fetchCartDetails = (ordersData) => {
//         ordersData.forEach(order => {
//             axios
//                 .get(`http://127.0.0.1:8000/api/carts/${order.cart_id}`)
//                 .then(response => {
//                     setCartDetails(prev => ({
//                         ...prev,
//                         [order.cart_id]: response.data
//                     }));
//                 })
//                 .catch(error => console.error(`Failed to fetch cart for order ${order.id}:`, error));
//         });
//     };
                
              
//     // Function to update order status
//     const updateOrderStatus = (orderId, newStatus) => {
//         axios
//             .post("http://127.0.0.1:8000/api/update-status", {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                   },
//                 id: orderId,
//                 order_status: newStatus
                
//             })
//             .then(() => {
//                 setOrders(prevOrders => prevOrders.map(order =>
//                     order.id === orderId ? { ...order, order_status: newStatus } : order
//                 ));
//             })
//             .catch(error => {
//                 console.error("Error updating order status:", error);
//                 setError("Failed to update order status.");
//             });
//     };

//     return (
//         <div className="container mx-auto px-4 py-6">
//             <button className="bg-neutral-200 px-4 py-2 font-bold rounded-lg ml-5 hover:bg-neutral-300" 
//             onClick={() => navigate("/Admin/DashBoard")}>DashBoard</button>
//             <h2 className="text-2xl font-bold text-center mb-6">All Orders</h2>

//             {loading && <p className="text-yellow-500 text-center">Loading orders...</p>}
//             {error && <p className="text-red-500 text-center">{error}</p>}

//             <div className="bg-white p-4 shadow-md rounded-lg">
//                 {orders.length === 0 ? (
//                     <p className="text-gray-500 text-center">No orders found.</p>
//                 ) : (
//                     <table className="w-full border-collapse border border-gray-300 text-center">
//                         <thead>
//                             <tr className="bg-gray-200">
//                                 <th className="border border-gray-300 p-2">Order ID</th>
//                                 <th className="border border-gray-300 p-2">Customer</th>
//                                 <th className="border border-gray-300 p-2">Address</th>
//                                 <th className="border border-gray-300 p-2">Products Id</th>
//                                 <th className="border border-gray-300 p-2">Order Details</th>
//                                 <th className="border border-gray-300 p-2">Total Price</th>
//                                 <th className="border border-gray-300 p-2">Payment Type</th>
//                                 <th className="border border-gray-300 p-2">Status</th>
//                                 <th className="border border-gray-300 p-2">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {orders.map(order => (
//                                 <tr key={order.id} className="border border-gray-300">
//                                     <td className="border border-gray-300 p-2">{order.id}</td>
                                    
//                                     {/* Customer Details */}
//                                     <td className="border border-gray-300 p-2">
//                                         <p><strong>Name:</strong> {order.name}</p>
//                                         <p><strong>Phone:</strong> {order.mobile}</p>
//                                     </td>

//                                     {/* Customer Address */}
//                                     <td className="border border-gray-300 p-2">
//                                         <p>{order.street1 + " " + order.street2}</p>
//                                         <p>{order.city}, {order.state}</p>
//                                         <p>{order.pincode}</p>
//                                     </td>

//                                     <td className="border border-gray-300 p-2">
//     {cartDetails[order.cart_id]?.items ? (  
//         <ul>
//             {cartDetails[order.cart_id].items.map(item => (
//                 <li key={item.id}>
//                     <p>{item.product.id}</p>
//                 </li>
//             ))}
//         </ul>
//     ) : (
//         <p>Loading...</p>
//     )}
// </td>

// {/* Order Details */}
// <td className="border border-gray-300 p-2">
//     {cartDetails[order.cart_id]?.items ? (
//         <ul>
//             {cartDetails[order.cart_id].items.map(item => (
//                 <li key={item.id} className="flex items-center mb-2">
//                     <img
//                         src={`http://127.0.0.1:8000/storage/${item.product.image}`}
//                         alt={item.product.name}
//                         className="w-16 h-16 object-cover rounded mr-2"
//                     />
//                     <div>
//                         <p className="font-semibold">{item.product.name}</p> 
//                         <p>₹{item.product.price} x {item.quantity}</p> 
//                         <p>Size: {item.size}</p>
//                     </div>
//                 </li>
//             ))}
//         </ul>
//     ) : (
//         <p className="text-gray-500">Loading...</p>
//     )}
// </td>


//                                     {/* Total Order Price */}
//                                     <td className="border border-gray-300 p-2">₹{order.cart_total || "N/A"}</td>

//                                      <td className="border border-gray-300 p-2">{order.payment_method}</td>

//                                     {/* Order Status */}
//                                     <td className="border border-gray-300 p-2">
//                                         <span className={`px-2 py-1 rounded ${order.order_status === "Pending" ? "bg-yellow-300" : order.order_status === "Shipped" ? "bg-blue-300" : "bg-green-300"}`}>
//                                             {order.order_status}
//                                         </span>
//                                     </td>

//                                     {/* Update Order Status */}
//                                     <td className="border border-gray-300 p-2">
//                                         <select
//                                             className="border p-2 rounded"
//                                             value={order.order_status}
//                                             onChange={(e) => updateOrderStatus(order.id, e.target.value)}
//                                         >
//                                             <option value="Pending">Pending</option>
//                                             <option value="Shipped">Shipped</option>
//                                             <option value="Delivered">Delivered</option>
//                                         </select>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// }



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function AdminOrders() {
//     const [orders, setOrders] = useState([]);
//     const [filteredOrders, setFilteredOrders] = useState([]);
//     const [cartDetails, setCartDetails] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const [searchNameOrPhone, setSearchNameOrPhone] = useState("");
//     const [searchPincode, setSearchPincode] = useState("");
//     const [searchProductId, setSearchProductId] = useState("");
//     const [priceFilter, setPriceFilter] = useState("");
//     const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
//     const [statusFilter, setStatusFilter] = useState("");

//     const navigate = useNavigate();
//     const token = localStorage.getItem("admin_token");

//     useEffect(() => {
//         axios
//             .get(`${import.meta.env.VITE_API_URL}/adminallorders`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 }
//             })
//             .then(response => {
//                 setOrders(response.data);
//                 setFilteredOrders(response.data);
//                 fetchCartDetails(response.data);
//             })
//             .catch(error => {
//                 console.error("Error fetching orders:", error);
//                 setError("Failed to load orders.");
//             })
//             .finally(() => setLoading(false));
//     }, []);

//     const fetchCartDetails = (ordersData) => {
//         ordersData.forEach(order => {
//             axios
//                 .get(`${import.meta.env.VITE_API_URL}/carts/${order.cart_id}`)
//                 .then(response => {
//                     setCartDetails(prev => ({
//                         ...prev,
//                         [order.cart_id]: response.data
//                     }));
//                 })
//                 .catch(error => console.error(`Failed to fetch cart for order ${order.id}:`, error));
//         });
//     };

//     // const updateOrderStatus = (orderId, newStatus) => {
//     //     axios
//     //         .post(`${import.meta.env.VITE_API_URL}/update-status`, {
//     //             id: orderId,
//     //             order_status: newStatus
//     //         })
//     //         .then(() => {
//     //             setOrders(prevOrders => prevOrders.map(order =>
//     //                 order.id === orderId ? { ...order, order_status: newStatus } : order
//     //             ));
//     //             setFilteredOrders(prevOrders => prevOrders.map(order =>
//     //                 order.id === orderId ? { ...order, order_status: newStatus } : order
//     //             ));
//     //         })
//     //         .catch(error => {
//     //             console.error("Error updating order status:", error);
//     //             setError("Failed to update order status.");
//     //         });
//     // };


// // make sure templateMap is defined somewhere accessible



// const templateMap = {
//   "Order Confirmed": 1,
//   "Shipped": 2,
//   "In Transit": 3,
//   "Out For Delivery": 4,
//   "Delivered": 5,
//   "Cancelled": 6
// };

// const updateOrderStatus = (orderId, newStatus) => {
//   // find order BEFORE mutating state so we have the correct data to use for email
//   const order = orders.find(o => o.id === orderId);

//   // We'll still attempt to update order status on server even if `order` is not found locally.
//   axios
//     .post(
//       `${import.meta.env.VITE_API_URL}/update-status`,
//       { id: orderId, order_status: newStatus },
//       { headers: { Authorization: `Bearer ${token}` } }
//     )
//     .then(() => {
//       // update local UI state
//       setOrders(prevOrders =>
//         prevOrders.map(o => (o.id === orderId ? { ...o, order_status: newStatus } : o))
//       );
//       setFilteredOrders(prevOrders =>
//         prevOrders.map(o => (o.id === orderId ? { ...o, order_status: newStatus } : o))
//       );

//       // If we don't have the order locally, skip sending email (or you could fetch it)
//       if (!order) {
//         console.warn("Order not found locally, skipping email send. orderId:", orderId);
//         return;
//       }

//       // Prepare email payload using nested user object (or fallbacks)
//       const email = order.user?.email || order.user_email || order.email || order.customer_email || "";
//       const name =
//         order.user?.name ||
//         order.user_name ||
//         order.name ||
//         order.customer_name ||
//         `${order.first_name || ""} ${order.last_name || ""}`.trim() ||
//         "Customer";

//       if (!email) {
//         console.warn("No recipient email available for order, skipping email send:", { orderId, name });
//         return;
//       }

//       const templateId = templateMap[newStatus]; // undefined if not found
//       const payload = {
//         email,
//         name,
//         orderId: orderId,
//         trackingId: order.tracking_id || order.trackingId || "",
//         orderStatus: newStatus
//       };

//       if (typeof templateId !== "undefined") {
//         payload.templateId = templateId;
//       }

//       // Log payload for debugging (remove in production)
//       console.log("Sending order email payload:", payload);

//       // call send-order-mail endpoint
//       axios.post(`${import.meta.env.VITE_API_URL}/send-order-mail`, payload, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       .then(res => {
//         console.log('Email queued', res.data);
//       })
//       .catch(err => {
//         console.error('Failed to send order email', {
//           status: err.response?.status,
//           data: err.response?.data,
//           payload
//         });
//       });

//     })
//     .catch(error => {
//       console.error("Error updating order status:", error);
//       setError("Failed to update order status.");
//     });
// };


//     useEffect(() => {
//         applyFilters();
//     }, [searchNameOrPhone, searchPincode, searchProductId, priceFilter, paymentMethodFilter, statusFilter, cartDetails]);

//     const applyFilters = () => {
//         let tempOrders = [...orders];

//         if (searchNameOrPhone.trim() !== "") {
//             tempOrders = tempOrders.filter(order =>
//                 (order.name && order.name.toLowerCase().includes(searchNameOrPhone.toLowerCase())) ||
//                 (order.mobile && order.mobile.includes(searchNameOrPhone))
//             );
//         }

//         if (searchPincode.trim() !== "") {
//             tempOrders = tempOrders.filter(order =>
//                 order.pincode && order.pincode.includes(searchPincode)
//             );
//         }

//         if (searchProductId.trim() !== "") {
//             tempOrders = tempOrders.filter(order =>
//                 cartDetails[order.cart_id]?.items?.some(item => 
//                     item.product.id.toString().includes(searchProductId)
//                 )
//             );
//         }

//         if (priceFilter !== "") {
//             tempOrders = tempOrders.filter(order =>
//                 order.cart_total <= parseInt(priceFilter)
//             );
//         }

//         if (paymentMethodFilter !== "") {
//             tempOrders = tempOrders.filter(order =>
//                 order.payment_method === paymentMethodFilter
//             );
//         }

//         if (statusFilter !== "") {
//             tempOrders = tempOrders.filter(order =>
//                 order.order_status === statusFilter
//             );
//         }

//         setFilteredOrders(tempOrders);
//     };

//     return (
//         <div className="container mx-auto px-4 py-6">
//             <button className="bg-neutral-200 px-4 py-2 font-bold rounded-lg ml-5 hover:bg-neutral-300" 
//             onClick={() => navigate("/Admin/DashBoard")}>DashBoard</button>
//             <h2 className="text-2xl font-bold text-center mb-6">All Orders</h2>

//             {loading && <p className="text-yellow-500 text-center">Loading orders...</p>}
//             {error && <p className="text-red-500 text-center">{error}</p>}

//             {/* Filters */}
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//                 <input
//                     type="text"
//                     placeholder="Search by Name or Phone"
//                     value={searchNameOrPhone}
//                     onChange={e => setSearchNameOrPhone(e.target.value)}
//                     className="border p-2 rounded"
//                 />
//                 <input
//                     type="text"
//                     placeholder="Search by Pincode"
//                     value={searchPincode}
//                     onChange={e => setSearchPincode(e.target.value)}
//                     className="border p-2 rounded"
//                 />
//                 <input
//                     type="text"
//                     placeholder="Search by Product ID"
//                     value={searchProductId}
//                     onChange={e => setSearchProductId(e.target.value)}
//                     className="border p-2 rounded"
//                 />
//                 <select
//                     value={priceFilter}
//                     onChange={e => setPriceFilter(e.target.value)}
//                     className="border p-2 rounded"
//                 >
//                     <option value="">Filter by Price</option>
//                     <option value="1000">Below ₹1000</option>
//                     <option value="1500">Below ₹1500</option>
//                     <option value="3000">Below ₹3000</option>
//                     <option value="5000">Below ₹5000</option>
//                     <option value="10000">Below ₹10000</option>
//                 </select>
//                 <select
//                     value={paymentMethodFilter}
//                     onChange={e => setPaymentMethodFilter(e.target.value)}
//                     className="border p-2 rounded"
//                 >
//                     <option value="">Filter by Payment Method</option>
//                     <option value="COD">COD</option>
//                     <option value="Online">Online</option>
//                 </select>
//                 <select
//                     value={statusFilter}
//                     onChange={e => setStatusFilter(e.target.value)}
//                     className="border p-2 rounded"
//                 >
//                     <option value="">Filter by Status</option>
//                     {/* <option value="Delivered">Cancelled</option> */}
//                     <option value="In Transit">In Transit</option>
//                     {/* <option value="Delivered">Order Placed</option> */}
//                     <option value="Shipped">Shipped</option>
//                       <option value="Out For Delivery">Out For Delivery</option>
//                     <option value="Delivered">Delivered</option>
//                 </select>
//             </div>

//             {/* Orders Table */}
//             <div className="bg-white p-4 shadow-md rounded-lg">
//                 {filteredOrders.length === 0 ? (
//                     <p className="text-gray-500 text-center">No orders found.</p>
//                 ) : (
//                     <table className="w-full border-collapse border border-gray-300 text-center">
//                         <thead>
//                             <tr className="bg-gray-200">
//                                 <th className="border border-gray-300 p-2">Order ID</th>
//                                 <th className="border border-gray-300 p-2">Customer</th>
//                                 <th className="border border-gray-300 p-2">Address</th>
//                                 <th className="border border-gray-300 p-2">Products Id</th>
//                                 <th className="border border-gray-300 p-2">Order Details</th>
//                                 <th className="border border-gray-300 p-2">Total Price</th>
//                                 <th className="border border-gray-300 p-2">Payment Type</th>
//                                 <th className="border border-gray-300 p-2">Status</th>
//                                 <th className="border border-gray-300 p-2">Actions</th>
//                                 <th className="border border-gray-300 p-2">Invoice</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredOrders.map(order => (
//                                 <tr key={order.id} className="border border-gray-300">
//                                     <td className="border border-gray-300 p-2">{order.id}</td>
                                    
//                                     {/* Customer Details */}
//                                     <td className="border border-gray-300 p-2">
//                                         <p><strong>Name:</strong> {order.name}</p>
//                                         <p><strong>Phone:</strong> {order.mobile}</p>
//                                     </td>

//                                     {/* Customer Address */}
//                                     <td className="border border-gray-300 p-2">
//                                         <p>{order.street1 + " " + order.street2}</p>
//                                         <p>{order.city}, {order.state}</p>
//                                         <p>{order.pincode}</p>
//                                     </td>

//                                     <td className="border border-gray-300 p-2">
//                                         {cartDetails[order.cart_id]?.items ? (  
//                                             <ul>
//                                                 {cartDetails[order.cart_id].items.map(item => (
//                                                     <li key={item.id}>
//                                                         <p>{item.product.id}</p>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         ) : (
//                                             <p>Loading...</p>
//                                         )}
//                                     </td>

//                                     {/* Order Details */}
//                                     <td className="border border-gray-300 p-2">
//                                         {cartDetails[order.cart_id]?.items ? (
//                                             <ul>
//                                                 {cartDetails[order.cart_id].items.map(item => (
//                                                     <li key={item.id} className="flex items-center mb-2">
//                                                         <img
//                                                             src={`${import.meta.env.VITE_BASE_URL}/storage/${item.product.image}`}
//                                                             alt={item.product.name}
//                                                             className="w-16 h-16 object-cover rounded mr-2"
//                                                         />
//                                                         <div>
//                                                             <p className="font-semibold">{item.product.name}</p> 
//                                                             <p>₹{item.product.price} x {item.quantity}</p> 
//                                                             <p>Size: {item.size}</p>
//                                                         </div>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         ) : (
//                                             <p className="text-gray-500">Loading...</p>
//                                         )}
//                                     </td>

//                                     <td className="border border-gray-300 p-2">₹{order.cart_total || "N/A"}</td>
//                                     <td className="border border-gray-300 p-2">{order.payment_method}</td>
//                                     <td className="border border-gray-300 p-2">
//                                         <span className={`px-2 py-1 rounded ${order.order_status === "Order Placed" ? "bg-yellow-300" : order.order_status === "Shipped" ? "bg-blue-300" : order.order_status ===  "Delivered" ? "bg-green-300" : "bg-white-300"}`}>
//                                             {order.order_status}
//                                         </span>
//                                     </td>
//                                     <td className="border border-gray-300 p-2">
//                                         <select
//                                             className="border p-2 rounded"
//                                             value={order.order_status}
//                                             onChange={(e) => updateOrderStatus(order.id, e.target.value)}
//                                         >
//                                              <option value="Order Confirmed">Order Confirmed</option>                                   
//                                             <option value="Shipped">Shipped</option>
//                                             <option value="In Transit">In Transit</option>
//                                             <option value="Out For Delivery">Out For Delivery</option>
//                                             <option value="Delivered">Delivered</option>
//                                         </select>
//                                     </td>
//                                       <td>
//     <button
//         className="border bg-red-500 px-3 py-1 rounded text-white"
//         onClick={() => navigate(`/Admin/ProductInvoice/${order.id}`)}
//     >
//         Invoice
//     </button>
// </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [cartDetails, setCartDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchNameOrPhone, setSearchNameOrPhone] = useState("");
  const [searchPincode, setSearchPincode] = useState("");
  const [searchProductId, setSearchProductId] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  // map status to template ids (if needed)
  const templateMap = {
    "Order Confirmed": 1,
    Shipped: 2,
    "In Transit": 3,
    "Out For Delivery": 4,
    Delivered: 5,
    Cancelled: 6,
  };

  // verify admin session on mount
  useEffect(() => {
    const verifyAdminAndLoad = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data || true);
        // now fetch orders
        await fetchOrders(token);
      } catch (err) {
        console.error("Admin verification failed:", err);
        setAdmin(null);
        navigate("/admin/login");
      } finally {
        setCheckingAdmin(false);
        setLoading(false);
      }
    };

    verifyAdminAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // fetch orders
  const fetchOrders = async (token) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/adminallorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data || [];
      setOrders(data);
      setFilteredOrders(data);
      // fetch carts for orders
      fetchCartDetails(data, token);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCartDetails = (ordersData = [], token) => {
    if (!Array.isArray(ordersData) || ordersData.length === 0) return;
    ordersData.forEach((order) => {
      // guard cart_id
      if (!order?.cart_id) return;
      axios
        .get(`${import.meta.env.VITE_API_URL}/carts/${order.cart_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCartDetails((prev) => ({
            ...prev,
            [order.cart_id]: response.data,
          }));
        })
        .catch((err) =>
          console.error(`Failed to fetch cart for order ${order.id}:`, err)
        );
    });
  };

  // update order status and send notification email
  const updateOrderStatus = (orderId, newStatus) => {
    const token = localStorage.getItem("admin_token");
    // find local order copy (may be undefined if not present)
    const order = orders.find((o) => o.id === orderId);

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/update-status`,
        { id: orderId, order_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        // update UI state
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
        );
        setFilteredOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
        );

        // prepare and send email only if we have recipient details
        if (!order) {
          console.warn("Order not found locally; skipping email send.", orderId);
          return;
        }

        const email =
          order.user?.email ||
          order.user_email ||
          order.email ||
          order.customer_email ||
          "";
        const name =
          order.user?.name ||
          order.user_name ||
          order.name ||
          order.customer_name ||
          `${order.first_name || ""} ${order.last_name || ""}`.trim() ||
          "Customer";

        if (!email) {
          console.warn("No recipient email available for order, skipping email send:", {
            orderId,
            name,
          });
          return;
        }

        const templateId = templateMap[newStatus]; // may be undefined
        const payload = {
          email,
          name,
          orderId,
          trackingId: order.tracking_id || order.trackingId || "",
          orderStatus: newStatus,
        };
        if (typeof templateId !== "undefined") payload.templateId = templateId;

        axios
          .post(`${import.meta.env.VITE_API_URL}/send-order-mail`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            console.log("Order email queued", res.data);
          })
          .catch((err) => {
            console.error("Failed to send order email", {
              status: err.response?.status,
              data: err.response?.data,
            });
          });
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
        setError("Failed to update order status.");
      });
  };

  


  // filters re-apply when inputs or cartDetails change
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchNameOrPhone,
    searchPincode,
    searchProductId,
    priceFilter,
    paymentMethodFilter,
    statusFilter,
    cartDetails,
    orders,
  ]);

  const applyFilters = () => {
    let tempOrders = [...orders];

    if (searchNameOrPhone.trim() !== "") {
      const q = searchNameOrPhone.toLowerCase();
      tempOrders = tempOrders.filter(
        (order) =>
          (order.name && order.name.toLowerCase().includes(q)) ||
          (order.mobile && order.mobile.includes(searchNameOrPhone))
      );
    }

    if (searchPincode.trim() !== "") {
      tempOrders = tempOrders.filter(
        (order) => order.pincode && order.pincode.includes(searchPincode)
      );
    }

    if (searchProductId.trim() !== "") {
      tempOrders = tempOrders.filter((order) =>
        cartDetails[order.cart_id]?.items?.some((item) =>
          item.product?.id?.toString().includes(searchProductId)
        )
      );
    }

    if (priceFilter !== "") {
      const max = parseInt(priceFilter, 10) || 0;
      tempOrders = tempOrders.filter((order) => (order.cart_total || 0) <= max);
    }

    if (paymentMethodFilter !== "") {
      tempOrders = tempOrders.filter(
        (order) => order.payment_method === paymentMethodFilter
      );
    }

    if (statusFilter !== "") {
      tempOrders = tempOrders.filter((order) => order.order_status === statusFilter);
    }

    setFilteredOrders(tempOrders);
  };

  if (checkingAdmin) return <p className="text-center text-yellow-500">Checking admin session...</p>;
  if (!admin) return null; // navigation to login already triggered

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        className="bg-neutral-200 px-4 py-2 font-bold rounded-lg ml-5 hover:bg-neutral-300"
        onClick={() => navigate("/Admin/DashBoard")}
      >
        DashBoard
      </button>
      <h2 className="text-2xl font-bold text-center mb-6">All Orders</h2>

      {loading && <p className="text-yellow-500 text-center">Loading orders...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Name or Phone"
          value={searchNameOrPhone}
          onChange={(e) => setSearchNameOrPhone(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Search by Pincode"
          value={searchPincode}
          onChange={(e) => setSearchPincode(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Search by Product ID"
          value={searchProductId}
          onChange={(e) => setSearchProductId(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Filter by Price</option>
          <option value="1000">Below ₹1000</option>
          <option value="1500">Below ₹1500</option>
          <option value="3000">Below ₹3000</option>
          <option value="5000">Below ₹5000</option>
          <option value="10000">Below ₹10000</option>
        </select>
        <select
          value={paymentMethodFilter}
          onChange={(e) => setPaymentMethodFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Filter by Payment Method</option>
          <option value="COD">COD</option>
          <option value="Online">Online</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Filter by Status</option>
          <option value="In Transit">In Transit</option>
          <option value="Shipped">Shipped</option>
          <option value="Out For Delivery">Out For Delivery</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white p-4 shadow-md rounded-lg">
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500 text-center">No orders found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Order ID</th>
                <th className="border border-gray-300 p-2">Customer</th>
                <th className="border border-gray-300 p-2">Address</th>
                <th className="border border-gray-300 p-2">Products Id</th>
                <th className="border border-gray-300 p-2">Order Details</th>
                <th className="border border-gray-300 p-2">Total Price</th>
                <th className="border border-gray-300 p-2">Payment Type</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Actions</th>
                <th className="border border-gray-300 p-2">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border border-gray-300">
                  <td className="border border-gray-300 p-2">{order.id}</td>

                  {/* Customer Details */}
                  <td className="border border-gray-300 p-2">
                    <p>
                      <strong>Name:</strong> {order.name}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.mobile}
                    </p>
                  </td>

                  {/* Customer Address */}
                  <td className="border border-gray-300 p-2">
                    <p>{(order.street1 || "") + " " + (order.street2 || "")}</p>
                    <p>
                      {order.city || ""}, {order.state || ""}
                    </p>
                    <p>{order.pincode || ""}</p>
                  </td>

                  <td className="border border-gray-300 p-2">
                    {cartDetails[order.cart_id]?.items ? (
                      <ul>
                        {cartDetails[order.cart_id].items.map((item) => (
                          <li key={item.id}>
                            <p>{item.product?.id}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Loading...</p>
                    )}
                  </td>

                  {/* Order Details */}
                  <td className="border border-gray-300 p-2">
                    {cartDetails[order.cart_id]?.items ? (
                      <ul>
                        {cartDetails[order.cart_id].items.map((item) => (
                          <li key={item.id} className="flex items-center mb-2">
                            <img
                              src={`${import.meta.env.VITE_BASE_URL}/storage/${item.product?.image}`}
                              alt={item.product?.name}
                              className="w-16 h-16 object-cover rounded mr-2"
                            />
                            <div>
                              <p className="font-semibold">{item.product?.name}</p>
                              <p>
                                ₹{item.product?.price} x {item.quantity}
                              </p>
                              <p>Size: {item.size}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">Loading...</p>
                    )}
                  </td>

                  <td className="border border-gray-300 p-2">₹{order.cart_total || "N/A"}</td>
                  <td className="border border-gray-300 p-2">{order.payment_method}</td>
                  <td className="border border-gray-300 p-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        order.order_status === "Order Placed"
                          ? "bg-yellow-300"
                          : order.order_status === "Shipped"
                          ? "bg-blue-300"
                          : order.order_status === "Delivered"
                          ? "bg-green-300"
                          : "bg-gray-200"
                      }`}
                    >
                      {order.order_status}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <select
                      className="border p-2 rounded"
                      value={order.order_status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    >
                      <option value="Order Confirmed">Order Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Out For Delivery">Out For Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="border bg-red-500 px-3 py-1 rounded text-white"
                      onClick={() => navigate(`/Admin/ProductInvoice/${order.id}`)}
                    >
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
