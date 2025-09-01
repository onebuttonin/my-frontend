import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { X,Heart, Minus, Plus } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Ticker2 from "../Ticker2";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ReviewsSection from "./Ratings";
import { Link } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [showPolicy, setShowPolicy] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product?.availableColors?.[0] || ""); 
  const [wishlist, setWishlist] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const navigate = useNavigate();
  const [cartId, setCartId] = useState(null); // State to store cart_id
  const token = localStorage.getItem("token");
  const [similarProducts, setSimilarProducts] = useState([]);
  const location = useLocation();
  const [avgRating, setAvgRating] = useState(0);
const [totalReviews, setTotalReviews] = useState(0);
  

  // Fetch the existing cart_id when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
  
    // if (!token) {
    //   console.error("No token found. Please log in.");
    //   return;
    // }

    
    axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      
      if (response.data.id && response.data.status === "pending") {
        setCartId(response.data.id);
        // console.log("Pending Cart ID:", response.data.id);
      } else {
        // console.log("No pending cart found.");
      }
    })
    .catch(error => {
      console.error("Error fetching cart ID:", error.response?.data || error.message);
    });

    if (product && product.category) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/products`)
        .then((response) => {
          const filtered = response.data
            .filter(
              (p) => p.category === product.category && p.id !== product.id
            )
            .slice(0, 4); // limit to 4 products
          setSimilarProducts(filtered);
        })
        .catch((err) => console.error("Error fetching similar products:", err));
    }
  }, [product, token, navigate, location]);

  
  
  const handleAddToCart = async (productId) => {
    if (!selectedSize) {
      toast.error("Please select a size first!");
      return;
    }
    
  
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        if (!localStorage.getItem("redirectAfterLogin")) {
          localStorage.setItem("redirectAfterLogin", location.pathname);
        }
        toast.error("Please log in first!");
        navigate("/login");
      }
  
      await axios.post(
         `${import.meta.env.VITE_API_URL}/add-cart`,
        { product_id: productId, size: selectedSize, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      toast.success("Product added to cart!"); // Later you can replace this too with a toast
      navigate('/cart')
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };


  

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
          "Content-Type": "application/json"   // ✅ Add Content-Type header
        }
      }
    );

    toast.success(response.data.message);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    
    // ✅ Better error handling for 401 Unauthorized
    if (error.response && error.response.status === 401) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("token");  // Remove invalid token
    } else {
      toast.error("Failed to add to wishlist.");
    }
  }
};

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setSelectedImage(
          response.data.thumbnail_images?.[0] 
            ? `${import.meta.env.VITE_BASE_URL}/storage/${response.data.thumbnail_images[0].replace("public/", "")}`
            : ""
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [id]);

    
// main div py-0
// productname black semibold
// product price black semibold

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="font-semibold text-lg">Loading Product</p>
      </div>
    );
  }
  if (!product) return <p>Product not found!</p>;

  return (
    <div className="container mx-auto px-4 lg:py-6">

      <Toaster position="top-center" reverseOrder={false} />
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 items-start">
        {/* Left: Image Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start space-x-0 relative -mx-4 sm:-mx-0">
          {/* Small Screens: Image Slider */}
          <div className="w-full lg:hidden relative">
            <Swiper
              spaceBetween={5}
              slidesPerView={"auto"}
              loop={true}
              centeredSlides={true}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
              {product.thumbnail_images.map((img, index) => (
                <SwiperSlide key={index} style={{ width: "80%" }}>
                  <div className="relative">
                    {index === activeIndex && (
                      <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                      onClick={() => addToWishlist(product.id)}>
                        <Heart className="w-6 h-6" />
                      </button>
                    )}
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}/storage/${img.replace("public/", "")}`}
                      alt={`Thumbnail ${index}`}
                      loading="lazy"
                      className="w-full h-125 lg:h-auto object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full">
                      <Ticker2 />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Large Screens: Thumbnails */}
          <div className="hidden lg:flex flex-col space-y-3 w-[15%]">
  {product.thumbnail_images.map((img, index) => {
    const imageUrl = `${import.meta.env.VITE_BASE_URL}/storage/${img.replace("public/", "")}`;
    return (
      <img
        key={index}
        src={imageUrl}
        alt={`Thumbnail ${index}`}
        className={`w-20 h-20 lg:w-[120px] lg:h-[120px] object-cover rounded-md cursor-pointer border-2 ${
          selectedImage === imageUrl ? "border-black" : "border-gray-300"
        }`}
        onClick={() => setSelectedImage(imageUrl)}
      />
    );
  })}
