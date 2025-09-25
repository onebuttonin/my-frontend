// // Dashboard.jsx
// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import { Bar, Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// // register chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// function formatDateKey(d) {
//   // returns YYYY-MM-DD for given Date
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// }

// function parseOrderDate(order) {
//   // Try multiple common fields; fallback to null
//   const raw = order.created_at || order.createdAt || order.order_date || order.date || order.created || order.updated_at;
//   if (!raw) return null;
//   const dt = new Date(raw);
//   if (isNaN(dt)) {
//     // sometimes API returns timestamp number or iso string; try coercion
//     try {
//       return new Date(Number(raw));
//     } catch {
//       return null;
//     }
//   }
//   return dt;
// }

// function startOfWeek(date) {
//   // Monday as start of week
//   const d = new Date(date);
//   const day = d.getDay(); // 0 (Sun) - 6 (Sat)
//   // calculate days to Monday
//   const diff = (day === 0 ? -6 : 1 - day);
//   const monday = new Date(d);
//   monday.setDate(d.getDate() + diff);
//   monday.setHours(0, 0, 0, 0);
//   return monday;
// }

// function getDaysInMonth(year, monthIndex) {
//   // monthIndex: 0-11
//   return new Date(year, monthIndex + 1, 0).getDate();
// }

// export default function Dashboard() {
//   const [orders, setOrders] = useState([]);
//   const [cartDetails, setCartDetails] = useState({}); // map cart_id -> cart data
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // filter UI
//   const [view, setView] = useState("Month"); // "Day" | "Week" | "Month"
//   const today = new Date();
//   const [selectedDate, setSelectedDate] = useState(() => formatDateKey(today)); // YYYY-MM-DD for Day & Week
//   const [selectedMonth, setSelectedMonth] = useState(() => {
//     // format YYYY-MM for <input type="month">
//     const y = today.getFullYear();
//     const m = String(today.getMonth() + 1).padStart(2, "0");
//     return `${y}-${m}`;
//   });

//   const token = localStorage.getItem("admin_token");

//   useEffect(() => {
//     setLoading(true);
//     axios
//       .get(`${import.meta.env.VITE_API_URL}/adminallorders`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         setOrders(res.data || []);
//         // prefetch cart details for orders that have cart_id
//         fetchCartDetails(res.data || []);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch orders:", err);
//         setError("Failed to load orders.");
//       })
//       .finally(() => setLoading(false));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const fetchCartDetails = (ordersData) => {
//     if (!ordersData || !Array.isArray(ordersData)) return;
//     ordersData.forEach((order) => {
//       if (!order.cart_id) return;
//       // only fetch if not already present
//       if (cartDetails[order.cart_id]) return;
//       axios
//         .get(`${import.meta.env.VITE_API_URL}/carts/${order.cart_id}`)
//         .then((res) => {
//           setCartDetails((prev) => ({ ...prev, [order.cart_id]: res.data }));
//         })
//         .catch((err) => {
//           console.warn("Failed to fetch cart", order.cart_id, err);
//         });
//     });
//   };

//   // Helper: compute numeric order total reliably
//   const getOrderTotal = (order) => {
//     // prefer order.cart_total if valid
//     if (order.cart_total !== undefined && order.cart_total !== null && order.cart_total !== "") {
//       const n = parseFloat(order.cart_total);
//       if (!isNaN(n)) return n;
//     }

//     // fallback to cartDetails sum
//     const cart = cartDetails[order.cart_id];
//     if (cart && Array.isArray(cart.items)) {
//       let sum = 0;
//       cart.items.forEach((it) => {
//         const price = parseFloat(it.product?.price ?? it.price ?? 0) || 0;
//         const qty = parseInt(it.quantity ?? 0) || 0;
//         sum += price * qty;
//       });
//       return sum;
//     }

//     return 0;
//   };

//   // Filter delivered orders only
//   const deliveredOrders = useMemo(() => {
//     return orders.filter((o) => {
//       // Accept order_status exactly "Delivered" (case sensitive as in your code)
//       // Be tolerant: allow lowercase variations
//       const s = (o.order_status || "").toString().trim().toLowerCase();
//       return s === "delivered";
//     });
//   }, [orders]);

//   // Aggregations for charts depending on view
//   const { labels, dataPoints, totalSales, orderCount, avgOrder } = useMemo(() => {
//     if (loading) return { labels: [], dataPoints: [], totalSales: 0, orderCount: 0, avgOrder: 0 };

//     if (view === "Day") {
//       const dateParts = selectedDate.split("-");
//       const year = Number(dateParts[0]);
//       const month = Number(dateParts[1]) - 1;
//       const day = Number(dateParts[2]);
//       const target = new Date(year, month, day);

//       // initialize 24 hours
//       const hours = Array.from({ length: 24 }, (_, i) => i);
//       const map = hours.map(() => 0);

//       let count = 0;
//       deliveredOrders.forEach((order) => {
//         const d = parseOrderDate(order);
//         if (!d) return;
//         if (d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth() && d.getDate() === target.getDate()) {
//           const total = getOrderTotal(order);
//           map[d.getHours()] += total;
//           count += 1;
//         }
//       });

//       const totalSalesVal = map.reduce((a, b) => a + b, 0);
//       const avg = count > 0 ? totalSalesVal / count : 0;

//       return {
//         labels: hours.map((h) => `${String(h).padStart(2, "0")}:00`),
//         dataPoints: map,
//         totalSales: totalSalesVal,
//         orderCount: count,
//         avgOrder: avg,
//       };
//     }

//     if (view === "Week") {
//       const dateParts = selectedDate.split("-");
//       const year = Number(dateParts[0]);
//       const month = Number(dateParts[1]) - 1;
//       const day = Number(dateParts[2]);
//       const anyDate = new Date(year, month, day);
//       const monday = startOfWeek(anyDate);
//       // build 7-day labels Mon..Sun
//       const labelsArr = [];
//       const map = new Array(7).fill(0);
//       let count = 0;

//       for (let i = 0; i < 7; i++) {
//         const d = new Date(monday);
//         d.setDate(monday.getDate() + i);
//         labelsArr.push(formatDateKey(d)); // YYYY-MM-DD
//       }

