// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import toast, { Toaster } from "react-hot-toast";
// import userApi, { setAccessToken, clearAccessToken } from "../Api/apiUser"; // ✅ use your axios instance

// export default function OtpAuth() {
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
//   const [step, setStep] = useState(1);
//   const [isRegistered, setIsRegistered] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   // ✅ Fetch user if already logged in
// useEffect(() => {
//   const fetchUser = async () => {
//     const token = localStorage.getItem("user_access_token");
//     if (token) {
//       try {
//         const res = await userApi.get("/user-token");
        
//         // 🧠 Check if backend sent a new token after refresh
//         if (res.data.access_token) {
//           setAccessToken(res.data.access_token);
//         }

//         setUser(res.data);
//       } catch (error) {
//         console.warn("User token invalid or expired:", error);
//         clearAccessToken();
//         setUser(null);
//       }
//     }
//     setLoading(false);
//   };
//   fetchUser();
// }, []);


//   // ✅ Send OTP
//   const sendOtp = async () => {
//     if (!email) return toast.error("Please enter your email first.");
//     try {
//       const res = await userApi.post("/send-otp", { email });
//       toast.success(res.data.message || "OTP sent to your email");
//       setStep(2);
//       setOtpDigits(["", "", "", ""]);
//       setTimeout(() => document.getElementById("otp-0")?.focus(), 100);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to send OTP");
//     }
//   };

//   // ✅ Verify OTP (get access + refresh token)
//   const verifyOtp = async (otpString) => {
//     if (!/^\d{4}$/.test(otpString)) return toast.error("Please enter all 4 digits.");

//     try {
//       const res = await userApi.post("/verify-otp", {
//         email,
//         otp: otpString,
//       });

//       // ✅ Save access token
//       setAccessToken(res.data.access_token);

//       toast.success("Login successful!");
//       setUser(res.data.user || { email });
//       const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
//       localStorage.removeItem("redirectAfterLogin");
//       setTimeout(() => navigate(redirectPath), 1000);
//     } catch (err) {
//       toast.error(err?.response?.data?.error || "Invalid or expired OTP.");
//     }
//   };

//   // ✅ Register new user after OTP login
//   const registerUser = async () => {
//     if (!name || !phone) return toast.error("Please enter name and phone.");
//     try {
//       await userApi.post("/register", { email, name, phone });
//       toast.success("Registered successfully!");

//       const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
//       localStorage.removeItem("redirectAfterLogin");
//       setTimeout(() => navigate(redirectPath), 1000);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Registration failed. Please try again.");
//     }
//   };

//   const logout = async () => {
//     clearAccessToken();
//     setUser(null);
//     setEmail("");
//     setStep(1);
//     toast("Logged out.");
//   };

//   const otpString = otpDigits.join("");

//   const animationProps = {
//     initial: { opacity: 0, y: 20 },
//     animate: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: -20 },
//     transition: { duration: 0.3 },
//   };

//   // ✅ UI
//   return (
//     <div className="flex flex-col items-center justify-center min-h-80 bg-gradient-to-br from-gray-50 via-white to-gray-100">
//       <Toaster position="top-center" reverseOrder={false} />

//       {loading ? (
//         <div className="flex items-center justify-center">
//           <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
//         </div>
//       ) : user ? (
//         <motion.div {...animationProps} className="bg-white/90 backdrop-blur-md p-8 w-96 border border-gray-200">
//           <h2 className="text-2xl font-semibold tracking-wide mb-6 text-center text-gray-800">PROFILE</h2>
//           <div className="space-y-2 text-gray-700">
//             <p><span className="font-semibold">Name:</span> {user.name || "—"}</p>
//             <p><span className="font-semibold">Phone:</span> {user.phone || "—"}</p>
//             <p><span className="font-semibold">Email:</span> {user.email}</p>
//           </div>
//           <button
//             onClick={logout}
//             className="w-full mt-6 py-3 bg-red-500 text-white hover:bg-red-600 transition duration-300"
//           >
//             Logout
//           </button>
//         </motion.div>
//       ) : (
//         <motion.div {...animationProps} className="bg-white/90 backdrop-blur-md p-8 w-96 border border-gray-200">
//           <AnimatePresence mode="wait">
//             {step === 1 && (
//               <motion.div key="step1" {...animationProps}>
//                 <h2 className="text-2xl font-light tracking-wide text-center mb-6">Login</h2>
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
//                 <h2 className="text-xl font-light tracking-wide text-center mb-6">Verify OTP</h2>
//                 <label className="block text-gray-600 mb-2 font-medium">OTP</label>
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
//                         if (val && index < 3) document.getElementById(`otp-${index + 1}`)?.focus();
//                       }}
//                       onKeyDown={(e) => {
//                         if (e.key === "Backspace" && !otpDigits[index] && index > 0)
//                           document.getElementById(`otp-${index - 1}`)?.focus();
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
//                 <h2 className="text-2xl font-light tracking-wide text-center mb-6">Register</h2>
//                 <label className="block text-gray-600 mb-2 font-medium">Name</label>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full border border-gray-300 px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-800"
//                   placeholder="Enter your name"
//                 />
//                 <label className="block text-gray-600 mb-2 font-medium">Phone Number</label>
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
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import userApi, { setAccessToken, clearAccessToken } from "../Api/apiUser";

