
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Trash } from "lucide-react";
// import { useAuth } from "/src/components/Hooks/useAuth";
// import toast from "react-hot-toast";


// export default function ProductGrid() {
//   const navigate = useNavigate();
//   const [wishlist, setWishlist] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [showSizeSelector, setShowSizeSelector] = useState(null);
//   const isLoggedIn = useAuth();

//   useEffect(() => {
//     if (!isLoggedIn) {
//       toast.error("Please log in.");
//       setTimeout(() => {
//         navigate('/login');
//       }, 1500);
//       return
//     } else {
//       fetchWishlist();
//     }
//   }, [isLoggedIn, navigate]);

//   const fetchWishlist = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       // window.alert("Please Login!");
//       navigate("/login");
//       setLoading(false);

//       return;
//     }

//     try {
//       const { data: wishlistItems } = await axios.get(
//         "http://127.0.0.1:8000/api/wishlist",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );

//       if (wishlistItems.length > 0) {
//         const productIds = wishlistItems.map((item) => item.product_id);

//         // ✅ Fetch product details for each wishlist item
//         const productDetails = await Promise.all(
//           productIds.map(async (id) => {
//             const { data } = await axios.get(
//               `http://127.0.0.1:8000/api/products/${id}`,  // ✅ Use existing API
//               {
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                   "Content-Type": "application/json",
//                 }
//               }
//             );
//             return { ...data, product_id: id };
//           })
//         );

//         // ✅ Enrich wishlist with product details
//         const enrichedWishlist = wishlistItems.map((item) => {
//           const product = productDetails.find((p) => p.id === item.product_id);
//           return {
//             ...item,
//             product: product || {},  // Ensure fallback for missing products
//           };
//         });

//         setWishlist(enrichedWishlist);
//       } else {
//         setWishlist([]);
//       }
//     } catch (error) {
//       console.error("Error fetching wishlist:", error);
//       if (error.response?.status === 401) {
//         alert("Session expired. Please log in again.");
//         localStorage.removeItem("token");
//         navigate("/login");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Handle Add to Cart with Size Selection
//   const handleAddToCart = async (productId) => {
//     if (!selectedSize) {
//       alert("Please select a size!");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Please log in first!");
//       navigate("/login");
//       return;
//     }

//     try {
//       await axios.post(
//         "http://127.0.0.1:8000/api/add-cart",
//         { product_id: productId, size: selectedSize, quantity: 1 },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert("Product added to cart!");
//       setShowSizeSelector(null);
//       setSelectedSize(null);  // Reset the size after adding to cart
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     }
//   };

//   // ✅ Handle Delete from Wishlist
//   const handleDelete = async (productId) => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       alert("Please log in first!");
//       navigate("/login");
//       return;
//     }

//     try {
//       await axios.delete(`http://127.0.0.1:8000/api/wishlist/${productId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setWishlist(wishlist.filter((item) => item.product_id !== productId));
//     } catch (error) {
//       console.error("Error removing item from wishlist:", error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 lg:p-10">
//       <div className="text-center bg-zinc-100 px-4 py-3 mb-4">
//         <h2 className="text-xl font-bold">Wishlist</h2>
//       </div>

//       {loading ? (
//         <p className="text-center text-gray-500">Loading...</p>
//       ) : (
//         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
//           {wishlist.length > 0 ? (
//             wishlist.map((item) => (
//               <div
//                 key={item.product_id}
//                 className="relative hover:border border-neutral-300 rounded-lg shadow-md p-4 flex flex-col"
//                 onClick={() => navigate(`/product/${item.product_id}`, { state: item.product })}
//               >
//                 <button
//                   className="absolute top-5 left-5 text-gray-500 hover:text-red-500"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDelete(item.product_id);
//                   }}
//                 >
//                   <Trash className="w-6 h-6" />
//                 </button>

//                 {/* Product Image */}
//                 <img
//                   src={`http://127.0.0.1:8000/storage/${item.product?.image || 'default.jpg'}`}
//                   alt={item.product?.name || 'Product'}
//                   className="w-full h-60 lg:h-100 object-cover transition-all duration-300"
//                   onMouseEnter={(e) => {
//                     if (item.product?.hover_image) {
//                       e.currentTarget.src = `http://127.0.0.1:8000/storage/${item.product.hover_image}`;
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.src = `http://127.0.0.1:8000/storage/${item.product?.image || 'default.jpg'}`;
//                   }}
//                 />

