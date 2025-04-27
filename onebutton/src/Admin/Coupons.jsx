import React, { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";

export default function Coupons() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/coupons");
            setCoupons(response.data);
        } catch (error) {
            setError("Failed to fetch coupons");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/coupons/${id}`);
            setCoupons(coupons.filter((coupon) => coupon.id !== id));
        } catch (error) {
            alert("Failed to delete coupon");
        }
    };

    // const handleUpdate = (id) => {
    //     navigate("/Admin/Update-Coupon", { state: id });
    // };

    if (loading) return <p>Loading coupons...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-4">Coupons</h2>
            <button
                onClick={() => navigate("/Admin/Add-Coupon")}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Add Coupon
            </button>
            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Code</th>
                        <th className="border px-4 py-2">Type</th>
                        <th className="border px-4 py-2">Value</th>
                        <th className="border px-4 py-2">Min Order</th>
                        <th className="border px-4 py-2">Expires At</th>
                        <th className="border px-4 py-2">Usage Limit</th>
                        <th className="border px-4 py-2">Used Count</th>
                        <th className="border px-4 py-2">Active</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {coupons.map((coupon) => (
                        <tr key={coupon.id}>
                            <td className="border px-4 py-2">{coupon.id}</td>
                            <td className="border px-4 py-2">{coupon.code}</td>
                            <td className="border px-4 py-2">{coupon.type}</td>
                            <td className="border px-4 py-2">{coupon.value}</td>
                            <td className="border px-4 py-2">{coupon.min_order_value}</td>
                            <td className="border px-4 py-2">{coupon.expires_at}</td>
                            <td className="border px-4 py-2">{coupon.usage_limit}</td>
                            <td className="border px-4 py-2">{coupon.used_count}</td>
                            <td className="border px-4 py-2">{coupon.is_active ? "Yes" : "No"}</td>
                            <td className="border px-4 py-2 space-x-2">
                                <Link
                                    to={`/Admin/update-coupon/${coupon.id}`}
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                >
                                    Update
                                </Link>
                                <button
                                    onClick={() => handleDelete(coupon.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
