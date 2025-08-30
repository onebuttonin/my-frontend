import React from "react";

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 md:px-10 py-16 max-w-3xl">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-semibold tracking-wide text-center text-gray-900 mb-8">
        About Us
      </h1>

      {/* Intro */}
      <p className="text-gray-700 leading-relaxed text-center mb-12">
        At <span className="font-medium">OneButton</span>, we believe luxury
        shouldn’t be limited to the few—it should be redefined for everyone. Our
        mission is simple: to create clothing that looks and feels premium, yet
        remains surprisingly affordable.
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
        Our Philosophy
      </h2>
      <p className="text-gray-700 leading-relaxed mb-8">
        Luxury, for us, is not just about the price tag. It’s about the comfort
        of wearing the perfect fabric, the confidence of a timeless fit, and the
        elegance of minimal, detail-focused design.
      </p>

      {/* Section 2 */}
      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
        Our Design Approach
      </h2>
      <p className="text-gray-700 leading-relaxed mb-8">
        We design pieces that merge streetwear ease with luxury aesthetics—
        oversized silhouettes, bold yet refined prints, and premium-quality
        materials that elevate everyday wear.
      </p>

      {/* Section 3 */}
      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
        Our Promise
      </h2>
      <p className="text-gray-700 leading-relaxed">
        With <span className="font-medium">OneButton</span>, you don’t just wear
        clothes—you experience{" "}
        <span className="italic">Luxury Redefined</span>: premium in feel,
        timeless in look, but always within reach.
      </p>
    </div>
  );
}
