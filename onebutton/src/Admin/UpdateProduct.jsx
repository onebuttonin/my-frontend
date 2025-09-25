// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";

// export default function EditProduct() {
//     const { id } = useParams(); // Get product ID from URL
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         name: "",
//         category: "",
//         price: "",
//         stock: "",
//         description: ""
//     });

//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     // Fetch product details
//     useEffect(() => {
//         axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`)
//             .then((response) => {
//                 const product = response.data;
//                 setFormData({
//                     name: product.name,
//                     category: product.category,
//                     price: product.price,
//                     stock: product.stock || "",
//                     description: product.description || ""
//                 });
//             })
//             .catch(() => setError("Failed to fetch product details."));
//     }, [id]);

//     // Handle input changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setSuccess("");

//         const updatedData = {};

//         // Append only fields that are modified
//         Object.keys(formData).forEach(key => {
//             if (formData[key] !== "") {
//                 updatedData[key] = formData[key];
//             }
//         });

//         try {
//             const response = await axios.put(
//                 `${import.meta.env.VITE_API_URL}/products/${id}`, 
//                 updatedData, 
//                 { headers: { "Content-Type": "application/json" } }
//             );

//             if (response.status === 200) {
//                 setSuccess("Product updated successfully!");
//                 setTimeout(() => navigate("/Admin/manageproducts"), 1500);
//             }
//         } catch {
//             setError("Failed to update product. Please try again.");
//         }
//     };

//     return (
//         <div className="container mx-auto px-4 py-6">
//             <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

//             {error && <p className="text-red-500">{error}</p>}
//             {success && <p className="text-green-500">{success}</p>}

//             <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//                 {/* Name */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Name</label>
//                     <input type="text" name="name" value={formData.name} onChange={handleChange} className="border rounded w-full py-2 px-3" />
//                 </div>

//                 {/* Category */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Category</label>
//                     <input type="text" name="category" value={formData.category} onChange={handleChange} className="border rounded w-full py-2 px-3" />
//                 </div>

//                 {/* Price */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Price</label>
//                     <input type="number" name="price" value={formData.price} onChange={handleChange} className="border rounded w-full py-2 px-3" />
//                 </div>

//                 {/* Stock */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Stock</label>
//                     <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="border rounded w-full py-2 px-3" />
//                 </div>

//                 {/* Description */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Description</label>
//                     <textarea name="description" value={formData.description} onChange={handleChange} className="border rounded w-full py-2 px-3"></textarea>
//                 </div>

//                 {/* Submit Button */}
//                 <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
//                     Update Product
//                 </button>
//             </form>
//         </div>
//     );
// }





// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";

// export default function EditProduct() {
//     const { id } = useParams(); // Get product ID from URL
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         name: "",
//         category: "",
//         price: "",
//         old_price: "",   // ✅ added old price
//         stock: "",
//         description: ""
//     });

//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     // Fetch product details
//     useEffect(() => {
//         axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`)
//             .then((response) => {
//                 const product = response.data;
//                 setFormData({
//                     name: product.name,
//                     category: product.category,
//                     price: product.price,
//                     old_price: product.old_price || "", // ✅ prefill old price
//                     stock: product.stock || "",
//                     description: product.description || ""
//                 });
//             })
//             .catch(() => setError("Failed to fetch product details."));
//     }, [id]);

//     // Handle input changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setSuccess("");

//         const updatedData = {};

//         // Append only fields that are modified
//         Object.keys(formData).forEach(key => {
//             if (formData[key] !== "") {
//                 updatedData[key] = formData[key];
//             }
//         });

//         try {
//             const response = await axios.put(
//                 `${import.meta.env.VITE_API_URL}/products/${id}`, 
//                 updatedData, 
//                 { headers: { "Content-Type": "application/json" } }
//             );

//             if (response.status === 200) {
//                 setSuccess("Product updated successfully!");
//                 setTimeout(() => navigate("/Admin/manageproducts"), 1500);
//             }
//         } catch {
//             setError("Failed to update product. Please try again.");
//         }
//     };

//     return (
//         <div className="container mx-auto px-4 py-6">
//             <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

//             {error && <p className="text-red-500">{error}</p>}
//             {success && <p className="text-green-500">{success}</p>}

