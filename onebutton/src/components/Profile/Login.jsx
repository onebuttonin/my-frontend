
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";  

// export default function OtpAuth() {
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState(1);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [isRegistered, setIsRegistered] = useState(false);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [user, setUser] = useState(null);           // ✅ Store logged-in user details
//   const [loading, setLoading] = useState(true);     // ✅ Loading state
//   const navigate = useNavigate();

//   // ✅ Check if User is Logged In
//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem("token");

//       if (token) {
//         try {
//           const response = await axios.get("http://127.0.0.1:8000/api/user-token", {
//             headers: { Authorization: `Bearer ${token}` },
//           });

//           setUser(response.data);   // ✅ Set user details
//         } catch (error) {
//           console.error("Failed to fetch user details:", error);
//           setUser(null);
//         }
//       }
//       setLoading(false);            // ✅ Set loading to false after check
//     };

//     fetchUser();
//   }, []);

//   // ✅ Send OTP
//   const sendOtp = async () => {
//     try {
//       const res = await axios.post("http://127.0.0.1:8000/api/send-otp", { phone });
//       setSuccess(res.data.message);
//       setStep(2);
//     } catch (err) {
//       setError("Failed to send OTP");
//     }
//   };

//   // ✅ Verify OTP and Check Registration
//   const verifyOtp = async () => {
//     try {
//       const res = await axios.post("http://127.0.0.1:8000/api/verify-otp", { phone, otp });

//       // ✅ Store the token in localStorage
//       localStorage.setItem("token", res.data.token);

//       if (res.data.registered) {
//         setSuccess("Login Successful!");
//         setUser(res.data.user);      // ✅ Set logged-in user details
//         setTimeout(() => navigate("/"), 1000);
//       } else {
//         setIsRegistered(false);
//         setStep(3);
//       }
//     } catch (err) {
//       setError("Invalid or expired OTP.");
//     }
//   };

//   // ✅ Register new user
//   const registerUser = async () => {
//     try {
//       await axios.post("http://127.0.0.1:8000/api/register", {
//         phone,
//         name,
//         email
//       });

//       setSuccess("Registered Successfully!");
//       setTimeout(() => navigate("/"), 1000);
//     } catch (err) {
//       setError("Failed to register. Please try again.");
//     }
//   };

//   // ✅ Logout Function
//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     setPhone("");
//     setStep(1);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-80 bg-gray-50">

//       {loading ? (
//         // ✅ Show spinner while loading
//         <div className="flex items-center justify-center">
//           <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
//         </div>
//       ) : user ? (
//         // ✅ Show User Details if Logged In
//         <div className="bg-white p-6 rounded-2xl shadow-md w-96">
//           <h2 className="text-2xl font-bold mb-4">User Details</h2>
//           <p><span className="font-semibold">Name:</span> {user.name}</p>
//           <p><span className="font-semibold">Phone:</span> {user.phone}</p>
//           <p><span className="font-semibold">Email:</span> {user.email}</p>

//           <button
//             onClick={logout}
//             className="w-full mt-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </div>
//       ) : (
//         // ✅ Show Login/OTP Form if Not Logged In
//         <div className="bg-white p-6 rounded-2xl shadow-md w-96">
//           {step === 1 && (
//             <>
//               <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
//               <label className="block text-gray-700 mb-1">Phone Number</label>
//               <div className="flex items-center border rounded-lg px-3 py-2">
//                 <span className="text-gray-600">+91</span>
//                 <input
//                   type="text"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="ml-2 outline-none w-full"
//                   placeholder="Enter 10-digit number"
//                   maxLength={10}
//                 />
//               </div>
//               <button
//                 onClick={sendOtp}
//                 className="w-full mt-4 py-2 bg-gray-900 text-white rounded-lg"
//               >
//                 Send OTP
//               </button>
//             </>
//           )}

//           {step === 2 && (
//             <>
//               <label className="block text-gray-700 mb-1">Enter OTP:</label>
//               <div className="flex items-center border rounded-lg px-3 py-2">
//                 <input
//                   type="text"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   className="ml-2 outline-none w-full"
//                 />
//               </div>
//               <button
//                 onClick={verifyOtp}
//                 className="w-full mt-4 py-2 bg-gray-900 text-white rounded-lg"
//               >
//                 Verify OTP
//               </button>
//             </>
//           )}

//           {step === 3 && (
//             <>
//               <h2 className="text-xl font-semibold text-center mb-4">Register</h2>
//               <label className="block text-gray-700 mb-1">Name</label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="w-full border rounded-lg px-3 py-2 mb-3"
//                 placeholder="Enter your name"
//               />

//               <label className="block text-gray-700 mb-1">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full border rounded-lg px-3 py-2 mb-3"
//                 placeholder="Enter your email"
//               />

