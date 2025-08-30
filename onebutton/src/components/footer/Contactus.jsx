import React, { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `mailto:onebutton.co@gmail.com?subject=Customer Inquiry from ${formData.name}&body=Name: ${formData.name}%0AEmail: ${formData.email}%0AMessage: ${formData.message}`;
  };

  return (
  <div className="container mx-auto px-4 md:px-10 py-16 max-w-2xl">
    {/* Header */}
    <h1 className="text-3xl md:text-4xl font-semibold tracking-wide text-center text-gray-900 mb-6">
      Contact Us
    </h1>
    <p className="text-gray-600 leading-relaxed text-center mb-10 max-w-xl mx-auto">
      We’d love to hear from you. Whether you have a question about our products, 
      returns, or anything else, reach out at{" "}
      <a
        href="mailto:onebutton.co@gmail.com"
        className="text-black underline hover:opacity-70 transition"
      >
        onebutton.co@gmail.com
      </a>{" "}
      or use the form below.
    </p>

    {/* Form */}
    <form
      onSubmit={handleSubmit}
      className="bg-white/90 backdrop-blur-md shadow-md border border-gray-200 p-8 space-y-6"
    >
      {/* Name */}
      <div>
        <label className="block text-gray-800 font-medium mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-gray-800 font-medium mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-gray-800 font-medium mb-2">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="4"
          className="w-full border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-black text-white font-medium py-3 tracking-wide hover:bg-gray-900 transition-all"
      >
        Send Message
      </button>
    </form>
  </div>
);

}
