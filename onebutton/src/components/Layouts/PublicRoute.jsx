// src/layouts/PublicLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
// import Ticker1 from "../components/Ticker1";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import ScrollToTop from "../components/ScrollToTop";

import Ticker1 from "../Ticker1";
import Navbar from "../Navbar";
import Footer from "../Footer";
import ScrollToTop from "../ScrollToTop";

/**
 * PublicLayout wraps all non-admin pages and shows Navbar/Ticker/Footer.
 * Child routes will be rendered inside <Outlet />.
 */
export default function PublicLayout() {
  return (
    <>
      <Ticker1 />
      <Navbar />
      <ScrollToTop />

      {/* main area where public child routes render */}
      <main className="min-h-[60vh]">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
