


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import toast, { Toaster } from "react-hot-toast";

// export default function OtpAuth() {
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");

//   // 🔧 Use array for the 4 digit inputs, derive a string when verifying
//   const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);

//   const [step, setStep] = useState(1);
//   const [isRegistered, setIsRegistered] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         try {
//           const res = await axios.get(`${import.meta.env.VITE_API_URL}/user-token`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           setUser(res.data);
//         } catch (error) {
//           console.error("Failed to fetch user:", error);
//           setUser(null);
//         }
//       }
//       setLoading(false);
//     };
//     fetchUser();
//   }, []);

//   const sendOtp = async () => {
//     if (!email) {
//       toast.error("Please enter your email first.");
//       return;
//     }
//     try {
//       const res = await axios.post(`${import.meta.env.VITE_API_URL}/send-otp`, { email });
//       toast.success(res.data.message || "OTP sent to your email");
//       setStep(2);
//       // reset inputs for safety
//       setOtpDigits(["", "", "", ""]);
//       setTimeout(() => document.getElementById("otp-0")?.focus(), 100);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to send OTP");
//     }
//   };

//   // ✅ verifyOtp now accepts the final string and sends it AS A STRING
//   const verifyOtp = async (otpString) => {
//     // guard: exactly 4 digits
//     if (!/^\d{4}$/.test(otpString)) {
//       toast.error("Please enter all 4 digits.");
//       return;
//     }

//     try {
//       const res = await axios.post(`${import.meta.env.VITE_API_URL}/verify-otp`, {
//         email,
//         otp: otpString, // send as string to preserve leading zeros
//       });

//       localStorage.setItem("token", res.data.token);

//       if (res.data.registered) {
//         toast.success("Login Successful!");
//         setUser(res.data.user);

//         const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
//         localStorage.removeItem("redirectAfterLogin");
//         setTimeout(() => navigate(redirectPath), 1000);
//       } else {
//         setIsRegistered(false);
//         setStep(3);
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Invalid or expired OTP.");
//     }
//   };

//   const registerUser = async () => {
//     if (!name || !phone) {
//       toast.error("Please enter name and phone.");
//       return;
//     }
//     try {
//       await axios.post(`${import.meta.env.VITE_API_URL}/register`, { email, name, phone });
//       toast.success("Registered Successfully!");

//       const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
//       localStorage.removeItem("redirectAfterLogin");

//       setTimeout(() => navigate(redirectPath), 1000);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Registration failed. Please try again.");
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     setPhone("");
//     setStep(1);
//     toast("Logged out.");
//   };

//   const animationProps = {
//     initial: { opacity: 0, y: 20 },
//     animate: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: -20 },
//     transition: { duration: 0.3 },
//   };

//   // helper derived value
//   const otpString = otpDigits.join("");

//   return (
//     <div className="flex flex-col items-center justify-center min-h-80 bg-gradient-to-br from-gray-50 via-white to-gray-100">
//       <Toaster position="top-center" reverseOrder={false} />

//       {loading ? (
//         <div className="flex items-center justify-center">
//           <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
//         </div>
//       ) : user ? (
//         <motion.div
//           {...animationProps}
//           className="bg-white/90 backdrop-blur-md p-8 w-96 border border-gray-200"
//         >
//           <h2 className="text-2xl font-semibold tracking-wide mb-6 text-center text-gray-800">
//             PROFILE
//           </h2>
//           <div className="space-y-2 text-gray-700">
//             <p>
//               <span className="font-semibold">Name:</span> {user.name}
//             </p>
//             <p>
//               <span className="font-semibold">Phone:</span> {user.phone}
//             </p>
//             <p>
//               <span className="font-semibold">Email:</span> {user.email}
//             </p>
//           </div>

