import { useState } from 'react'

import './App.css'
import Navbar from './components/Navbar'
import Ticker1 from './components/Ticker1'
import Footer from './components/Footer'

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Category from "./components/Categories/Category";
import Home  from './components/HomePage/Home'

import NotBasic from './components/Categories/NotBasic'
import Basic from "./components/Categories/Basic"
import Minimals from "./components/Categories/Minimals"
import Login from "./components/Profile/Login"
import WishlistPage from "../src/components/Wishlist/WishlistPage"
import MainProduct2 from './components/products/MainProduct2'
import ShowCart from './components/Cart/Showcart'
import ManageProducts from './Admin/ManageProducts'
import AddProduct from './Admin/AddProduct'
import UpdateProduct from './Admin/UpdateProduct'
import SizeColorVariants from './Admin/SizeColorVariants'
import Dashboard from './Admin/DashBoard'
import PlaceOrder from './components/Cart/PlaceOrder'
import OrderDetails from './components/Cart/OrderDetails'
import AllOrders from './Admin/Allorders'
import AdminLogin from './Admin/AdminLogin'
import PrivateRoute from './Admin/PrivateRoute'
import Coupons from './Admin/Coupons'
import UpdateCoupon from './Admin/Update-Coupon'
import AddCoupon from './Admin/Add-Coupon'
import AllUsers from './Admin/AllUsers'
import AllProducts from './components/Categories/AllProducts'
import ScrollToTop from './components/ScrollToTop'
import Invoice from './Admin/Invoice'
import ReturnAndExchange from './components/footer/Return&Exchange'
import ContactUs from './components/footer/Contactus'
import ShippingInfo from './components/footer/ShippingInfo'
import AboutUs from './components/footer/Aboutus'
import Order  from './components/Cart/Order'
import AdminLayout from './Admin/AdminLayout'
import PublicLayout from './components/Layouts/PublicRoute'
import UpdateProductImages from './Admin/UpdateProductImages'
import ProductImages from './Admin/ProductImages'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
<div>
    
        <Routes>

           {/* PUBLIC ROUTES (wrapped in PublicLayout) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          {/* Authentication / public pages */}
          <Route path="/login" element={<Login />} />

          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<ShowCart />} />
          <Route path="/PlaceOrder" element={<PlaceOrder />} />
          <Route path="/Orders" element={<Order />} />
          <Route path="/OrderDetails/:id" element={<OrderDetails />} />

          {/* Categories and products */}
          <Route path="/category" element={<Category/>} />
          <Route path="/category/Tshirts" element={<NotBasic />} />
          <Route path="/category/Oversize-Tshirts" element={<Basic />} />
          <Route path="/category/Shirts" element={<Minimals />} />
          <Route path="/category/AllProducts" element={<AllProducts />} />
          <Route path="/product/:id" element={<MainProduct2 />} />

          {/* Footer pages */}
          <Route path="/Return&Exchange" element={<ReturnAndExchange />} />
          <Route path="/Contactus" element={<ContactUs />} />
          <Route path="/ShippingInformation" element={<ShippingInfo />} />
          <Route path="/AboutUs" element={<AboutUs />} />
        </Route>
     

        {/* Admin Routes */}

        <Route path='/Admin/Login' element={<AdminLogin />}/>
         
        {/* <Route element={<PrivateRoute />}>
        <Route path='/Admin/Dashboard' element={<Dashboard />}/>
        <Route path='/Admin/manageproducts' element={<ManageProducts />}/>
        <Route path='/Admin/add-product' element={<AddProduct />} />
        <Route path='/Admin/edit-product/:id' element={<UpdateProduct />} />
        <Route path='/Admin/sizecolorvariants/:id' element={<SizeColorVariants />}/>
        <Route path='/Admin/AllOrders' element={<AllOrders />}/>
        <Route path='/Admin/AllUsers' element={<AllUsers />}/>
        <Route path='/Admin/Coupons' element={<Coupons />} />
        <Route path='/Admin/update-coupon/:id' element={<UpdateCoupon/>}/>
        <Route path='/Admin/Add-Coupon' element={<AddCoupon />} />
        <Route path='/Admin/ProductInvoice/:orderId' element={<Invoice />} />
        </Route> */}


<Route element={<PrivateRoute />}>
          <Route path="/Admin" element={<AdminLayout />}>
            {/* keep same paths as before but now as children (relative to /Admin) */}
            <Route path="Dashboard" element={<Dashboard />} />
            <Route path="manageproducts" element={<ManageProducts />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="edit-product/:id" element={<UpdateProduct />} />
            <Route path="sizecolorvariants/:id" element={<SizeColorVariants />} />
            <Route path="AllOrders" element={<AllOrders />} />
            <Route path="AllUsers" element={<AllUsers />} />
            <Route path="Coupons" element={<Coupons />} />
            <Route path="update-coupon/:id" element={<UpdateCoupon />} />
            <Route path="Add-Coupon" element={<AddCoupon />} />
            <Route path="ProductInvoice/:orderId" element={<Invoice />} />
            <Route path="UpdateImages/:id" element={<UpdateProductImages/>}/>
            <Route path="ProductImages/:id" element={<ProductImages/>} />

            {/* optional: redirect /Admin => /Admin/Dashboard */}
            <Route index element={<Navigate to="/Admin/Dashboard" replace />} />
            {/* catch-all under /Admin redirect to dashboard */}
            <Route path="*" element={<Navigate to="/Admin/Dashboard" replace />} />
          </Route>
        </Route>

           
       </Routes>
      
     
       
       <div>
      {/* Your routes / layouts */}
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
    </div>
    </div>
    </>
       
  )
}

export default App
