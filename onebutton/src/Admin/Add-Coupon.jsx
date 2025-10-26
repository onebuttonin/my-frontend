import React, { useState } from "react";
import axios from "axios";
import api from "./api";
import { useNavigate } from "react-router-dom";

export default function AddCoupon() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        code: "",
        description: "",
        type: "fixed",
        value: "",
        usage_limit: "",
        expires_at: "",
        is_active: true,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "is_active" ? value === "1" : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await api.post(`/add-coupon`, {
                ...formData,
                is_active: formData.is_active ? 1 : 0, // Convert boolean to int
            });

            if (response.status === 201) {
                setSuccess("Coupon added successfully!");
                setTimeout(() => navigate("/Admin/Coupons"), 1500);
            }
        } catch (error) {
            setError(error.response?.data.errors || "Failed to add coupon.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-4">Add New Coupon</h2>

            {error && <p className="text-red-500">{typeof error === "string" ? error : Object.values(error).flat().join(", ")}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Coupon Code</label>
                    <input type="text" name="code" value={formData.code} onChange={handleChange} required className="border rounded w-full py-2 px-3 uppercase" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="border rounded w-full py-2 px-3"></textarea>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="border rounded w-full py-2 px-3">
                        <option value="fixed">Fixed Discount</option>
                        <option value="percentage">Percentage Discount</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Value</label>
                    <input type="number" name="value" value={formData.value} onChange={handleChange} required className="border rounded w-full py-2 px-3" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Usage Limit</label>
                    <input type="number" name="usage_limit" value={formData.usage_limit} onChange={handleChange} className="border rounded w-full py-2 px-3" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Expiry Date</label>
                    <input type="date" name="expires_at" value={formData.expires_at} onChange={handleChange} className="border rounded w-full py-2 px-3" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                    <select name="is_active" value={formData.is_active ? "1" : "0"} onChange={handleChange} className="border rounded w-full py-2 px-3">
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                </div>

                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" disabled={loading}>
                    {loading ? "Adding..." : "Add Coupon"}
                </button>
            </form>
        </div>
    );
}