//               <button
//                 onClick={registerUser}
//                 className="w-full mt-4 py-2 bg-green-500 text-white rounded-lg"
//               >
//                 Register
//               </button>
//             </>
//           )}

//           {error && <p className="text-red-500 mt-2">{error}</p>}
//           {success && <p className="text-green-500 mt-2">{success}</p>}
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function OtpAuth() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [isRegistered, setIsRegistered] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/user-token`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const sendOtp = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/send-otp`, { email });
      // toast.success(res.data.message);
      toast.success("OTP Sent To Email Successfully");
      setStep(2);
    } catch (err) {
      toast.error("Failed to send OTP");
    }
  };

  // const verifyOtp = async () => {
  //   try {
  //     const res = await axios.post(`${import.meta.env.VITE_API_URL}/verify-otp`, { phone, otp });
  //     localStorage.setItem("token", res.data.token);
  //     if (res.data.registered) {
  //       toast.success("Login Successful!");
  //       setUser(res.data.user);
  //       setTimeout(() => navigate("/"), 1000);
  //     } else {
  //       setIsRegistered(false);
  //       setStep(3);
  //     }
  //   } catch (err) {
  //     toast.error("Invalid or expired OTP.");
  //   }
  // };

  // const registerUser = async () => {
  //   try {
  //     await axios.post(`${import.meta.env.VITE_API_URL}/register`, { phone, name, email });
  //     toast.success("Registered Successfully!");
  //     setTimeout(() => navigate("/"), 1000);
  //   } catch (err) {
  //     toast.error("Registration failed. Please try again.");
  //   }
  // };

  const verifyOtp = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/verify-otp`, { email, otp });
      localStorage.setItem("token", res.data.token);
      if (res.data.registered) {
        toast.success("Login Successful!");
        setUser(res.data.user);
  
        // Get the redirect path from localStorage, or default to "/"
        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/"; 
        localStorage.removeItem("redirectAfterLogin");  // Remove it after using
  
        setTimeout(() => navigate(redirectPath), 1000);  // Redirect to the saved path or home
      } else {
        setIsRegistered(false);
        setStep(3);
      }
    } catch (err) {
      toast.error("Invalid or expired OTP.");
    }
  };
  
  const registerUser = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/register`, { email, name, phone });
      toast.success("Registered Successfully!");
      
      // Redirect after successful registration
      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/"; 
      localStorage.removeItem("redirectAfterLogin");  // Clean up the redirect path
  
      setTimeout(() => navigate(redirectPath), 1000);  // Redirect to wishlist or home
    } catch (err) {
      toast.error("Registration failed. Please try again.");
    }
  };
  

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setPhone("");
    setStep(1);
    toast("Logged out.");
  };

  const animationProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-80 bg-gray-50">
         <Toaster position="top-center" reverseOrder={false} />

      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      ) : user ? (
        <motion.div {...animationProps} className="bg-white p-6 rounded-2xl shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4">User Details</h2>
          <p><span className="font-semibold">Name:</span> {user.name}</p>
          <p><span className="font-semibold">Phone:</span> {user.phone}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>

          <button
            onClick={logout}
            className="w-full mt-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </motion.div>
      ) : (
        <motion.div {...animationProps} className="bg-white p-6 rounded-2xl shadow-md w-96">
          <AnimatePresence mode="wait">
            {step === 1 && (
  <motion.div key="step1" {...animationProps}>
    <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
    <label className="block text-gray-700 mb-1">Email</label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full border rounded-lg px-3 py-2"
      placeholder="Enter your email"
    />
    <button
      onClick={sendOtp}
      className="w-full mt-4 py-2 bg-gray-900 text-white rounded-lg"
    >
      Send OTP
    </button>
  </motion.div>
)}


            {step === 2 && (
              <motion.div key="step2" {...animationProps}>
                <label className="block text-gray-700 mb-1">Enter OTP:</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
                <button
                  onClick={verifyOtp}
                  className="w-full mt-4 py-2 bg-gray-900 text-white rounded-lg"
                >
                  Verify OTP
                </button>
              </motion.div>
            )}

            {step === 3 && (
  <motion.div key="step3" {...animationProps}>
    <h2 className="text-xl font-semibold text-center mb-4">Register</h2>

    <label className="block text-gray-700 mb-1">Name</label>
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="w-full border rounded-lg px-3 py-2 mb-3"
      placeholder="Enter your name"
    />

    <label className="block text-gray-700 mb-1">Phone Number</label>
    <input
      type="text"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      className="w-full border rounded-lg px-3 py-2 mb-3"
      placeholder="Enter your phone"
    />

    <button
      onClick={registerUser}
      className="w-full mt-4 py-2 bg-green-500 text-white rounded-lg"
    >
      Register
    </button>
  </motion.div>
)}

          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
