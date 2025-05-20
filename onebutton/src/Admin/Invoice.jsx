import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function AdminInvoice() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [cart, setCart] = useState(null);
    const token = localStorage.getItem("admin_token");

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                setOrder(res.data);
                return axios.get(`${import.meta.env.VITE_API_URL}/carts/${res.data.cart_id}`);
            })
            .then(res => setCart(res.data))
            .catch(err => console.error(err));
    }, [orderId]);

  
const handleDownload = () => {
  const invoice = document.getElementById("invoiceContent");
  if (!invoice) return;

  // Clone and clean
  const clone = invoice.cloneNode(true);

  // Remove all classes
  const removeClasses = (el) => {
    el.removeAttribute("class");
    for (let child of el.children) {
      removeClasses(child);
    }
  };
  removeClasses(clone);

  // Apply basic styles
  clone.style.background = "#fff";
  clone.style.padding = "32px";
  clone.style.color = "#000";
  clone.style.fontFamily = "Arial, sans-serif";
  clone.style.width = "800px";
  clone.style.maxWidth = "100%";

  // Style headers and text
  clone.querySelectorAll("h2").forEach(h => h.style.fontSize = "20px");
  clone.querySelectorAll("h3").forEach(h => h.style.fontSize = "16px");
  clone.querySelectorAll("p, td, th").forEach(el => {
    el.style.padding = "8px";
    el.style.fontSize = "14px";
  });

  // Style table
  const table = clone.querySelector("table");
  if (table) {
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "16px";
  }

  const tableCells = clone.querySelectorAll("th, td");
  tableCells.forEach(cell => {
    cell.style.border = "1px solid #ccc";
    cell.style.textAlign = "left";
  });

  // Wrapper
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-10000px";
  container.style.left = "-10000px";
  container.appendChild(clone);
  document.body.appendChild(container);

  // Render with html2canvas
  html2canvas(clone)
    .then(canvas => {
      const link = document.createElement("a");
      link.download = "invoice.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      document.body.removeChild(container);
    })
    .catch(error => {
      console.error("Error:", error);
    });
};


    if (!order || !cart) return <p>Loading Invoice...</p>;

    return (
    <div className="p-4">
        <div id="invoiceContent" className="bg-white p-6 shadow-md rounded max-w-3xl mx-auto" style={{ color: '#000' }}>
            <h2 className="text-2xl font-bold mb-4">Order-Id #{order.id}</h2>
            <p><strong>Customer:</strong> {order.name}</p>
            <p><strong>Mobile:</strong> {order.mobile}</p>
            <p><strong>Address:</strong> {order.street1} {order.street2}, {order.city}, {order.state} - {order.pincode}</p>

            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Order Items</h3>
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 text-sm">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Product</th>
                                <th className="border p-2">Qty</th>
                                <th className="border p-2">Size</th>
                                <th className="border p-2">Price</th>
                                <th className="border p-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.items.map(item => (
                                <tr key={item.id}>
                                    <td className="border p-2">{item.product.name}</td>
                                    <td className="border p-2">{item.quantity}</td>
                                    <td className="border p-2">{item.size}</td>
                                    <td className="border p-2">₹{item.product.price}</td>
                                    <td className="border p-2">₹{item.quantity * item.product.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 text-right">
                <p><strong>Total:</strong> ₹{order.cart_total}</p>
                <p><strong>Payment Method:</strong> {order.payment_method}</p>
            </div>
        </div>

        <div className="max-w-3xl mx-auto mt-4 text-center">
            <button onClick={handleDownload} className="bg-blue-600 text-white px-4 py-2 rounded">
                Download Invoice
            </button>
        </div>
    </div>
);

}
