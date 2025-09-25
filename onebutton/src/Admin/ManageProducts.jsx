// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// export default function ProductList() {
//     const [products, setProducts] = useState([]);
//     const [filteredProducts, setFilteredProducts] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [filter, setFilter] = useState({ price: "", category: "", stock: "" });

//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     // Fetch products from backend
//     const fetchProducts = async () => {
//         try {
//             const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
//             setProducts(response.data);
//             setFilteredProducts(response.data);

//             // Extract unique categories for filter dropdown
//             const uniqueCategories = [...new Set(response.data.map(p => p.category))];
//             setCategories(uniqueCategories);
//         } catch (error) {
//             console.error("Error fetching products:", error);
//         }
//     };

//     // Handle Delete Product
//     const handleDelete = async (id) => {
//         if (window.confirm("Are you sure you want to delete this product?")) {
//             try {
//                 await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`);
//                 fetchProducts(); // Refresh after deletion
//             } catch (error) {
//                 console.error("Error deleting product:", error);
//             }
//         }
//     };

//     // Handle Filtering
//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilter({ ...filter, [name]: value });

//         let filtered = products;

//         if (name === "price" && value) {
//             filtered = filtered.filter(p => p.price <= parseFloat(value));
//         }
//         if (name === "category" && value) {
//             filtered = filtered.filter(p => p.category === value);
//         }
//         if (name === "stock" && value) {
//             filtered = filtered.filter(p => (value === "inStock" ? p.stock > 0 : p.stock === 0));
//         }

//         setFilteredProducts(filtered);
//     };

//     return (
//         <div className="container mx-auto px-4 py-6">
//             {/* Add Product Button */}
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-bold">Product List</h2>
//                 <Link to="/Admin/add-product" className="bg-blue-500 text-white px-4 py-2 rounded">+ Add Product</Link>
//             </div>

//             {/* Filters */}
//             <div className="flex space-x-4 mb-4">
//                 <select name="price" onChange={handleFilterChange} className="border p-2 rounded">
//                     <option value="">Filter by Price</option>
//                     <option value="500">Below ₹500</option>
//                     <option value="1000">Below ₹1000</option>
//                     <option value="2000">Below ₹2000</option>
//                 </select>

//                 <select name="category" onChange={handleFilterChange} className="border p-2 rounded">
//                     <option value="">Filter by Category</option>
//                     {categories.map((cat, index) => (
//                         <option key={index} value={cat}>{cat}</option>
//                     ))}
//                 </select>

//                 <select name="stock" onChange={handleFilterChange} className="border p-2 rounded">
//                     <option value="">Filter by Stock</option>
//                     <option value="inStock">In Stock</option>
//                     <option value="outStock">Out of Stock</option>
//                 </select>
//             </div>

//             {/* Product Table */}
//             <div className="overflow-x-auto">
//             <table className="w-full border-collapse border border-gray-200">
//     <thead className="bg-gray-100">
//         <tr>
//             <th className="border p-3 text-center">Image</th>
//             <th className="border p-3 text-center">Name</th>
//             <th className="border p-3 text-center">Category</th>
//             <th className="border p-3 text-center">Price</th>
//             <th className="border p-3 text-center">Stock</th>
//             <th className="border p-3 text-center">Actions</th>
//         </tr>
//     </thead>
//     <tbody>
//         {filteredProducts.length > 0 ? (
//             filteredProducts.map((product) => (
//                 <tr key={product.id} className="border">
//                     <td className="p-3 text-center">
//                         <img src={`${import.meta.env.VITE_BASE_URL}/storage/${product.image}`} 
//                              alt={product.name} className="w-16 h-16 object-cover mx-auto" />
//                     </td>
//                     <td className="p-3 text-center">{product.name}</td>
//                     <td className="p-3 text-center">{product.category}</td>
//                     <td className="p-3 text-center">₹{product.price}</td>
//                     <td className="p-3 text-center">
//                     {Object.values(product.availableSizes).reduce((total, stock) => total + stock, 0) > 0 
//                     ? `${Object.values(product.availableSizes).reduce((total, stock) => total + stock, 0)} left` 
//                     : "Out of Stock"}
//                     </td>
//                     <td className="p-3 text-center flex justify-center space-x-2">
//                         <Link to={`/Admin/edit-product/${product.id}`} 
//                               className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</Link>
//                               <Link to={`/Admin/sizecolorvariants/${product.id}`} 
//                               className="bg-zinc-500 text-white px-3 py-1 rounded">Variants</Link>
//                         <button onClick={() => handleDelete(product.id)} 
//                                 className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
//                     </td>
//                 </tr>
//             ))
//         ) : (
//             <tr>
//                 <td colSpan="6" className="text-center p-3 text-gray-500">No products found.</td>
//             </tr>
//         )}
//     </tbody>
// </table>

//             </div>
//         </div>
//     );
// }



