// src/utils/safeApiCall.js
import toast from "react-hot-toast";

/**
 * Wraps an API call safely.
 * - Suppresses harmless 401 logs.
 * - Returns null on failure (so UI doesn't crash).
 * - Optionally shows toast for serious errors.
 */
export async function safeApiCall(apiFn, options = { silent401: true, showToast: false }) {
  try {
    return await apiFn();
  } catch (err) {
    const status = err?.response?.status;

    // Suppress harmless 401 Unauthorized errors
    if (options.silent401 && status === 401) {
      return null;
    }

    // Show toast only for real errors
    if (options.showToast) {
      const msg = err?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }

    console.error("🔴 API Error:", err);
    return null;
  }
}
