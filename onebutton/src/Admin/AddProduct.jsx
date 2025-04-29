// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function AddProduct() {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         name: "",
//         category: "",
//         price: "",
//         stock: "",
//         availableSizes: {},
//         availableColors: [],
//     });

//     const [image, setImage] = useState(null);
//     const [hoverImage, setHoverImage] = useState(null);
//     const [thumbnailImages, setThumbnailImages] = useState([]);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSizeChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             availableSizes: { ...prev.availableSizes, [name]: parseInt(value) },
//         }));
//     };

//     const handleColorChange = (e) => {
//         const colors = e.target.value.split(",").map((color) => color.trim());
//         setFormData({ ...formData, availableColors: colors });
//     };

//     const handleImageChange = (e) => setImage(e.target.files[0]);
//     const handleHoverImageChange = (e) => setHoverImage(e.target.files[0]);
//     const handleThumbnailChange = (e) => setThumbnailImages([...e.target.files]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setSuccess("");
    
//         const formDataToSend = new FormData();
//         formDataToSend.append("name", formData.name);
//         formDataToSend.append("category", formData.category);
//         formDataToSend.append("price", formData.price);
//         formDataToSend.append("stock", formData.stock);
//         formDataToSend.append("image", image);
//         formDataToSend.append("hover_image", hoverImage);
        
//         thumbnailImages.forEach((file) => formDataToSend.append("thumbnail_images[]", file));
    
//         formDataToSend.append("availableSizes", JSON.stringify(formData.availableSizes));
//         formDataToSend.append("availableColors", JSON.stringify(formData.availableColors));
    
//         try {
//             const response = await axios.post("http://127.0.0.1:8000/api/add-products", formDataToSend, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
    
//             console.log("Response:", response);
    
//             if (response.status === 201) {
//                 setSuccess("Product added successfully!");
//                 // setTimeout(() => navigate("//"), 1500);
//             }
//         } catch (error) {
//             console.error("Error:", error.response?.data);
//             setError("Failed to add product. Please check input fields.");
//         }
//     };
    

//     return (
//         <div className="container mx-auto px-4 py-6">
//             <h2 className="text-2xl font-bold mb-4">Add Product</h2>

//             {error && <p className="text-red-500">{error}</p>}
//             {success && <p className="text-green-500">{success}</p>}

//             <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
//                     <input type="text" name="name" value={formData.name} onChange={handleChange} required className="border rounded w-full py-2 px-3" />
//                 </div>

//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
//                     <input type="text" name="category" value={formData.category} onChange={handleChange} required className="border rounded w-full py-2 px-3" />
//                 </div>

//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
//                     <input type="number" name="price" value={formData.price} onChange={handleChange} required className="border rounded w-full py-2 px-3" />
//                 </div>

//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Stock</label>
//                     <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="border rounded w-full py-2 px-3" />
//                 </div>

//                 {/* Available Sizes */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Available Sizes (Enter stock for each size)</label>
//                     <div className="grid grid-cols-3 gap-2">
//                         {["s", "m", "l", "xl", "xxl"].map((size) => (
//                             <div key={size}>
//                                 <label className="text-sm">{size.toUpperCase()}</label>
//                                 <input type="number" name={size} onChange={handleSizeChange} className="border rounded w-full py-1 px-2" />
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Available Colors */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Available Colors (Comma-separated hex codes)</label>
//                     <input type="text" onChange={handleColorChange} placeholder="#000000, #FF0000" className="border rounded w-full py-2 px-3" />
//                 </div>

//                 {/* Image Uploads */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Main Image</label>
//                     <input type="file" accept="image/*" onChange={handleImageChange} required className="border rounded w-full py-2 px-3" />
//                 </div>

//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Hover Image</label>
//                     <input type="file" accept="image/*" onChange={handleHoverImageChange} required className="border rounded w-full py-2 px-3" />
//                 </div>

//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Thumbnail Images (Select multiple)</label>
//                     <input type="file" accept="image/*" multiple onChange={handleThumbnailChange} required className="border rounded w-full py-2 px-3" />
//                 </div>

