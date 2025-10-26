// import axios from "axios";

// // ✅ Create Axios instance
// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL,
//     withCredentials: true, // Required for refresh token cookie
// });

// // ✅ Helper: logout admin
// const logout = () => {
//     localStorage.removeItem("admin_token");
//     window.location.href = "/admin/login"; // Redirect to login page
// };

// // ✅ Request interceptor to attach access token
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("admin_token");
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // ✅ Response interceptor to handle token refresh
// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         // Only retry once
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
//                 // Call refresh token endpoint
//                 const refreshResponse = await api.post("/admin/refresh-token");

//                 const newAccessToken = refreshResponse.data.access_token;
//                 localStorage.setItem("admin_token", newAccessToken);

//                 // Retry original request with new token
//                 originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//                 return api(originalRequest);
//             } catch (refreshErr) {
//                 // Refresh token expired or invalid → logout
//                 logout();
//                 return Promise.reject(refreshErr);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default api;




import axios from "axios";

// ✅ Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // required for sending/receiving refresh token cookies
});

// ✅ Helper: Logout admin safely
const logout = () => {
  localStorage.removeItem("admin_token");
  // Redirect only if not already on login page
  if (window.location.pathname !== "/admin/login") {
    window.location.href = "/admin/login";
  }
};

// ✅ Request interceptor → Attach latest access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor → Auto refresh expired token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // ✅ Call your refresh endpoint (must return new access_token)
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/refresh-token`,
          {},
          { withCredentials: true } // ensure cookie is sent
        );

        const newAccessToken = refreshResponse.data.access_token;
        if (newAccessToken) {
          // ✅ Save new access token
          localStorage.setItem("admin_token", newAccessToken);

          // ✅ Update authorization headers for next requests
          api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // ✅ Retry the original request
          return api(originalRequest);
        } else {
          logout();
        }
      } catch (refreshError) {
        // Refresh failed → logout and clear session
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
