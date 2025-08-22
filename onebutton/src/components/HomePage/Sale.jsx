// import React, { useState, useEffect } from "react";

// export default function Nbottom() {
//   const images = [
//     "/images/Sale-1.jpg",
//     "/images/Sale-2.jpg",
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       // Instantly change to next image
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 1000); // change every 1 second (like blinking)
//     return () => clearInterval(interval);
//   }, [images.length]);

//   return (
//     <div className="container mx-auto flex justify-center items-center bg-neutral-100 max-h-[450px]">
//       <img
//         src={images[currentIndex]}
//         alt="Blinking banner"
//         className="h-full max-h-[450px] w-auto object-contain"
//         style={{
//           display: "block",
//           margin: "0 auto",
//         }}
//       />
//     </div>
//   );
// }




// import React from "react";

// export default function Nbottom() {
//   const images = [
//     "/images/Sale-1.jpg",
//     "/images/Sale-2.jpg",
//   ];

//   return (
//     <div className="container mx-auto flex justify-center items-center lg:hidden mt-10 bg-neutral-100 max-h-[450px]">
//       <img
//         src={images[0]} // Always show only the first image
//         alt="Banner"
//         className="h-full max-h-[450px] w-auto object-contain"
//         style={{
//           display: "block",
//           margin: "0 auto",
//         }}
//       />
//     </div>
//   );
// }


import React from "react";
import { motion } from "framer-motion";

export default function BrandStatement() {
  return (
    <section className="relative max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12 text-center">
      <motion.p
        className="text-gray-700 text-sm sm:text-base md:text-lg tracking-wide font-light"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Crafted for timeless style. Minimal design. Maximum impact.
      </motion.p>
    </section>
  );
}
