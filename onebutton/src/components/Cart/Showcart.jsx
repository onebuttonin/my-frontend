
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { ConstructionIcon } from "lucide-react";
// import toast from "react-hot-toast";

// export default function Cart() {
//   const [cartId, setCartId] = useState(null);
//   const [status, setStatus] = useState(null);
//   const [cartItems, setCartItems] = useState([]);
//   const [coupon, setCoupon] = useState("");
//   const [discount, setDiscount] = useState(0);
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [availableCoupons, setAvailableCoupons] = useState([]);
//   const [userId, setUserId] = useState(null);  // Add user_id state
  
//   const deliveryCharge = 50;
//   const navigate = useNavigate();

//   // ✅ Fetch Cart with Pending Status Only
//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       console.error("No token found. Please log in.");
//       return;
//     }

//     const fetchCart = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/api/cart", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.data.id) {
//           const cartId = response.data.id;
//           setCartId(cartId);
//           localStorage.setItem("cart_id", cartId);

//           // Fetch cart items by ID
//           const cartResponse = await axios.get(`http://127.0.0.1:8000/api/cart/${cartId}`, {
//             headers: { Authorization: `Bearer ${token}` }
//           });

//           console.log("Cart Response:", cartResponse.data);

//           if (cartResponse.data.status === "pending") {
//             setCartItems(cartResponse.data.items || []);
//             setStatus(cartResponse.data.status);
//           } else {
//             setCartItems([]);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching cart:", error);
//       }
//     };

//     fetchCart();
//   }, []);

//   // ✅ Fetch Available Coupons
//   useEffect(() => {
//     axios
//       .get("http://127.0.0.1:8000/api/coupons")
//       .then((res) => {
//         console.log("Available Coupons:", res.data);
//         setAvailableCoupons(res.data);
//       })
//       .catch((error) => console.error("Error fetching coupons:", error));
//   }, []);

//   // ✅ Remove item from cart
//   const handleRemove = async (product_id) => {
//     const token = localStorage.getItem("token");

//     try {
//       await axios.delete(`http://127.0.0.1:8000/api/cart/${product_id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setCartItems(cartItems.filter((item) => item.product_id !== product_id));
//     } catch (error) {
//       console.error("Error removing item:", error);
//     }
//   };

//   // ✅ Update quantity
//   const handleQuantityChange = (product_id, newQuantity) => {
//     if (newQuantity < 1) return;
  
//     const token = localStorage.getItem("token"); // Get token from localStorage
//     if (!token) {
//       alert("You need to login first.");
//       return;
//     }
  
//     axios
//       .put(
//         `http://127.0.0.1:8000/api/cart/${product_id}`,
//         { quantity: newQuantity },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Add token to request headers
//             "Content-Type": "application/json",
//           },
//         }
//       )
//       .then(() => {
//         setCartItems(
//           cartItems.map((item) =>
//             item.product_id === product_id ? { ...item, quantity: newQuantity } : item
//           )
//         );
//       })
//       .catch((error) => {
//         console.error("Error updating quantity:", error);
        
//         if (error.response && error.response.status === 401) {
//           alert("Session expired. Please log in again.");
//           localStorage.removeItem("token"); // Remove invalid token
//         } else {
//           alert("Failed to update cart.");
//         }
//       });
//   };
  

//   // ✅ Apply Coupon
//   const applyCoupon = () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//         toast.error("Please log in to apply a coupon.");
//         return;
//     }

//     if (!cartId) {
//         toast.error("No cart found. Please add items to your cart.");
//         return;
//     }

//     axios
//         .post("http://127.0.0.1:8000/api/apply-coupon", {
//             code: coupon,
//             cart_id: cartId
//         }, {
//             headers: { Authorization: `Bearer ${token}` }  // Include token in header
//         })
//         .then((res) => {
//             console.log("Applied Coupon:", res.data);

//             if (res.data && res.data.message === "Coupon applied successfully") {
//                 setDiscount(Number(res.data.discount));
//                 setAppliedCoupon({
//                     code: coupon,
//                     discount: res.data.discount,
//                     newTotal: res.data.new_total
//                 });

