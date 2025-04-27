// import React, { useEffect,useState } from "react";
import { useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Heart, Minus, Plus } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { X } from "lucide-react";
import Ticker2 from "../Ticker2";
import Minimal from "/src/components/products/Minimal"
import { useEffect, useState } from "react";
import axios from "axios"; // For API request
import { useParams } from "react-router-dom";


export default function ProductDetails() {
  const { state: product } = useLocation();
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [showReview, setShowReview] = useState(false);
  // const [quantity, setQuantity] = useState(1);
  // const [activeIndex, setActiveIndex] = useState(0);
// 
  const [selectedColor, setSelectedColor] = useState(
    product.availableColors?.[0] || "" // Fallback to empty string if undefined
  );
  

  /* from database 28-39, */ 
  const { id } = useParams(); // Get product ID from URL
  // const [product, setProduct] = useState(null);
  // const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Increase quantity (Max: 10)
  const increaseQty = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  // Decrease quantity (Min: 1)
  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="container mx-auto px-4 py-6">
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
          // className="rounded-md"
        >
          {product.images.map((img, index) => (
            <SwiperSlide key={index} style={{ width: "80%" }}>
              <div className="relative">
                {/* Wishlist Icon (Only for Centered Image) */}
                {index === activeIndex && (
                  <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
                    <Heart className="w-6 h-6" />
                  </button>
                )}

                {/* Product Image */}
                <img
                  src={img}
                  alt={`Thumbnail ${index}`}
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

      {/* Large Screens: Thumbnails (Left Side) */}
      <div className="hidden lg:flex flex-col space-y-3 w-[15%]">
        {product.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index}`}
            className={`w-20 h-20 lg:w-[120px] lg:h-[120px] object-cover rounded-md cursor-pointer border-2 ${
              selectedImage === img ? "border-black" : "border-gray-300"
            }`}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>

      {/* Large Image (with Absolute Positioned Wishlist Icon) */}
      <div className="relative w-[85%] lg:max-w-[85%] hidden lg:block">
        {/* Wishlist Icon (Doesn't Reduce Image Width) */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-10">
          <Heart className="w-6 h-6" />
        </button>

        {/* Large Image */}
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
          <h1 className="text-2xl text-gray-700 font-semibold md:text-xl lg:text-3xl lg:font-bold lg:mb-3">{product.name}</h1>

          {/* Price */}
          <p className="text-gray-600 text-xl md:text-xl lg:text-2xl lg:mb-3">{product.price}</p>

           {/* Color Selector */}
           {product?.availableColors?.length > 0 ? (
  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-4 text-center sm:text-left">
    {/* Color Text (Centered for Small Screens, Left for Large Screens) */}
    <h3 className="text-xl sm:text-base lg:text-lg font-semibold">Colors:</h3>

    {/* Color Selector (Centered for Small Screens, Bigger Size) */}
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
      {/* Size Text */}
      <h3 className="text-xl sm:text-base lg:text-lg font-semibold">Size:</h3>

      {/* Size Chart Button (Aligned with Size Text) */}
      <button
        onClick={() => setShowSizeChart(true)}
        className="text-xs sm:text-sm lg:text-base text-gray-700 font-semibold underline hover:text-black"
      >
        Size Chart
      </button>
    </div>

    {/* Size Selector Buttons (Centered for Small Screens, Normal for Large Screens) */}
    <div className="flex justify-center sm:justify-start space-x-3 mt-2 sm:mt-0">
      {product.availableSizes.map((size) => (
        <button
          key={size}
          className="text-sm sm:text-sm lg:text-lg font-medium px-4 sm:px-3 py-2 sm:py-1 border rounded-md transition hover:bg-black hover:text-white"
        >
          {size}
        </button>
      ))}
    </div>
  </div>

  {/* Sliding Size Chart (Reduced Height, Increased Width) */}
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
        



         
          <button
  className="w-full lg:w-[70%] lg:mt-5 text-xs sm:text-sm lg:text-base px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold lg:rounded-md hover:from-black hover:to-gray-800 transition-all mt-3 
  fixed bottom-0 left-0 right-0 lg:static lg:mb-0 p-3 text-center shadow-md h-10 sm:h-10"
>
  Add to Cart
</button>
          

          {/* Product Description (Collapsible) */}
          <button
  onClick={() => setShowDescription(!showDescription)}
  className="w-full lg:w-[70%] h-12 sm:h-14 lg:h-10 text-sm sm:text-base lg:text-base 
             flex justify-between items-center text-gray-700 font-bold 
             px-5 py-3 border border-gray-300 lg:rounded-md mt-5"
>
  Product Details
  <span className="text-xl">{showDescription ? "−" : "+"}</span>
</button>
{showDescription && (
  <div className="w-full lg:w-[70%] bg-gray-100 p-4 rounded-md text-sm">
      {product.description.map((section, index) => (
      <div key={index}>
        <h3 className="text-gray-900 font-semibold">{section.title}</h3>
        {Array.isArray(section.details) ? (
          <ul className="list-none text-gray-700 mt-1">
            {section.details.map((item, i) => (
              <li key={i} className="text-sm">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700 mt-1">{section.details}</p>
        )}
      </div>
    ))}
  </div>
)}

<button
  onClick={() => setShowPolicy(!showPolicy)}
  className="w-full lg:w-[70%] h-12 sm:h-14 lg:h-10 text-sm sm:text-base lg:text-base 
             flex justify-between items-center text-gray-700 font-bold 
             px-5 py-3 border border-gray-300 lg:rounded-md mt-2"
>
  Return & Exchange 
  <span className="text-xl">{showPolicy ? "−" : "+"}</span>
</button>
{showPolicy && (
  <div className="w-full lg:w-[70%] bg-gray-100 p-4 rounded-md text-sm">
    {product.description}
  </div>
)}

<button
  onClick={() => setShowOffer(!showOffer)}
  className="w-full lg:w-[70%] h-12 sm:h-14 lg:h-10 text-sm sm:text-base lg:text-base 
             flex justify-between items-center text-gray-700 font-bold 
             px-5 py-3 border border-gray-300 lg:rounded-md mt-2"
>
  Offers
  <span className="text-xl">{showOffer ? "−" : "+"}</span>
</button>
{showOffer && (
  <div className="w-full lg:w-[70%] bg-gray-100 p-4 rounded-md text-sm">
    {product.description}
  </div>
)}

<button
  onClick={() => setShowReview(!showReview)}
  className="w-full lg:w-[70%] h-12 sm:h-14 lg:h-10 text-sm sm:text-base lg:text-base 
             flex justify-between items-center text-gray-700 font-bold 
             px-5 py-3 border border-gray-300 lg:rounded-md mt-2"
>
  Review
  <span className="text-xl">{showReview ? "−" : "+"}</span>
</button>
{showReview && (
  <div className="w-full lg:w-[70%] bg-gray-100 p-4 rounded-md text-sm">
    {product.description}
  </div>
)}

  








       </div>
      
      </div>
      <Minimal/>
    </div>
    
  );
}

