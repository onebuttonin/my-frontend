import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = import.meta.src.env.VITE_API_URL;

// Function to get token (if user is logged in)
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Function to get guest ID (if user is not logged in)
const getGuestId = () => {
    let guestId = localStorage.getItem("guest_id");
    if (!guestId) {
        guestId = `guest_${Math.random().toString(36).substring(7)}`;
        localStorage.setItem("guest_id", guestId);
    }
    return guestId;
};

// Add to Wishlist
export const addToWishlist = async (productId) => {
    try {
        const headers = {
            ...getAuthHeader(),
            "Guest-Id": getGuestId(),
        };

        const response = await axios.post(
            `${API_URL}/wishlist/add`,
            { product_id: productId },
            { headers }
        );

        return response.data;
    } catch (error) {
        console.error("Error adding to wishlist:", error.response?.data || error.message);
        throw error;
    }
};

// Get Wishlist Items
export const getWishlist = async () => {
    try {
        const headers = {
            ...getAuthHeader(),
            "Guest-Id": getGuestId(),
        };

        const response = await axios.get(`${API_URL}/wishlist`, { headers });
        return response.data;
    } catch (error) {
        console.error("Error fetching wishlist:", error.response?.data || error.message);
        throw error;
    }
};