//       deliveredOrders.forEach((order) => {
//         const d = parseOrderDate(order);
//         if (!d) return;
//         const key = formatDateKey(d);
//         const idx = labelsArr.indexOf(key);
//         if (idx >= 0) {
//           const total = getOrderTotal(order);
//           map[idx] += total;
//           count += 1;
//         }
//       });

//       const totalSalesVal = map.reduce((a, b) => a + b, 0);
//       const avg = count > 0 ? totalSalesVal / count : 0;

//       // human-readable labels (day names)
//       const weekdayLabels = labelsArr.map((k) => {
//         const d = new Date(k);
//         return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
//       });

//       return {
//         labels: weekdayLabels,
//         dataPoints: map,
//         totalSales: totalSalesVal,
//         orderCount: count,
//         avgOrder: avg,
//       };
//     }

//     // Month view
//     if (view === "Month") {
//       // selectedMonth like "2025-09"
//       const [yStr, mStr] = selectedMonth.split("-");
//       const y = Number(yStr);
//       const mIndex = Number(mStr) - 1;
//       const daysInMonth = getDaysInMonth(y, mIndex);
//       const labelsArr = [];
//       const map = new Array(daysInMonth).fill(0);
//       let count = 0;

//       for (let d = 1; d <= daysInMonth; d++) {
//         const dateKey = `${y}-${String(mIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
//         labelsArr.push(dateKey);
//       }

//       deliveredOrders.forEach((order) => {
//         const d = parseOrderDate(order);
//         if (!d) return;
//         if (d.getFullYear() === y && d.getMonth() === mIndex) {
//           const dayIndex = d.getDate() - 1;
//           const total = getOrderTotal(order);
//           map[dayIndex] += total;
//           count += 1;
//         }
//       });

//       const totalSalesVal = map.reduce((a, b) => a + b, 0);
//       const avg = count > 0 ? totalSalesVal / count : 0;

//       // pretty labels: 1,2,3... or '1 Sep' etc
//       const prettyLabels = labelsArr.map((k) => {
//         const d = new Date(k);
//         return String(d.getDate());
//       });

//       return {
//         labels: prettyLabels,
//         dataPoints: map,
//         totalSales: totalSalesVal,
//         orderCount: count,
//         avgOrder: avg,
//       };
//     }

//     return { labels: [], dataPoints: [], totalSales: 0, orderCount: 0, avgOrder: 0 };
//   }, [view, selectedDate, selectedMonth, deliveredOrders, cartDetails, loading]);

//   // Chart data objects
//   const chartData = {
//     labels,
//     datasets: [
//       {
//         label: "Sales (₹)",
//         data: dataPoints,
//         tension: 0.3,
//         fill: false,
//         borderWidth: 2,
//         borderColor: "rgba(34,197,94,0.9)",
//         backgroundColor: "rgba(34,197,94,0.6)",
//       },
//     ],
//   };

//   const barOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       tooltip: { callbacks: { label: (ctx) => `₹ ${Number(ctx.parsed.y || ctx.parsed).toFixed(2)}` } },
//       title: { display: false },
//     },
//     scales: {
//       y: { beginAtZero: true, ticks: { callback: (val) => `₹${val}` } },
//     },
//   };

//   const lineOptions = { ...barOptions, elements: { point: { radius: 3 } } };

//   // UI helpers: quick-select handlers
//   const setThisMonth = () => {
//     const d = new Date();
//     setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
//     setView("Month");
//   };
//   const setThisWeek = () => {
//     const d = new Date();
//     setSelectedDate(formatDateKey(d));
//     setView("Week");
//   };
//   const setToday = () => {
//     const d = new Date();
//     setSelectedDate(formatDateKey(d));
//     setView("Day");
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Sales Dashboard</h1>
//         <div className="flex gap-2">
//           <button onClick={setToday} className="px-3 py-1 bg-gray-200 rounded">Today</button>
//           <button onClick={setThisWeek} className="px-3 py-1 bg-gray-200 rounded">This Week</button>
//           <button onClick={setThisMonth} className="px-3 py-1 bg-gray-200 rounded">This Month</button>
//         </div>
//       </div>

//       <div className="bg-white p-4 rounded shadow mb-4">
//         {/* View selector */}
//         <div className="flex items-center gap-4 mb-4">
//           <div className="flex items-center gap-2">
//             <label className="font-medium">View:</label>
//             <select
//               value={view}
//               onChange={(e) => setView(e.target.value)}
//               className="border p-2 rounded"
//             >
//               <option value="Day">Day</option>
//               <option value="Week">Week</option>
//               <option value="Month">Month</option>
//             </select>
//           </div>

//           {view === "Day" && (
//             <div>
//               <input
//                 type="date"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//                 className="border p-2 rounded"
//               />
//             </div>
//           )}

//           {view === "Week" && (
//             <div>
//               {/* pick any date inside week */}
//               <input
//                 type="date"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//                 className="border p-2 rounded"
//               />
//               <div className="text-sm text-gray-500 mt-1">Week shown will start on Monday.</div>
//             </div>
//           )}

//           {view === "Month" && (
//             <div>
//               <input
//                 type="month"
//                 value={selectedMonth}
//                 onChange={(e) => setSelectedMonth(e.target.value)}
//                 className="border p-2 rounded"
//               />
//             </div>
//           )}
//         </div>

//         {/* summary cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//           <div className="p-4 bg-gray-50 rounded">
//             <div className="text-sm text-gray-500">Total Sales</div>
//             <div className="text-2xl font-bold">₹{Number(totalSales || 0).toFixed(2)}</div>
//           </div>
//           <div className="p-4 bg-gray-50 rounded">
//             <div className="text-sm text-gray-500">Orders Count</div>
//             <div className="text-2xl font-bold">{orderCount}</div>
//           </div>
//           <div className="p-4 bg-gray-50 rounded">
//             <div className="text-sm text-gray-500">Average Order</div>
//             <div className="text-2xl font-bold">₹{Number(avgOrder || 0).toFixed(2)}</div>
//           </div>
//         </div>

//         {/* Chart area */}
//         <div className="bg-white p-4 rounded">
//           {loading ? (
//             <div className="text-center py-8">Loading...</div>
//           ) : error ? (
//             <div className="text-red-500 py-4">{error}</div>
//           ) : (
//             <>
//               <div className="mb-4">
//                 <h3 className="font-semibold">
//                   {view} Sales Chart
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   Only orders with status <strong>Delivered</strong> are counted.
//                 </p>
//               </div>