//                 localStorage.setItem('applied_coupon', coupon);
//                 toast.success(`Coupon applied! Discount: ₹${res.data.discount}`);
//             } else {
//                 toast.error("Invalid or expired coupon.");
//             }
//         })
//         .catch((error) => {
//             console.error("Error applying coupon:", error);

//             // Handle different error messages
//             if (error.response) {
//                 const errorMessage = error.response.data?.message || "Failed to apply coupon.";
//                 toast.error(errorMessage);
//             } else {
//                 toast.error("Network error. Please try again.");
//             }
//         });

//     setCoupon("");
// };



//   // ✅ Remove Coupon
//   const removeCoupon = () => {
//     const token = localStorage.getItem("token");
//     const appliedCoupon = localStorage.getItem("applied_coupon");

//     if (!cartId) {
//         toast.error("No cart found.");
//         return;
//     }

//     if (!appliedCoupon) {
//         toast.error("No applied coupon found.");
//         return;
//     }

//     axios.post("http://127.0.0.1:8000/api/remove-coupon", {
//         cart_id: cartId,
//         code: appliedCoupon
//     }, {
//         headers: { Authorization: `Bearer ${token}` }
//     })
//     .then((res) => {
//         console.log("Coupon Removed:", res.data);
//         toast.success(res.data.message);

//         // ✅ Reset discount and coupon states
//         setDiscount(0);
//         setAppliedCoupon(null);

//         // ✅ Remove coupon from local storage
//         localStorage.removeItem("applied_coupon");

//         // Optionally, refetch cart items to show updated totals
       
//     })
//     .catch((error) => {
//         console.error("Error removing coupon:", error);
//         toast.error(error.response?.data?.message || "Failed to remove coupon.");
//     });
// };




//   // ✅ Calculate Subtotal and Total
//   const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * (item.quantity || 0), 0);
//   const discountValue = Number(discount) || 0;
//   const total = subtotal - discountValue + deliveryCharge;

//   localStorage.setItem('cart_total', total);
  
//   return (

    
//     <div className="container mx-auto px-4 py-6">
//       <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 items-start">

//         {/* Left Section: Product List */}
//         <div className="bg-white p-4 shadow-md rounded-lg">
//           <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
//           {/* <p className="text-gray-500">Cart ID: {cartId} | Status: {status}</p> */}

//           {cartItems.length === 0 ? (
//             <p className="text-gray-500">Your cart is empty</p>
//           ) : (
//             cartItems.map((item) => (
//               <div key={item.product_id} className="flex items-center border-b pb-4 mb-4">
//                 <img
//                   src={item.product?.image ? `http://127.0.0.1:8000/storage/${item.product.image}` : "/placeholder.png"}
//                   alt={item.product?.name || "Product"}
//                   className="w-24 h-24 object-cover rounded-lg"
//                   onClick={() => item.product && navigate(`/product/${item.product.id}`, { state: item.product })}
//                 />

//                 <div className="ml-4 flex-1">
//                   <h3 className="text-lg font-semibold">{item.product?.name || "Unknown Product"}</h3>
//                   <p className="text-gray-500">₹{item.product?.price || 0}</p>
//                   <p className="text-gray-700 mt-1">
//                     <span className="font-medium">Size:</span> {item.size}
//                   </p>

//                   <div className="flex items-center mt-2">
//                     <button
//                       onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
//                       className="bg-gray-200 px-2 py-1 rounded"
//                     >
//                       -
//                     </button>
//                     <span className="mx-2">{item.quantity}</span>
//                     <button
//                       onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
//                       className="bg-gray-200 px-2 py-1 rounded"
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => handleRemove(item.product_id)}
//                   className="text-red-500 hover:text-red-700 ml-4"
//                 >
//                   🗑
//                 </button>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Right Section: Summary */}
//         <div className="bg-white p-4 shadow-md rounded-lg">
//           <h2 className="text-xl font-bold mb-4">Order Summary</h2>

