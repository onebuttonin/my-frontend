import React from "react";
import { useState } from "react"; 
import  { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CollectionGrid() {
  const collections = [
    {
      id: 1,
      title: "Collections",
    //   image: "/public/images/Collections.jpg",
      path: "AllProducts"
    },
    {
      id: 2,
      title: "Basic Range",
      image: "/images/Collections/mckblackfr.png",
      path: "basics",
    },
    {
      id: 3,
      title: "Minimal Range",
      image: "/images/Collections/flowers.png",
      path: "minimals"
    },
    {
      id: 4,
      title: "Not So Basic Range",
      image: "/images/Collections/Men-face.png",
      path: "not-so-basic",
    },
  ];
 
  const navigate = useNavigate();

  const handleRedirect = (path) => {
    navigate(`/category/${path}`);
  };

  return (

   

    <div className="container mx-auto px-4 py-8">
      {/* Header with Thick Background */}
      <div className="bg-gray-200 py-3 px-6 rounded-lg text-center mb-4">
        <h2 className="text-2xl font-bold">Our Collections</h2>
      </div>

      {/* Grid for Large Screens (Desktop) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {collections.map((collection) => (
          <div key={collection.id} className="relative group overflow-hidden"> {/* Added overflow-hidden here */}
            {/* Product Image */}
            <img
              src={collection.image}
              alt={collection.title}
              className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
            {/* Overlay with Blur Effect */}
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/50 backdrop-blur-sm text-white rounded-lg">
              <h3 className="text-xl font-semibold sm:text-lg md:text-xl">{collection.title}</h3>
              <button className="mt-3 px-4 py-2 bg-white text-black font-bold text-sm rounded-lg shadow-md hover:bg-gray-300 sm:text-xs"
              onClick={() => handleRedirect(collection.path)}>
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slider for Small Screens (Mobile) */}
      <div className="md:hidden overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex space-x-4 w-max scroll-smooth snap-x snap-mandatory">
          {collections.map((collection) => (
            <div key={collection.id} className="w-[22%] flex-shrink-0 snap-center relative rounded-lg overflow-hidden border border-gray-200">
              {/* Product Image */}
              <img
                src={collection.image}
                alt={collection.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              {/* Overlay with Blur Effect */}
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/50 backdrop-blur-sm text-white rounded-lg">
                {/* Title Size Adjustments */}
                <h3 className="text-lg font-semibold sm:text-base md:text-lg">{collection.title}</h3>
                {/* Button Size Adjustments */}
                <button className="mt-3 px-4 py-1 bg-white text-black font-bold text-xs rounded-lg shadow-md hover:bg-gray-300 sm:text-xs"
                onClick={() => handleRedirect(collection.path)}>
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}