//               <div className="w-full">
//                 {/* use line for Day, bar for Week/Month */}
//                 {view === "Day" ? (
//                   <Line data={chartData} options={lineOptions} />
//                 ) : (
//                   <Bar data={chartData} options={barOptions} />
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// Dashboard.jsx
// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import { Bar, Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// // register chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// function formatDateKey(d) {
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// }

// function parseOrderDate(order) {
//   const raw = order.created_at || order.createdAt || order.order_date || order.date || order.created || order.updated_at;
//   if (!raw) return null;
//   const dt = new Date(raw);
//   if (isNaN(dt)) {
//     try {
//       return new Date(Number(raw));
//     } catch {
//       return null;
//     }
//   }
//   return dt;
// }

// function startOfWeek(date) {
//   const d = new Date(date);
//   const day = d.getDay();
//   const diff = (day === 0 ? -6 : 1 - day);
//   const monday = new Date(d);
//   monday.setDate(d.getDate() + diff);
//   monday.setHours(0, 0, 0, 0);
//   return monday;
// }

// function getDaysInMonth(year, monthIndex) {
//   return new Date(year, monthIndex + 1, 0).getDate();
// }

// export default function Dashboard() {
//   const [orders, setOrders] = useState([]);
//   const [cartDetails, setCartDetails] = useState({}); // map cart_id -> cart data
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // filter UI
//   const [view, setView] = useState("Month"); // "Day" | "Week" | "Month"
//   const today = new Date();
//   const [selectedDate, setSelectedDate] = useState(() => formatDateKey(today));
//   const [selectedMonth, setSelectedMonth] = useState(() => {
//     const y = today.getFullYear();
//     const m = String(today.getMonth() + 1).padStart(2, "0");
//     return `${y}-${m}`;
//   });

//   const token = localStorage.getItem("admin_token");

//   useEffect(() => {
//     setLoading(true);
//     axios
//       .get(`${import.meta.env.VITE_API_URL}/adminallorders`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         setOrders(res.data || []);
//         fetchCartDetails(res.data || []);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch orders:", err);
//         setError("Failed to load orders.");
//       })
//       .finally(() => setLoading(false));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const fetchCartDetails = (ordersData) => {
//     if (!ordersData || !Array.isArray(ordersData)) return;
//     ordersData.forEach((order) => {
//       if (!order.cart_id) return;
//       if (cartDetails[order.cart_id]) return;
//       axios
//         .get(`${import.meta.env.VITE_API_URL}/carts/${order.cart_id}`)
//         .then((res) => {
//           setCartDetails((prev) => ({ ...prev, [order.cart_id]: res.data }));
//         })
//         .catch((err) => {
//           console.warn("Failed to fetch cart", order.cart_id, err);
//         });
//     });
//   };

//   // Helper: compute numeric order total reliably
//   const getOrderTotal = (order) => {
//     if (order.cart_total !== undefined && order.cart_total !== null && order.cart_total !== "") {
//       const n = parseFloat(order.cart_total);
//       if (!isNaN(n)) return n;
//     }

//     const cart = cartDetails[order.cart_id];
//     if (cart && Array.isArray(cart.items)) {
//       let sum = 0;
//       cart.items.forEach((it) => {
//         const price = parseFloat(it.product?.price ?? it.price ?? 0) || 0;
//         const qty = parseInt(it.quantity ?? 0) || 0;
//         sum += price * qty;
//       });
//       return sum;
//     }

//     return 0;
//   };

//   // Helper: compute items cost sum (sum of cost_price * qty)
//   const getOrderItemsCost = (order) => {
//     // Prefer stored items_cost_sum or items_snapshot in order
//     if (order.items_cost_sum !== undefined && order.items_cost_sum !== null && order.items_cost_sum !== "") {
//       const n = parseFloat(order.items_cost_sum);
//       if (!isNaN(n)) return n;
//     }

//     // if items_snapshot JSON exists, parse and compute
//     if (order.items_snapshot) {
//       try {
//         const snapshot = typeof order.items_snapshot === "string" ? JSON.parse(order.items_snapshot) : order.items_snapshot;
//         if (Array.isArray(snapshot)) {
//           return snapshot.reduce((acc, it) => {
//             const cp = parseFloat(it.cost_price ?? 0) || 0;
//             const qty = parseInt(it.quantity ?? 0) || 0;
//             return acc + cp * qty;
//           }, 0);
//         }
//       } catch (e) {
//         // fallthrough to cartDetails
//       }
//     }

//     // fallback: use cartDetails and product.cost_price if available
//     const cart = cartDetails[order.cart_id];
//     if (cart && Array.isArray(cart.items)) {
//       return cart.items.reduce((acc, it) => {
//         const cp = parseFloat(it.product?.cost_price ?? it.cost_price ?? 0) || 0;
//         const qty = parseInt(it.quantity ?? 0) || 0;
//         return acc + cp * qty;
//       }, 0);
//     }

//     return 0;
//   };

//   // Helper: compute delivery, packaging, gateway fee (defaults applied)
//   const computeOrderFinancialsFallback = (order) => {
//     // Defaults
//     const DEFAULT_DELIVERY = 100.0;
//     const PACKAGING_PER_UNIT = 15.0;
//     const GATEWAY_PERCENT = 0.02; // 2%

//     // delivery
//     let delivery = 0;
//     if (order.delivery_charges !== undefined && order.delivery_charges !== null && order.delivery_charges !== "") {
//       delivery = parseFloat(order.delivery_charges) || 0;
//     } else {
//       delivery = DEFAULT_DELIVERY;
//     }

