import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateCoupon() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [coupon, setCoupon] = useState({
        value: "",
        min_order_value: "",
        expires_at: "",
        usage_limit: "",
        is_active: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchCoupon = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/coupons/${id}`);
                setCoupon({
                    value: response.data.value || "",
                    min_order_value: response.data.min_order_value || "",
                    expires_at: response.data.expires_at || "",
                    usage_limit: response.data.usage_limit || "",
                    is_active: response.data.is_active,
                });
            } catch (error) {
                setError("Failed to fetch coupon details.");
            }
        };
        fetchCoupon();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCoupon((prev) => ({
            ...prev,
            [name]: name === "is_active" ? value === "1" : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // Only send non-empty fields
        const updatedData = {};
        if (coupon.value !== "") updatedData.value = coupon.value;
        if (coupon.min_order_value !== "") updatedData.min_order_value = coupon.min_order_value;
        if (coupon.expires_at !== "") updatedData.expires_at = coupon.expires_at;
        if (coupon.usage_limit !== "") updatedData.usage_limit = coupon.usage_limit;
        updatedData.is_active = coupon.is_active ? 1 : 0;

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/update-coupon/${id}`, updatedData);

            if (response.status === 200) {
                setSuccess("Coupon updated successfully!");
                setTimeout(() => navigate("/Admin/Coupons"), 1500);
            }
        } catch (error) {
            setError(error.response?.data.errors || "Failed to update coupon.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-4">Update Coupon</h2>

            {error && <p className="text-red-500">{typeof error === "string" ? error : Object.values(error).flat().join(", ")}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Value</label>
                    <input type="number" name="value" value={coupon.value} onChange={handleChange} className="border rounded w-full py-2 px-3" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Minimum Order Value</label>
                    <input type="number" name="min_order_value" value={coupon.min_order_value} onChange={handleChange} className="border rounded w-full py-2 px-3" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Expiry Date</label>
                    <input type="date" name="expires_at" value={coupon.expires_at} onChange={handleChange} className="border rounded w-full py-2 px-3" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Usage Limit</label>
                    <input type="number" name="usage_limit" value={coupon.usage_limit} onChange={handleChange} className="border rounded w-full py-2 px-3" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                    <select name="is_active" value={coupon.is_active ? "1" : "0"} onChange={handleChange} className="border rounded w-full py-2 px-3">
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                </div>

                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" disabled={loading}>
                    {loading ? "Updating..." : "Update Coupon"}
                </button>
            </form>
        </div>
    );
}

