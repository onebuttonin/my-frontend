// // src/Api/apiUser.js
// import axios from "axios";
// import toast from "react-hot-toast";

// const API_URL = import.meta.env.VITE_API_URL;

// // ✅ Create axios instance for user endpoints
// const userApi = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // allows sending/receiving cookies (refresh token)
// });

// let accessToken = localStorage.getItem("user_access_token") || null;
// let isRefreshing = false;
// let refreshQueue = [];

// // ✅ Notify all waiting requests with the new token
// const processRefreshQueue = (newToken) => {
//   refreshQueue.forEach((callback) => callback(newToken));
//   refreshQueue = [];
// };

// // ✅ Attach token to outgoing requests
// userApi.interceptors.request.use(
//   (config) => {
//     if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ Refresh expired token automatically
// userApi.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     const status = error?.response?.status;

//     if (status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       // Wait if another refresh is ongoing
//       if (isRefreshing) {
//         return new Promise((resolve) => {
//           refreshQueue.push((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             resolve(userApi(originalRequest));
//           });
//         });
//       }

//       isRefreshing = true;
//       try {
//         // Refresh access token using refresh token cookie
//         const { data } = await axios.post(`${API_URL}/user/refresh-token`, {}, { withCredentials: true });
//         const newToken = data?.access_token;
//         if (!newToken) throw new Error("No access token returned");

//         accessToken = newToken;
//         localStorage.setItem("user_access_token", newToken);
//         processRefreshQueue(newToken);

//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         return userApi(originalRequest);
//       } catch (err) {
//         console.warn("🔴 Refresh token failed:", err);

//         clearAccessToken();
//         toast.error("Session expired. Please log in again.");
//         if (!window.location.pathname.includes("/login")) {
//           window.location.replace("/login");
//         }
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// // ✅ Helpers
// export const setAccessToken = (token) => {
//   accessToken = token;
//   localStorage.setItem("user_access_token", token);
// };

// export const clearAccessToken = () => {
//   accessToken = null;
//   localStorage.removeItem("user_access_token");
// };

// export default userApi;



import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Create Axios instance
const userApi = axios.create({
  baseURL: API_URL,
  withCredentials: true, // required for refresh cookie
});

let accessToken = localStorage.getItem("user_access_token") || null;
let isRefreshing = false;
let refreshQueue = [];

// ✅ Process queued requests after refresh
const processRefreshQueue = (newToken) => {
  refreshQueue.forEach((cb) => cb(newToken));
  refreshQueue = [];
};

// ✅ Attach Authorization header
userApi.interceptors.request.use(
  (config) => {
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle expired tokens automatically
userApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    // If no response or no status, just reject
    if (!status) return Promise.reject(error);

    // Prevent infinite loops on /login or /verify-otp pages
    const isLoginRoute =
      window.location.pathname.includes("/login") ||
      window.location.pathname.includes("/verify-otp");

    // Only handle 401 if it’s not already retried
    if (status === 401 && !originalRequest._retry && !isLoginRoute) {
      originalRequest._retry = true;

      // Wait for ongoing refresh
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(userApi(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        // Attempt to refresh token via cookie
        const { data } = await axios.post(
          `${API_URL}/user/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = data?.access_token;
        if (!newToken) throw new Error("No new access token");

        // Save and retry
        accessToken = newToken;
        localStorage.setItem("user_access_token", newToken);
        processRefreshQueue(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return userApi(originalRequest);
      } catch (err) {
        // Don't reload — just clear and stop
        clearAccessToken();
        console.warn("Session expired. User must log in again.");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ✅ Helper functions
export const setAccessToken = (token) => {
  accessToken = token;
  localStorage.setItem("user_access_token", token);
};

export const clearAccessToken = () => {
  accessToken = null;
  localStorage.removeItem("user_access_token");
};

export default userApi;
