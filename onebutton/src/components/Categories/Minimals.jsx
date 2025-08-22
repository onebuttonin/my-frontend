// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Heart } from "lucide-react";
// import toast from "react-hot-toast";

// export default function ProductGrid() {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [wishlist, setWishlist] = useState([]);
//   const [loading, setLoading] = useState(true); // <-- loading state added

//   useEffect(() => {
//     fetchWishlist();
//     fetchProducts();
//   }, []);

//   const fetchWishlist = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const response = await axios.get("http://127.0.0.1:8000/api/wishlist", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setWishlist(response.data.map((item) => item.product_id));
//     } catch (error) {
//       // console.error("Error fetching wishlist:", error);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:8000/api/products", {
//         headers: { "Content-Type": "application/json" },
//       });
//       setProducts(response.data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false); // <-- stop loading after products fetched
//     }
//   };

//   const addToWishlist = async (productId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("You need to login first.");
//         return;
//       }

//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/wishlist",
//         { product_id: productId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       toast.success(response.data.message);

//       setWishlist((prev) =>
//         prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
//       );
//     } catch (error) {
//       console.error("Error adding to wishlist:", error);
//       if (error.response?.status === 401) {
//         toast.error("Session expired. Please log in again.");
//         localStorage.removeItem("token");
//       } else {
//         toast.error("Failed to add to wishlist.");
//       }
//     }
//   };

//   const minimalProducts = products.filter(
//     (product) => product.category?.toLowerCase() === "minimals"
//   );

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-xl font-semibold">Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4 lg:p-10">
//       <div className="text-center px-4 py-3 mb-4">
//         <h2 className="text-xl font-bold">Minimals</h2>
//       </div>

//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {minimalProducts.length > 0 ? (
//           minimalProducts.map((product) => (
//             <div
//               key={product.id}
//               className="relative hover:border border-neutral-300 rounded-lg shadow-md p-4 flex flex-col"
//             >
//               <button
//                 className={`absolute top-5 right-5 ${wishlist.includes(product.id) ? "text-red-500" : "text-gray-500"} hover:text-red-500`}
//                 onClick={() => addToWishlist(product.id)}
//               >
//                 <Heart className="w-6 h-6" fill={wishlist.includes(product.id) ? "red" : "none"} />
//               </button>

//               <img
//                 src={`http://127.0.0.1:8000/storage/${product.image}`}
//                 alt={product.name}
//                 className="w-full h-60 lg:h-100 object-cover"
//                 onClick={() => navigate(`/product/${product.id}`, { state: product })}
//                 onMouseEnter={(e) =>
//                   (e.currentTarget.src = `http://127.0.0.1:8000/storage/${product.hover_image}`)
//                 }
//                 onMouseLeave={(e) =>
//                   (e.currentTarget.src = `http://127.0.0.1:8000/storage/${product.image}`)
//                 }
//               />

//               <h3 className="text-sm sm:text-base md:text-lg font-semibold mt-2">
//                 {product.name}
//               </h3>

//               <p className="text-gray-600">{product.price}</p>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500 text-center col-span-full">No minimal products available.</p>
//         )}
//       </div>
//     </div>
//   );
// }



import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

const fetchProducts = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
  return response.data;
};

const fetchWishlist = async () => {
  const token = localStorage.getItem("token");
  if (!token) return [];
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.map((item) => item.product_id);
};

export default function ProductGrid() {
  const navigate = useNavigate();

  const {
    data: products = [],
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  const {
    data: wishlist = [],
    refetch: refetchWishlist,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
  });

  const addToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You need to login first.");
        return;
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

      toast.success(response.data.message);
      refetchWishlist();
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        toast.error("Failed to add to wishlist.");
      }
    }
  };

  const minimalProducts = products.filter(
    (product) => product.category?.toLowerCase() === "minimals"
  );

  if (isLoadingProducts) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  if (isErrorProducts) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-600">Failed to load products.</p>
      </div>
    );
  }

  return (
  <div className="container mx-auto px-2 lg:px-10 py-10">
    {/* Preload hover images */}
    <div className="hidden">
      {minimalProducts.map((product) => (
        <link
          key={`hover-${product.id}`}
          rel="preload"
          as="image"
          href={`${import.meta.env.VITE_BASE_URL}/storage/${product.hover_image}`}
        />
      ))}
    </div>

    {/* Title Section */}
    <div className="text-center px-4 py-3 mb-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide uppercase">
        Not So Basic
      </h2>
    </div>

    {/* Product Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {minimalProducts.length > 0 ? (
        minimalProducts.map((product) => (
          <div
            key={product.id}
            className="relative flex flex-col border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer"
          >
            {/* Wishlist Button */}
            <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <Heart
                className="w-6 h-6"
                fill={wishlist.includes(product.id) ? "red" : "none"}
              />
            </button>

            {/* Product Image */}
            <div className="bg-white flex justify-center items-center">
              <img
                loading="lazy"
                src={`${import.meta.env.VITE_BASE_URL}/storage/${product.image}`}
                alt={product.name}
                className="w-full h-auto sm:max-h-80 lg:max-h-[450px] object-contain cursor-pointer transition-transform duration-500"
                onClick={() => navigate(`/product/${product.id}`, { state: product })}
                onMouseEnter={(e) =>
                  (e.currentTarget.src = `${import.meta.env.VITE_BASE_URL}/storage/${product.hover_image}`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.src = `${import.meta.env.VITE_BASE_URL}/storage/${product.image}`)
                }
              />
            </div>

            {/* Product Details */}
            <div className="px-2 py-2 lg:pl-4">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold leading-tight">
                {product.name}
              </h3>
              <p className="text-gray-600">{product.price}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center col-span-full">
          No minimal products available.
        </p>
      )}
    </div>
  </div>
);

}
