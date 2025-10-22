import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductImageManager = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Get token from localStorage
  const token = localStorage.getItem("admin_token");

  // ✅ Axios config with token
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  };

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setProduct(res.data);
      } catch (error) {
        console.error("❌ Error fetching product:", error);
        if (error.response?.status === 401) {
          alert("Admin not authenticated. Please log in again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, token]);

  const handleReplace = async (type, oldPath = null) => {
    if (!token) {
      alert("Please login as admin to replace images.");
      return;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async (e) => {
      const newImage = e.target.files[0];
      if (!newImage) return;

      const formData = new FormData();
      formData.append("type", type);
      formData.append("new_image", newImage);
      if (oldPath) formData.append("old_path", oldPath);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/products/${productId}/replace-image`,
          formData,
          axiosConfig
        );
        alert("✅ Image replaced successfully!");
        setProduct(response.data.product);
      } catch (error) {
        console.error("❌ Failed to replace image:", error);
        if (error.response?.status === 401) {
          alert("Session expired. Please login again as admin.");
        } else {
          alert("Failed to replace image. Check console for details.");
        }
      }
    };

    fileInput.click();
  };

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>

      {/* Main Image */}
      {product.image && (
        <div>
          <h3 className="font-semibold mb-2">Main Image</h3>
          <div className="flex items-center gap-3">
            <img
              src={`${import.meta.env.VITE_BASE_URL}/storage/${product.image}`}
              alt="Main"
              className="w-32 h-32 object-cover rounded border"
            />
            <button
              onClick={() => handleReplace("image")}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Replace
            </button>
          </div>
        </div>
      )}

      {/* Hover Image */}
      {product.hover_image && (
        <div>
          <h3 className="font-semibold mb-2">Hover Image</h3>
          <div className="flex items-center gap-3">
            <img
              src={`${import.meta.env.VITE_BASE_URL}/storage/${product.hover_image}`}
              alt="Hover"
              className="w-32 h-32 object-cover rounded border"
            />
            <button
              onClick={() => handleReplace("hover_image")}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Replace
            </button>
          </div>
        </div>
      )}

      {/* Thumbnail Images */}
      {product.thumbnail_images?.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Thumbnail Images</h3>
          <div className="flex flex-wrap gap-3">
            {product.thumbnail_images.map((thumb, index) => (
              <div key={index} className="relative group">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/storage/${thumb}`}
                  alt={`Thumbnail ${index}`}
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  onClick={() => handleReplace("thumbnail_images", thumb)}
                  className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100"
                >
                  ↻
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageManager;