//             <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//                 {/* Name */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Name</label>
//                     <input type="text" name="name" value={formData.name} onChange={handleChange} className="border rounded w-full py-2 px-3" />
//                 </div>

//                 {/* Category */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Category</label>
//                     <input type="text" name="category" value={formData.category} onChange={handleChange} className="border rounded w-full py-2 px-3" />
//                 </div>

//                 {/* New Price */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700">New Price</label>
//                     <input type="number" name="price" value={formData.price} onChange={handleChange} className="border rounded w-full py-2 px-3" />
//                 </div>

//                 {/* Old Price */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Old Price (Optional)</label>
//                     <input type="number" name="old_price" value={formData.old_price} onChange={handleChange} className="border rounded w-full py-2 px-3" />
//                 </div>

//                 {/* Stock */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Stock</label>
//                     <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="border rounded w-full py-2 px-3" />
//                 </div>

//                 {/* Description */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700">Description</label>
//                     <textarea name="description" value={formData.description} onChange={handleChange} className="border rounded w-full py-2 px-3"></textarea>
//                 </div>

//                 {/* Submit Button */}
//                 <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
//                     Update Product
//                 </button>
//             </form>
//         </div>
//     );
// }



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";

// export default function EditProduct() {
//   const { id } = useParams(); // Get product ID from URL
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     price: "",
//     old_price: "",
//     stock: "",
//     description: {
//       details: "",
//       size_fit: "",
//       wash_care: "",
//       specification: [],
//       sku: ""
//     }
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Fetch product details
//   useEffect(() => {
//     axios
//       .get(`${import.meta.env.VITE_API_URL}/products/${id}`)
//       .then((response) => {
//         const product = response.data;

//         setFormData({
//           name: product.name,
//           category: product.category,
//           price: product.price,
//           old_price: product.old_price || "",
//           stock: product.stock || "",
//           description: {
//             details: product.description?.details || "",
//             size_fit: product.description?.size_fit || "",
//             wash_care: product.description?.wash_care || "",
//             specification: product.description?.specification || [],
//             sku: product.description?.sku || ""
//           }
//         });
//       })
//       .catch(() => setError("Failed to fetch product details."));
//   }, [id]);

//   // Handle simple field changes (name, category, price etc.)
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle nested description changes
//   const handleDescriptionChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       description: { ...formData.description, [name]: value }
//     });
//   };

//   // Handle specification (comma-separated list)
//   const handleSpecificationChange = (e) => {
//     const value = e.target.value;
//     setFormData({
//       ...formData,
//       description: {
//         ...formData.description,
//         specification: value.split(",").map((item) => item.trim())
//       }
//     });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     const updatedData = {
//       ...formData,
//       description: formData.description // ensure JSON object is sent
//     };

//     try {
//       const response = await axios.put(
//         `${import.meta.env.VITE_API_URL}/products/${id}`,
//         updatedData,
//         { headers: { "Content-Type": "application/json" } }
//       );

//       if (response.status === 200) {
//         setSuccess("Product updated successfully!");
//         setTimeout(() => navigate("/Admin/manageproducts"), 1500);
//       }
//     } catch {
//       setError("Failed to update product. Please try again.");
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

//       {error && <p className="text-red-500">{error}</p>}
//       {success && <p className="text-green-500">{success}</p>}

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
//       >
//         {/* Name */}
//         <div className="mb-4">
//           <label className="block text-gray-700">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         {/* Category */}
//         <div className="mb-4">
//           <label className="block text-gray-700">Category</label>
//           <input
//             type="text"
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         {/* New Price */}
//         <div className="mb-4">
//           <label className="block text-gray-700">New Price</label>
//           <input
//             type="number"
//             name="price"
//             value={formData.price}
//             onChange={handleChange}
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         {/* Old Price */}
//         <div className="mb-4">
//           <label className="block text-gray-700">Old Price (Optional)</label>
//           <input
//             type="number"
//             name="old_price"
//             value={formData.old_price}
//             onChange={handleChange}
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         {/* Stock */}
//         <div className="mb-4">
//           <label className="block text-gray-700">Stock</label>
//           <input
//             type="number"
//             name="stock"
//             value={formData.stock}
//             onChange={handleChange}
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         {/* Description - structured JSON */}
//         <h3 className="text-lg font-semibold mt-6 mb-2">Product Description</h3>

