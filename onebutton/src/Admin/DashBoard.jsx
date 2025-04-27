import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    return (
      <div>
        <h1 className="text-center text-3xl mt-10 mb-10 font-bold">Admin DashBoard</h1>
        <button onClick={() => navigate('/Admin/Login')} className="bg-red-500 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded">
            Profile</button>
        <div className="flex flex-col items-center justify-center border-2 mb-5">
            {/* Products Header */}
            <h2 className="text-2xl font-bold mb-6 mt-10">Products</h2>

            {/* Buttons Container */}
            <div className="flex space-x-4 mb-15">
                <button className="bg-neutral-500 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded"
                 onClick={() => navigate('/Admin/add-product')} >
                    Add Product
                </button>
                <button className="bg-neutral-500 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate('/Admin/manageproducts')}>
                    All Products
                </button>
                <button className="bg-neutral-500 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate('/Admin/Dashboard')}>
                    Update Stock
                </button>
                <button className="bg-neutral-500 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate('/Admin/Dashboard')}>
                    Delete Product
                </button>
            </div>
        </div>
        <div className="flex flex-col items-center justify-center border-2 ">
            {/* Products Header */}
            <h2 className="text-2xl font-bold mb-6 mt-10">Orders</h2>

            {/* Buttons Container */}
            <div className="flex space-x-4 mb-15">
                <button className="bg-neutral-500 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate('/Admin/AllOrders')}>
                    All Orders
                </button>
                <button className="bg-neutral-500 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate('/Admin/Coupons')}>
                    Coupons
                </button>
                <button className="bg-neutral-500 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded">
                    Update Stock
                </button>
                <button className="bg-neutral-500 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded">
                    Delete Product
                </button>
            </div>
        </div>
        <div className="flex flex-col items-center justify-center border-2 ">
            {/* Products Header */}
            <h2 className="text-2xl font-bold mb-6 mt-10">Users</h2>

            {/* Buttons Container */}
            <div className="flex space-x-4 mb-15">
                <button className="bg-neutral-500 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate('/Admin/AllUsers')}>
                    All Users
                </button>
                <button className="bg-neutral-500 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate('/Admin/Dashboard')}>
                   Nill
                </button>
                <button className="bg-neutral-500 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded">
                    Nill
                </button>
                <button className="bg-neutral-500 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded">
                    Nill
                </button>
            </div>
        </div>
      </div>
    );
}