//     // packaging: prefer stored packaging_cost, else compute from qty
//     let packaging = 0;
//     if (order.packaging_cost !== undefined && order.packaging_cost !== null && order.packaging_cost !== "") {
//       packaging = parseFloat(order.packaging_cost) || 0;
//     } else {
//       // compute total qty from snapshot or cart
//       let totalQty = 0;
//       if (order.items_snapshot) {
//         try {
//           const snapshot = typeof order.items_snapshot === "string" ? JSON.parse(order.items_snapshot) : order.items_snapshot;
//           if (Array.isArray(snapshot)) totalQty = snapshot.reduce((s, it) => s + (parseInt(it.quantity ?? 0) || 0), 0);
//         } catch {}
//       }
//       if (totalQty === 0) {
//         const cart = cartDetails[order.cart_id];
//         if (cart && Array.isArray(cart.items)) {
//           totalQty = cart.items.reduce((s, it) => s + (parseInt(it.quantity ?? 0) || 0), 0);
//         }
//       }
//       packaging = PACKAGING_PER_UNIT * totalQty;
//     }

//     // gateway fee: prefer stored, else if prepaid compute 2% of cart_total, else 0
//     let gateway = 0;
//     if (order.payment_gateway_fee !== undefined && order.payment_gateway_fee !== null && order.payment_gateway_fee !== "") {
//       gateway = parseFloat(order.payment_gateway_fee) || 0;
//     } else {
//       const pm = (order.payment_method || "").toString().toLowerCase();
//       const isPrepaid = pm && pm !== "cod";
//       if (isPrepaid) {
//         gateway = (parseFloat(order.cart_total) || 0) * GATEWAY_PERCENT;
//       } else {
//         gateway = 0;
//       }
//     }

//     // items cost
//     const itemsCost = getOrderItemsCost(order);

//     const totalExpense = Number((itemsCost + delivery + packaging + gateway).toFixed(2));
//     const profit = Number(((parseFloat(order.cart_total) || 0) - totalExpense).toFixed(2));

//     return { itemsCost, delivery, packaging, gateway, totalExpense, profit };
//   };

//   // Filter delivered orders only
//   const deliveredOrders = useMemo(() => {
//     return orders.filter((o) => {
//       const s = (o.order_status || "").toString().trim().toLowerCase();
//       return s === "delivered";
//     });
//   }, [orders]);

//   // Aggregations for charts depending on view — now returns sales, expenses, profit arrays
//   const { labels, salesData, expensesData, profitData, totalSales, totalExpenses, totalProfit, orderCount, avgOrder } = useMemo(() => {
//     if (loading) return { labels: [], salesData: [], expensesData: [], profitData: [], totalSales: 0, totalExpenses: 0, totalProfit: 0, orderCount: 0, avgOrder: 0 };

//     // helper to init arrays
//     if (view === "Day") {
//       const dateParts = selectedDate.split("-");
//       const year = Number(dateParts[0]);
//       const month = Number(dateParts[1]) - 1;
//       const day = Number(dateParts[2]);
//       const target = new Date(year, month, day);

//       const hours = Array.from({ length: 24 }, (_, i) => i);
//       const sales = hours.map(() => 0);
//       const expenses = hours.map(() => 0);
//       const profits = hours.map(() => 0);

//       let count = 0;
//       deliveredOrders.forEach((order) => {
//         const d = parseOrderDate(order);
//         if (!d) return;
//         if (d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth() && d.getDate() === target.getDate()) {
//           const h = d.getHours();
//           const sale = getOrderTotal(order);
//           // compute expense/profit: prefer stored fields
//           let expense = 0;
//           let profit = 0;
//           if (order.total_expense !== undefined && order.total_expense !== null && order.total_expense !== "") {
//             expense = parseFloat(order.total_expense) || 0;
//             profit = parseFloat(order.net_profit) || (sale - expense);
//           } else {
//             const fin = computeOrderFinancialsFallback(order);
//             expense = fin.totalExpense;
//             profit = fin.profit;
//           }

//           sales[h] += sale;
//           expenses[h] += expense;
//           profits[h] += profit;
//           count += 1;
//         }
//       });

//       const totalSalesVal = sales.reduce((a, b) => a + b, 0);
//       const totalExpensesVal = expenses.reduce((a, b) => a + b, 0);
//       const totalProfitVal = profits.reduce((a, b) => a + b, 0);
//       const avg = count > 0 ? totalSalesVal / count : 0;

//       return {
//         labels: hours.map((h) => `${String(h).padStart(2, "0")}:00`),
//         salesData: sales,
//         expensesData: expenses,
//         profitData: profits,
//         totalSales: totalSalesVal,
//         totalExpenses: totalExpensesVal,
//         totalProfit: totalProfitVal,
//         orderCount: count,
//         avgOrder: avg,
//       };
//     }

//     if (view === "Week") {
//       const dateParts = selectedDate.split("-");
//       const year = Number(dateParts[0]);
//       const month = Number(dateParts[1]) - 1;
//       const day = Number(dateParts[2]);
//       const anyDate = new Date(year, month, day);
//       const monday = startOfWeek(anyDate);

//       const labelsArr = [];
//       const sales = new Array(7).fill(0);
//       const expenses = new Array(7).fill(0);
//       const profits = new Array(7).fill(0);
//       let count = 0;

//       for (let i = 0; i < 7; i++) {
//         const d = new Date(monday);
//         d.setDate(monday.getDate() + i);
//         labelsArr.push(formatDateKey(d));
//       }

//       deliveredOrders.forEach((order) => {
//         const d = parseOrderDate(order);
//         if (!d) return;
//         const key = formatDateKey(d);
//         const idx = labelsArr.indexOf(key);
//         if (idx >= 0) {
//           const sale = getOrderTotal(order);

//           let expense = 0;
//           let profit = 0;
//           if (order.total_expense !== undefined && order.total_expense !== null && order.total_expense !== "") {
//             expense = parseFloat(order.total_expense) || 0;
//             profit = parseFloat(order.net_profit) || (sale - expense);
//           } else {
//             const fin = computeOrderFinancialsFallback(order);
//             expense = fin.totalExpense;
//             profit = fin.profit;
//           }

//           sales[idx] += sale;
//           expenses[idx] += expense;
//           profits[idx] += profit;
//           count += 1;
//         }
//       });

//       const totalSalesVal = sales.reduce((a, b) => a + b, 0);
//       const totalExpensesVal = expenses.reduce((a, b) => a + b, 0);
//       const totalProfitVal = profits.reduce((a, b) => a + b, 0);
//       const weekdayLabels = labelsArr.map((k) => {
//         const d = new Date(k);
//         return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
//       });
//       const avg = count > 0 ? totalSalesVal / count : 0;

