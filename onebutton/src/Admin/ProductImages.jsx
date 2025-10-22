import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // get product ID from URL

const ProductImageManager = () => {
  const { id: productId } = useParams(); // e.g. /products/25 → productId = 25
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("admin_token"); // ✅ get admin token

  // Fetch product data
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ send token
            },
          }
        );
        setProduct(res.data);
      } catch (error) {
        console.error("❌ Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, token]);

  // Delete image handler
  const handleDelete = async (type, path = null) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const payload = { type };
      if (path) payload.path = path;

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/products/${productId}/delete-image`,
        {
          data: payload,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ send token here too
          },
        }
      );

      alert("✅ Image deleted successfully!");
      setProduct(response.data.product); // update product after deletion
    } catch (error) {
      console.error("❌ Failed to delete image:", error);
      alert("Failed to delete image! Check console for details.");
    }
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
              src={`${import.meta.env.VITE_API_URL}/storage/${product.image}`}
              alt="Main"
              className="w-32 h-32 object-cover rounded border"
            />
            <button
              onClick={() => handleDelete("image")}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
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
              src={`${import.meta.env.VITE_API_URL}/storage/${product.hover_image}`}
              alt="Hover"
              className="w-32 h-32 object-cover rounded border"
            />
            <button
              onClick={() => handleDelete("hover_image")}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
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
                  src={`${import.meta.env.VITE_API_URL}/storage/${thumb}`}
                  alt={`Thumbnail ${index}`}
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  onClick={() => handleDelete("thumbnail_images", thumb)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100"
                >
                  ×
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
