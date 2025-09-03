
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function PlaceOrder() {
//     const navigate = useNavigate();

//     const cart_price = localStorage.getItem("cart_total");
//     const [userId, setUserId] = useState("");  // Store user_id from backend
    

//     const [order, setOrder] = useState({
//         name: "",
//         street1: "",
//         street2: "",
//         city: "",
//         state: "",
//         pincode: "",
//         mobile: "",
//         payment_method: "COD",
//         cart_id: "",  // Dynamically set
//         cart_total: cart_price,
//         user_id: ""   // Include user_id
//     });

//     const [loading, setLoading] = useState(true);
//     const [success, setSuccess] = useState("");
//     const [error, setError] = useState("");

//     // ✅ Fetch user_id and cart_id
//     useEffect(() => {
//         const token = localStorage.getItem("token");

//         if (token) {
//             // ✅ Fetch user_id from the backend
//             axios.get("http://127.0.0.1:8000/api/user-token", {
//                 headers: { Authorization: `Bearer ${token}` }
//             })
//             .then(response => {
//                 console.log("User ID:", response.data.id);
//                 setUserId(response.data.id);   // Store user_id
//                 setOrder(prevOrder => ({ ...prevOrder, user_id: response.data.id }));
//             })
//             .catch(error => {
//                 console.error("Failed to fetch user_id:", error);
//                 setError("Failed to fetch user ID.");
//             });
//         } else {
//             setError("Authentication token missing.");
//         }

//         const storedCartId = localStorage.getItem("cart_id");
        
//         if (storedCartId) {
//             console.log("Cart ID from localStorage:", storedCartId);
//             setOrder(prevOrder => ({ ...prevOrder, cart_id: storedCartId }));

//             // ✅ Fetch cart details
//             axios.get(`http://127.0.0.1:8000/api/cart/${storedCartId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             })
//             .then(response => {
//                 console.log("Cart Items by ID:", response.data);
//                 if (response.data && response.data.cart_id) {
//                     setOrder(prevOrder => ({
//                         ...prevOrder,
//                         cart_id: response.data.cart_id
//                     }));
//                 } else {
//                     setError("Cart items not found.");
//                 }
//             })
//             .catch((err) => {
//                 console.error("Failed to fetch cart items by ID:", err);
//                 setError("Failed to fetch cart items by ID.");
//             })
//             .finally(() => setLoading(false));
//         } else {
//             setError("Cart ID not found in localStorage.");
//             setLoading(false);
//         }
//     }, []);

//     const handleChange = (e) => {
//         setOrder({ ...order, [e.target.name]: e.target.value });
//     };

//     const placeOrder = () => {
//         console.log("Order Data Before Submission:", order);

//         if (!order.name || !order.street1 || !order.city || !order.state || !order.pincode || !order.mobile || !order.payment_method || !order.cart_id || !order.user_id) {
//             setError("All fields are required.");
//             return;
//         }

//         const token = localStorage.getItem("token");

//         axios.post("http://127.0.0.1:8000/api/orders", order, {
//             headers: { Authorization: `Bearer ${token}` }
//         })
//             .then(response => {
//                 console.log("Order placed successfully:", response.data);
//                 setSuccess("Order placed successfully!");
//                 setError("");

//                 // ✅ Update cart status to 'ordered'
//                 return axios.post("http://127.0.0.1:8000/api/cart/update-status", {
//                     cart_id: order.cart_id,
//                     status: 'completed'
//                 }, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//             })
//             .then(response => {
//                 console.log("Cart status updated to 'ordered':", response.data);

//                 // ✅ Clear cart_id from localStorage after placing the order
//                 localStorage.removeItem("cart_id");
//                 navigate("/OrderDetails");
//                 localStorage.removeItem('applied_coupon');

//             })
//             .catch(error => {
//                 console.error("Error placing order or updating cart:", error.response?.data || error.message);
//                 setError(error.response?.data?.message || "Failed to place order or update cart status.");
//             });
//     };

//     return (
//         <div className="w-[60%] mx-auto mt-10 p-6 bg-white shadow-lg rounded-md">
//             <h2 className="text-2xl font-bold text-center mb-4">Place Order</h2>

//             {loading && <p className="text-yellow-500 text-center">Loading cart details...</p>}
//             {error && <p className="text-red-500 text-center">{error}</p>}
//             {success && <p className="text-green-500 text-center">{success}</p>}

//             <div className="space-y-4">
//                 <input type="text" name="name" value={order.name} onChange={handleChange} placeholder="Full Name" className="w-full border p-2 rounded" />
//                 <input type="text" name="street1" value={order.street1} onChange={handleChange} placeholder="Street Address Line 1" className="w-full border p-2 rounded" />
//                 <input type="text" name="street2" value={order.street2} onChange={handleChange} placeholder="Street Address Line 2 (Optional)" className="w-full border p-2 rounded" />

//                 <div className="grid grid-cols-3 gap-4">
//                     <input type="text" name="city" value={order.city} onChange={handleChange} placeholder="City" className="border p-2 rounded" />
//                     <input type="text" name="state" value={order.state} onChange={handleChange} placeholder="State" className="border p-2 rounded" />
//                     <input type="text" name="pincode" value={order.pincode} onChange={handleChange} placeholder="Pincode" className="border p-2 rounded" />
//                 </div>

//                 <input type="text" name="mobile" value={order.mobile} onChange={handleChange} placeholder="Mobile Number" className="w-full border p-2 rounded" />

//                 {/* Payment Method Dropdown */}
//                 <select name="payment_method" value={order.payment_method} onChange={handleChange} className="w-full border p-2 rounded">
//                     <option value="COD">Cash on Delivery</option>
//                     <option value="Online Payment">Online Payment</option>
//                 </select>

//                 <button 
//                     onClick={placeOrder}
//                     disabled={loading}
//                     className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
//                 >
//                     {loading ? "Fetching Cart..." : "Place Order"}
//                 </button>
//             </div>
//         </div>
//     );
// }





// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function PlaceOrder() {
//   const navigate = useNavigate();
//   const cart_price = localStorage.getItem("cart_total");
//   const [userId, setUserId] = useState("");
//   const [address, setAddress] = useState(null);
//   const [selectedOption, setSelectedOption] = useState('');

//   const [order, setOrder] = useState({
//     name: "",
//     street1: "",
//     street2: "",
//     city: "",
//     state: "",
//     pincode: "",
//     mobile: "",
//     payment_method: "COD",
//     cart_id: "",
//     cart_total: cart_price,
//     user_id: ""
//   });

//   const [loading, setLoading] = useState(true);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     async function fetchInitialData() {
//       try {
//         if (!token) {
//           setError("Authentication token missing.");
//           setLoading(false);
//           return;
//         }

//         // Fetch user id
//         const userResponse = await axios.get("http://127.0.0.1:8000/api/user-token", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setUserId(userResponse.data.id);
//         setOrder(prev => ({ ...prev, user_id: userResponse.data.id }));

//         // Fetch cart details
//         const storedCartId = localStorage.getItem("cart_id");
//         if (storedCartId) {
//           const cartResponse = await axios.get(`http://127.0.0.1:8000/api/cart/${storedCartId}`, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           if (cartResponse.data) {
//             setOrder(prev => ({ ...prev, cart_id: storedCartId }));
//           } else {
//             setError("Cart items not found.");
//           }
//         } else {
//           setError("Cart ID not found in localStorage.");
//         }

//         // Fetch previous address
//         const addressResponse = await axios.get('http://127.0.0.1:8000/api/get-previous-address', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         if (addressResponse.data) {
//           setAddress(addressResponse.data);
//         }
//       } catch (err) {
//         console.error("Error during initial data fetch:", err);
//         setError("Failed to load initial data.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchInitialData();
//   }, []);

//   const handleChange = (e) => {
//     setOrder({ ...order, [e.target.name]: e.target.value });
//   };

//   const handleOptionChange = (e) => {
//     setSelectedOption(e.target.value);

//     // ✅ Autofill existing address if selected
//     if (e.target.value === 'existing' && address) {
//       setOrder(prev => ({
//         ...prev,
//         name: address.name || '',
//         street1: address.street1 || '',
//         street2: address.street2 || '',
//         city: address.city || '',
//         state: address.state || '',
//         pincode: address.pincode || '',
//         mobile: address.mobile || ''
//       }));
//     } else if (e.target.value === 'new') {
//       setOrder(prev => ({
//         ...prev,
//         name: '',
//         street1: '',
//         street2: '',
//         city: '',
//         state: '',
//         pincode: '',
//         mobile: ''
//       }));
//     }
//   };

//   const placeOrder = async () => {
//     console.log("Order Data Before Submission:", order);

//     if (!order.name || !order.street1 || !order.city || !order.state || !order.pincode || !order.mobile || !order.payment_method || !order.cart_id || !order.user_id) {
//       setError("All fields are required.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Authentication token missing.");
//         return;
//       }

//       const orderResponse = await axios.post("http://127.0.0.1:8000/api/orders", order, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       console.log("Order placed successfully:", orderResponse.data);
//       setSuccess("Order placed successfully!");
//       setError("");

//       // Update cart status
//       await axios.post("http://127.0.0.1:8000/api/cart/update-status", {
//         cart_id: order.cart_id,
//         status: 'completed'
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       // Clear localStorage
//       localStorage.removeItem("cart_id");
//       localStorage.removeItem("applied_coupon");

//       // Navigate to Order Details
//       navigate("/OrderDetails");

//     } catch (err) {
//       console.error("Error placing order or updating cart:", err.response?.data || err.message);
//       setError(err.response?.data?.message || "Failed to place order or update cart status.");
//     }
//   };

//   return (
//     <div className="w-[60%] mx-auto mt-10 p-6 bg-white shadow-lg rounded-md">
//       <h2 className="text-2xl font-bold text-center mb-4">Place Order</h2>

//       {loading && <p className="text-yellow-500 text-center">Loading cart details...</p>}
//       {error && <p className="text-red-500 text-center">{error}</p>}
//       {success && <p className="text-green-500 text-center">{success}</p>}

//       {address && (
//         <>
//           <h2 className="text-lg font-bold mb-2">Choose Address</h2>
//           <div className="mb-4">
//             <label>
//               <input
//                 type="radio"
//                 value="existing"
//                 checked={selectedOption === 'existing'}
//                 onChange={handleOptionChange}
//               />
//               <span className="ml-2">
//                 Use Existing Address: {address.name}, {address.street1}, {address.street2}, {address.city}, {address.state}, {address.pincode}
//               </span>
//             </label>
//           </div>
//           <div className="mb-4">
//             <label>
//               <input
//                 type="radio"
//                 value="new"
//                 checked={selectedOption === 'new'}
//                 onChange={handleOptionChange}
//               />
//               <span className="ml-2">Add New Address</span>
//             </label>
//           </div>
//         </>
//       )}

//       {(!address || selectedOption === 'new') && (
//         <div className="space-y-4">
//           <input type="text" name="name" value={order.name} onChange={handleChange} placeholder="Full Name" className="w-full border p-2 rounded" />
//           <input type="text" name="street1" value={order.street1} onChange={handleChange} placeholder="Street Address Line 1" className="w-full border p-2 rounded" />
//           <input type="text" name="street2" value={order.street2} onChange={handleChange} placeholder="Street Address Line 2 (Optional)" className="w-full border p-2 rounded" />

//           <div className="grid grid-cols-3 gap-4">
//             <input type="text" name="city" value={order.city} onChange={handleChange} placeholder="City" className="border p-2 rounded" />
//             <input type="text" name="state" value={order.state} onChange={handleChange} placeholder="State" className="border p-2 rounded" />
//             <input type="text" name="pincode" value={order.pincode} onChange={handleChange} placeholder="Pincode" className="border p-2 rounded" />
//           </div>

//           <input type="text" name="mobile" value={order.mobile} onChange={handleChange} placeholder="Mobile Number" className="w-full border p-2 rounded" />

//           <select name="payment_method" value={order.payment_method} onChange={handleChange} className="w-full border p-2 rounded">
//             <option value="COD">Cash on Delivery</option>
//             <option value="Online Payment">Online Payment</option>
//           </select>
//         </div>
//       )}

//       <button 
//         onClick={placeOrder}
//         disabled={loading}
//         className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
//       >
//         Place Order
//       </button>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa"; // for loading spinner
import toast, { Toaster } from "react-hot-toast";


export default function PlaceOrder() {
  const navigate = useNavigate();
  const cart_price = localStorage.getItem("cart_total");

  const [userId, setUserId] = useState("");
  const [address, setAddress] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [order, setOrder] = useState({
    name: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    pincode: "",
    mobile: "",
    payment_method: "COD",
    cart_id: "",
    cart_total: cart_price,
    user_id: ""
  });

  useEffect(() => {



    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token missing.");
      setLoading(false);
      return;
    }

    if (!address || !Object.values(address).some(val => val)) {
      setSelectedOption('new');
    }

    async function fetchData() {
      try {
        const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/user-token`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserId(userRes.data.id);
        setOrder(prev => ({ ...prev, user_id: userRes.data.id }));

        const cartId = localStorage.getItem("cart_id");
        if (cartId) {
          const cartRes = await axios.get(`${import.meta.env.VITE_API_URL}/cart/${cartId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (cartRes.data) {
            setOrder(prev => ({ ...prev, cart_id: cartId }));
          } else {
            setError("Cart not found.");
          }
        } else {
          setError("Cart ID missing.");
        }

        const addressRes = await axios.get(`${import.meta.env.VITE_API_URL}/get-previous-address`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (addressRes.data) {
          setAddress(addressRes.data);
        }

      } catch (err) {
        console.error(err);
        setError("Failed to fetch user/cart/address info.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [address]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({ ...prevOrder, [name]: value }));
  
    if (name === "pincode" && value.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await response.json();
        
        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          setOrder((prevOrder) => ({
            ...prevOrder,
            city: postOffice.District,
            state: postOffice.State,
          }));
        } else {
          // Handle invalid pincode
          setOrder((prevOrder) => ({
            ...prevOrder,
            city: "",
            state: "",
          }));
        }
      } catch (error) {
        console.error("Error fetching pincode details:", error);
        setOrder((prevOrder) => ({
          ...prevOrder,
          city: "",
          state: "",
        }));
      }
    }
  };
  

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    if (e.target.value === 'existing' && address) {
      // Autofill fields with existing address
      setOrder(prev => ({
        ...prev,
        name: address.name,
        street1: address.street1,
        street2: address.street2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        mobile: address.mobile,
      }));
    } else {
      // Reset address fields for new
      setOrder(prev => ({
        ...prev,
        name: "",
        street1: "",
        street2: "",
        city: "",
        state: "",
        pincode: "",
        mobile: "",
      }));
    }
  };

  const validateFields = () => {
    const requiredFields = ['name', 'street1', 'city', 'state', 'pincode', 'mobile', 'payment_method', 'cart_id', 'user_id'];
    for (let field of requiredFields) {
      if ((order[field] ?? '').toString().trim() === '') {
        return false;
      }
    }
    if (order.pincode.length !== 6 || isNaN(order.pincode)) {
      setError("Invalid pincode.");
      return false;
    }
    if (order.mobile.length !== 10 || isNaN(order.mobile)) {
      setError("Invalid mobile number.");
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
    if (!validateFields()) {
      setError("Please fill all required fields correctly.");
      return;
    }

    setPlacingOrder(true);
    const token = localStorage.getItem("token");

    try {
      if (order.payment_method === "Online Payment") {
        // 💳  REDIRECT TO PAYMENT GATEWAY
        console.log("Redirecting to payment gateway...");
        // You can integrate Razorpay, Stripe, etc here
        // Example: openPaymentGateway(order)
        setTimeout(() => {
          alert("Demo Payment Gateway: Payment Successful.");
          finalizeOrder(token);
        }, 1500);
      } else {
        await finalizeOrder(token);
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const finalizeOrder = async (token) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, order, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Order placed:", response.data);
    toast.success("Order placed successfully!");
    setError("");

    await axios.post(`${import.meta.env.VITE_API_URL}/cart/update-status`, {
      cart_id: order.cart_id,
      status: 'completed'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    localStorage.removeItem("cart_id");
    localStorage.removeItem("applied_coupon");
    navigate("/OrderDetails");
  };



  return (
    <div className="w-[90%] lg:w-[60%] mx-auto mt-10 p-6 bg-white shadow-lg rounded-md">
         <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-2xl font-semibold text-center mb-4">PLACE ORDER</h2>
  
      {loading ? (
        <div className="flex justify-center items-center text-blue-500">
          <FaSpinner className="animate-spin mr-2" />
          Loading details...
        </div>
      ) : (
        <>
          {error && <p className="text-red-500 text-center mb-2">{error}</p>}
          {success && <p className="text-green-500 text-center mb-2">{success}</p>}
  
          {address && Object.values(address).some(val => val) ? (
  <>
    <h2 className="text-lg font-bold mb-2">Choose Address</h2>

    <div className="mb-4">
      <label className="flex items-center">
        <input
          type="radio"
          value="existing"
          checked={selectedOption === 'existing'}
          onChange={handleOptionChange}
        />
        <span className="ml-2">
          Use Existing Address: {address.name}, {address.street1}, {address.street2}, {address.city}, {address.state}, {address.pincode}
        </span>
      </label>
    </div>

    <div className="mb-4">
      <label className="flex items-center">
        <input
          type="radio"
          value="new"
          checked={selectedOption === 'new'}
          onChange={handleOptionChange}
        />
        <span className="ml-2">Add New Address</span>
      </label>
    </div>
  </>
) : (
  <p className="text-sm text-gray-600 italic mb-4">
    
  </p>
)}

  
          {(!address || selectedOption === 'new') && (
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={order.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="street1"
                value={order.street1}
                onChange={handleChange}
                placeholder="Street Address Line 1"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="street2"
                value={order.street2}
                onChange={handleChange}
                placeholder="Street Address Line 2 (Optional)"
                className="w-full border p-2 rounded"
              />
  
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  value={order.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="state"
                  value={order.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="pincode"
                  value={order.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  className="border p-2 rounded"
                />
              </div>
  
              <input
                type="text"
                name="mobile"
                value={order.mobile}
                onChange={handleChange}
                placeholder="Mobile Number"
                className="w-full border p-2 rounded"
              />
            </div>
          )}
  
          {(selectedOption || address) && (
            <div className="mb-4">
              <label className="block font-bold mb-1">Select Payment Method:</label>
              <select
                name="payment_method"
                value={order.payment_method}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="COD">Cash On Delivery</option>
                <option value="Online Payment">Online Payment</option>
              </select>
            </div>
          )}
  
          <button
            onClick={placeOrder}
            disabled={placingOrder}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6 flex justify-center items-center"
          >
            {placingOrder && <FaSpinner className="animate-spin mr-2" />}
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
  
}

