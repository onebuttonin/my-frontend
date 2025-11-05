
import React from "react";
import { FacebookIcon, InstagramIcon, XIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-black py-10 mt-12 border-t border-gray-200">
      <div className="container mx-auto px-6 text-center">
        
        {/* Footer Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          
          {/* Customer Support */}
          <div>
            <h3 className="text-base font-semibold tracking-wide mb-3 uppercase">
              Customer Support
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/Contactus" className="hover:text-black">Contact Us</a></li>
              <li><a href="#" className="hover:text-black">FAQs</a></li>
              <li><a href="/Contactus" className="hover:text-black">Help Center</a></li>
            </ul>
          </div>

          {/* Exchange & Return Policy */}
          <div>
            <h3 className="text-base font-semibold tracking-wide mb-3 uppercase">
              Exchange & Returns
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/Return&Exchange" className="hover:text-black">Return Policy</a></li>
              <li><a href="/Return&Exchange" className="hover:text-black">Exchange Process</a></li>
              <li><a href="/Return&Exchange" className="hover:text-black">Refund Guidelines</a></li>
            </ul>
          </div>

          {/* Order Details */}
          <div>
            <h3 className="text-base font-semibold tracking-wide mb-3 uppercase">
              Order Details
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-black">Track My Order</a></li>
              <li><a href="/ShippingInformation" className="hover:text-black">Shipping Information</a></li>
              <li><a href="#" className="hover:text-black">Payment Options</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 pt-6">
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6 mb-4">
            <a href="https://www.facebook.com/profile.php?id=61579609931771" className="hover:text-black"  target="_blank"
  rel="noopener noreferrer">
              <FacebookIcon className="w-6 h-6" />
            </a>
            <a href="https://www.instagram.com/onebutton.in/" className="hover:text-black"  target="_blank"
  rel="noopener noreferrer">
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-black"  target="_blank"
  rel="noopener noreferrer">
              <XIcon className="w-6 h-6" />
            </a>
          </div>

          {/* Copyright Text */}
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} OneButton. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
