import React from "react";
import { useNavigate } from "react-router-dom";

const collections = [
  {
    id: 1,
    title: "Collections",
    path: "AllProducts",
    image: "https://images.unsplash.com/photo-1521336575822-6da63fb45455?w=800&q=80",
  },
  {
    id: 2,
    title: "Oversize Tshirts",
    image: "/images/Реклама.jpeg",
    path: "Oversize-Tshirts",
  },
  {
    id: 3,
    title: "Shirts",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
    path: "Shirts",
  },
  {
    id: 4,
    title: "Tshirts",
    image: "/images/download (8).jpeg",
    path: "Tshirts",
  },
];

function CollectionGrid() {
  const navigate = useNavigate();

  const handleRedirect = (path) => {
    navigate(`/category/${path}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide uppercase">
          Our Collections
        </h2>
        <p className="text-gray-500 mt-2 text-sm">Explore the ranges</p>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="relative overflow-hidden border border-gray-200"
          >
            <img
              loading="lazy"
              src={collection.image}
              alt={collection.title}
              className="w-full h-60 object-cover"
            />
            {/* Overlay with content */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col justify-center items-center text-center">
              <h3 className="text-white text-lg font-medium tracking-wide">
                {collection.title}
              </h3>
              <button
                className="mt-3 px-5 py-2 bg-white text-black font-medium text-sm shadow-md hover:bg-gray-100"
                onClick={() => handleRedirect(collection.path)}
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Slider */}
      <div className="md:hidden overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex space-x-4 w-max scroll-smooth snap-x snap-mandatory">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="w-56 flex-shrink-0 snap-center relative border border-gray-200"
            >
              <img
                loading="lazy"
                src={collection.image}
                alt={collection.title}
                className="w-full h-56 object-cover"
              />
              {/* Overlay with content */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col justify-center items-center text-center">
                <h3 className="text-white text-base font-medium">
                  {collection.title}
                </h3>
                <button
                  className="mt-2 px-3 py-1 bg-white text-black text-xs font-medium hover:bg-gray-100"
                  onClick={() => handleRedirect(collection.path)}
                >
                  Shop
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(CollectionGrid);
