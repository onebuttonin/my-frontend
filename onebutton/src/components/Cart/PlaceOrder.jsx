
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaSpinner } from "react-icons/fa"; // for loading spinner
// import toast, { Toaster } from "react-hot-toast";
// import userApi from "../Api/apiUser";


// export default function PlaceOrder() {
//   const navigate = useNavigate();
//   const cart_price = localStorage.getItem("cart_total");

//   const [userId, setUserId] = useState("");
//   const [address, setAddress] = useState(null);
//   const [selectedOption, setSelectedOption] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [placingOrder, setPlacingOrder] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

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

//   useEffect(() => {



//     const token = localStorage.getItem("user_access_token");

//     if (!token) {
//       setError("Authentication token missing.");
//       setLoading(false);
//       return;
//     }

//     if (!address || !Object.values(address).some(val => val)) {
//       setSelectedOption('new');
//     }

//     async function fetchData() {
//       try {
//         const userRes = await userApi.get(`/user/profile`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setUserId(userRes.data.id);
//         setOrder(prev => ({ ...prev, user_id: userRes.data.id }));

//         const cartId = localStorage.getItem("cart_id");
//         if (cartId) {
//           const cartRes = await userApi.get(`/cart/${cartId}`, {
//             headers: { Authorization: `Bearer ${token}` }
//           });

//           if (cartRes.data) {
//             setOrder(prev => ({ ...prev, cart_id: cartId }));
//           } else {
//             setError("Cart not found.");
//           }
//         } else {
//           setError("Cart ID missing.");
//         }

//         const addressRes = await userApi.get(`/get-previous-address`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         if (addressRes.data) {
//           setAddress(addressRes.data);
//         }

//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch user/cart/address info.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [address]);

//   const handleChange = async (e) => {
//     const { name, value } = e.target;
//     setOrder((prevOrder) => ({ ...prevOrder, [name]: value }));
  
//     if (name === "pincode" && value.length === 6) {
//       try {
//         const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
//         const data = await response.json();
        
//         if (data[0].Status === "Success") {
//           const postOffice = data[0].PostOffice[0];
//           setOrder((prevOrder) => ({
//             ...prevOrder,
//             city: postOffice.District,
//             state: postOffice.State,
//           }));
//         } else {
//           // Handle invalid pincode
//           setOrder((prevOrder) => ({
//             ...prevOrder,
//             city: "",
//             state: "",
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching pincode details:", error);
//         setOrder((prevOrder) => ({
//           ...prevOrder,
//           city: "",
//           state: "",
//         }));
//       }
//     }
//   };
  

//   const handleOptionChange = (e) => {
//     setSelectedOption(e.target.value);
//     if (e.target.value === 'existing' && address) {
//       // Autofill fields with existing address
//       setOrder(prev => ({
//         ...prev,
//         name: address.name,
//         street1: address.street1,
//         street2: address.street2,
//         city: address.city,
//         state: address.state,
//         pincode: address.pincode,
//         mobile: address.mobile,
//       }));
//     } else {
//       // Reset address fields for new
//       setOrder(prev => ({
//         ...prev,
//         name: "",
//         street1: "",
//         street2: "",
//         city: "",
//         state: "",
//         pincode: "",
//         mobile: "",
//       }));
//     }
//   };

//   const validateFields = () => {
//     const requiredFields = ['name', 'street1', 'city', 'state', 'pincode', 'mobile', 'payment_method', 'cart_id', 'user_id'];
//     for (let field of requiredFields) {
//       if ((order[field] ?? '').toString().trim() === '') {
//         return false;
//       }
//     }
//     if (order.pincode.length !== 6 || isNaN(order.pincode)) {
//       setError("Invalid pincode.");
//       return false;
//     }
//     if (order.mobile.length !== 10 || isNaN(order.mobile)) {
//       setError("Invalid mobile number.");
//       return false;
//     }
//     return true;
//   };

//   const placeOrder = async () => {
//     if (!validateFields()) {
//       setError("Please fill all required fields correctly.");
//       return;
//     }

//     setPlacingOrder(true);
//     const token = localStorage.getItem("token");

//     try {
//       if (order.payment_method === "Online Payment") {
//         // 💳  REDIRECT TO PAYMENT GATEWAY
//         console.log("Redirecting to payment gateway...");
//         // You can integrate Razorpay, Stripe, etc here
//         // Example: openPaymentGateway(order)
//         setTimeout(() => {
//           alert("Demo Payment Gateway: Payment Successful.");
//           finalizeOrder(token);
//         }, 1500);
//       } else {
//         await finalizeOrder(token);
//       }

