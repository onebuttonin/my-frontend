import React, { useState, useEffect } from "react";
import axios from "axios";
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
        availableColors: []
    });

    const [newSize, setNewSize] = useState("");
    const [newStock, setNewStock] = useState(0);
    const [newColor, setNewColor] = useState("#000000");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/products/${id}`)
            .then((response) => setProduct(response.data))
            .catch(() => setError("Failed to fetch product details."));
    }, [id]);

    const updateSizeStock = (size, stock) => {
        axios.put(`http://127.0.0.1:8000/api/products/${id}/update-size`, { size, stock })
            .then((response) => {
                setProduct(prev => ({ ...prev, availableSizes: response.data.availableSizes }));
                setSuccess("Size updated successfully!");
            })
            .catch(() => setError("Failed to update size."));
    };

    const addSize = () => {
        if (!newSize || newStock <= 0) return;
        axios.put(`http://127.0.0.1:8000/api/products/${id}/add-size`, { size: newSize, stock: newStock })
            .then((response) => {
                setProduct(prev => ({ ...prev, availableSizes: response.data.availableSizes }));
                setNewSize("");
                setNewStock(0);
                setSuccess("Size added successfully!");
            })
            .catch(() => setError("Failed to add size."));
    };

    const deleteSize = (size) => {
        axios.delete(`http://127.0.0.1:8000/api/products/${id}/delete-size`, { data: { size } })
            .then((response) => {
                setProduct(prev => ({ ...prev, availableSizes: response.data.availableSizes }));
                setSuccess("Size deleted successfully!");
            })
            .catch(() => setError("Failed to delete size."));
    };

    const addColor = () => {
        if (!newColor) return;
        axios.put(`http://127.0.0.1:8000/api/products/${id}/add-color`, { color: newColor })
            .then((response) => {
                setProduct(prev => ({ ...prev, availableColors: response.data.availableColors }));
                setSuccess("Color added successfully!");
            })
            .catch(() => setError("Failed to add color."));
    };

    const deleteColor = (color) => {
        axios.delete(`http://127.0.0.1:8000/api/products/${id}/delete-color`, { data: { color } })
            .then((response) => {
                setProduct(prev => ({ ...prev, availableColors: response.data.availableColors }));
                setSuccess("Color deleted successfully!");
            })
            .catch(() => setError("Failed to delete color."));
    };

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
                            {Object.entries(product.availableSizes).map(([size, stock]) => (
                                <tr key={size}>
                                    <td className="border p-2 text-center">{size}</td>
                                    <td className="border p-2 text-center">
                                        <input 
                                            type="number" 
                                            value={stock} 
                                            onChange={(e) => updateSizeStock(size, parseInt(e.target.value))} 
                                            className="border rounded w-full py-1 px-2 text-center"
                                        />
                                    </td>
                                    <td className="border p-2 text-center">
                                        <button onClick={() => deleteSize(size)} className="bg-red-500 text-white px-2 py-1 rounded">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 flex justify-center">
                        <input 
                            type="text" 
                            placeholder="Size" 
                            value={newSize} 
                            onChange={(e) => setNewSize(e.target.value)} 
                            className="border rounded px-2 py-1 mr-2 text-center"
                        />
                        <input 
                            type="number" 
                            placeholder="Stock" 
                            value={newStock} 
                            onChange={(e) => setNewStock(parseInt(e.target.value))} 
                            className="border rounded px-2 py-1 mr-2 text-center"
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
                        {product.availableColors.map((color) => (
                            <div key={color} className="flex flex-col items-center">
                                <div className="w-10 h-10 border rounded-full" style={{ backgroundColor: color }}></div>
                                <button 
                                    onClick={() => deleteColor(color)} 
                                    className="bg-red-500 text-white px-2 py-1 mt-2 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
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
