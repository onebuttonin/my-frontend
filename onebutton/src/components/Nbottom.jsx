
import React, { useEffect, useState,} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Nbottom() {
  const [largeScreenImages, setLargeScreenImages] = useState([]);
  const [smallScreenImages, setSmallScreenImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();

  // ✅ Fetch Hero Images from Backend
  useEffect(() => {
  const fetchHeroImages = async () => {
    try {
      const response = await axios.get(`${API_URL}/hero-images`);
      const data = response.data;
      // console.log("Hero image API response:", data);

      const largeImages = (data.large || []).map((img) =>
        img.startsWith("http") ? img : `${BASE_URL}${img}`
      );

      const smallImages = (data.small || []).map((img) =>
        img.startsWith("http") ? img : `${BASE_URL}${img}`
      );

      setLargeScreenImages(largeImages);
      setSmallScreenImages(smallImages);
    } catch (error) {
      console.error("Error fetching hero images:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchHeroImages();
}, [API_URL, BASE_URL]);


  if (loading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center text-gray-500">
        Loading hero images...
      </div>
    );
  }

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
        <button className="mt-6 px-6 py-3 bg-white text-black text-sm tracking-wide uppercase shadow-lg hover:bg-neutral-200 transition"
        onClick={() => navigate("/category/AllProducts")}>
          Explore Collection
        </button>
      </div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>

      {/* Large Screen Slider */}
      <div className="hidden lg:block w-full">
        {largeScreenImages.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            loop
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
        ) : (
          <div className="w-full h-[90vh] flex items-center justify-center text-gray-400">
            No large screen images found.
          </div>
        )}
      </div>

      {/* Small Screen Slider */}
      <div className="block lg:hidden w-full">
        {smallScreenImages.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            loop
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
                  className="w-full h-[70vh] object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-[70vh] flex items-center justify-center text-gray-400">
            No small screen images found.
          </div>
        )}
      </div>
    </div>
  );
}