</div>


          {/* Large Image */}
          <div className="relative w-[85%] lg:max-w-[85%] hidden lg:block">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-10"
            onClick={() => addToWishlist(product.id)}>
              <Heart className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-[650px] object-contain rounded-md shadow-md"
            />
          </div>
        </div>

        {/* Right: Product Details */}
<div className="flex flex-col w-full lg:pl-6">
  {/* Product Name */}
  <h1 className="text-2xl md:text-xl lg:text-3xl font-semibold tracking-wide text-gray-900 mb-0 lg:mb-3">
    {product.name}
  </h1>

  {/* Price */}
  <p className="text-xl md:text-xl lg:text-2xl font-medium text-gray-900 mb-0">
    ₹{product.price}
  </p>

  {/* Show rating */}
  {totalReviews > 0 && (
    <div className="flex items-center gap-2 mb-0">
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        if (avgRating >= starValue) {
          return <span key={i} className="text-yellow-500 text-lg">★</span>;
        } else if (avgRating >= starValue - 0.5) {
          return <span key={i} className="text-yellow-500 text-lg">☆</span>;
        }
        return <span key={i} className="text-gray-400 text-lg">★</span>;
      })}
      <span className="text-gray-600 text-sm font-medium">
        {avgRating.toFixed(1)} ({totalReviews} reviews)
      </span>
    </div>
  )}

{/* Color Selector */}
{product?.availableColors?.length > 0 ? (
  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-4 sm:justify-start justify-center">
    <h3 className="text-base lg:text-lg font-medium text-gray-800 text-center sm:text-left">
      Colors:
    </h3>
    <div className="flex space-x-3 mt-2 sm:mt-0 justify-center sm:justify-start">
      {product.availableColors.map((color, index) => (
        <button
          key={index}
          className={`w-9 h-9 border rounded-full ${
            selectedColor === color ? "border-black" : "border-gray-300"
          }`}
          style={{ backgroundColor: color }}
          onClick={() => setSelectedColor(color)}
        ></button>
      ))}
    </div>
  </div>
) : (
  <p className="text-gray-500 text-sm text-center sm:text-left">No colors available</p>
)}

{/* Size Selector */}
<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-4 sm:justify-start justify-center">
  <div className="text-center sm:text-left">
    <div className="flex items-center justify-center sm:justify-start space-x-3">
      <h3 className="text-base lg:text-lg font-medium text-gray-800">Size:</h3>
      <button
        onClick={() => setShowSizeChart(!showSizeChart)}
        className="text-xs sm:text-sm text-gray-700 underline hover:text-black"
      >
        Size Chart
      </button>
    </div>

    {product?.availableSizes && Object.keys(product.availableSizes).length > 0 ? (
      <div className="flex space-x-3 mt-2 justify-center sm:justify-start">
        {["s", "m", "l", "xl", "xxl"].map((size) =>
          product.availableSizes[size] ? (
            <button
              key={size}
              className={`px-4 py-2 border text-sm lg:text-base font-medium transition rounded 
                ${
                  selectedSize === size
                    ? "bg-black text-white"
                    : "hover:bg-black hover:text-white border-gray-400"
                }`}
              onClick={() => {
                setSelectedSize(size);
                setShowSizeChart(true); // open card when size selected
              }}
            >
              {size.toUpperCase()}
            </button>
          ) : null
        )}
      </div>
    ) : (
      <p className="text-gray-500 text-sm mt-1 text-center sm:text-left">No sizes available</p>
    )}
  </div>
</div>

