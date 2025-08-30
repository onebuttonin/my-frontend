import React from "react";

export default function ReturnAndExchange() {
  return (
  <div className="container mx-auto px-4 md:px-10 py-16 max-w-3xl">
    {/* Header */}
    <h1 className="text-3xl md:text-4xl font-semibold tracking-wide text-gray-900 mb-6 text-center">
      Return & Exchange Policy
    </h1>

    <p className="text-gray-700 leading-relaxed mb-8 text-center">
      At <span className="font-medium">OneButton</span>, we strive to provide you with premium quality products. 
      However, if you are not completely satisfied with your purchase due to issues with size or color, 
      you may request a return or exchange within{" "}
      <span className="font-medium">7 days</span> of receiving your order.
    </p>

    {/* Eligibility */}
    <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
      Eligibility for Return & Exchange
    </h2>
    <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
      <li>
        Return or exchange is applicable if the product delivered is of{" "}
        <strong>wrong size</strong> or <strong>incorrect color</strong>.
      </li>
      <li>
        The product must be <strong>unused</strong>, <strong>unwashed</strong>, 
        and in its original packaging with tags intact.
      </li>
      <li>
        Requests must be initiated within{" "}
        <strong>7 days from the delivery date</strong>.
      </li>
    </ul>

    {/* How to Request */}
    <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
      How to Request a Return or Exchange?
    </h2>
    <p className="text-gray-700 mb-3">
      Please email us at{" "}
      <a
        href="mailto:onebutton.co@gmail.com"
        className="text-black underline hover:opacity-70 transition"
      >
        onebutton.co@gmail.com
      </a>{" "}
      with the following details:
    </p>
    <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
      <li>Order ID</li>
      <li>Product name and size</li>
      <li>Reason for return or exchange</li>
      <li>Clear photos of the product showing the issue (if applicable)</li>
    </ul>

    {/* Refunds */}
    <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
      Refunds
    </h2>
    <p className="text-gray-700 leading-relaxed mb-8">
      Refunds will only be processed if a replacement is not available. 
      Refunds will be initiated to your original payment method within{" "}
      <strong>7-10 business days</strong> after approval.
    </p>

    <p className="text-gray-500 text-sm mt-10 italic text-center">
      *Please note: Items purchased on sale or with promotional discounts are
      not eligible for returns or exchanges unless they are defective.
    </p>
  </div>
);

}
