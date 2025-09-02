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
        old_price: "",   // ✅ added old price
        stock: "",
        description: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch product details
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`)
            .then((response) => {
                const product = response.data;
                setFormData({
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    old_price: product.old_price || "", // ✅ prefill old price
                    stock: product.stock || "",
                    description: product.description || ""
                });
            })
            .catch(() => setError("Failed to fetch product details."));
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const updatedData = {};

        // Append only fields that are modified
        Object.keys(formData).forEach(key => {
            if (formData[key] !== "") {
                updatedData[key] = formData[key];
            }
        });

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/products/${id}`, 
                updatedData, 
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 200) {
                setSuccess("Product updated successfully!");
                setTimeout(() => navigate("/Admin/manageproducts"), 1500);
            }
        } catch {
            setError("Failed to update product. Please try again.");
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {/* Name */}
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="border rounded w-full py-2 px-3" />
                </div>

                {/* Category */}
                <div className="mb-4">
                    <label className="block text-gray-700">Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} className="border rounded w-full py-2 px-3" />
                </div>

                {/* New Price */}
                <div className="mb-4">
                    <label className="block text-gray-700">New Price</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="border rounded w-full py-2 px-3" />
                </div>

                {/* Old Price */}
                <div className="mb-4">
                    <label className="block text-gray-700">Old Price (Optional)</label>
                    <input type="number" name="old_price" value={formData.old_price} onChange={handleChange} className="border rounded w-full py-2 px-3" />
                </div>

                {/* Stock */}
                <div className="mb-4">
                    <label className="block text-gray-700">Stock</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="border rounded w-full py-2 px-3" />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="border rounded w-full py-2 px-3"></textarea>
                </div>

                {/* Submit Button */}
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Update Product
                </button>
            </form>
        </div>
    );
}