//         <div className="mb-4">
//           <label className="block text-gray-700">Details</label>
//           <textarea
//             name="details"
//             value={formData.description.details}
//             onChange={handleDescriptionChange}
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">Size & Fit</label>
//           <input
//             type="text"
//             name="size_fit"
//             value={formData.description.size_fit}
//             onChange={handleDescriptionChange}
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">Wash Care</label>
//           <input
//             type="text"
//             name="wash_care"
//             value={formData.description.wash_care}
//             onChange={handleDescriptionChange}
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">Specification (comma-separated)</label>
//           <input
//             type="text"
//             name="specification"
//             value={formData.description.specification.join(", ")}
//             onChange={handleSpecificationChange}
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">SKU</label>
//           <input
//             type="text"
//             name="sku"
//             value={formData.description.sku}
//             onChange={handleDescriptionChange}
//             className="border rounded w-full py-2 px-3"
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//         >
//           Update Product
//         </button>
//       </form>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    old_price: "",
    stock: "",
    description: {
      details: "",
      size_fit: "",
      wash_care: "",
      specification: [],
      sku: ""
    }
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Verify admin and fetch product details
  useEffect(() => {
    const verifyAndFetch = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdmin(true);

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const product = res.data || {};

        setFormData({
          name: product.name || "",
          category: product.category || "",
          price: product.price ?? "",
          old_price: product.old_price ?? "",
          stock: product.stock ?? "",
          description: {
            details: product.description?.details || "",
            size_fit: product.description?.size_fit || "",
            wash_care: product.description?.wash_care || "",
            specification: product.description?.specification || [],
            sku: product.description?.sku || ""
          }
        });
      } catch (err) {
        console.error("Admin verify or fetch failed:", err);
        setError("Failed to load product or session invalid.");
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/admin/login");
        }
      } finally {
        setCheckingAdmin(false);
      }
    };

    verifyAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  // Handle simple field changes (name, category, price etc.)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle nested description changes
  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      description: { ...prev.description, [name]: value }
    }));
  };

  // Handle specification (comma-separated list)
  const handleSpecificationChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        specification: value ? value.split(",").map((item) => item.trim()) : []
      }
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoadingSubmit(true);

    const updatedData = {
      ...formData,
      description: formData.description
    };

    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/products/${id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );

      if (response.status === 200) {
        setSuccess("Product updated successfully!");
        setTimeout(() => navigate("/Admin/manageproducts"), 1500);
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      if (err.response?.data?.errors) {
        const allErrors = Object.values(err.response.data.errors).flat().join(", ");
        setError(allErrors || "Validation failed");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update product. Please try again.");
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (checkingAdmin) {
    return <p className="text-center text-yellow-500">Checking admin session...</p>;
  }
  if (!admin) return null; // navigation already triggered

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
          />
        </div>

        {/* New Price */}
        <div className="mb-4">
          <label className="block text-gray-700">New Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
          />
        </div>

        {/* Old Price */}
        <div className="mb-4">
          <label className="block text-gray-700">Old Price (Optional)</label>
          <input
            type="number"
            name="old_price"
            value={formData.old_price}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
          />
        </div>

        {/* Stock */}
        <div className="mb-4">
          <label className="block text-gray-700">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
          />
        </div>

        {/* Description - structured JSON */}
        <h3 className="text-lg font-semibold mt-6 mb-2">Product Description</h3>

        <div className="mb-4">
          <label className="block text-gray-700">Details</label>
          <textarea
            name="details"
            value={formData.description.details}
            onChange={handleDescriptionChange}
            className="border rounded w-full py-2 px-3"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Size & Fit</label>
          <input
            type="text"
            name="size_fit"
            value={formData.description.size_fit}
            onChange={handleDescriptionChange}
            className="border rounded w-full py-2 px-3"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Wash Care</label>
          <input
            type="text"
            name="wash_care"
            value={formData.description.wash_care}
            onChange={handleDescriptionChange}
            className="border rounded w-full py-2 px-3"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Specification (comma-separated)</label>
          <input
            type="text"
            name="specification"
            value={(formData.description.specification || []).join(", ")}
            onChange={handleSpecificationChange}
            className="border rounded w-full py-2 px-3"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.description.sku}
            onChange={handleDescriptionChange}
            className="border rounded w-full py-2 px-3"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
