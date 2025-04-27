import React, { useState } from "react";
import { addToWishlist } from "../Api/Wishlist";

const WishlistButton = ({ productId }) => {
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);

    const handleAddToWishlist = async () => {
        setLoading(true);
        try {
            await addToWishlist(productId);
            setAdded(true);
        } catch (error) {
            alert("Failed to add to wishlist");
        }
        setLoading(false);
    };

    return (
        <button 
            onClick={handleAddToWishlist} 
            disabled={loading || added} 
            style={{
                backgroundColor: added ? "green" : "red",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                cursor: loading ? "not-allowed" : "pointer"
            }}
        >
            {added ? "Added" : "Add to Wishlist"}
        </button>
    );
};

export default WishlistButton;
