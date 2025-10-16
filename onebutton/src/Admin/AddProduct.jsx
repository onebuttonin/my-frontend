
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function AddProduct() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     price: "",
//     old_price: "",
//     cost_price: "",
//     stock: "",
//     availableSizes: { s: 0, m: 0, l: 0, xl: 0, xxl: 0 },
//     availableColors: [],
//   });

//   const [image, setImage] = useState(null);
//   const [hoverImage, setHoverImage] = useState(null);
//   const [thumbnailImages, setThumbnailImages] = useState([]);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Admin state & loading
//   const [admin, setAdmin] = useState(null);
//   const [checkingAdmin, setCheckingAdmin] = useState(true);

//   useEffect(() => {
//     const fetchAdmin = async () => {
//       const token = localStorage.getItem("admin_token");
//       if (!token) {
//         navigate("/admin/login");
//         return;
//       }

//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/profile`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAdmin(response.data);
//       } catch (err) {
//         setAdmin(null);
//         navigate("/admin/login");
//       } finally {
//         setCheckingAdmin(false);
//       }
//     };

//     fetchAdmin();
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSizeChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       availableSizes: { ...prev.availableSizes, [name]: parseInt(value, 10) || 0 },
//     }));
//   };

//   const handleColorChange = (e) => {
//     const colors = e.target.value
//       .split(",")
//       .map((color) => color.trim())
//       .filter(Boolean);
//     setFormData({ ...formData, availableColors: colors });
//   };

//   const handleImageChange = (e) => setImage(e.target.files[0]);
//   const handleHoverImageChange = (e) => setHoverImage(e.target.files[0]);
//   const handleThumbnailChange = (e) => setThumbnailImages([...e.target.files]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!admin) {
//       setError("Admin session invalid. Redirecting to login...");
//       navigate("/admin/login");
//       return;
//     }

//     setError("");
//     setSuccess("");
//     setLoading(true);

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append("name", formData.name);
//       formDataToSend.append("category", formData.category);
//       formDataToSend.append("price", formData.price);
//       formDataToSend.append("old_price", formData.old_price || "");
//       formDataToSend.append("cost_price", formData.cost_price || "");
//       formDataToSend.append("stock", formData.stock);

//       if (image) formDataToSend.append("image", image);
//       if (hoverImage) formDataToSend.append("hover_image", hoverImage);

//       thumbnailImages.forEach((file) => {
//         formDataToSend.append("thumbnail_images[]", file);
//       });

//       Object.entries(formData.availableSizes).forEach(([size, value]) => {
//         formDataToSend.append(`availableSizes[${size}]`, value);
//       });

//       formData.availableColors.forEach((color, index) => {
//         formDataToSend.append(`availableColors[${index}]`, color);
//       });

//       // include admin token if available
//       const adminToken = localStorage.getItem("admin_token");

//       const headers = {
//         "Content-Type": "multipart/form-data",
//       };
//       if (adminToken) headers["Authorization"] = `Bearer ${adminToken}`;

//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URL}/add-products`,
//         formDataToSend,
//         { headers }
//       );

//       if (response.status === 201 || response.status === 200) {
//         setSuccess("Product added successfully!");
//         // optional: short delay so admin sees success
//         setTimeout(() => navigate("/Admin/Dashboard"), 1200);
//       } else {
//         setError("Unexpected response from server.");
//       }
//     } catch (err) {
//       console.error("Error adding product:", err);
//       if (err.response?.data?.errors) {
//         const allErrors = Object.values(err.response.data.errors).flat().join(", ");
//         setError(allErrors || "Validation failed");
//       } else if (err.response?.data?.message) {
//         setError(err.response.data.message);
//       } else {
//         setError("Failed to add product. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (checkingAdmin) return <p>Checking admin session...</p>;
//   if (!admin) return null; // navigation to login already triggered

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h2 className="text-2xl font-bold mb-4">Add Product</h2>

