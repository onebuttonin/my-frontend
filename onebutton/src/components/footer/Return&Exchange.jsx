import React from "react";

export default function ReturnAndExchange() {
  return (
    <div className="container mx-auto px-4 md:px-10 py-8 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
        Return & Exchange Policy
      </h1>
      <p className="text-gray-700 leading-relaxed mb-4">
        At <span className="font-semibold">OneButton</span>, we strive to
        provide you with premium quality products. However, if you are not
        completely satisfied with your purchase due to issues with size or
        color, you may request a return or exchange within{" "}
        <span className="font-semibold">7 days</span> of receiving your order.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">
        Eligibility for Return & Exchange
      </h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>
          Return or exchange is only applicable if the product delivered is of{" "}
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

      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">
        How to Request a Return or Exchange?
      </h2>
      <p className="text-gray-700 mb-2">
        Please email us at{" "}
        <a
          href="mailto:onebutton.co@gmail.com"
          className="text-blue-600 underline hover:text-blue-800"
        >
          onebuttonco@gmail.com
        </a>{" "}
        with the following details:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Order ID</li>
        <li>Product name and size</li>
        <li>Reason for return or exchange</li>
        <li>Clear photos of the product showing the issue (if applicable)</li>
      </ul>

      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">
        Refunds
      </h2>
      <p className="text-gray-700 mb-4">
        Refunds will only be processed if a replacement is not available.
        Refunds will be initiated to your original payment method within{" "}
        <strong>7-10 business days</strong> after approval.
      </p>

      <p className="text-gray-600 text-sm mt-8 italic">
        *Please note: Items purchased on sale or with promotional discounts are
        not eligible for returns or exchanges unless they are defective.
      </p>
    </div>
  );
}