//       return {
//         labels: weekdayLabels,
//         salesData: sales,
//         expensesData: expenses,
//         profitData: profits,
//         totalSales: totalSalesVal,
//         totalExpenses: totalExpensesVal,
//         totalProfit: totalProfitVal,
//         orderCount: count,
//         avgOrder: avg,
//       };
//     }

//     // Month view
//     if (view === "Month") {
//       const [yStr, mStr] = selectedMonth.split("-");
//       const y = Number(yStr);
//       const mIndex = Number(mStr) - 1;
//       const daysInMonth = getDaysInMonth(y, mIndex);
//       const labelsArr = [];
//       const sales = new Array(daysInMonth).fill(0);
//       const expenses = new Array(daysInMonth).fill(0);
//       const profits = new Array(daysInMonth).fill(0);
//       let count = 0;

//       for (let d = 1; d <= daysInMonth; d++) {
//         const dateKey = `${y}-${String(mIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
//         labelsArr.push(dateKey);
//       }

//       deliveredOrders.forEach((order) => {
//         const d = parseOrderDate(order);
//         if (!d) return;
//         if (d.getFullYear() === y && d.getMonth() === mIndex) {
//           const dayIndex = d.getDate() - 1;
//           const sale = getOrderTotal(order);

//           let expense = 0;
//           let profit = 0;
//           if (order.total_expense !== undefined && order.total_expense !== null && order.total_expense !== "") {
//             expense = parseFloat(order.total_expense) || 0;
//             profit = parseFloat(order.net_profit) || (sale - expense);
//           } else {
//             const fin = computeOrderFinancialsFallback(order);
//             expense = fin.totalExpense;
//             profit = fin.profit;
//           }

//           sales[dayIndex] += sale;
//           expenses[dayIndex] += expense;
//           profits[dayIndex] += profit;
//           count += 1;
//         }
//       });

//       const totalSalesVal = sales.reduce((a, b) => a + b, 0);
//       const totalExpensesVal = expenses.reduce((a, b) => a + b, 0);
//       const totalProfitVal = profits.reduce((a, b) => a + b, 0);
//       const prettyLabels = labelsArr.map((k) => {
//         const d = new Date(k);
//         return String(d.getDate());
//       });
//       const avg = count > 0 ? totalSalesVal / count : 0;

//       return {
//         labels: prettyLabels,
//         salesData: sales,
//         expensesData: expenses,
//         profitData: profits,
//         totalSales: totalSalesVal,
//         totalExpenses: totalExpensesVal,
//         totalProfit: totalProfitVal,
//         orderCount: count,
//         avgOrder: avg,
//       };
//     }

//     return { labels: [], salesData: [], expensesData: [], profitData: [], totalSales: 0, totalExpenses: 0, totalProfit: 0, orderCount: 0, avgOrder: 0 };
//   }, [view, selectedDate, selectedMonth, deliveredOrders, cartDetails, loading]);

//   // Chart data objects (three datasets)
//   const chartData = {
//     labels,
//     datasets: [
//       {
//         type: "bar",
//         label: "Sales (₹)",
//         data: salesData,
//         borderWidth: 1,
//         backgroundColor: "rgba(34,197,94,0.6)",
//       },
//       {
//         type: "bar",
//         label: "Expenses (₹)",
//         data: expensesData,
//         borderWidth: 1,
//         backgroundColor: "rgba(234,88,12,0.6)",
//       },
//       {
//         type: "line",
//         label: "Net Profit (₹)",
//         data: profitData,
//         tension: 0.3,
//         borderWidth: 2,
//         borderColor: "rgba(59,130,246,1)",
//         backgroundColor: "rgba(59,130,246,0.2)",
//         fill: false,
//         yAxisID: "y",
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: true, position: "top" },
//       tooltip: {
//         callbacks: {
//           label: (ctx) => {
//             const val = Number(ctx.parsed.y ?? ctx.parsed);
//             return `${ctx.dataset.label}: ₹ ${val.toFixed(2)}`;
//           },
//         },
//       },
//     },
//     scales: {
//       y: { beginAtZero: true, ticks: { callback: (val) => `₹${val}` } },
//     },
//   };

//   // quick-select handlers
//   const setThisMonth = () => {
//     const d = new Date();
//     setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
//     setView("Month");
//   };
//   const setThisWeek = () => {
//     const d = new Date();
//     setSelectedDate(formatDateKey(d));
//     setView("Week");
//   };
//   const setToday = () => {
//     const d = new Date();
//     setSelectedDate(formatDateKey(d));
//     setView("Day");
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Sales & Profit Dashboard</h1>
//         <div className="flex gap-2">
//           <button onClick={setToday} className="px-3 py-1 bg-gray-200 rounded">Today</button>
//           <button onClick={setThisWeek} className="px-3 py-1 bg-gray-200 rounded">This Week</button>
//           <button onClick={setThisMonth} className="px-3 py-1 bg-gray-200 rounded">This Month</button>
//         </div>
//       </div>

//       <div className="bg-white p-4 rounded shadow mb-4">
//         {/* View selector */}
//         <div className="flex items-center gap-4 mb-4">
//           <div className="flex items-center gap-2">
//             <label className="font-medium">View:</label>
//             <select value={view} onChange={(e) => setView(e.target.value)} className="border p-2 rounded">
//               <option value="Day">Day</option>
//               <option value="Week">Week</option>
//               <option value="Month">Month</option>
//             </select>
//           </div>

//           {view === "Day" && (
//             <div>
//               <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border p-2 rounded" />
//             </div>
//           )}

//           {view === "Week" && (
//             <div>
//               <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border p-2 rounded" />
//               <div className="text-sm text-gray-500 mt-1">Week shown will start on Monday.</div>
//             </div>
//           )}

//           {view === "Month" && (
//             <div>
//               <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="border p-2 rounded" />
//             </div>
//           )}
//         </div>

