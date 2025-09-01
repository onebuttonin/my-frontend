// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ReviewsSection = ({ productId }) => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showReview, setShowReview] = useState(false);

//   const [newRating, setNewRating] = useState(0);
//   const [newReview, setNewReview] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     getUser();
//   }, []);

//   useEffect(() => {
//     if (showReview) {
//       fetchReviews();
//     }
//   }, [showReview, productId]);

  

//   const getUser = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${import.meta.env.VITE_API_URL}/user-profile`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setUserId(res.data.id);
      
//     } catch (err) {
//       console.error('Failed to fetch user', err);
//     }
//   };
  
  

//   const fetchReviews = async () => {

//     try {
//       setLoading(true);
//       const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/ratings/${productId}`);
//       setReviews(response.data); // your backend gives array directly
      
//     } catch (err) {
//       console.error(err);
//       setError('Failed to fetch reviews.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (newRating === 0) {
//       alert('Please select a rating!');
//       return;
//     }

//     try {
//       setSubmitting(true);

//       // You must send Bearer token if backend is protected
//       const token = localStorage.getItem('token'); // assuming you store JWT token in localStorage

//       await axios.post(`${import.meta.env.VITE_API_URL}/products/ratings`, {
//         product_id: productId,
//         rating: newRating,
//         review: newReview,
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setNewRating(0);
//       setNewReview('');
//       fetchReviews(); // reload reviews after posting
//     } catch (err) {
//       console.error(err);
//       alert('Failed to submit review.');
//     } finally {
//       setSubmitting(false);
//     }
//   };


//   const handleDelete = async (ratingId) => {
//     if (!window.confirm('Are you sure you want to delete this review?')) {
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');

//       await axios.delete(`${import.meta.env.VITE_API_URL}/ratings/${ratingId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       fetchReviews();
//     } catch (err) {
//       console.error(err);
//       alert('Failed to delete review.');
//     }
//   };

//   const renderStars = (count, setCountFunc = null) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <span
//           key={i}
//           onClick={() => setCountFunc && setCountFunc(i)}
//           style={{
//             color: i <= count ? 'gold' : '#ccc',
//             fontSize: '25px',
//             cursor: setCountFunc ? 'pointer' : 'default',
//             marginRight: '4px',
//           }}
//         >
//           ★
//         </span>
//       );
//     }
//     return stars;
//   };

//   return (
//     <div style={{ maxWidth: '600px', margin: 'auto' }}>
//        <button
//         className="w-full lg:w-[70%] h-12 text-sm flex justify-between items-center text-gray-700 font-bold px-5 py-3 border border-gray-300 rounded-md mt-2"
//         onClick={() => setShowReview(!showReview)}
//       >
//         Ratings
//         <span className="text-xl">{showReview ? "-" : "+"}</span>
//       </button>


//       {showReview && (
//         <div className="w-full lg:w-[70%] border border-gray-300 rounded-md p-4 mt-2">

// {/* Post a Review */}


//           {loading ? (
//             <p>Loading reviews...</p>
//           ) : error ? (
//             <p className="text-red-500">{error}</p>
//           ) : reviews.length === 0 ? (
//             <p>No reviews yet.</p>
//           ) : (
//             reviews.map((r) => (
//               <div key={r.id} className="border-b border-gray-200 py-2">
//                 <div className="font-semibold">{r.user?.name || 'Anonymous'}</div>
//                 <div>{renderStars(r.rating)}</div>
//                 {r.review && <p className="text-gray-700">{r.review}</p>}
//                 {/* <small className="text-gray-500">Posted on: {new Date(r.created_at).toLocaleDateString()}</small> */}
              
//               {/* Delete Button */}
//               {/* {userId === r.user_id && (
//                   <button
//                     className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs"
//                     onClick={() => handleDelete(r.id)}
//                   >
//                     Delete
//                   </button>
//                 )} */}
//               </div>
//             ))
//           )}
// {/* 
// <form onSubmit={handleSubmit} className="mb-6">
//             <div className="flex flex-col mb-4">
//               <label className="font-semibold mb-2">Your Rating:</label>
//               <div>{renderStars(newRating, setNewRating)}</div>
//             </div>
//             <div className="flex flex-col mb-4">
//               <label className="font-semibold mb-2">Your Review (optional):</label>
//               <textarea
//                 className="border border-gray-300 rounded-md p-2"
//                 rows="3"
//                 value={newReview}
//                 onChange={(e) => setNewReview(e.target.value)}
//                 placeholder="Write your experience..."
//               ></textarea>
//             </div>
//             <button
//               type="submit"
//               className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
//               disabled={submitting}
//             >
//               {submitting ? 'Submitting...' : 'Submit Review'}
//             </button>
//           </form> */}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReviewsSection;







import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from "lucide-react"; 

const ReviewsSection = ({ productId, onRatingData }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReview, setShowReview] = useState(false);

  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (showReview) {
      fetchReviews();
    } else {
      // Also fetch initially to send avg & total to parent without showing
      fetchReviews(true);
    }
  }, [showReview, productId]);

  const getUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

      // Calculate average rating & total reviews
      if (response.data.length > 0) {
        const avg =
          response.data.reduce((sum, r) => sum + r.rating, 0) /
          response.data.length;
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

  const renderStars = (count, setCountFunc = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (count >= i) {
        stars.push(<span key={i} style={{ color: 'gold', fontSize: '25px' }}>★</span>);
      } else if (count >= i - 0.5) {
        stars.push(<span key={i} style={{ color: 'gold', fontSize: '25px' }}>☆</span>);
      } else {
        stars.push(<span key={i} style={{ color: '#ccc', fontSize: '25px' }}>★</span>);
      }
    }
    return stars;
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
      <div className="w-full lg:w-[70%] border border-gray-300 rounded-md p-4 mt-2 bg-white shadow-sm">
        {loading ? (
          <p className="text-gray-600">Loading reviews...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border-b border-gray-200 py-4 last:border-b-0">
              {/* Stars + Rating Value */}
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(r.rating)}</div>
                <span className="text-sm text-gray-600 font-medium">{r.rating.toFixed(1)}/5</span>
              </div>

              {/* Profile icon + name */}
              <div className="flex items-center mt-3">
                <div className="w-10 h-10 rounded-full border flex items-center justify-center bg-gray-100 mr-3">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <span className="font-semibold text-gray-800">
                  {r.user?.name || 'Anonymous'}
                </span>
              </div>

              {/* Review text */}
              {r.review && (
                <p className="text-gray-700 mt-3 leading-relaxed">{r.review}</p>
              )}
            </div>
          ))
        )}
      </div>
    )}
  </div>
);

};

export default ReviewsSection;
