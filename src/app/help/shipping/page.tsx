"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";

export default function ShippingPolicyPage() {
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
          Shipping Policy
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="mt-4 max-w-2xl mx-auto text-lg md:text-xl"
        >
          Fast, reliable, and secure delivery for every order.
        </motion.p>
      </section>

      {/* Policy Content */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Package className="h-8 w-8 text-blue-600" aria-hidden="true" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Delivery Information
            </h2>
          </div>

          <div className="space-y-6 text-gray-700 leading-relaxed max-w-prose">
            <p>
              We aim to process and ship all orders within{" "}
              <span className="font-semibold text-gray-900">
                1–2 business days
              </span>
              . Standard delivery usually takes{" "}
              <span className="font-semibold text-gray-900">
                3–7 business days
              </span>
              , depending on your location.
            </p>
            <p>
              Our logistics partners include{" "}
              <span className="font-semibold text-gray-900">
                Yodel, Evri, Inpost, and Royal Mail
              </span>
              , ensuring your orders arrive safely and on time.
            </p>
            <p>
              Shipping costs are automatically calculated at checkout and may
              vary depending on order size and destination.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