//           {/* Coupon Section */}
//           <div className="flex items-center mb-4">
//             <input
//               type="text"
//               placeholder="Enter Coupon Code"
//               value={coupon}
//               onChange={(e) => setCoupon(e.target.value)}
//               className="flex-1 border rounded-lg px-3 py-2 mr-2"
//             />
//             <button 
//               onClick={applyCoupon}
//               className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
//             >
//               Apply
//             </button>
//           </div>

//           {appliedCoupon && (
//             <div className="flex justify-between items-center bg-green-100 p-2 rounded-lg mb-4">
//               <span className="text-green-700 font-semibold">Coupon: {appliedCoupon.code}</span>
//               <button onClick={removeCoupon} className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600">Remove</button>
//             </div>
//           )}



//     <div className="flex justify-between mb-2">
//              <span>Subtotal:</span>
//              <span>₹{subtotal.toFixed(2)}</span>
//           </div>
//            <div className="flex justify-between mb-2">
//              <span>Discount:</span>
//             <span>-₹{discount.toFixed(2)}</span>
//           </div>

//            <div className="flex justify-between mb-2">
//              <span>Delivery Charge:</span>
//              <span>₹{deliveryCharge.toFixed(2)}</span>
//            </div>

//           <div className="flex justify-between font-semibold text-lg">
//              <span>Total:</span>
//             <span>₹{total.toFixed(2)}</span>
//           </div>

