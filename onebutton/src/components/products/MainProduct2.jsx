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
  const [showDescription, setShowDescription] = useState(false);
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

    



  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="font-semibold text-lg">Loading Product</p>
      </div>
    );
  }
  if (!product) return <p>Product not found!</p>;

  return (
    <div className="container mx-auto px-4 py-6">
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
        <h1 className="text-2xl text-gray-700 font-semibold md:text-xl lg:text-3xl lg:font-bold lg:mb-3">{product.name}</h1>

{/* Price */}
<p className="text-gray-600 text-xl md:text-xl lg:text-2xl lg:mb-3">{product.price}</p>

{/* Color Selector */}
{product?.availableColors && product.availableColors.length > 0 ? (
  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-4 text-center sm:text-left">
    <h3 className="text-xl sm:text-base lg:text-lg font-semibold">Colors:</h3>
    <div className="flex justify-center sm:justify-start space-x-3 mt-2 sm:mt-0">
      {product.availableColors.map((color, index) => (
        <button
          key={index}
          className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full border-2 ${
            selectedColor === color ? "border-black" : "border-gray-300"
          }`}
          style={{ backgroundColor: color }}
          onClick={() => setSelectedColor(color)}
        ></button>
      ))}
    </div>
  </div>
) : (
  <p className="text-gray-500 text-sm">No colors available</p>
)}

{/* Size and Quantity Selector */}
<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-center sm:text-left">
  {/* Size Selector */}
  <div className="flex flex-col items-center sm:items-start">
    <div className="flex items-center space-x-3">
      <h3 className="text-xl sm:text-base lg:text-lg font-semibold">Size:</h3>
      <button
        onClick={() => setShowSizeChart(true)}
        className="text-xs sm:text-sm lg:text-base text-gray-700 font-semibold underline hover:text-black"
      >
        Size Chart
      </button>
    </div>

    {/* Size Selector Buttons */}
    

    {product?.availableSizes && Object.keys(product.availableSizes).length > 0 ? (
  <div className="flex justify-center sm:justify-start space-x-3 mt-2 sm:mt-0">
    {Object.keys(product.availableSizes).map((size) => (
      <button
        key={size}
        className={`text-sm sm:text-sm lg:text-lg font-medium px-4 sm:px-3 py-2 sm:py-1 border rounded-md transition hover:bg-black hover:text-white 
          ${selectedSize === size ? "bg-black text-white" : ""}`}
        onClick={() => setSelectedSize(size)} // Set selected size
      >
        {size.toUpperCase()} {/* Display size in uppercase (optional) */}
      </button>
    ))}
  </div>
) : (
  <p className="text-gray-500 text-sm mt-1">No sizes available</p>
)}

  </div>

  {/* Sliding Size Chart */}
  {showSizeChart && (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    bg-white shadow-lg z-50 p-4 rounded-lg 
                    w-[90%] max-w-[400px] h-[350px] sm:h-[400px]">
      <button
        onClick={() => setShowSizeChart(false)}
        className="absolute top-2 right-3 text-gray-600 hover:text-black"
      >
        <X size={24} />
      </button>

      <div className="w-full flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-3 text-center">Size Chart</h3>
        <p className="text-sm text-center">
          📏 **Example:** S - 38in, M - 40in, L - 42in, XL - 44in, XXL - 46in.
        </p>
      </div>
    </div>
  )}
</div>
          {/* {product.description && <p className="mt-4 text-gray-600">{product.description}</p>} */}

          <button className="w-full lg:w-[70%] text-xs px-4 py-2 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition mt-3"
          onClick={() =>  {handleAddToCart(product.id) }}>
            Add to Cart
          </button>
        

          <button onClick={() => setShowDescription(!showDescription)} className="w-full lg:w-[70%] h-12 text-sm flex justify-between items-center text-gray-700 font-bold px-5 py-3 border border-gray-300 rounded-md mt-5">
            Product Details
            <span className="text-xl">{showDescription ? "−" : "+"}</span>
          </button>
          {showDescription && <div className="w-full lg:w-[70%] bg-gray-100 p-4 rounded-md text-sm">{product.description}</div>}

          <button onClick={() => setShowPolicy(!showPolicy)} className="w-full lg:w-[70%] h-12 text-sm flex justify-between items-center text-gray-700 font-bold px-5 py-3 border border-gray-300 rounded-md mt-2">
            Return & Exchange
            <span className="text-xl">{showPolicy ? "−" : "+"}</span>
          </button>
          {showPolicy && <div className="w-full lg:w-[70%] bg-gray-100 p-4 rounded-md text-sm">{product.policy}</div>}

         

           {/* REVIEWS SECTION */}
      <div className="mt-1">
        <ReviewsSection productId={product.id} />
      </div>



          <button onClick={() => setShowOffer(!showOffer)} className="w-full lg:w-[70%] h-12 text-sm flex justify-between items-center text-gray-700 font-bold px-5 py-3 border border-gray-300 rounded-md mt-2">
            Offers
            <span className="text-xl">{showOffer ? "−" : "+"}</span>
          </button>
          {showOffer && <div className="w-full lg:w-[70%] bg-gray-100 p-4 rounded-md text-sm">{product.offers}</div>}
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











