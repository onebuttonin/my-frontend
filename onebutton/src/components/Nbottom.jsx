// import React from "react";

// export default function Nbottom () {
//   return(
           
//     <div className="container mx-auto flex border-1 min-h-50 max-h-[450px] bg-neutral-100">
//           <img src="/images/WEB.jpg" className="block mx-auto w-full max-w-[1200px] h-auto bg-cover bg-center bg-no-repeat" />
//     </div> 
//   )

// }

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function Nbottom() {
  const images = [
    "/images/WEB.jpg",
    "/images/WEB2.jpg",
  ];

  return (
    <div className="container mx-auto flex justify-center items-center bg-neutral-100 max-h-[450px]">
      <Swiper
        modules={[Autoplay]}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        speed={800}
        slidesPerView={1}
        centeredSlides={true}
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx} className="flex justify-center items-center">
            <img
              src={src}
              alt={`Slide ${idx}`}
              className="h-full max-h-[450px] w-auto object-contain"
              style={{
                display: "block",
                margin: "0 auto", // keep horizontal center
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
