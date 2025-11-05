
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import userApi from '../Api/apiUser';

const ReviewsSection = ({ productId, onRatingData }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [userId, setUserId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (showReview) {
      fetchReviews();
    } else {
      fetchReviews(true);
    }
  }, [showReview, productId]);

  const getUser = async () => {
    try {
      const token = localStorage.getItem('user_access_token');
      const res = await userApi.get(`/user/profile`);
      setUserId(res.data.id);
    } catch (err) {
      console.error('Failed to fetch user', err);
    }
  };

  const fetchReviews = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/ratings/${productId}`
      );
      setReviews(response.data);

      if (response.data.length > 0) {
        const avg =
          response.data.reduce((sum, r) => sum + r.rating, 0) / response.data.length;
        onRatingData?.(avg, response.data.length);
      } else {
        onRatingData?.(0, 0);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch reviews.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const imageReviews = reviews.filter(r => r.review_image);

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % imageReviews.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + imageReviews.length) % imageReviews.length);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      {/* Ratings Accordion Button */}
      <button
        className="w-full lg:w-[70%] h-12 text-sm flex justify-between items-center 
                   text-gray-800 font-medium px-5 py-3 border 
                   mt-2 hover:bg-gray-50 transition"
        onClick={() => setShowReview(!showReview)}
      >
        Ratings
        <span className="text-xl">{showReview ? '−' : '+'}</span>
      </button>

      {/* Reviews Section */}
      {showReview && (
        <div className="w-full lg:w-[70%]   p-4 mt-2 bg-white ">
          {loading ? (
            <p className="text-gray-600">Loading reviews...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="border-b border-gray-200 py-2 last:border-b-0">
                {/* ✅ Rating + Customer Name Row */}
                <div className="flex items-center gap-2">
                  <div className="bg-black text-white px-2 py-1 text-sm font-semibold">
                    {r.rating} ★
                  </div>
                  <span className="font-medium text-gray-800">
                    {r.user?.name || 'Anonymous'}
                  </span>
                </div>

                {/* Review text */}
                {r.review && (
                  <p className="text-gray-700 mt-2 leading-relaxed">{r.review}</p>
                )}

                {/* ✅ Review image */}
                {r.review_image && (
                  <div className="mt-3">
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}/storage/${r.review_image.replace("public/", "")}`}
                      alt="Review"
                      className="w-16 h-16 object-cover border border-gray-200 cursor-pointer hover:opacity-90"
                      onClick={() =>
                        setCurrentIndex(imageReviews.findIndex(item => item.id === r.id))
                      }
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ✅ Fullscreen Modal with Slider */}
      {currentIndex !== null && imageReviews.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setCurrentIndex(null)}
        >
          <div
            className="relative max-w-[90%] max-h-[90%] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md"
              onClick={() => setCurrentIndex(null)}
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            {/* Prev Button */}
            {imageReviews.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
            )}

            {/* Image */}
            <img
              src={`${import.meta.env.VITE_BASE_URL}/storage/${imageReviews[currentIndex].review_image.replace("public/", "")}`}
              alt="Review Full"
              className="max-h-[70vh] object-contain rounded-md"
            />

            {/* Next Button */}
            {imageReviews.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            )}

            {/* Overlay Info */}
            <div className="bg-white bg-opacity-90 w-full mt-4 p-4 text-center">
              <div className="flex justify-center items-center gap-2">
                <div className="bg-black text-white px-2 py-1 text-sm font-semibold rounded-sm">
                  {imageReviews[currentIndex].rating}★
                </div>
                <span className="font-medium text-gray-800">
                  {imageReviews[currentIndex].user?.name || 'Anonymous'}
                </span>
              </div>
              <p className="text-gray-700 mt-2">{imageReviews[currentIndex].review}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;



