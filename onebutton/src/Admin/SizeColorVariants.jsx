import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "./api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    availableSizes: {},
    availableColors: [],
  });

  const [newSize, setNewSize] = useState("");
  const [newStock, setNewStock] = useState(0);
  const [newColor, setNewColor] = useState("#000000");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [admin, setAdmin] = useState(null);

  // Verify admin & load product
  useEffect(() => {
    const verifyAdminAndFetch = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        // verify admin
        await api.get(`/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(true);

        // fetch product details
        const res = await api.get(`/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // ensure shapes are safe
        const data = res.data || {};
        setProduct({
          name: data.name || "",
          category: data.category || "",
          price: data.price || "",
          stock: data.stock || "",
          availableSizes: data.availableSizes || {},
          availableColors: Array.isArray(data.availableColors) ? data.availableColors : [],
        });
      } catch (err) {
        console.error("Failed to verify admin or fetch product:", err);
        setError("Failed to load product or admin session invalid.");
        // if verification failed, redirect to login
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/admin/login");
        }
      } finally {
        setCheckingAdmin(false);
      }
    };

    verifyAdminAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const updateSizeStock = (size, stock) => {
    setError("");
    setSuccess("");
    const token = localStorage.getItem("admin_token");
    api
      .put(
        `/products/${id}/update-size`,
        { size, stock },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setProduct((prev) => ({
          ...prev,
          availableSizes: response.data.availableSizes || prev.availableSizes,
        }));
        setSuccess("Size updated successfully!");
      })
      .catch((err) => {
        console.error("Failed to update size:", err);
        setError("Failed to update size.");
      });
  };

  const addSize = () => {
    setError("");
    setSuccess("");
    if (!newSize || newStock <= 0) {
      setError("Please provide a valid size and stock (> 0).");
      return;
    }
    const token = localStorage.getItem("admin_token");
    api
      .put(
        `/products/${id}/add-size`,
        { size: newSize, stock: newStock },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setProduct((prev) => ({
          ...prev,
          availableSizes: response.data.availableSizes || prev.availableSizes,
        }));
        setNewSize("");
        setNewStock(0);
        setSuccess("Size added successfully!");
      })
      .catch((err) => {
        console.error("Failed to add size:", err);
        setError("Failed to add size.");
      });
  };

  const deleteSize = (size) => {
    setError("");
    setSuccess("");
    const token = localStorage.getItem("admin_token");
    api
      .delete(`/products/${id}/delete-size`, {
        data: { size },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProduct((prev) => ({
          ...prev,
          availableSizes: response.data.availableSizes || prev.availableSizes,
        }));
        setSuccess("Size deleted successfully!");
      })
      .catch((err) => {
        console.error("Failed to delete size:", err);
        setError("Failed to delete size.");
      });
  };

  const addColor = () => {
    setError("");
    setSuccess("");
    if (!newColor) {
      setError("Please select a color.");
      return;
    }
    const token = localStorage.getItem("admin_token");
    api
      .put(
        `/products/${id}/add-color`,
        { color: newColor },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setProduct((prev) => ({
          ...prev,
          availableColors: response.data.availableColors || prev.availableColors,
        }));
        setSuccess("Color added successfully!");
      })
      .catch((err) => {
        console.error("Failed to add color:", err);
        setError("Failed to add color.");
      });
  };

  const deleteColor = (color) => {
    setError("");
    setSuccess("");
    const token = localStorage.getItem("admin_token");
    api
      .delete(`/products/${id}/delete-color`, {
        data: { color },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProduct((prev) => ({
          ...prev,
          availableColors: response.data.availableColors || prev.availableColors,
        }));
        setSuccess("Color deleted successfully!");
      })
      .catch((err) => {
        console.error("Failed to delete color:", err);
        setError("Failed to delete color.");
      });
  };

  if (checkingAdmin) return <p className="text-center text-yellow-500">Checking admin session...</p>;
  if (!admin) return null; // navigation to login already triggered

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[60%] bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Edit Product</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        {/* Sizes Section */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-center mb-2">Manage Sizes</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border p-2">Size</th>
                <th className="border p-2">Stock</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(product.availableSizes || {}).length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-3 text-gray-500">
                    No sizes available.
                  </td>
                </tr>
              ) : (
                Object.entries(product.availableSizes || {}).map(([size, stock]) => (
                  <tr key={size}>
                    <td className="border p-2 text-center">{size}</td>
                    <td className="border p-2 text-center">
                      <input
                        type="number"
                        value={Number(stock)}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          // update UI immediately and send request
                          setProduct((prev) => ({
                            ...prev,
                            availableSizes: { ...prev.availableSizes, [size]: val },
                          }));
                          updateSizeStock(size, val);
                        }}
                        className="border rounded w-full py-1 px-2 text-center"
                        min="0"
                      />
                    </td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => deleteSize(size)}
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

          <div className="mt-4 flex justify-center">
            <input
              type="text"
              placeholder="Size (e.g., XL)"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              className="border rounded px-2 py-1 mr-2 text-center"
            />
            <input
              type="number"
              placeholder="Stock"
              value={newStock}
              onChange={(e) => setNewStock(parseInt(e.target.value, 10) || 0)}
              className="border rounded px-2 py-1 mr-2 text-center"
              min="0"
            />
            <button onClick={addSize} className="bg-green-500 text-white px-3 py-1 rounded">
              Add Size
            </button>
          </div>
        </div>

        {/* Colors Section */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-center mb-2">Manage Colors</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {(product.availableColors || []).length === 0 ? (
              <p className="text-gray-500">No colors available.</p>
            ) : (
              (product.availableColors || []).map((color) => (
                <div key={color} className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 border rounded-full"
                    style={{ backgroundColor: color }}
                    aria-hidden
                  />
                  <button
                    onClick={() => deleteColor(color)}
                    className="bg-red-500 text-white px-2 py-1 mt-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 flex justify-center">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="border rounded w-12 h-10 p-1 mr-2"
            />
            <button onClick={addColor} className="bg-green-500 text-white px-3 py-1 rounded">
              Add Color
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
