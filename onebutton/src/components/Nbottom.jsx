// import React from "react";

// export default function Nbottom () {
//   return(
           
//     <div className="container mx-auto flex border-1 min-h-50 max-h-[450px] bg-neutral-100">
//           <img src="/images/WEB.jpg" className="block mx-auto w-full max-w-[1200px] h-auto bg-cover bg-center bg-no-repeat" />
//     </div> 
//   )

// }

// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import "swiper/css";

// export default function Nbottom() {
//   const images = [
//     "/images/WEB.jpg",
//     "/images/WEB2.jpg",
//   ];

//   return (
//     <div className="container mx-auto flex justify-center items-center bg-neutral-100 max-h-[450px]">
//       <Swiper
//         modules={[Autoplay]}
//         loop={true}
//         autoplay={{
//           delay: 3000,
//           disableOnInteraction: false,
//         }}
//         speed={800}
//         slidesPerView={1}
//         centeredSlides={true}
//       >
//         {images.map((src, idx) => (
//           <SwiperSlide key={idx} className="flex justify-center items-center">
//             <img
//               src={src}
//               alt={`Slide ${idx}`}
//               className="h-full max-h-[450px] w-auto object-contain"
//               style={{
//                 display: "block",
//                 margin: "0 auto", // keep horizontal center
//               }}
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// }



// last

// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import "swiper/css";

// export default function Nbottom() {
//   // Images for large and small screens
//   const largeScreenImages = [
//     "/images/WEB1.1.jpg",
//     "/images/WEB2.1.jpg",
//   ];
//   const smallScreenImages = [
//     "/images/main image-1.1.jpg",
//     "/images/main image-2.2.jpg",
//   ];

//   return (
//     <div className="container mx-auto flex justify-center items-center bg-neutral-100">
//       {/* Large Screen Slider */}
//       <div className="hidden lg:block w-full">
//         <Swiper
//           modules={[Autoplay]}
//           loop={true}
//           autoplay={{
//             delay: 3000,
//             disableOnInteraction: false,
//           }}
//           speed={800}
//           slidesPerView={1}
//           centeredSlides={true}
//         >
//           {largeScreenImages.map((src, idx) => (
//             <SwiperSlide key={idx} className="flex justify-center items-center">
//               <img
//                 src={src}
//                 alt={`Large Slide ${idx}`}
//                 className="h-full max-h-[450px] w-auto object-contain"
//                 style={{
//                   display: "block",
//                   margin: "0 auto",
//                 }}
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* Small Screen Slider */}
//       <div className="block lg:hidden w-full">
//         <Swiper
//           modules={[Autoplay]}
//           loop={true}
//           autoplay={{
//             delay: 3000,
//             disableOnInteraction: false,
//           }}
//           speed={800}
//           slidesPerView={1}
//           centeredSlides={true}
//         >
//           {smallScreenImages.map((src, idx) => (
//             <SwiperSlide key={idx} className="flex justify-center items-center">
//               <img
//                 src={src}
//                 alt={`Small Slide ${idx}`}
//                 className="h-full max-h-[600px] w-auto object-contain" // taller for small screens
//                 style={{
//                   display: "block",
//                   margin: "0 auto",
//                 }}
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Nbottom() {
  // Images for large and small screens
  const largeScreenImages = [
    "images/Coming-soon-1.1.jpg",
    // "/images/WEB1.1.jpg",
    "/images/WEB2.1.jpg",
  ];
  const smallScreenImages = [
    // "/images/main image-1.1.jpg",
    // "/images/Poster-1.jpg",
    // "/images/main image-2.4.jpg",
    // "/images/Sale-image-3.jpg",
    //  "/images/Poster-2.jpg",
     "/images/Coming-soon-2.jpg",
     "/images/Sale-Poster-2.jpg"
  ];

  return (
    <div className="relative w-full bg:adaptive">
      {/* Overlay Text */}
     <div className="absolute bottom-10 inset-x-0 flex flex-col items-center text-center z-20 px-4">
  <h1 className="text-black text-3xl sm:text-5xl lg:text-6xl font-light tracking-wide drop-shadow-md">
    ONE BUTTON
  </h1>
  <p className="text-black text-sm sm:text-base lg:text-lg mt-3 font-extralight tracking-widest uppercase">
    Luxury Redefined
  </p>
  <button className="mt-6 px-6 py-3 bg-white text-black text-sm tracking-wide uppercase  shadow-lg hover:bg-neutral-200 transition">
    Explore Collection
  </button>
</div>


      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>

      {/* Large Screen Slider */}
      <div className="hidden lg:block w-full">
        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          speed={1000}
          slidesPerView={1}
          centeredSlides
          pagination={{ clickable: true }}
        >
          {largeScreenImages.map((src, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={src}
                alt={`Large Slide ${idx}`}
                className="w-full h-[90vh] object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Small Screen Slider */}
      <div className="block lg:hidden w-full">
        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          speed={1000}
          slidesPerView={1}
          centeredSlides
          pagination={{ clickable: true }}
        >
          {smallScreenImages.map((src, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={src}
                alt={`Small Slide ${idx}`}
                className="w-full h-[70vh] object-contain"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
