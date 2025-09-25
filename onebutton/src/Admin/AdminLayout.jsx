// AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/Admin/Dashboard" },
  { name: "Products", path: "/Admin/manageproducts" },
  { name: "Orders", path: "/Admin/AllOrders" },
  { name: "Customers", path: "/Admin/AllUsers" },
  { name: "Coupons", path: "/Admin/Coupons" },
  { name: "Update Stock", path: "/Admin/UpdateStock" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // collapsed persisted in localStorage (optional but handy)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("admin_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("admin_sidebar_collapsed", collapsed ? "true" : "false");
    } catch {}
  }, [collapsed]);

  // derive the active menu by startsWith so nested routes also map to their parent
  const activeName =
    menuItems.find((m) => location.pathname.startsWith(m.path))?.name || "Dashboard";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } sticky top-0 h-screen`}
        aria-label="Admin Sidebar"
      >
        <div className="flex items-center justify-between px-3 py-4 border-b border-gray-800">
          <div className={`text-lg font-bold ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
            Admin Panel
          </div>

          <button
            onClick={() => setCollapsed((s) => !s)}
            className="p-2 rounded hover:bg-gray-800 focus:outline-none"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <svg className={`w-5 h-5 transform ${collapsed ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M6 4l8 6-8 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="py-2">
            {menuItems.map((menu) => {
              const isActive = activeName === menu.name;
              return (
                <li key={menu.name} className="px-2">
                  <button
                    onClick={() => navigate(menu.path)}
                    className={`flex items-center gap-3 w-full text-left py-2 px-3 rounded hover:bg-gray-800 transition ${
                      isActive ? "bg-gray-800" : ""
                    }`}
                    title={menu.name}
                  >
                    {/* small placeholder icon */}
                    <div className="flex-shrink-0 text-gray-200">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 12h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className={`${collapsed ? "opacity-0 w-0" : "opacity-100"} transition-all`}>{menu.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-3 pb-4 border-t border-gray-800">
          <button onClick={() => navigate("/Admin/Login")} className="w-full text-sm py-2 px-3 rounded bg-red-600 hover:bg-red-500 transition">
            Profile
          </button>
        </div>
      </aside>

      {/* Content area for child routes */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          {/* optional header showing active name */}
          <h1 className="text-3xl font-bold mb-4">{activeName}</h1>

          {/* child page (Products, Orders, ...) will render here */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