//         {/* summary cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//           <div className="p-4 bg-gray-50 rounded">
//             <div className="text-sm text-gray-500">Total Sales</div>
//             <div className="text-2xl font-bold">₹{Number(totalSales || 0).toFixed(2)}</div>
//           </div>
//           <div className="p-4 bg-gray-50 rounded">
//             <div className="text-sm text-gray-500">Total Expenses</div>
//             <div className="text-2xl font-bold">₹{Number(totalExpenses || 0).toFixed(2)}</div>
//           </div>
//           <div className="p-4 bg-gray-50 rounded">
//             <div className="text-sm text-gray-500">Net Profit</div>
//             <div className="text-2xl font-bold">₹{Number(totalProfit || 0).toFixed(2)}</div>
//           </div>
//           <div className="p-4 bg-gray-50 rounded">
//             <div className="text-sm text-gray-500">Orders Count</div>
//             <div className="text-2xl font-bold">{orderCount}</div>
//             <div className="text-sm text-gray-500">Avg Order ₹{Number(avgOrder || 0).toFixed(2)}</div>
//           </div>
//         </div>

//         {/* Chart area */}
//         <div className="bg-white p-4 rounded">
//           {loading ? (
//             <div className="text-center py-8">Loading...</div>
//           ) : error ? (
//             <div className="text-red-500 py-4">{error}</div>
//           ) : (
//             <>
//               <div className="mb-4">
//                 <h3 className="font-semibold">{view} Financials</h3>
//                 <p className="text-sm text-gray-500">Only orders with status <strong>Delivered</strong> are counted. Expenses/profit use stored order fields when available, otherwise computed with defaults.</p>
//               </div>