{/* Size Chart Card */}
{showSizeChart && (
  <div className="mt-4 p-4 border rounded-lg shadow-lg bg-white w-full sm:w-[80%] lg:w-[70%] mx-auto">
    <h4 className="text-lg font-semibold text-gray-800 mb-3">Size Chart</h4>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 text-sm lg:text-base">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2">Size</th>
            <th className="border border-gray-300 px-3 py-2">Chest</th>
            <th className="border border-gray-300 px-3 py-2">Length</th>
            <th className="border border-gray-300 px-3 py-2">Shoulder</th>
            <th className="border border-gray-300 px-3 py-2">Sleeves</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="border px-3 py-2">S</td><td className="border px-3 py-2">42</td><td className="border px-3 py-2">27.5</td><td className="border px-3 py-2">21.5</td><td className="border px-3 py-2">8.8</td></tr>
          <tr><td className="border px-3 py-2">M</td><td className="border px-3 py-2">44</td><td className="border px-3 py-2">28</td><td className="border px-3 py-2">22.5</td><td className="border px-3 py-2">9</td></tr>
          <tr><td className="border px-3 py-2">L</td><td className="border px-3 py-2">46</td><td className="border px-3 py-2">28.5</td><td className="border px-3 py-2">23.5</td><td className="border px-3 py-2">9.2</td></tr>
          <tr><td className="border px-3 py-2">XL</td><td className="border px-3 py-2">48</td><td className="border px-3 py-2">29</td><td className="border px-3 py-2">24.5</td><td className="border px-3 py-2">9.4</td></tr>
          <tr><td className="border px-3 py-2">XXL</td><td className="border px-3 py-2">50</td><td className="border px-3 py-2">29.5</td><td className="border px-3 py-2">25.5</td><td className="border px-3 py-2">9.6</td></tr>
        </tbody>
      </table>
    </div>
  </div>
)}



  {/* Add to Bag */}
  <button
    onClick={() => handleAddToCart(product.id)}
    className="w-full lg:w-[70%] mt-5 py-3 bg-black text-white text-sm font-medium tracking-wide hover:bg-gray-900 transition"
  >
    ADD TO BAG
  </button>

  {/* Accordion Sections */}
  <button
    onClick={() => setShowDescription(!showDescription)}
    className="w-full lg:w-[70%] h-12 mt-5 flex justify-between items-center px-5 py-3 border text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
  >
    Product Details
    <span className="text-xl">{showDescription ? "−" : "+"}</span>
  </button>
  {showDescription && (
    <div className="w-full lg:w-[70%] bg-gray-50 p-4 text-sm text-gray-700">
      {product.description}
    </div>
  )}

   {/* Reviews */}
  <div className="mt-1">
    <ReviewsSection
      productId={product.id}
      onRatingData={(avg, total) => {
        setAvgRating(avg);
        setTotalReviews(total);
      }}
    />
  </div>

  <button
    onClick={() => setShowOffer(!showOffer)}
    className="w-full lg:w-[70%] h-12 mt-3 flex justify-between items-center px-5 py-3 border text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
  >
    Offers
    <span className="text-xl">{showOffer ? "−" : "+"}</span>
  </button>
  {showOffer && (
    <div className="w-full lg:w-[70%] bg-gray-50 p-4 text-sm text-gray-700">
      {product.offers}
    </div>
  )}

  <button
    onClick={() => setShowPolicy(!showPolicy)}
    className="w-full lg:w-[70%] h-12 mt-3 flex justify-between items-center px-5 py-3 border text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
  >
    Return & Exchange
    <span className="text-xl">{showPolicy ? "−" : "+"}</span>
  </button>
  {showPolicy && (
    <div className="w-full lg:w-[70%] bg-gray-50 p-4 text-sm text-gray-700">
      {product.policy}
    </div>
  )}

 
</div>


      </div>

      {similarProducts.length > 0 && (
  <div className="container mx-auto p-4 lg:p-10">
    <div className="text-center px-4 py-3 mb-4">
      <h2 className="text-xl font-bold">Similar Products</h2>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {similarProducts.map((product) => (
        <div
          key={product.id}
          className="relative hover:border border-neutral-300 rounded-lg shadow-md p-4 flex flex-col"
        >
          <button
            className={`absolute top-5 right-5 ${wishlist.includes(product.id) ? "text-red-500" : "text-gray-500"} hover:text-red-500`}
            onClick={() => addToWishlist(product.id)}
          >
            <Heart
              className="w-6 h-6"
              fill={wishlist.includes(product.id) ? "red" : "none"}
            />
          </button>

          <img
            src={`${import.meta.env.VITE_BASE_URL}/storage/${product.image}`}
            alt={product.name}
            className="w-full h-60 md:h-72 lg:h-80 object-cover transition duration-300 ease-in-out cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`, { state: product })}
            onMouseEnter={(e) =>
              (e.currentTarget.src = `${import.meta.env.VITE_BASE_URL}/storage/${product.hover_image}`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.src = `${import.meta.env.VITE_BASE_URL}/storage/${product.image}`)
            }
          />

          <h3 className="text-sm sm:text-base md:text-lg font-semibold mt-2">
            {product.name}
          </h3>

          <p className="text-gray-600">{product.price}</p>
        </div>
      ))}
    </div>
  </div>
)}
    </div>
  );
}




// Inside your return JSX, add this block at the very bottom (just before final </div>):











