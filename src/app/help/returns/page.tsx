"use client";

import { motion } from "framer-motion";

export default function ReturnsPage() {
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
          Returns & Exchanges
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="mt-4 max-w-2xl mx-auto text-lg md:text-xl"
        >
          Shop with confidence — if something isn’t right, we’ve made returns simple.
        </motion.p>
      </section>

      {/* Content Section */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-10 text-gray-700 leading-relaxed">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Return Window</h2>
            <p>
              Items may be returned within <span className="font-medium">7 days of delivery</span> 
              for a full refund or exchange.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Condition of Items</h2>
            <p>
              Products must be <span className="font-medium">unused</span>, in their 
              <span className="font-medium"> original packaging</span>, and include proof of purchase.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Refund Process</h2>
            <p>
              Refunds are processed within <span className="font-medium">5–7 business days</span> 
              after we receive your returned items. You’ll be notified once your refund is issued.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