//           <button
//             onClick={logout}
//             className="w-full mt-6 py-3 bg-red-500 text-white hover:bg-red-600 transition duration-300"
//           >
//             Logout
//           </button>
//         </motion.div>
//       ) : (
//         <motion.div
//           {...animationProps}
//           className="bg-white/90 backdrop-blur-md p-8 w-96 border border-gray-200"
//         >
//           <AnimatePresence mode="wait">
//             {step === 1 && (
//               <motion.div key="step1" {...animationProps}>
//                 <h2 className="text-2xl font-light tracking-wide text-center mb-6">
//                   Login
//                 </h2>
//                 <label className="block text-gray-600 mb-2 font-medium">Email</label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-800"
//                   placeholder="Enter your email"
//                 />
//                 <button
//                   onClick={sendOtp}
//                   className="w-full mt-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition duration-300 shadow-md"
//                 >
//                   Send OTP
//                 </button>
//               </motion.div>
//             )}

//             {step === 2 && (
//               <motion.div key="step2" {...animationProps}>
//                 <h2 className="text-xl font-light tracking-wide text-center mb-6">
//                   Verify OTP
//                 </h2>
//                 <label className="block text-gray-600 mb-2 font-medium">OTP</label>

//                 {/* 4 OTP boxes */}
//                 <div className="flex justify-between gap-3">
//                   {Array.from({ length: 4 }).map((_, index) => (
//                     <input
//                       key={index}
//                       id={`otp-${index}`}
//                       type="text"
//                       inputMode="numeric"
//                       pattern="\d*"
//                       autoComplete="one-time-code"
//                       maxLength={1}
//                       value={otpDigits[index]}
//                       onChange={(e) => {
//                         const val = e.target.value.replace(/\D/g, "");
//                         const next = [...otpDigits];
//                         next[index] = val;
//                         setOtpDigits(next);
//                         if (val && index < 3) {
//                           document.getElementById(`otp-${index + 1}`)?.focus();
//                         }
//                       }}
//                       onKeyDown={(e) => {
//                         if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
//                           document.getElementById(`otp-${index - 1}`)?.focus();
//                         }
//                       }}
//                       onPaste={(e) => {
//                         const pasted = (e.clipboardData.getData("text") || "").replace(/\D/g, "");
//                         if (pasted.length === 4) {
//                           e.preventDefault();
//                           setOtpDigits(pasted.split("").slice(0, 4));
//                           document.getElementById("otp-3")?.focus();
//                         }
//                       }}
//                       className="w-14 h-14 text-center text-xl font-semibold border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 rounded-md"
//                     />
//                   ))}
//                 </div>

//                 <button
//                   onClick={() => verifyOtp(otpString)}
//                   className="w-full mt-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition duration-300 shadow-md"
//                 >
//                   Verify OTP
//                 </button>
//               </motion.div>
//             )}

//             {step === 3 && (
//               <motion.div key="step3" {...animationProps}>
//                 <h2 className="text-2xl font-light tracking-wide text-center mb-6">
//                   Register
//                 </h2>

//                 <label className="block text-gray-600 mb-2 font-medium">Name</label>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full border border-gray-300 px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-800"
//                   placeholder="Enter your name"
//                 />

//                 <label className="block text-gray-600 mb-2 font-medium">
//                   Phone Number
//                 </label>
//                 <input
//                   type="text"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="w-full border border-gray-300 px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-800"
//                   placeholder="Enter your phone"
//                 />

