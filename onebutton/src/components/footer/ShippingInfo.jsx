import React from "react";

export default function Shipping() {
  return (
    <div className="container mx-auto px-4 md:px-10 py-8 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
        Shipping Information
      </h1>
      <p className="text-gray-700 leading-relaxed mb-6">
        At <span className="font-semibold">OneButton</span>, we aim to deliver
        your premium fashion pieces with care and efficiency. Please review our
        shipping guidelines below:
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">
        Processing Time
      </h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>
          Orders are typically processed within{" "}
          <strong>1-2 business days</strong>.
        </li>
        <li>
          During sales or festive seasons, processing times may extend to{" "}
          <strong>3-4 business days</strong>.
        </li>
      </ul>

      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">
        Delivery Timeline
      </h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>
          <strong>Metro Cities:</strong> 3-5 business days after dispatch.
        </li>
        <li>
          <strong>Other Cities:</strong> 5-7 business days after dispatch.
        </li>
        <li>
          <strong>Remote Areas:</strong> May take up to 10 business days.
        </li>
      </ul>

      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">
        Shipping Charges
      </h2>
      <p className="text-gray-700 mb-4">
        <strong>Free shipping</strong> on all prepaid orders above ₹999. For
        orders below ₹999, a standard shipping fee of ₹50 will be applied.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">
        Order Tracking
      </h2>
      <p className="text-gray-700 mb-4">
        Once your order is dispatched, you will receive an email or SMS with
        your tracking details. You can track your order using the provided
        tracking ID.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">
        Questions About Shipping?
      </h2>
      <p className="text-gray-700">
        For any queries related to shipping, feel free to contact us at{" "}
        <a
          href="mailto:onebutton.co@gmail.com"
          className="text-blue-600 underline hover:text-blue-800"
        >
          onebuttonco@gmail.com
        </a>
        .
      </p>
    </div>
  );
}
