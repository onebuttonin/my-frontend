import React from "react";
import Ticker1 from "../Ticker1";
import Navbar from "../Navbar";
import Nbottom from "../Nbottom";
import Ticker2 from "../Ticker2";
import Footer from "../Footer";
import Collections from "/src/components/products/Collections"
import Minimal from "/src/components/products/Minimal"
import Homep from "/src/components/products/Homep"
import ProductTicker from "../products/ProductTicker";

export default function HomePages()  {

    return (
        
        <div>
            {/* <Ticker1></Ticker1>
            <Navbar></Navbar> */}
            <Nbottom></Nbottom>
            {/* <Ticker2></Ticker2> */}
            {/* <ProductTicker /> */}
            <Homep></Homep>
            <Minimal></Minimal>
            <Collections></Collections>
            
            {/* <Footer></Footer> */}
        </div>


    )

}