"use client";

import { motion } from "framer-motion";

export default function SizeGuidePage() {
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
          Size Guide
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="mt-4 max-w-2xl mx-auto text-lg md:text-xl"
        >
          Find the perfect fit with our detailed size charts and recommendations.
        </motion.p>
      </section>

      {/* Content Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-12 text-gray-700 leading-relaxed">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p>
              Use the chart below to select the right size. If you’re between sizes,{" "}
              we recommend choosing the <span className="font-medium">larger size</span>{" "}
              for a more comfortable fit.
            </p>
          </motion.div>

          {/* Size Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="overflow-x-auto"
          >
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm md:text-base text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Size</th>
                  <th className="p-3">35</th>
                  <th className="p-3">36</th>
                  <th className="p-3">37</th>
                  <th className="p-3">38</th>
                  <th className="p-3">39</th>
                  <th className="p-3">40</th>
                  <th className="p-3">41</th>
                  <th className="p-3">42</th>
                  <th className="p-3">43</th>
                  <th className="p-3">44</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3 font-medium text-left">UK</td>
                  <td>3</td>
                  <td>3.5</td>
                  <td>4.5</td>
                  <td>5.5</td>
                  <td>6</td>
                  <td>6.5</td>
                  <td>7</td>
                  <td>7.5</td>
                  <td>8</td>
                  <td>9</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-medium text-left">EU</td>
                  <td>35</td>
                  <td>36</td>
                  <td>37</td>
                  <td>38</td>
                  <td>39</td>
                  <td>40</td>
                  <td>41</td>
                  <td>42</td>
                  <td>43</td>
                  <td>44</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-medium text-left">US</td>
                  <td>5.5</td>
                  <td>6</td>
                  <td>7</td>
                  <td>8</td>
                  <td>8.5</td>
                  <td>9</td>
                  <td>9.5</td>
                  <td>10</td>
                  <td>10.5</td>
                  <td>11</td>
                </tr>
              </tbody>
            </table>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
