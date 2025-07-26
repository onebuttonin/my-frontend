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
    window.location.href = `mailto:onebuttonco@gmail.com?subject=Customer Inquiry from ${formData.name}&body=Name: ${formData.name}%0AEmail: ${formData.email}%0AMessage: ${formData.message}`;
  };

  return (
    <div className="container mx-auto px-4 md:px-10 py-8 max-w-xl">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
        Contact Us
      </h1>
      <p className="text-gray-700 leading-relaxed mb-6">
        We’d love to hear from you! Whether you have a question about our
        products, returns, or anything else, feel free to reach out to us at{" "}
        <a
          href="mailto:onebutton.co@gmail.com"
          className="text-blue-600 underline hover:text-blue-800"
        >
          onebuttonco@gmail.com
        </a>
        . Or, you can use the contact form below:
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 space-y-4"
      >
        <div>
          <label className="block text-gray-800 font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
        </div>

        <div>
          <label className="block text-gray-800 font-medium mb-1">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white font-semibold py-2 rounded-lg hover:bg-gray-800 transition-all"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
