import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../Admin/api"

export default function AdminHeroImages() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [heroImages, setHeroImages] = useState({ large: [], small: [] });
  const [selectedFile, setSelectedFile] = useState(null);
  const [screenType, setScreenType] = useState("large");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Verify Admin Session
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
        await fetchHeroImages(token);
      } catch (err) {
        console.error("Admin verification failed:", err);
        setAdmin(null);
        navigate("/admin/login");
      } finally {
        setCheckingAdmin(false);
      }
    };

    verifyAdminAndLoad();
  }, [navigate]);

  // ✅ Fetch Hero Images
  const fetchHeroImages = async (token) => {
    try {
      const res = await api.get(`/hero-images`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHeroImages(res.data);
    } catch (err) {
      console.error("Error fetching hero images:", err);
    }
  };

  // ✅ Upload Hero Image
  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    if (!selectedFile) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("screen_type", screenType);

    try {
      setLoading(true);
      await api.post(`/hero-images`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSelectedFile(null);
      await fetchHeroImages(token);
      alert("Image uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Hero Image
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("admin_token");
    try {
      await api.delete(`/hero-images/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchHeroImages(token);
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Failed to delete image.");
    }
  };

  if (checkingAdmin) return <p className="text-center mt-10">Checking admin session...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Hero Image Management</h2>

      {/* Upload Section */}
      <form
        onSubmit={handleUpload}
        className="flex flex-col sm:flex-row items-center gap-4 mb-8 justify-center"
      >
        <select
          value={screenType}
          onChange={(e) => setScreenType(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="large">Large Screen</option>
          <option value="small">Small Screen</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="border px-3 py-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-neutral-800 transition"
        >
          <UploadCloud className="w-5 h-5" />
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

     {/* Display Large Screen Images */}
<h3 className="text-lg font-semibold mb-2">Large Screen Images</h3>
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
  {heroImages.large.map((img) => (
    <div key={img.id} className="relative group">
      <img
        src={img.path.startsWith("http") ? img.path : `${import.meta.env.VITE_BASE_URL}${img.path}`}
        alt="Large Hero"
        className="w-full h-40 object-cover rounded shadow"
      />
      <button
        onClick={() => handleDelete(img.id)}
        className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  ))}
</div>

{/* Display Small Screen Images */}
<h3 className="text-lg font-semibold mb-2">Small Screen Images</h3>
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
  {heroImages.small.map((img) => (
    <div key={img.id} className="relative group">
      <img
        src={img.path.startsWith("http") ? img.path : `${import.meta.env.VITE_BASE_URL}${img.path}`}
        alt="Small Hero"
        className="w-full h-60 object-cover rounded shadow"
      />
      <button
        onClick={() => handleDelete(img.id)}
        className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  ))}
</div>

      
    </div>
  );
}