//           <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
//            onClick={() => navigate('/orders')}>
//             Proceed to Checkout
//            </button>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Cart() {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [cartId, setCartId] = useState(localStorage.getItem("cart_id"));
  const deliveryCharge = 50;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const token = localStorage.getItem("token");

  // Redirect non-logged-in users
  useEffect(() => {
    if (!token) {
      toast.error("Please log in to view your cart.");
      navigate("/login");
    }
  }, [navigate, token]);



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

  const removeItemMutation = useMutation({
    mutationFn: async (product_id) => {
      await axios.delete(`${import.meta.env.VITE_API_URL}/cart/${product_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["cart"]),
  });

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="font-semibold text-lg">Loading your cart...</p>
      </div>
    );
  }

  // return (
  //   <div className="container mx-auto px-4 py-6">
  //           <Toaster position="top-center" reverseOrder={false} />
  //     <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 items-start">
  //       <div className="bg-white p-4 shadow-md rounded-lg">
  //         <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
  //         {!cartData?.items || cartData.items.length === 0 ? (
  //           <p className="text-gray-500">Your cart is empty</p>
  //         ) : (
  //           cartData.items.map((item) => (
  //             <div
  //               key={item.product_id}
  //               className="flex items-center border-b pb-4 mb-4"
  //             >
  //               <img
  //                 src={item.product?.image ? `http://127.0.0.1:8000/storage/${item.product.image}` : "/placeholder.png"}
  //                 alt={item.product?.name || "Product"}
  //                 className="w-24 h-24 object-cover rounded-lg"
  //                 onClick={() => item.product && navigate(`/product/${item.product.id}`, { state: item.product })}
  //               />
  //               <div className="ml-4 flex-1">
  //                 <h3 className="text-lg font-semibold">{item.product?.name}</h3>
  //                 <p className="text-gray-500">₹{item.product?.price}</p>
  //                 <p className="text-gray-700 mt-1">
  //                   <span className="font-medium">Size:</span> {item.size}
  //                 </p>
  //                 <div className="flex items-center mt-2">
  //                   <button
  //                     onClick={() => updateQuantityMutation.mutate({ product_id: item.product_id, quantity: item.quantity - 1 })}
  //                     className="bg-gray-200 px-2 py-1 rounded"
  //                   >
  //                     -
  //                   </button>
  //                   <span className="mx-2">{item.quantity}</span>
  //                   <button
  //                     onClick={() => updateQuantityMutation.mutate({ product_id: item.product_id, quantity: item.quantity + 1 })}
  //                     className="bg-gray-200 px-2 py-1 rounded"
  //                   >
  //                     +
  //                   </button>
  //                 </div>
  //               </div>
  //               <button
  //                 onClick={() => removeItemMutation.mutate(item.product_id)}
  //                 className="text-red-500 hover:text-red-700 ml-4"
  //               >
  //                 🗑
  //               </button>
  //             </div>
  //           ))
  //         )}
  //       </div>

  //       <div className="bg-white p-4 shadow-md rounded-lg">
  //         <h2 className="text-xl font-bold mb-4">Order Summary</h2>
  //         <div className="flex items-center mb-4">
  //           <input
  //             type="text"
  //             placeholder="Enter Coupon Code"
  //             value={coupon}
  //             onChange={(e) => setCoupon(e.target.value)}
  //             className="flex-1 border rounded-lg px-3 py-2 mr-2"
  //           />
  //           <button
  //             onClick={applyCoupon}
  //             className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
  //           >
  //             Apply
  //           </button>
  //         </div>

  //         {appliedCoupon && (
  //           <div className="flex justify-between items-center bg-green-100 p-2 rounded-lg mb-4">
  //             <span className="text-green-700 font-semibold">
  //               Coupon: {appliedCoupon.code}
  //             </span>
  //             <button
  //               onClick={removeCoupon}
  //               className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
  //             >
  //               Remove
  //             </button>
  //           </div>
  //         )}

  //         <div className="flex justify-between mb-2">
  //           <span>Subtotal:</span>
  //           <span>₹{subtotal.toFixed(2)}</span>
  //         </div>
  //         <div className="flex justify-between mb-2">
  //           <span>Discount:</span>
  //           <span>-₹{discount.toFixed(2)}</span>
  //         </div>
  //         <div className="flex justify-between mb-2">
  //           <span>Delivery Charge:</span>
  //           <span>₹{deliveryCharge.toFixed(2)}</span>
  //         </div>
  //         <div className="flex justify-between font-semibold text-lg">
  //           <span>Total:</span>
  //           <span>₹{total.toFixed(2)}</span>
  //         </div>

  //         <button
  //           className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
  //           onClick={() => navigate("/orders")}
  //         >
  //           Proceed to Checkout
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
 
  return (
    <div className="container mx-auto px-4 py-6">
      <Toaster position="top-center" reverseOrder={false} />
      {!cartData?.items || cartData.items.length === 0 ? (
        <div className="flex justify-center items-center h-60">
          <p className="text-gray-500 text-lg font-medium">No item found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 items-start">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
            {cartData.items.map((item) => (
              <div
                key={item.product_id}
                className="flex items-center border-b pb-4 mb-4"
              >
                <img
                  src={
                    item.product?.image
                      ? `${import.meta.env.VITE_BASE_URL}/storage/${item.product.image}`
                      : "/placeholder.png"
                  }
                  alt={item.product?.name || "Product"}
                  className="w-24 h-24 object-cover rounded-lg"
                  onClick={() =>
                    item.product &&
                    navigate(`/product/${item.product.id}`, {
                      state: item.product,
                    })
                  }
                />
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold">{item.product?.name}</h3>
                  <p className="text-gray-500">₹{item.product?.price}</p>
                  <p className="text-gray-700 mt-1">
                    <span className="font-medium">Size:</span> {item.size}
                  </p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() =>
                        updateQuantityMutation.mutate({
                          product_id: item.product_id,
                          quantity: item.quantity - 1,
                        })
                      }
                      className="bg-gray-200 px-2 py-1 rounded"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantityMutation.mutate({
                          product_id: item.product_id,
                          quantity: item.quantity + 1,
                        })
                      }
                      className="bg-gray-200 px-2 py-1 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItemMutation.mutate(item.product_id)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
  
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 mr-2"
              />
              <button
                onClick={applyCoupon}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Apply
              </button>
            </div>
  
            {appliedCoupon && (
              <div className="flex justify-between items-center bg-green-100 p-2 rounded-lg mb-4">
                <span className="text-green-700 font-semibold">
                  Coupon: {appliedCoupon.code}
                </span>
                <button
                  onClick={removeCoupon}
                  className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            )}
  
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Discount:</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Delivery Charge:</span>
              <span>₹{deliveryCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
  
            <button
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              onClick={() => navigate("/orders")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
  

}