//                 <button
//                   onClick={registerUser}
//                   className="w-full mt-6 py-3 bg-green-600 text-white hover:bg-green-700 transition duration-300 shadow-md"
//                 >
//                   Register
//                 </button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>
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
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
const [sendingOtp, setSendingOtp] = useState(false);

  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [step, setStep] = useState(1);
  const [isRegistered, setIsRegistered] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🕒 Timer state
  const [timer, setTimer] = useState(0);
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
  if (!email) {
    toast.error("Please enter your email first.");
    return;
  }

  try {
    setSendingOtp(true); // start loading
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/send-otp`, { email });
    toast.success(res.data.message || "OTP sent to your email");
    setStep(2);
    setOtpDigits(["", "", "", ""]);
    setTimer(40); // 🕒 start timer
    setTimeout(() => document.getElementById("otp-0")?.focus(), 100);
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to send OTP");
  } finally {
    setSendingOtp(false); // stop loading
  }
};


  // 🕒 countdown effect
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const verifyOtp = async (otpString) => {
    if (!/^\d{4}$/.test(otpString)) {
      toast.error("Please enter all 4 digits.");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/verify-otp`, {
        email,
        otp: otpString,
      });

      localStorage.setItem("token", res.data.token);

      if (res.data.registered) {
        toast.success("Login Successful!");
        setUser(res.data.user);
        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        setTimeout(() => navigate(redirectPath), 1000);
      } else {
        setIsRegistered(false);
        setStep(3);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid or expired OTP.");
    }
  };

  const registerUser = async () => {
    if (!name || !phone) {
      toast.error("Please enter name and phone.");
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/register`, { email, name, phone });
      toast.success("Registered Successfully!");
      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin");
      setTimeout(() => navigate(redirectPath), 1000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed. Please try again.");
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

  const otpString = otpDigits.join("");

  return (
    <div className="flex flex-col items-center justify-center min-h-80 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Toaster position="top-center" reverseOrder={false} />

      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      ) : user ? (
        <motion.div {...animationProps} className="bg-white/90 backdrop-blur-md p-8 w-96 border border-gray-200">
          <h2 className="text-2xl font-semibold tracking-wide mb-6 text-center text-gray-800">PROFILE</h2>
          <div className="space-y-2 text-gray-700">
            <p><span className="font-semibold">Name:</span> {user.name}</p>
            <p><span className="font-semibold">Phone:</span> {user.phone}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
          </div>
          <button onClick={logout} className="w-full mt-6 py-3 bg-red-500 text-white hover:bg-red-600 transition duration-300">
            Logout
          </button>
        </motion.div>
      ) : (
        <motion.div {...animationProps} className="bg-white/90 backdrop-blur-md p-8 w-96 border border-gray-200">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" {...animationProps}>
                <h2 className="text-2xl font-light tracking-wide text-center mb-6">Login</h2>
                <label className="block text-gray-600 mb-2 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  placeholder="Enter your email"
                />
                <button
  onClick={sendOtp}
  disabled={sendingOtp}
  className={`w-full mt-6 py-3 text-white transition duration-300 shadow-md ${
    sendingOtp ? "bg-gray-500 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800"
  }`}
>
  {sendingOtp ? "Sending OTP..." : "Send OTP"}
</button>

              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" {...animationProps}>
                <h2 className="text-xl font-light tracking-wide text-center mb-6">Verify OTP</h2>
                <label className="block text-gray-600 mb-2 font-medium">OTP</label>

                {/* OTP boxes */}
                <div className="flex justify-between gap-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={otpDigits[index]}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        const next = [...otpDigits];
                        next[index] = val;
                        setOtpDigits(next);
                        if (val && index < 3) {
                          document.getElementById(`otp-${index + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
                          document.getElementById(`otp-${index - 1}`)?.focus();
                        }
                      }}
                      onPaste={(e) => {
                        const pasted = (e.clipboardData.getData("text") || "").replace(/\D/g, "");
                        if (pasted.length === 4) {
                          e.preventDefault();
                          setOtpDigits(pasted.split("").slice(0, 4));
                          document.getElementById("otp-3")?.focus();
                        }
                      }}
                      className="w-14 h-14 text-center text-xl font-semibold border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 rounded-md"
                    />
                  ))}
                </div>

                {/* 🕒 Timer display */}
                <div className="text-center mt-4 text-gray-600">
                  {timer > 0 ? (
                    <p>OTP expires in <span className="font-semibold text-gray-800">{timer}s</span></p>
                  ) : (
                    <button
                      onClick={sendOtp}
                      className="text-sm text-blue-600 hover:underline mt-2"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  onClick={() => verifyOtp(otpString)}
                  disabled={timer === 0} // disable when expired
                  className={`w-full mt-6 py-3 text-white transition duration-300 shadow-md ${
                    timer > 0 ? "bg-gray-900 hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Verify OTP
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" {...animationProps}>
                <h2 className="text-2xl font-light tracking-wide text-center mb-6">Register</h2>
                <label className="block text-gray-600 mb-2 font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  placeholder="Enter your name"
                />
                <label className="block text-gray-600 mb-2 font-medium">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  placeholder="Enter your phone"
                />
                <button
                  onClick={registerUser}
                  className="w-full mt-6 py-3 bg-green-600 text-white hover:bg-green-700 transition duration-300 shadow-md"
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