//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Failed to place order.");
//     } finally {
//       setPlacingOrder(false);
//     }
//   };

//   const finalizeOrder = async (token) => {
//     const response = await userApi.post(`/orders`, order, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     console.log("Order placed:", response.data);
//     toast.success("Order placed successfully!");
//     setError("");

//     await axios.post(`${import.meta.env.VITE_API_URL}/cart/update-status`, {
//       cart_id: order.cart_id,
//       status: 'completed'
//     }, {
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     localStorage.removeItem("cart_id");
//     localStorage.removeItem("applied_coupon");
//     navigate("/Orders");
//   };



//   return (
//     <div className="w-[90%] lg:w-[60%] mx-auto mt-10 p-6 bg-white shadow-lg rounded-md">
//          <Toaster position="top-center" reverseOrder={false} />
//       <h2 className="text-2xl font-semibold text-center mb-4">PLACE ORDER</h2>
  
//       {loading ? (
//         <div className="flex justify-center items-center text-blue-500">
//           <FaSpinner className="animate-spin mr-2" />
//           Loading details...
//         </div>
//       ) : (
//         <>
//           {error && <p className="text-red-500 text-center mb-2">{error}</p>}
//           {success && <p className="text-green-500 text-center mb-2">{success}</p>}
  
//           {address && Object.values(address).some(val => val) ? (
//   <>
//     <h2 className="text-lg font-bold mb-2">Choose Address</h2>

//     <div className="mb-4">
//       <label className="flex items-center">
//         <input
//           type="radio"
//           value="existing"
//           checked={selectedOption === 'existing'}
//           onChange={handleOptionChange}
//         />
//         <span className="ml-2">
//           Use Existing Address: {address.name}, {address.street1}, {address.street2}, {address.city}, {address.state}, {address.pincode}
//         </span>
//       </label>
//     </div>

//     <div className="mb-4">
//       <label className="flex items-center">
//         <input
//           type="radio"
//           value="new"
//           checked={selectedOption === 'new'}
//           onChange={handleOptionChange}
//         />
//         <span className="ml-2">Add New Address</span>
//       </label>
//     </div>
//   </>
// ) : (
//   <p className="text-sm text-gray-600 italic mb-4">
    
//   </p>
// )}

  
//           {(!address || selectedOption === 'new') && (
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 name="name"
//                 value={order.name}
//                 onChange={handleChange}
//                 placeholder="Full Name"
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 name="street1"
//                 value={order.street1}
//                 onChange={handleChange}
//                 placeholder="Street Address Line 1"
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 name="street2"
//                 value={order.street2}
//                 onChange={handleChange}
//                 placeholder="Street Address Line 2 (Optional)"
//                 className="w-full border p-2 rounded"
//               />
  
//               <div className="grid grid-cols-3 gap-4">
//                 <input
//                   type="text"
//                   name="city"
//                   value={order.city}
//                   onChange={handleChange}
//                   placeholder="City"
//                   className="border p-2 rounded"
//                 />
//                 <input
//                   type="text"
//                   name="state"
//                   value={order.state}
//                   onChange={handleChange}
//                   placeholder="State"
//                   className="border p-2 rounded"
//                 />
//                 <input
//                   type="text"
//                   name="pincode"
//                   value={order.pincode}
//                   onChange={handleChange}
//                   placeholder="Pincode"
//                   className="border p-2 rounded"
//                 />
//               </div>
  
//               {/* <input
//                 type="text"
//                 name="mobile"
//                 value={order.mobile}
//                 onChange={handleChange}
//                 placeholder="Mobile Number"
//                 className="w-full border p-2 rounded"
//               /> */}
//                     <input
//         type="text"
//         name="mobile"
//         value={order.mobile}
//         onChange={handleChange}
//         placeholder="Mobile Number"
//         inputMode="numeric"
//         maxLength={10}
//         pattern="\d*"
//         className={`w-full border p-2 rounded transition-colors ${
//           error ? "border-red-500" : "border-gray-300"
//         }`}
//       />
//       {error ? (
//         <p className="text-red-500 text-sm mt-1">{error}</p>
//       ) : (
//         <p className="invisible text-sm mt-1">placeholder</p>
//       )}
//             </div>
//           )}
  