//                 <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
//                     Add Product
//                 </button>
//             </form>
//         </div>
//     );
// }


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        stock: "",
        availableSizes: { s: 0, m: 0, l: 0, xl: 0, xxl: 0 }, // ✅ Default all sizes to 0
        availableColors: [],
    });

    const [image, setImage] = useState(null);
    const [hoverImage, setHoverImage] = useState(null);
    const [thumbnailImages, setThumbnailImages] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false); // ✅ Added loading state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSizeChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            availableSizes: { ...prev.availableSizes, [name]: parseInt(value) || 0 }, // ✅ Ensure it's an integer
        }));
    };

    const handleColorChange = (e) => {
        const colors = e.target.value.split(",").map((color) => color.trim());
        setFormData({ ...formData, availableColors: colors });
    };

    const handleImageChange = (e) => setImage(e.target.files[0]);
    const handleHoverImageChange = (e) => setHoverImage(e.target.files[0]);
    const handleThumbnailChange = (e) => setThumbnailImages([...e.target.files]);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setError("");
    //     setSuccess("");
    //     setLoading(true); // ✅ Disable form submission
    
    //     const formDataToSend = new FormData();
    //     formDataToSend.append("name", formData.name);
    //     formDataToSend.append("category", formData.category);
    //     formDataToSend.append("price", formData.price);
    //     formDataToSend.append("stock", formData.stock);
    //     formDataToSend.append("image", image);
    //     formDataToSend.append("hover_image", hoverImage);
    
    //     // ✅ Append each thumbnail image correctly
    //     thumbnailImages.forEach((file) => {
    //         formDataToSend.append("thumbnail_images[]", file);
    //     });

    //     // ✅ Send `availableSizes` as a JSON string
    //     formDataToSend.append("availableSizes", JSON.stringify(formData.availableSizes));

    //     // ✅ Fix `availableColors` (Send as JSON string)
    //     formDataToSend.append("availableColors", JSON.stringify(formData.availableColors));
    
    //     try {
    //         const response = await axios.post("http://127.0.0.1:8000/api/add-products", formDataToSend, {
    //             headers: { "Content-Type": "multipart/form-data" },
    //         });
    
    //         if (response.status === 201) {
    //             setSuccess("Product added successfully!");
    //             setTimeout(() => navigate("/Admin/Dashboard"), 1500); // ✅ Redirect after success
    //         }
    //     } catch (error) {
    //         console.error("Error:", error.response?.data);
    //         setError(error.response?.data.errors || "Failed to add product. Please check input fields.");
    //     } finally {
    //         setLoading(false); // ✅ Enable form submission again
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
    
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("stock", formData.stock);
        formDataToSend.append("image", image);
        formDataToSend.append("hover_image", hoverImage);
    
        // Append each thumbnail
        thumbnailImages.forEach((file) => {
            formDataToSend.append("thumbnail_images[]", file);
        });
    
        // ✅ Append availableSizes properly
        Object.entries(formData.availableSizes).forEach(([size, value]) => {
            formDataToSend.append(`availableSizes[${size}]`, value);
        });
    
        // ✅ Append availableColors properly
        formData.availableColors.forEach((color, index) => {
            formDataToSend.append(`availableColors[${index}]`, color);
        });
    
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/add-products`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            if (response.status === 201) {
                setSuccess("Product added successfully!");
                setTimeout(() => navigate("/Admin/Dashboard"), 1500);
            }
        } catch (error) {
            console.error("Error:", error.response?.data);
            setError(error.response?.data.errors || "Failed to add product. Please check input fields.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-4">Add Product</h2>

            {error && <p className="text-red-500">{typeof error === "string" ? error : Object.values(error).flat().join(", ")}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="border rounded w-full py-2 px-3" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} required className="border rounded w-full py-2 px-3" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required className="border rounded w-full py-2 px-3" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Stock</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="border rounded w-full py-2 px-3" />
                </div>

                {/* Available Sizes */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Available Sizes (Enter stock for each size)</label>
                    <div className="grid grid-cols-3 gap-2">
                        {["s", "m", "l", "xl", "xxl"].map((size) => (
                            <div key={size}>
                                <label className="text-sm">{size.toUpperCase()}</label>
                                <input type="number" name={size} onChange={handleSizeChange} className="border rounded w-full py-1 px-2" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Available Colors */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Available Colors (Comma-separated hex codes)</label>
                    <input type="text" onChange={handleColorChange} placeholder="#000000, #FF0000" className="border rounded w-full py-2 px-3" />
                </div>

                {/* Image Uploads */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Main Image</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} required className="border rounded w-full py-2 px-3" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Hover Image</label>
                    <input type="file" accept="image/*" onChange={handleHoverImageChange} required className="border rounded w-full py-2 px-3" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Thumbnail Images (Select multiple)</label>
                    <input type="file" accept="image/*" multiple onChange={handleThumbnailChange} required className="border rounded w-full py-2 px-3" />
                </div>

                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" disabled={loading}>
                    {loading ? "Adding..." : "Add Product"}
                </button>
            </form>
        </div>
    );
}