//                 <h3 className="text-sm sm:text-base md:text-lg font-semibold mt-2">
//                   {item.product?.name || "Unnamed Product"}
//                 </h3>

//                 <p className="text-gray-600">₹{item.product?.price || "N/A"}</p>

//                 {/* Size Selector */}
//                 {showSizeSelector === item.product_id ? (
//                   <div className="flex justify-center mt-2">
//                     {Object.entries(item.product.availableSizes).map(([size]) => (
//                       <button
//                         key={size}
//                         className={`px-3 py-1 mx-1 border rounded-md ${selectedSize === size ? 'bg-black text-white' : 'bg-gray-200'}`}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setSelectedSize(size);
//                         }}
//                       >
//                         {size.toUpperCase()}
//                       </button>
//                     ))}
//                   </div>
//                 ) : (
//                   <button
//                     className="mt-2 w-full py-2 bg-black text-white font-bold text-sm rounded-lg hover:bg-gray-800 transition-all"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setShowSizeSelector(item.product_id);
//                     }}
//                   >
//                     Add To Cart
//                   </button>
//                 )}

//                 {showSizeSelector === item.product_id && (
//                   <button
//                     className="mt-2 w-full py-2 bg-black text-white font-bold text-sm rounded-lg hover:bg-gray-800 transition-all"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleAddToCart(item.product_id);
//                     }}
//                   >
//                     Add
//                   </button>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p className="text-center text-gray-500">No items in wishlist</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash } from "lucide-react";
import { useAuth } from "/src/components/Hooks/useAuth";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function ProductGrid() {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(null);
  const [showSizeSelector, setShowSizeSelector] = useState(null);
  const isLoggedIn = useAuth();
  const queryClient = useQueryClient();

  const token = localStorage.getItem("token");

  const fetchWishlist = async () => {
    if (!token) throw new Error("No token");

    const { data: wishlistItems } = await axios.get(
      "http://127.0.0.1:8000/api/wishlist",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (wishlistItems.length > 0) {
      const productDetails = await Promise.all(
        wishlistItems.map(async (item) => {
          const { data } = await axios.get(
            `http://127.0.0.1:8000/api/products/${item.product_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          return {
            ...item,
            product: { ...data },
          };
        })
      );
      return productDetails;
    }

    return [];
  };

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
    enabled: () => Boolean(isLoggedIn), // ✅ fixed here
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId) => {
      await axios.delete(`http://127.0.0.1:8000/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
    },
  });

  const handleAddToCart = async (productId) => {
    if (!selectedSize) {
      alert("Please select a size!");
      return;
    }

    if (!token) {
      alert("Please log in first!");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/add-cart",
        { product_id: productId, size: selectedSize, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Product added to cart!");
      setShowSizeSelector(null);
      setSelectedSize(null);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleDelete = (e, productId) => {
    e.stopPropagation();
    deleteMutation.mutate(productId);
  };

  if (!isLoggedIn) {
    toast.error("Please log in.");
    setTimeout(() => navigate("/login"), 1500);
    return null;
  }

  // return (
  //   <div className="container mx-auto p-4 lg:p-10">
  //     <div className="text-center bg-zinc-100 px-4 py-3 mb-4">
  //       <h2 className="text-xl font-bold">Wishlist</h2>
  //     </div>

  //     {isLoading ? (
  //       <p className="text-center text-gray-500">Loading...</p>
  //     ) : (
  //       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
  //         {wishlist.length > 0 ? (
  //           wishlist.map((item) => (
  //             <div
  //               key={item.product_id}
  //               className="relative hover:border border-neutral-300 rounded-lg shadow-md p-4 flex flex-col"
  //               onClick={() => navigate(`/product/${item.product_id}`, { state: item.product })}
  //             >
  //               <button
  //                 className="absolute top-5 left-5 text-gray-500 hover:text-red-500"
  //                 onClick={(e) => handleDelete(e, item.product_id)}
  //               >
  //                 <Trash className="w-6 h-6" />
  //               </button>

  //               <img
  //                 src={`http://127.0.0.1:8000/storage/${item.product?.image || 'default.jpg'}`}
  //                 alt={item.product?.name || 'Product'}
  //                 className="w-full h-60 lg:h-100 object-cover transition-all duration-300"
  //                 onMouseEnter={(e) => {
  //                   if (item.product?.hover_image) {
  //                     e.currentTarget.src = `http://127.0.0.1:8000/storage/${item.product.hover_image}`;
  //                   }
  //                 }}
  //                 onMouseLeave={(e) => {
  //                   e.currentTarget.src = `http://127.0.0.1:8000/storage/${item.product?.image || 'default.jpg'}`;
  //                 }}
  //               />

  //               <h3 className="text-sm sm:text-base md:text-lg font-semibold mt-2">
  //                 {item.product?.name || "Unnamed Product"}
  //               </h3>

  //               <p className="text-gray-600">₹{item.product?.price || "N/A"}</p>

  //               {showSizeSelector === item.product_id ? (
  //                 <div className="flex justify-center mt-2">
  //                   {Object.entries(item.product.availableSizes).map(([size]) => (
  //                     <button
  //                       key={size}
  //                       className={`px-3 py-1 mx-1 border rounded-md ${selectedSize === size ? 'bg-black text-white' : 'bg-gray-200'}`}
  //                       onClick={(e) => {
  //                         e.stopPropagation();
  //                         setSelectedSize(size);
  //                       }}
  //                     >
  //                       {size.toUpperCase()}
  //                     </button>
  //                   ))}
  //                 </div>
  //               ) : (
  //                 <button
  //                   className="mt-2 w-full py-2 bg-black text-white font-bold text-sm rounded-lg hover:bg-gray-800 transition-all"
  //                   onClick={(e) => {
  //                     e.stopPropagation();
  //                     setShowSizeSelector(item.product_id);
  //                   }}
  //                 >
  //                   Add To Cart
  //                 </button>
  //               )}

  //               {showSizeSelector === item.product_id && (
  //                 <button
  //                   className="mt-2 w-full py-2 bg-black text-white font-bold text-sm rounded-lg hover:bg-gray-800 transition-all"
  //                   onClick={(e) => {
  //                     e.stopPropagation();
  //                     handleAddToCart(item.product_id);
  //                   }}
  //                 >
  //                   Add
  //                 </button>
  //               )}
  //             </div>
  //           ))
  //         ) : (
  //           <p className="text-center text-gray-500">No items in wishlist</p>
  //         )}
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div className="container mx-auto p-4 lg:p-10">
      <div className="text-center bg-zinc-100 px-4 py-3 mb-4">
        <h2 className="text-xl font-bold">Wishlist</h2>
      </div>
  
      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {wishlist.length > 0 ? (
            wishlist.map((item) => (
              <div
                key={item.product_id}
                className="relative hover:border border-neutral-300 rounded-lg shadow-md p-4 flex flex-col"
                onClick={() => navigate(`/product/${item.product_id}`, { state: item.product })}
              >
                <button
                  className="absolute top-5 left-5 text-gray-500 hover:text-red-500"
                  onClick={(e) => handleDelete(e, item.product_id)}
                >
                  <Trash className="w-6 h-6" />
                </button>
  
                <img
                  src={`http://127.0.0.1:8000/storage/${item.product?.image || 'default.jpg'}`}
                  alt={item.product?.name || 'Product'}
                  className="w-full h-60 lg:h-100 object-cover transition-all duration-300"
                  onMouseEnter={(e) => {
                    if (item.product?.hover_image) {
                      e.currentTarget.src = `http://127.0.0.1:8000/storage/${item.product.hover_image}`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.src = `http://127.0.0.1:8000/storage/${item.product?.image || 'default.jpg'}`;
                  }}
                />
  
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mt-2">
                  {item.product?.name || "Unnamed Product"}
                </h3>
  
                <p className="text-gray-600">₹{item.product?.price || "N/A"}</p>
  
                {showSizeSelector === item.product_id ? (
                  <div className="flex justify-center mt-2">
                    {Object.entries(item.product.availableSizes).map(([size]) => (
                      <button
                        key={size}
                        className={`px-3 py-1 mx-1 border rounded-md ${selectedSize === size ? 'bg-black text-white' : 'bg-gray-200'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSize(size);
                        }}
                      >
                        {size.toUpperCase()}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    className="mt-2 w-full py-2 bg-black text-white font-bold text-sm rounded-lg hover:bg-gray-800 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSizeSelector(item.product_id);
                    }}
                  >
                    Add To Cart
                  </button>
                )}
  
                {showSizeSelector === item.product_id && (
                  <button
                    className="mt-2 w-full py-2 bg-black text-white font-bold text-sm rounded-lg hover:bg-gray-800 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item.product_id);
                    }}
                  >
                    Add
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center col-span-full py-10">
              <p className="text-gray-700 text-lg font-semibold mb-4">No items in wishlist</p>
              <button
                onClick={() => navigate("/category/AllProducts")}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
  

}