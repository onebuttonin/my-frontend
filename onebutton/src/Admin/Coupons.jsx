
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "./api";

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [admin, setAdmin] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdminAndLoad = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const res = await api.get(`/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data || true);
        // only fetch coupons after admin verified
        await fetchCoupons(token);
      } catch (err) {
        console.error("Admin verification failed:", err);
        setAdmin(null);
        navigate("/admin/login");
      } finally {
        setCheckingAdmin(false);
      }
    };

    verifyAdminAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchCoupons = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/coupons`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setCoupons(res.data || []);
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
      setError("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    const token = localStorage.getItem("admin_token");
    try {
      await api.delete(`/coupons/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setCoupons((prev) => prev.filter((coupon) => coupon.id !== id));
    } catch (err) {
      console.error("Failed to delete coupon:", err);
      alert("Failed to delete coupon");
    }
  };

  if (checkingAdmin) return <p className="text-center text-yellow-500">Checking admin session...</p>;
  if (!admin) return null; // navigation to login already triggered

  if (loading) return <p>Loading coupons...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Coupons</h2>
        <button
          onClick={() => navigate("/Admin/Add-Coupon")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Coupon
        </button>
      </div>

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
          {coupons.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center p-4 text-gray-500">
                No coupons found.
              </td>
            </tr>
          ) : (
            coupons.map((coupon) => (
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