import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filter, setFilter] = useState({ price: "", category: "", stock: "" });
    const [admin, setAdmin] = useState(null);
    const [loadingAdmin, setLoadingAdmin] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const navigate = useNavigate();

    // Verify admin token / profile
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
            } catch (err) {
                setAdmin(null);
                navigate("/admin/login");
            } finally {
                setLoadingAdmin(false);
            }
        };

        fetchAdmin();
    }, [navigate]);

    // Fetch products only after admin is verified
    useEffect(() => {
        if (!admin) return;

        fetchProducts();
    }, [admin]);

    // Fetch products from backend
    const fetchProducts = async () => {
        setLoadingProducts(true);
        const token = localStorage.getItem("admin_token");
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            // handle possibly nested response arrays like earlier example
            const data = Array.isArray(response.data) && Array.isArray(response.data[0])
                ? response.data[0]
                : response.data;

            setProducts(data);
            setFilteredProducts(data);

            const uniqueCategories = [...new Set((data || []).map(p => p.category))].filter(Boolean);
            setCategories(uniqueCategories);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoadingProducts(false);
        }
    };

    // Handle Delete Product
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        const token = localStorage.getItem("admin_token");
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            // remove locally for instant UI feedback rather than full refetch
            setProducts(prev => prev.filter(p => p.id !== id));
            setFilteredProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    // Handle Filtering
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilter = { ...filter, [name]: value };
        setFilter(newFilter);

        let filtered = products;

        if (newFilter.price) {
            const max = parseFloat(newFilter.price);
            if (!Number.isNaN(max)) filtered = filtered.filter(p => parseFloat(p.price) <= max);
        }
        if (newFilter.category) {
            filtered = filtered.filter(p => p.category === newFilter.category);
        }
        if (newFilter.stock) {
            filtered = filtered.filter(p => (newFilter.stock === "inStock" ? productInStock(p) : !productInStock(p)));
        }

        setFilteredProducts(filtered);
    };

    const productInStock = (p) => {
        // handle availableSizes possibly being object or array
        if (!p || !p.availableSizes) return false;
        const vals = typeof p.availableSizes === "object" ? Object.values(p.availableSizes) : [];
        return vals.reduce((total, stock) => total + (Number(stock) || 0), 0) > 0;
    };

    if (loadingAdmin) return <p>Checking admin session...</p>;
    if (!admin) return null; // redirect will happen; this avoids rendering before navigation

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Add Product Button */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Product List</h2>
                <Link to="/Admin/add-product" className="bg-blue-500 text-white px-4 py-2 rounded">+ Add Product</Link>
            </div>

            {/* Filters */}
            <div className="flex space-x-4 mb-4">
                <select name="price" value={filter.price} onChange={handleFilterChange} className="border p-2 rounded">
                    <option value="">Filter by Price</option>
                    <option value="500">Below ₹500</option>
                    <option value="1000">Below ₹1000</option>
                    <option value="2000">Below ₹2000</option>
                </select>

                <select name="category" value={filter.category} onChange={handleFilterChange} className="border p-2 rounded">
                    <option value="">Filter by Category</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>

                <select name="stock" value={filter.stock} onChange={handleFilterChange} className="border p-2 rounded">
                    <option value="">Filter by Stock</option>
                    <option value="inStock">In Stock</option>
                    <option value="outStock">Out of Stock</option>
                </select>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto">
                {loadingProducts ? (
                    <p>Loading products...</p>
                ) : (
                    <table className="w-full border-collapse border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-3 text-center">Image</th>
                                <th className="border p-3 text-center">Name</th>
                                <th className="border p-3 text-center">Category</th>
                                <th className="border p-3 text-center">Price</th>
                                <th className="border p-3 text-center">Stock</th>
                                <th className="border p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="border">
                                        <td className="p-3 text-center">
                                            <img
                                                src={`${import.meta.env.VITE_BASE_URL}/storage/${product.image}`}
                                                alt={product.name}
                                                className="w-16 h-16 object-cover mx-auto"
                                            />
                                        </td>
                                        <td className="p-3 text-center">{product.name}</td>
                                        <td className="p-3 text-center">{product.category}</td>
                                        <td className="p-3 text-center">₹{product.price}</td>
                                        <td className="p-3 text-center">
                                            {productInStock(product)
                                                ? `${Object.values(product.availableSizes || {}).reduce((total, stock) => total + (Number(stock) || 0), 0)} left`
                                                : "Out of Stock"}
                                        </td>
                                        <td className="p-3 text-center flex justify-center space-x-2">
                                            <Link to={`/Admin/edit-product/${product.id}`} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</Link>
                                            <Link to={`/Admin/sizecolorvariants/${product.id}`} className="bg-zinc-500 text-white px-3 py-1 rounded">Variants</Link>
                                            <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-3 text-gray-500">No products found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