//       {error && (
//         <p className="text-red-500 mb-2">
//           {typeof error === "string" ? error : JSON.stringify(error)}
//         </p>
//       )}
//       {success && <p className="text-green-500 mb-2">{success}</p>}

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
//       >
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
//           <input
//             type="text"
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             required
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         {/* New Price */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">New Price (Selling)</label>
//           <input
//             type="number"
//             name="price"
//             value={formData.price}
//             onChange={handleChange}
//             required
//             min="0"
//             step="0.01"
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         {/* Old Price */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Old Price (Optional)</label>
//           <input
//             type="number"
//             name="old_price"
//             value={formData.old_price}
//             onChange={handleChange}
//             min="0"
//             step="0.01"
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         {/* Cost Price */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Cost Price (Purchase)</label>
//           <input
//             type="number"
//             name="cost_price"
//             value={formData.cost_price}
//             onChange={handleChange}
//             min="0"
//             step="0.01"
//             required
//             className="border rounded w-full py-2 px-3"
//           />
//           <p className="text-xs text-gray-500 mt-1">This is used for expense/profit calculations (keep private).</p>
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Stock</label>
//           <input
//             type="number"
//             name="stock"
//             value={formData.stock}
//             onChange={handleChange}
//             required
//             min="0"
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         {/* Available Sizes */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Available Sizes (Enter stock for each size)</label>
//           <div className="grid grid-cols-3 gap-2">
//             {["s", "m", "l", "xl", "xxl"].map((size) => (
//               <div key={size}>
//                 <label className="text-sm">{size.toUpperCase()}</label>
//                 <input
//                   type="number"
//                   name={size}
//                   onChange={handleSizeChange}
//                   className="border rounded w-full py-1 px-2"
//                   min="0"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Available Colors */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Available Colors (Comma-separated)</label>
//           <input
//             type="text"
//             onChange={handleColorChange}
//             placeholder="#000000, #FF0000"
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         {/* Image Uploads */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Main Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             required
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Hover Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleHoverImageChange}
//             required
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Thumbnail Images (Select multiple)</label>
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleThumbnailChange}
//             required
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//           disabled={loading}
//         >
//           {loading ? "Adding..." : "Add Product"}
//         </button>
//       </form>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    old_price: "",
    cost_price: "",
    stock: "",
    sku: "", // ✅ SKU added
    availableSizes: { s: 0, m: 0, l: 0, xl: 0, xxl: 0 },
    availableColors: [],
  });

  const [image, setImage] = useState(null);
  const [hoverImage, setHoverImage] = useState(null);
  const [thumbnailImages, setThumbnailImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Admin state
  const [admin, setAdmin] = useState(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(response.data);
      } catch {
        setAdmin(null);
        navigate("/admin/login");
      } finally {
        setCheckingAdmin(false);
      }
    };

    fetchAdmin();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSizeChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      availableSizes: { ...prev.availableSizes, [name]: parseInt(value, 10) || 0 },
    }));
  };

  const handleColorChange = (e) => {
    const colors = e.target.value
      .split(",")
      .map((color) => color.trim())
      .filter(Boolean);
    setFormData({ ...formData, availableColors: colors });
  };

  const handleImageChange = (e) => setImage(e.target.files[0]);
  const handleHoverImageChange = (e) => setHoverImage(e.target.files[0]);
  const handleThumbnailChange = (e) => setThumbnailImages([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admin) {
      setError("Admin session invalid. Redirecting to login...");
      navigate("/admin/login");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("old_price", formData.old_price || "");
      formDataToSend.append("cost_price", formData.cost_price || "");
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("sku", formData.sku || ""); // ✅ include SKU

      if (image) formDataToSend.append("image", image);
      if (hoverImage) formDataToSend.append("hover_image", hoverImage);

      thumbnailImages.forEach((file) => {
        formDataToSend.append("thumbnail_images[]", file);
      });

      Object.entries(formData.availableSizes).forEach(([size, value]) => {
        formDataToSend.append(`availableSizes[${size}]`, value);
      });

      formData.availableColors.forEach((color, index) => {
        formDataToSend.append(`availableColors[${index}]`, color);
      });

      const adminToken = localStorage.getItem("admin_token");
      const headers = { "Content-Type": "multipart/form-data" };
      if (adminToken) headers["Authorization"] = `Bearer ${adminToken}`;

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/add-products`,
        formDataToSend,
        { headers }
      );

      if (response.status === 201 || response.status === 200) {
        setSuccess("Product added successfully!");
        setTimeout(() => navigate("/Admin/Dashboard"), 1200);
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      if (err.response?.data?.errors) {
        const allErrors = Object.values(err.response.data.errors).flat().join(", ");
        setError(allErrors || "Validation failed");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to add product. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmin) return <p>Checking admin session...</p>;
  if (!admin) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {/* ✅ SKU field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            SKU (Optional)
          </label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="e.g. OB-TS-001"
            className="border rounded w-full py-2 px-3"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to auto-generate SKU.
          </p>
        </div>

        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border rounded w-full py-2 px-3"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="border rounded w-full py-2 px-3"
          />
        </div>

        {/* Prices */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            New Price (Selling)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="border rounded w-full py-2 px-3"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Old Price (Optional)
          </label>
          <input
            type="number"
            name="old_price"
            value={formData.old_price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="border rounded w-full py-2 px-3"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Cost Price (Purchase)
          </label>
          <input
            type="number"
            name="cost_price"
            value={formData.cost_price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="border rounded w-full py-2 px-3"
          />
          <p className="text-xs text-gray-500 mt-1">
            Used for profit calculations (keep private).
          </p>
        </div>

        {/* Stock */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            className="border rounded w-full py-2 px-3"
          />
        </div>

        {/* Available Sizes */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Available Sizes (Enter stock for each size)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["s", "m", "l", "xl", "xxl"].map((size) => (
              <div key={size}>
                <label className="text-sm">{size.toUpperCase()}</label>
                <input
                  type="number"
                  name={size}
                  onChange={handleSizeChange}
                  className="border rounded w-full py-1 px-2"
                  min="0"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Available Colors */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Available Colors (Comma-separated)
          </label>
          <input
            type="text"
            onChange={handleColorChange}
            placeholder="#000000, #FF0000"
            className="border rounded w-full py-2 px-3"
          />
        </div>

        {/* Image Uploads */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Main Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="border rounded w-full py-2 px-3"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Hover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleHoverImageChange}
            required
            className="border rounded w-full py-2 px-3"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Thumbnail Images (Select multiple)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleThumbnailChange}
            required
            className="border rounded w-full py-2 px-3"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
