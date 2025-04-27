
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: 1, name: "All", image: "/images/streetwear.jpg", path: "AllProducts" },
  { id: 2, name: "Not So Basic", image: "/images/Collections/Men-face.png", path: "not-so-basic" },
  { id: 3, name: "Minimal", image: "/images/Collections/flowers.png", path: "minimals" },
  { id: 4, name: "Basic", image: "/images/Collections/mckblackfr.png", path: "basics" },
];

export default function CategoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleRedirect = (path) => {
    navigate(`/category/${path}`);
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second loading time

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-lg font-semibold">Loading Categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gray-200 py-3 px-6 rounded-lg text-center mb-6">
        <h2 className="text-2xl font-bold">Our Categories</h2>
      </div>

      {/* 2-column Layout for All Screen Sizes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-36 sm:h-44 md:h-56 lg:h-64 object-cover rounded-t-lg"
            />
            <div className="p-4 flex flex-col flex-grow items-center">
              <h3 className="text-sm sm:text-md md:text-lg font-semibold mb-2">{category.name}</h3>
              <button onClick={() => handleRedirect(category.path)} className="mt-auto w-full py-2 bg-black text-white font-bold text-sm rounded-lg hover:bg-gray-800 transition-all">
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
