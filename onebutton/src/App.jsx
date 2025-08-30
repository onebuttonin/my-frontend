import { useState } from 'react'

import './App.css'
import Navbar from './components/Navbar'
import Ticker1 from './components/Ticker1'
import Footer from './components/Footer'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
<div>
        {/* Always Visible  */}
        <Ticker1 /> 
        <Navbar />
        <ScrollToTop />
        <Routes>
        <Route path="/" element={<Home />} />

        {/* <Route path="/category" element={<Category />} /> */}

        <Route path='/login' element={<Login />} />

        <Route path="/wishlist" element={<WishlistPage />}/>

        <Route path='/cart' element={<ShowCart />}/>

        <Route path="/orders" element={<PlaceOrder />} />

        <Route path="/OrderDetails" element={<OrderDetails />}/>

        {/* <Route path="/category/:categoryName" element={<CategoryDetail />} />  */}

        <Route path="/category/not-so-basic" element={<NotBasic />} /> 
        <Route path="/category/basics" element={<Basic />} /> 
        <Route path="/category/minimals" element={<Minimals />} /> 
        <Route path="/category/AllProducts" element={<AllProducts />}/>

        {/* <Route path="/collection/basics" element={<Basic />} /> */}

        {/* <Route path="/productgrid" element={<ProductGrid />} /> */}
        <Route path="/product/:id" element={<MainProduct2 />} />

        

        <Route path="/wishlist" element={<WishlistPage />} />





        {/* Admin Routes */}

        <Route path='/Admin/Login' element={<AdminLogin />}/>
         
        <Route element={<PrivateRoute />}>
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
        </Route>


         <Route path = "/Return&Exchange"  element={<ReturnAndExchange/>}/>
         <Route path = "/Contactus"  element={<ContactUs/>}/>
         <Route path = "/ShippingInformation"  element={<ShippingInfo/>}/>
         <Route path="/AboutUs" element={<AboutUs/>}/>
           
       </Routes>
      
       <Footer /> 
       
       <div>
      {/* Your routes / layouts */}
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
    </div>
    </div>
    </>
       
  )
}

export default App
