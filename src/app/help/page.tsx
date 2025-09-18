"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, RefreshCw, Ruler } from "lucide-react";

const helpLinks = [
  {
    title: "Shipping Policy",
    href: "/help/shipping",
    icon: Package,
    description: "Learn about our delivery times, costs, and carriers.",
  },
  {
    title: "Returns & Exchanges",
    href: "/help/returns",
    icon: RefreshCw,
    description: "Understand our process for returns, refunds, and exchanges.",
  },
  {
    title: "Size Guide",
    href: "/help/size-guide",
    icon: Ruler,
    description: "Find the right fit with our detailed size charts.",
  },
];

export default function HelpCenterPage() {
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
          Help Center
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="mt-4 max-w-2xl mx-auto text-lg md:text-xl"
        >
          Everything you need to know about shipping, returns, and sizing.
        </motion.p>
      </section>

      {/* Help Cards */}
      <section className="py-16 px-6">
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {helpLinks.map(({ title, href, icon: Icon, description }) => (
            <motion.div
              key={title}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition"
            >
              <Icon className="h-12 w-12 text-blue-600 mx-auto mb-6" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
              <p className="text-gray-600 text-sm mb-6">{description}</p>
              <Link
                href={href}
                className="inline-block text-blue-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
              >
                Learn more →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
