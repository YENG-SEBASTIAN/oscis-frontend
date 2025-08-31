"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { AppSettings } from "@/settings/settings";
import { useNotificationStore } from "@/store/useNotificationStore";
import toast, { Toaster } from "react-hot-toast";

export default function ContactPage() {
  const { submitMessage, loading } = useNotificationStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitMessage(formData);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg max-w-2xl mx-auto">
          We’re here to help! Whether you have questions about our services,
          need technical support, or want to partner with us, our team will get
          back to you as soon as possible.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-black mb-6">Send us a Message</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="w-full text-blue-500 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full text-blue-500 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject of your message"
                required
                className="w-full text-blue-500 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                rows={5}
                required
                className="w-full text-blue-500 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-3 rounded-lg transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Contact Info & Map */}
        <div className="bg-white rounded-xl shadow p-6 space-y-6">
          <h2 className="text-2xl font-bold text-black mb-4">Get in Touch</h2>
          <p className="text-gray-700">
            You can also reach us through the following channels:
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="text-blue-600 w-6 h-6" />
              <span className="text-gray-800">{AppSettings.contact.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-blue-600 w-6 h-6" />
              <span className="text-gray-800">{AppSettings.contact.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-blue-600 w-6 h-6" />
              <span className="text-gray-800">{AppSettings.contact.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-blue-600 w-6 h-6" />
              <span className="text-gray-800">Mon - Fri: 9am - 6pm</span>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">📍</span> Our Office Location
            </h2>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d945.2486749780982!2d-1.7822621!3d53.6447251!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487bdec1884a38c3%3A0x4d3d9f3c6fdb9dbf!2s34%20Packhorse%20Walk%2C%20Packhorse%20Shopping%20Centre%2C%20Huddersfield%20HD1%202RT%2C%20UK!5e0!3m2!1sen!2suk!4v1735600000000!5m2!1sen!2suk"
              width="100%"
              height="250"
              style={{ border: 0 }}
              loading="lazy"
              className="rounded-lg shadow"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
