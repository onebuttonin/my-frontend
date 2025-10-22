// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ReviewForm = ({ productId, accessToken }) => {
//   const [showPopup, setShowPopup] = useState(false);
//   const [alreadyRated, setAlreadyRated] = useState(false);
//   const [newRating, setNewRating] = useState(0);
//   const [newReview, setNewReview] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [loading, setLoading] = useState(true); // 👉 New loading state

//   useEffect(() => {
//     const checkAlreadyRated = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_URL}/check-rating`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//           params: {
//             product_id: productId,
//           },
//         });

//         if (response.data.alreadyRated) {
//           setAlreadyRated(true); // User has already rated
//         }
//       } catch (error) {
//         console.error('Error checking rating:', error);
//       } finally {
//         setLoading(false); // ✅ After check completed (success or error), stop loading
//       }
//     };

//     if (productId && accessToken) {
//       checkAlreadyRated();
//     }
//   }, [productId, accessToken]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_URL}/products/ratings`, {
//         product_id: productId,
//         rating: newRating,
//         review: newReview,
//       }, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });

//       console.log('Rating submitted:', response.data);
//       setAlreadyRated(true);
//       setShowPopup(false);
//     } catch (error) {
//       console.error('Error submitting rating:', error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const renderStars = (rating, setRating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <span
//           key={i}
//           onClick={() => setRating(i)}
//           style={{
//             cursor: 'pointer',
//             color: i <= rating ? '#FFD700' : '#C0C0C0',
//             fontSize: '24px',
//           }}
//         >
//           ★
//         </span>
//       );
//     }
//     return stars;
//   };

//   return (
//     <div className="my-4">
//       {loading ? (
//         // 👉 While loading, show nothing or a spinner
//         <div className="text-center">Loading...</div> 
//       ) : (
//         !alreadyRated && (
//           <button
//             onClick={() => setShowPopup(true)}
//             className="bg-black text-white px-3 py-1 hover:bg-gray-800"
//           >
//             Rate Us
//           </button>
//         )
//       )}

//       {showPopup && (
//         <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-neutral-200 bg-opacity-50">
//           <div className="bg-white p-6 rounded-md w-full max-w-md relative">
//             <button
//               onClick={() => setShowPopup(false)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-black"
//             >
//               ✖
//             </button>

//             <h2 className="text-xl font-semibold mb-4">Rate This Product</h2>

//             <form onSubmit={handleSubmit} className="mb-4">
//               <div className="flex flex-col mb-4">
//                 <label className="font-semibold mb-2">Your Rating:</label>
//                 <div className="flex">
//                   {renderStars(newRating, setNewRating)}
//                 </div>
//               </div>

//               <div className="flex flex-col mb-4">
//                 <label className="font-semibold mb-2">Your Review (optional):</label>
//                 <textarea
//                   className="border border-gray-300 rounded-md p-2"
//                   rows="3"
//                   value={newReview}
//                   onChange={(e) => setNewReview(e.target.value)}
//                   placeholder="Write your experience..."
//                 ></textarea>
//               </div>

//               <button
//                 type="submit"
//                 className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 w-full"
//                 disabled={submitting}
//               >
//                 {submitting ? 'Submitting...' : 'Submit Review'}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReviewForm;



import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ productId, accessToken }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [reviewImage, setReviewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // ✅ for image preview
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Check if user already rated
  useEffect(() => {
    const checkAlreadyRated = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/check-rating`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            product_id: productId,
          },
        });

        if (response.data.alreadyRated) {
          setAlreadyRated(true);
        }
      } catch (error) {
        console.error('Error checking rating:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId && accessToken) {
      checkAlreadyRated();
    }
  }, [productId, accessToken]);

  // ✅ Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReviewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ Submit review with image
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('product_id', productId);
      formData.append('rating', newRating);
      formData.append('review', newReview);
      if (reviewImage) {
        formData.append('review_image', reviewImage);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/products/ratings`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Rating submitted:', response.data);
      setAlreadyRated(true);
      setShowPopup(false);
      setNewRating(0);
      setNewReview('');
      setReviewImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, setRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => setRating(i)}
          style={{
            cursor: 'pointer',
            color: i <= rating ? '#FFD700' : '#C0C0C0',
            fontSize: '24px',
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="my-4">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        !alreadyRated && (
          <button
            onClick={() => setShowPopup(true)}
            className="bg-black text-white px-3 py-1 hover:bg-gray-800"
          >
            Rate Us
          </button>
        )
      )}

      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-neutral-200 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md relative shadow-lg">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold mb-4">Rate This Product</h2>

            <form onSubmit={handleSubmit} className="mb-4">
              {/* Rating */}
              <div className="flex flex-col mb-4">
                <label className="font-semibold mb-2">Your Rating:</label>
                <div className="flex">{renderStars(newRating, setNewRating)}</div>
              </div>

              {/* Review */}
              <div className="flex flex-col mb-4">
                <label className="font-semibold mb-2">Your Review (optional):</label>
                <textarea
                  className="border border-gray-300 rounded-md p-2"
                  rows="3"
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Write your experience..."
                ></textarea>
              </div>

              {/* ✅ Image upload and preview */}
              <div className="flex flex-col mb-4">
                <label className="font-semibold mb-2">Upload Image (optional):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border border-gray-300 rounded-md p-2"
                />
                {imagePreview && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-1">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md border border-gray-200"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 w-full"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
