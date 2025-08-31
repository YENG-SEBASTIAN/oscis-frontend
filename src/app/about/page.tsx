"use client";

import { motion } from "framer-motion";
import { CheckCircle, Users, ShoppingBag, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold"
        >
          About OSCIS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="mt-4 max-w-2xl mx-auto text-lg md:text-xl"
        >
          Empowering commerce with simplicity, security, and trust.
        </motion.p>
      </section>

      {/* Our Story */}
      <section className="py-16 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src="logo.jpg"
            alt="About OSCIS"
            className="rounded-2xl shadow-lg w-full h-80 object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-black mb-4">Our Story</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            OSCIS was founded with a vision to simplify online shopping and
            payment processes for customers. We bring
            together technology, security, and seamless design to create a
            reliable platform that empowers both buyers.
          </p>
          <p className="text-gray-700 leading-relaxed">
            OSCIS provides solutions that make digital transactions fast, 
            transparent, andstress-free.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white py-16 px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-black mb-12">
          Our Core Values
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-md transition">
            <CheckCircle className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-black mb-2">
              Transparency
            </h3>
            <p className="text-gray-600 text-sm">
              We prioritize clear processes, honest communication, and fair
              transactions.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-md transition">
            <Shield className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-black mb-2">
              Security
            </h3>
            <p className="text-gray-600 text-sm">
              Data protection and secure payments are at the heart of everything
              we build.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-md transition">
            <Users className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-black mb-2">
              Customer First
            </h3>
            <p className="text-gray-600 text-sm">
              We exist to serve people—ensuring convenience, trust, and
              satisfaction for every user.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-md transition">
            <ShoppingBag className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-black mb-2">
              Innovation
            </h3>
            <p className="text-gray-600 text-sm">
              We constantly improve to deliver better, smarter, and more
              efficient solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16 px-6 text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">
          Ready to Experience OSCIS?
        </h2>
        <p className="max-w-2xl mx-auto mb-6 text-lg">
          Join our customers already using OSCIS to make
          secure, seamless transactions every day.
        </p>
        <a
          href="/"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition"
        >
          Get Started
        </a>
      </section>
    </div>
  );
}
