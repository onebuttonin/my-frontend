import React from "react";

export default function Shipping() {
  return (
  <div className="container mx-auto px-4 md:px-10 py-16 max-w-3xl">
    {/* Header */}
    <h1 className="text-3xl md:text-4xl font-semibold tracking-wide text-gray-900 mb-6 text-center">
      Shipping Information
    </h1>

    <p className="text-gray-700 leading-relaxed mb-10 text-center">
      At <span className="font-medium">OneButton</span>, we aim to deliver
      your premium fashion pieces with care and efficiency. Please review our
      shipping guidelines below:
    </p>

    {/* Processing Time */}
    <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
      Processing Time
    </h2>
    <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
      <li>
        Orders are typically processed within{" "}
        <strong>1-2 business days</strong>.
      </li>
      <li>
        During sales or festive seasons, processing times may extend to{" "}
        <strong>3-4 business days</strong>.
      </li>
    </ul>

    {/* Delivery Timeline */}
    <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
      Delivery Timeline
    </h2>
    <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
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

    {/* Shipping Charges */}
    <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
      Shipping Charges
    </h2>
    <p className="text-gray-700 leading-relaxed mb-8">
      <strong>Free shipping</strong> on all prepaid orders above ₹999. For
      orders below ₹999, a standard shipping fee of ₹50 will be applied.
    </p>

    {/* Order Tracking */}
    <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
      Order Tracking
    </h2>
    <p className="text-gray-700 leading-relaxed mb-8">
      Once your order is dispatched, you will receive an email or SMS with
      your tracking details. You can track your order using the provided
      tracking ID.
    </p>

    {/* Questions */}
    <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
      Questions About Shipping?
    </h2>
    <p className="text-gray-700 leading-relaxed text-center">
      For any queries related to shipping, feel free to contact us at{" "}
      <a
        href="mailto:onebutton.co@gmail.com"
        className="text-black underline hover:opacity-70 transition"
      >
        onebutton.co@gmail.com
      </a>
      .
    </p>
  </div>
);

}