//               <div className="w-full">
//                 {view === "Day" ? (
//                   <Line data={chartData} options={chartOptions} />
//                 ) : (
//                   <Bar data={chartData} options={chartOptions} />
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function formatDateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseOrderDate(order) {
  const raw =
    order.created_at ||
    order.createdAt ||
    order.order_date ||
    order.date ||
    order.created ||
    order.updated_at;
  if (!raw) return null;
  const dt = new Date(raw);
  if (isNaN(dt)) {
    try {
      return new Date(Number(raw));
    } catch {
      return null;
    }
  }
  return dt;
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [cartDetails, setCartDetails] = useState({}); // map cart_id -> cart data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // admin session check
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [admin, setAdmin] = useState(null);

  // filter UI
  const [view, setView] = useState("Month"); // "Day" | "Week" | "Month"
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(() => formatDateKey(today));
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    const verifyAdminAndLoad = async () => {
      setCheckingAdmin(true);
      setLoading(true);

      if (!token) {
        // redirect immediately if no token
        navigate("/admin/login");
        return;
      }

      try {
        // verify admin session
        await axios.get(`${import.meta.env.VITE_API_URL}/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(true);

        // fetch orders
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/adminallorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data || [];
        setOrders(data);
        // fetch carts (will use token)
        fetchCartDetails(data);
      } catch (err) {
        console.error("Failed to verify admin or fetch orders:", err);
        // if unauthorized, redirect to login
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          navigate("/admin/login");
          return;
        }
        setError("Failed to load orders.");
      } finally {
        setCheckingAdmin(false);
        setLoading(false);
      }
    };

    verifyAdminAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchCartDetails = (ordersData) => {
    if (!ordersData || !Array.isArray(ordersData)) return;
    const tokenLocal = localStorage.getItem("admin_token");
    ordersData.forEach((order) => {
      if (!order?.cart_id) return;
      setCartDetails((prev) => {
        if (prev[order.cart_id]) return prev; // already fetched
        // kick off fetch
        axios
          .get(`${import.meta.env.VITE_API_URL}/carts/${order.cart_id}`, {
            headers: { Authorization: `Bearer ${tokenLocal}` },
          })
          .then((res) => {
            setCartDetails((p) => ({ ...p, [order.cart_id]: res.data }));
          })
          .catch((err) => {
            console.warn("Failed to fetch cart", order.cart_id, err);
          });
        return prev;
      });
    });
  };

  // Helper: compute numeric order total reliably
  const getOrderTotal = (order) => {
    if (
      order.cart_total !== undefined &&
      order.cart_total !== null &&
      order.cart_total !== ""
    ) {
      const n = parseFloat(order.cart_total);
      if (!isNaN(n)) return n;
    }

    const cart = cartDetails[order.cart_id];
    if (cart && Array.isArray(cart.items)) {
      let sum = 0;
      cart.items.forEach((it) => {
        const price = parseFloat(it.product?.price ?? it.price ?? 0) || 0;
        const qty = parseInt(it.quantity ?? 0) || 0;
        sum += price * qty;
      });
      return sum;
    }

    return 0;
  };

  // Helper: compute items cost sum (sum of cost_price * qty)
  const getOrderItemsCost = (order) => {
    if (
      order.items_cost_sum !== undefined &&
      order.items_cost_sum !== null &&
      order.items_cost_sum !== ""
    ) {
      const n = parseFloat(order.items_cost_sum);
      if (!isNaN(n)) return n;
    }

    if (order.items_snapshot) {
      try {
        const snapshot =
          typeof order.items_snapshot === "string"
            ? JSON.parse(order.items_snapshot)
            : order.items_snapshot;
        if (Array.isArray(snapshot)) {
          return snapshot.reduce((acc, it) => {
            const cp = parseFloat(it.cost_price ?? 0) || 0;
            const qty = parseInt(it.quantity ?? 0) || 0;
            return acc + cp * qty;
          }, 0);
        }
      } catch (e) {
        // fallthrough to cartDetails
      }
    }

    const cart = cartDetails[order.cart_id];
    if (cart && Array.isArray(cart.items)) {
      return cart.items.reduce((acc, it) => {
        const cp = parseFloat(it.product?.cost_price ?? it.cost_price ?? 0) || 0;
        const qty = parseInt(it.quantity ?? 0) || 0;
        return acc + cp * qty;
      }, 0);
    }

    return 0;
  };

  // Helper: compute delivery, packaging, gateway fee (defaults applied)
  const computeOrderFinancialsFallback = (order) => {
    const DEFAULT_DELIVERY = 100.0;
    const PACKAGING_PER_UNIT = 15.0;
    const GATEWAY_PERCENT = 0.02; // 2%

    let delivery = 0;
    if (
      order.delivery_charges !== undefined &&
      order.delivery_charges !== null &&
      order.delivery_charges !== ""
    ) {
      delivery = parseFloat(order.delivery_charges) || 0;
    } else {
      delivery = DEFAULT_DELIVERY;
    }

    let packaging = 0;
    if (
      order.packaging_cost !== undefined &&
      order.packaging_cost !== null &&
      order.packaging_cost !== ""
    ) {
      packaging = parseFloat(order.packaging_cost) || 0;
    } else {
      let totalQty = 0;
      if (order.items_snapshot) {
        try {
          const snapshot =
            typeof order.items_snapshot === "string"
              ? JSON.parse(order.items_snapshot)
              : order.items_snapshot;
          if (Array.isArray(snapshot))
            totalQty = snapshot.reduce(
              (s, it) => s + (parseInt(it.quantity ?? 0) || 0),
              0
            );
        } catch {}
      }
      if (totalQty === 0) {
        const cart = cartDetails[order.cart_id];
        if (cart && Array.isArray(cart.items)) {
          totalQty = cart.items.reduce(
            (s, it) => s + (parseInt(it.quantity ?? 0) || 0),
            0
          );
        }
      }
      packaging = PACKAGING_PER_UNIT * totalQty;
    }

    let gateway = 0;
    if (
      order.payment_gateway_fee !== undefined &&
      order.payment_gateway_fee !== null &&
      order.payment_gateway_fee !== ""
    ) {
      gateway = parseFloat(order.payment_gateway_fee) || 0;
    } else {
      const pm = (order.payment_method || "").toString().toLowerCase();
      const isPrepaid = pm && pm !== "cod";
      if (isPrepaid) {
        gateway = (parseFloat(order.cart_total) || 0) * GATEWAY_PERCENT;
      } else {
        gateway = 0;
      }
    }

    const itemsCost = getOrderItemsCost(order);
    const totalExpense = Number((itemsCost + delivery + packaging + gateway).toFixed(2));
    const profit = Number(((parseFloat(order.cart_total) || 0) - totalExpense).toFixed(2));

    return { itemsCost, delivery, packaging, gateway, totalExpense, profit };
  };

  // Filter delivered orders only
  const deliveredOrders = useMemo(() => {
    return orders.filter((o) => {
      const s = (o.order_status || "").toString().trim().toLowerCase();
      return s === "delivered";
    });
  }, [orders]);

  // Aggregations for charts depending on view — now returns sales, expenses, profit arrays
  const {
    labels,
    salesData,
    expensesData,
    profitData,
    totalSales,
    totalExpenses,
    totalProfit,
    orderCount,
    avgOrder,
  } = useMemo(() => {
    if (loading || checkingAdmin) return { labels: [], salesData: [], expensesData: [], profitData: [], totalSales: 0, totalExpenses: 0, totalProfit: 0, orderCount: 0, avgOrder: 0 };

    // Day view
    if (view === "Day") {
      const dateParts = selectedDate.split("-");
      const year = Number(dateParts[0]);
      const month = Number(dateParts[1]) - 1;
      const day = Number(dateParts[2]);
      const target = new Date(year, month, day);

      const hours = Array.from({ length: 24 }, (_, i) => i);
      const sales = hours.map(() => 0);
      const expenses = hours.map(() => 0);
      const profits = hours.map(() => 0);

      let count = 0;
      deliveredOrders.forEach((order) => {
        const d = parseOrderDate(order);
        if (!d) return;
        if (
          d.getFullYear() === target.getFullYear() &&
          d.getMonth() === target.getMonth() &&
          d.getDate() === target.getDate()
        ) {
          const h = d.getHours();
          const sale = getOrderTotal(order);

          let expense = 0;
          let profit = 0;
          if (
            order.total_expense !== undefined &&
            order.total_expense !== null &&
            order.total_expense !== ""
          ) {
            expense = parseFloat(order.total_expense) || 0;
            profit = parseFloat(order.net_profit) || sale - expense;
          } else {
            const fin = computeOrderFinancialsFallback(order);
            expense = fin.totalExpense;
            profit = fin.profit;
          }

          sales[h] += sale;
          expenses[h] += expense;
          profits[h] += profit;
          count += 1;
        }
      });

      const totalSalesVal = sales.reduce((a, b) => a + b, 0);
      const totalExpensesVal = expenses.reduce((a, b) => a + b, 0);
      const totalProfitVal = profits.reduce((a, b) => a + b, 0);
      const avg = count > 0 ? totalSalesVal / count : 0;

      return {
        labels: hours.map((h) => `${String(h).padStart(2, "0")}:00`),
        salesData: sales,
        expensesData: expenses,
        profitData: profits,
        totalSales: totalSalesVal,
        totalExpenses: totalExpensesVal,
        totalProfit: totalProfitVal,
        orderCount: count,
        avgOrder: avg,
      };
    }

    // Week view
    if (view === "Week") {
      const dateParts = selectedDate.split("-");
      const year = Number(dateParts[0]);
      const month = Number(dateParts[1]) - 1;
      const day = Number(dateParts[2]);
      const anyDate = new Date(year, month, day);
      const monday = startOfWeek(anyDate);

      const labelsArr = [];
      const sales = new Array(7).fill(0);
      const expenses = new Array(7).fill(0);
      const profits = new Array(7).fill(0);
      let count = 0;

      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        labelsArr.push(formatDateKey(d));
      }

      deliveredOrders.forEach((order) => {
        const d = parseOrderDate(order);
        if (!d) return;
        const key = formatDateKey(d);
        const idx = labelsArr.indexOf(key);
        if (idx >= 0) {
          const sale = getOrderTotal(order);

          let expense = 0;
          let profit = 0;
          if (
            order.total_expense !== undefined &&
            order.total_expense !== null &&
            order.total_expense !== ""
          ) {
            expense = parseFloat(order.total_expense) || 0;
            profit = parseFloat(order.net_profit) || sale - expense;
          } else {
            const fin = computeOrderFinancialsFallback(order);
            expense = fin.totalExpense;
            profit = fin.profit;
          }

          sales[idx] += sale;
          expenses[idx] += expense;
          profits[idx] += profit;
          count += 1;
        }
      });

      const totalSalesVal = sales.reduce((a, b) => a + b, 0);
      const totalExpensesVal = expenses.reduce((a, b) => a + b, 0);
      const totalProfitVal = profits.reduce((a, b) => a + b, 0);
      const weekdayLabels = labelsArr.map((k) => {
        const d = new Date(k);
        return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
      });
      const avg = count > 0 ? totalSalesVal / count : 0;

      return {
        labels: weekdayLabels,
        salesData: sales,
        expensesData: expenses,
        profitData: profits,
        totalSales: totalSalesVal,
        totalExpenses: totalExpensesVal,
        totalProfit: totalProfitVal,
        orderCount: count,
        avgOrder: avg,
      };
    }

    // Month view
    if (view === "Month") {
      const [yStr, mStr] = selectedMonth.split("-");
      const y = Number(yStr);
      const mIndex = Number(mStr) - 1;
      const daysInMonth = getDaysInMonth(y, mIndex);
      const labelsArr = [];
      const sales = new Array(daysInMonth).fill(0);
      const expenses = new Array(daysInMonth).fill(0);
      const profits = new Array(daysInMonth).fill(0);
      let count = 0;

      for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = `${y}-${String(mIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        labelsArr.push(dateKey);
      }

      deliveredOrders.forEach((order) => {
        const d = parseOrderDate(order);
        if (!d) return;
        if (d.getFullYear() === y && d.getMonth() === mIndex) {
          const dayIndex = d.getDate() - 1;
          const sale = getOrderTotal(order);

          let expense = 0;
          let profit = 0;
          if (
            order.total_expense !== undefined &&
            order.total_expense !== null &&
            order.total_expense !== ""
          ) {
            expense = parseFloat(order.total_expense) || 0;
            profit = parseFloat(order.net_profit) || sale - expense;
          } else {
            const fin = computeOrderFinancialsFallback(order);
            expense = fin.totalExpense;
            profit = fin.profit;
          }

          sales[dayIndex] += sale;
          expenses[dayIndex] += expense;
          profits[dayIndex] += profit;
          count += 1;
        }
      });

      const totalSalesVal = sales.reduce((a, b) => a + b, 0);
      const totalExpensesVal = expenses.reduce((a, b) => a + b, 0);
      const totalProfitVal = profits.reduce((a, b) => a + b, 0);
      const prettyLabels = labelsArr.map((k) => {
        const d = new Date(k);
        return String(d.getDate());
      });
      const avg = count > 0 ? totalSalesVal / count : 0;

      return {
        labels: prettyLabels,
        salesData: sales,
        expensesData: expenses,
        profitData: profits,
        totalSales: totalSalesVal,
        totalExpenses: totalExpensesVal,
        totalProfit: totalProfitVal,
        orderCount: count,
        avgOrder: avg,
      };
    }

    return { labels: [], salesData: [], expensesData: [], profitData: [], totalSales: 0, totalExpenses: 0, totalProfit: 0, orderCount: 0, avgOrder: 0 };
  }, [view, selectedDate, selectedMonth, deliveredOrders, cartDetails, loading, checkingAdmin]);

  // Chart data objects (three datasets)
  const chartData = {
    labels,
    datasets: [
      {
        type: "bar",
        label: "Sales (₹)",
        data: salesData,
        borderWidth: 1,
        backgroundColor: "rgba(34,197,94,0.6)",
      },
      {
        type: "bar",
        label: "Expenses (₹)",
        data: expensesData,
        borderWidth: 1,
        backgroundColor: "rgba(234,88,12,0.6)",
      },
      {
        type: "line",
        label: "Net Profit (₹)",
        data: profitData,
        tension: 0.3,
        borderWidth: 2,
        borderColor: "rgba(59,130,246,1)",
        backgroundColor: "rgba(59,130,246,0.2)",
        fill: false,
        yAxisID: "y",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const val = Number(ctx.parsed.y ?? ctx.parsed);
            return `${ctx.dataset.label}: ₹ ${val.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (val) => `₹${val}` } },
    },
  };

  // quick-select handlers
  const setThisMonth = () => {
    const d = new Date();
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    setView("Month");
  };
  const setThisWeek = () => {
    const d = new Date();
    setSelectedDate(formatDateKey(d));
    setView("Week");
  };
  const setToday = () => {
    const d = new Date();
    setSelectedDate(formatDateKey(d));
    setView("Day");
  };

  // Render
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sales & Profit Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={setToday} className="px-3 py-1 bg-gray-200 rounded">Today</button>
          <button onClick={setThisWeek} className="px-3 py-1 bg-gray-200 rounded">This Week</button>
          <button onClick={setThisMonth} className="px-3 py-1 bg-gray-200 rounded">This Month</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        {/* View selector */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="font-medium">View:</label>
            <select value={view} onChange={(e) => setView(e.target.value)} className="border p-2 rounded">
              <option value="Day">Day</option>
              <option value="Week">Week</option>
              <option value="Month">Month</option>
            </select>
          </div>

          {view === "Day" && (
            <div>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border p-2 rounded" />
            </div>
          )}

          {view === "Week" && (
            <div>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border p-2 rounded" />
              <div className="text-sm text-gray-500 mt-1">Week shown will start on Monday.</div>
            </div>
          )}

          {view === "Month" && (
            <div>
              <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="border p-2 rounded" />
            </div>
          )}
        </div>

        {/* summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Total Sales</div>
            <div className="text-2xl font-bold">₹{Number(totalSales || 0).toFixed(2)}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Total Expenses</div>
            <div className="text-2xl font-bold">₹{Number(totalExpenses || 0).toFixed(2)}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Net Profit</div>
            <div className="text-2xl font-bold">₹{Number(totalProfit || 0).toFixed(2)}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Orders Count</div>
            <div className="text-2xl font-bold">{orderCount}</div>
            <div className="text-sm text-gray-500">Avg Order ₹{Number(avgOrder || 0).toFixed(2)}</div>
          </div>
        </div>

        {/* Chart area */}
        <div className="bg-white p-4 rounded">
          {checkingAdmin ? (
            <div className="text-center py-8 text-yellow-500">Checking admin session...</div>
          ) : loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="font-semibold">{view} Financials</h3>
                <p className="text-sm text-gray-500">Only orders with status <strong>Delivered</strong> are counted. Expenses/profit use stored order fields when available, otherwise computed with defaults.</p>
              </div>

              <div className="w-full">
                {view === "Day" ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <Bar data={chartData} options={chartOptions} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
