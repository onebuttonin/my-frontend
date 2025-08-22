

// import React from "react";
// import { useNavigate } from "react-router-dom";

// const collections = [
//   {
//     id: 1,
//     title: "Collections",
//     path: "AllProducts",
//     image: "/images/Collections/placeholder.jpg", // Add placeholder or real image
//   },
//   {
//     id: 2,
//     title: "Basic Range",
//     image: "/images/Collections/mckblackfr.png",
//     path: "basics",
//   },
//   {
//     id: 3,
//     title: "Minimal Range",
//     image: "/images/Collections/flowers.png",
//     path: "minimals",
//   },
//   {
//     id: 4,
//     title: "Not So Basic Range",
//     image: "/images/Collections/Men-face.png",
//     path: "not-so-basic",
//   },
// ];

// function CollectionGrid() {
//   const navigate = useNavigate();

//   const handleRedirect = (path) => {
//     navigate(`/category/${path}`);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* ✅ Preload Images */}
//       <div className="hidden">
//         {collections.map((collection) => (
//           <link
//             key={`preload-${collection.id}`}
//             rel="preload"
//             as="image"
//             href={collection.image}
//           />
//         ))}
//       </div>

//       {/* Header */}
//       <div className="bg-gray-200 py-3 px-6 rounded-lg text-center mb-4">
//         <h2 className="text-2xl font-bold">Our Collections</h2>
//       </div>

//       {/* Desktop Grid */}
//       <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {collections.map((collection) => (
//           <div key={collection.id} className="relative group overflow-hidden">
//             <img
//               loading="lazy"
//               src={collection.image}
//               alt={collection.title}
//               className="w-full h-64 object-cover rounded-lg transition-transform duration-150 group-hover:scale-105"
//             />
//             <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/50 backdrop-blur-sm text-white rounded-lg">
//               <h3 className="text-xl font-semibold sm:text-lg md:text-xl">{collection.title}</h3>
//               <button
//                 className="mt-3 px-4 py-2 bg-white text-black font-bold text-sm rounded-lg shadow-md hover:bg-gray-300 sm:text-xs"
//                 onClick={() => handleRedirect(collection.path)}
//               >
//                 Shop Now
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Mobile Slider */}
//       <div className="md:hidden overflow-x-auto pb-4 scrollbar-hide">
//         <div className="flex space-x-4 w-max scroll-smooth snap-x snap-mandatory">
//           {collections.map((collection) => (
//             <div
//               key={collection.id}
//               className="w-[22%] flex-shrink-0 snap-center relative rounded-lg overflow-hidden border border-gray-200"
//             >
//               <img
//                 loading="lazy"
//                 src={collection.image}
//                 alt={collection.title}
//                 className="w-full h-64 object-cover rounded-lg"
//               />
//               <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/50 backdrop-blur-sm text-white rounded-lg">
//                 <h3 className="text-lg font-semibold sm:text-base md:text-lg">
//                   {collection.title}
//                 </h3>
//                 <button
//                   className="mt-3 px-4 py-1 bg-white text-black font-bold text-xs rounded-lg shadow-md hover:bg-gray-300 sm:text-xs"
//                   onClick={() => handleRedirect(collection.path)}
//                 >
//                   Shop Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ✅ Memoize for performance
// export default React.memo(CollectionGrid);



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
    title: "Basic Range",
    image: "/images/Реклама.jpeg",
    path: "basics",
  },
  {
    id: 3,
    title: "Minimal Range",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
    path: "minimals",
  },
  {
    id: 4,
    title: "Not So Basic Range",
    image: "/images/download (8).jpeg",
    path: "not-so-basic",
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