//        {(selectedOption || address) && (
//   <div className="mb-4">
//     <label className="block font-bold mb-1">Select Payment Method:</label>
//     <select
//       name="payment_method"
//       value={order.payment_method}
//       onChange={handleChange}
//       className="w-full border p-2 rounded"
//     >
//       <option value="COD">Cash On Delivery</option>
//       {/* <option value="Online Payment">Online Payment</option> */}
//     </select>
//     <p className="text-sm text-gray-600 mt-2 italic">
//       💳 Prepaid payment option will be available soon.
//     </p>
//   </div>
// )}

  
//           <button
//             onClick={placeOrder}
//             disabled={placingOrder}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6 flex justify-center items-center"
//           >
//             {placingOrder && <FaSpinner className="animate-spin mr-2" />}
//             {placingOrder ? "Placing Order..." : "Place Order"}
//           </button>
//         </>
//       )}
//     </div>
//   );
  
// }





import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import userApi from "../Api/apiUser";

export default function PlaceOrder() {
  const navigate = useNavigate();
  const cart_price = localStorage.getItem("cart_total");
  const token = localStorage.getItem("user_access_token");

  const [userId, setUserId] = useState("");
  const [address, setAddress] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
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
    user_id: "",
  });

  // ✅ Fetch user, cart, and previous address once
  useEffect(() => {
    if (!token) {
      setError("Authentication token missing.");
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        // Get user profile
        const userRes = await userApi.get(`/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(userRes.data.id);
        setOrder((prev) => ({ ...prev, user_id: userRes.data.id }));

        // Get cart details
        const cartId = localStorage.getItem("cart_id");
        if (cartId) {
          const cartRes = await userApi.get(`/cart/${cartId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (cartRes.data) {
            setOrder((prev) => ({ ...prev, cart_id: cartId }));
          } else {
            setError("Cart not found.");
          }
        } else {
          setError("Cart ID missing.");
        }

        // Get previous address
        const addressRes = await userApi.get(`/get-previous-address`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (addressRes.data) {
          setAddress(addressRes.data);
        } else {
          setSelectedOption("new");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user/cart/address info.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  // ✅ Input change handler
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

  // ✅ Handle address option switch
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    if (e.target.value === "existing" && address) {
      setOrder((prev) => ({
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
      setOrder((prev) => ({
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

  // ✅ Validation
  const validateFields = () => {
    const requiredFields = [
      "name",
      "street1",
      "city",
      "state",
      "pincode",
      "mobile",
      "payment_method",
      "cart_id",
      "user_id",
    ];
    for (let field of requiredFields) {
      if ((order[field] ?? "").toString().trim() === "") {
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

  // ✅ Place order handler
  const placeOrder = async () => {
    if (!validateFields()) {
      setError("Please fill all required fields correctly.");
      return;
    }

    if (!order.cart_id || !order.user_id) {
      setError("Order data incomplete. Please wait a moment and try again.");
      return;
    }

    setPlacingOrder(true);

    try {
      if (order.payment_method === "Online Payment") {
        console.log("Redirecting to payment gateway...");
        setTimeout(() => {
          alert("Demo Payment Gateway: Payment Successful.");
          finalizeOrder();
        }, 1500);
      } else {
        await finalizeOrder();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  // ✅ Finalize Order (with consistent token)
  const finalizeOrder = async () => {
    try {
      const response = await userApi.post(`/orders`, order, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Order placed:", response.data);
      toast.success("Order placed successfully!");
      setError("");

      // Update cart status
      await userApi.post(
        `/cart/update-status`,
        { cart_id: order.cart_id, status: "completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.removeItem("cart_id");
      localStorage.removeItem("applied_coupon");

      navigate("/Orders");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to finalize order.");
    }
  };

  // ✅ Render
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

          {address && Object.values(address).some((val) => val) ? (
            <>
              <h2 className="text-lg font-bold mb-2">Choose Address</h2>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="existing"
                    checked={selectedOption === "existing"}
                    onChange={handleOptionChange}
                  />
                  <span className="ml-2">
                    Use Existing Address: {address.name}, {address.street1},{" "}
                    {address.street2}, {address.city}, {address.state},{" "}
                    {address.pincode}
                  </span>
                </label>
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="new"
                    checked={selectedOption === "new"}
                    onChange={handleOptionChange}
                  />
                  <span className="ml-2">Add New Address</span>
                </label>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-600 italic mb-4"></p>
          )}

          {(!address || selectedOption === "new") && (
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
                inputMode="numeric"
                maxLength={10}
                pattern="\d*"
                className={`w-full border p-2 rounded transition-colors ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
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
                {/* <option value="Online Payment">Online Payment</option> */}
              </select>
              <p className="text-sm text-gray-600 mt-2 italic">
                💳 Prepaid payment option will be available soon.
              </p>
            </div>
          )}

          <button
            onClick={placeOrder}
            disabled={placingOrder || loading}
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