export default function OtpAuth() {
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();
  const otpString = otpDigits.join("");

  // 🧭 1️⃣ Auto-login on initial load only
  useEffect(() => {
    const autoLogin = async () => {
      const existingToken = localStorage.getItem("user_access_token");
      if (!existingToken) return setLoading(false);

      try {
        const res = await userApi.post("/user/refresh-token");
        const newToken = res.data?.access_token;
        if (newToken) setAccessToken(newToken);
        const profile = await userApi.get("/user/profile");
        setUser(profile.data);
      } catch {
        clearAccessToken();
      } finally {
        setLoading(false);
      }
    };
    // ✅ Only run auto-login when we are on step 1 (not OTP or register)
    if (step === 1) autoLogin();
  }, [step]);

  // 🕒 2️⃣ Countdown for OTP expiry
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // 📤 3️⃣ Send OTP
  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter your email");

    setSendingOtp(true);
    try {
      const res = await userApi.post("/send-otp", { email });
      toast.success(res.data.message || "OTP sent successfully");
      setStep(2);
      setOtpDigits(["", "", "", ""]);
      setOtpError(false);
      setCountdown(40);
      setTimeout(() => document.getElementById("otp-0")?.focus(), 100);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  // ✅ 4️⃣ Verify OTP
  const handleVerifyOtp = async () => {
    if (!/^\d{4}$/.test(otpString)) return toast.error("Please enter all 4 digits");

    setVerifyingOtp(true);
    try {
      const res = await userApi.post("/verify-otp", { email, otp: otpString });
      console.log("🔍 OTP Response:", res.data);

      const { access_token, registered, user } = res.data;
      setAccessToken(access_token);
      setUser(user);
      setOtpError(false);

      if (!registered) {
        toast.success("OTP verified! Please complete registration.");
        setStep(3); // 🚩 show register step
        return; // ⛔ Stop here — do NOT navigate or auto-login
      }

      toast.success("Login successful!");
      const redirect = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin");
      setTimeout(() => navigate(redirect), 1000);
    } catch (err) {
      const msg = err?.response?.data?.error || "Invalid or expired OTP";
      setOtpError(true);
      toast.error(msg);
      setCountdown(0);
    } finally {
      setVerifyingOtp(false);
    }
  };

  // 📝 5️⃣ Register user
  const handleRegister = async () => {
    if (!name || !phone) return toast.error("Please fill all fields");

    try {
      await userApi.post("/register", { name, phone, email });
      toast.success("Registration successful!");

      // Fetch updated profile
      const profile = await userApi.get("/user/profile");
      setUser(profile.data);

      const redirect = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin");
      setTimeout(() => navigate(redirect), 1000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    }
  };

  // 🚪 6️⃣ Logout
  const handleLogout = () => {
    clearAccessToken();
    setUser(null);
    setEmail("");
    setStep(1);
    toast("Logged out successfully");
  };

  // 🎨 Animation
  const animationProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  // 🧱 UI
  return (
    <div className="flex flex-col items-center justify-center min-h-80 ">
      <Toaster position="top-center" />
      {loading ? (
        <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
      ) : user && step !== 3 ? ( // ✅ Don't show profile if on register step
        <motion.div {...animationProps} className="p-8 w-96">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">PROFILE</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Name:</strong> {user.name || "—"}</p>
            <p><strong>Phone:</strong> {user.phone || "—"}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
          <button onClick={handleLogout} className="w-full mt-6 py-3 bg-red-500 text-white hover:bg-red-600">
            Logout
          </button>
        </motion.div>
      ) : (
        <motion.div {...animationProps} className=" p-8 w-96 ">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" {...animationProps}>
                <h2 className="text-2xl font-light text-center mb-6">Login</h2>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-gray-800"
                />
                <button
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  className={`w-full mt-6 py-3 text-white ${
                    sendingOtp ? "bg-gray-500 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800"
                  }`}
                >
                  {sendingOtp ? "Sending OTP..." : "Send OTP"}
                </button>
              </motion.div>
            )}

            {step === 2 && (
  <motion.div key="step2" {...animationProps}>
    <h2 className="text-xl font-light text-center mb-6">Verify OTP</h2>
    <div className="flex justify-between gap-3 mb-4">
      {otpDigits.map((digit, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            const updated = [...otpDigits];
            updated[i] = val;
            setOtpDigits(updated);
            if (val && i < 3)
              document.getElementById(`otp-${i + 1}`)?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !otpDigits[i] && i > 0)
              document.getElementById(`otp-${i - 1}`)?.focus();
          }}
          className="w-14 h-14 text-center text-xl border rounded-md focus:ring-2 focus:ring-gray-800"
        />
      ))}
    </div>

    {/* 🕒 Resend OTP Section */}
    {countdown > 0 ? (
      <p className="text-center text-gray-600 mb-4">
        OTP expires in <span className="font-semibold">{countdown}s</span>
      </p>
    ) : (
      <div className="text-center mb-4">
        <button
          onClick={handleSendOtp}
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Resend OTP
        </button>
      </div>
    )}

    {/* ✅ Verify OTP Button */}
    <button
      onClick={handleVerifyOtp}
      disabled={verifyingOtp}
      className={`w-full py-3 text-white ${
        verifyingOtp
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gray-900 hover:bg-gray-800"
      }`}
    >
      {verifyingOtp ? "Verifying..." : "Verify OTP"}
    </button>
  </motion.div>
)}


            {step === 3 && (
              <motion.div key="step3" {...animationProps}>
                <h2 className="text-2xl font-light text-center mb-6">Register</h2>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 px-4 py-3  mb-4 focus:ring-2 focus:ring-gray-800"
                />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone"
                  className="w-full border border-gray-300 px-4 py-3  mb-4 focus:ring-2 focus:ring-gray-800"
                />
                <button
                  onClick={handleRegister}
                  className="w-full mt-6 py-3 bg-green-600 text-white hover:bg-green-700"
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



