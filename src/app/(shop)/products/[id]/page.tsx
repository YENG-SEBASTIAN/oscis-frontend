'use client';

import { notFound } from 'next/navigation';
import { featuredProducts } from '@/data/products';
import { ProductInterface } from '@/types/types';
import Image from 'next/image';
import { ShoppingCart, Shield, Truck, RefreshCw, Star, Check, Package } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const {id} = await params;
  const productId = id;

  const product: ProductInterface | undefined = featuredProducts.find(
    (item) => item.id.toString() === productId
  );

  if (!product) return notFound();

  // Mock related products (you can replace this with actual logic)
  const relatedProducts = featuredProducts
    .filter(item => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  // If no products in same category, show any other products
  const finalRelatedProducts = relatedProducts.length > 0 
    ? relatedProducts 
    : featuredProducts.filter(item => item.id !== product.id).slice(0, 4);

  const productFeatures = [
    "Actual unedited pictures of the product - What you see is what you get",
    "100% Authentic & Genuine product - All items sold at Mgears are personally inspected by our team for originality",
    "Imported from USA",
    "Not a Fake / Not a First Copy / Not a Replica",
    "Pre-owned and pre-used",
    "We offer 7 days easy exchange policy in case if there is a size issue or you are not satisfied with the product"
  ];

  const conditionGuide = [
    { rating: "10/10", description: "Perfect - Like new condition" },
    { rating: "9/10", description: "Excellent - Minor signs of wear" },
    { rating: "8/10", description: "Very Good - Light wear, fully functional" },
    { rating: "7/10", description: "Good - Noticeable wear but good condition" },
    { rating: "6/10", description: "Fair - Moderate wear, all functions work" }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative w-full h-[500px] rounded-xl overflow-hidden border-2 border-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Authentic Product Guarantee</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {product.category}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Premium 10/10
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-3xl font-bold text-blue-600">${product.price}</span>
                  <span className="line-through text-gray-400 text-lg">${product.originalPrice}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600">
                    ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                  </span>
                </div>
              </div>

              {/* Product Specifications */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Weight</div>
                  <div className="font-semibold text-gray-900">1 kg</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Brand</div>
                  <div className="font-semibold text-gray-900">Columbia</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Condition</div>
                  <div className="font-semibold text-green-600">Premium 10/10</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Size</div>
                  <div className="font-semibold text-gray-900">EUR 43/ UK 9/ 28CM</div>
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Color:</label>
                <div className="flex space-x-2">
                  <button className="w-8 h-8 rounded-full bg-black border-2 border-gray-300 focus:border-blue-500"></button>
                  <button className="w-8 h-8 rounded-full bg-gray-600 border-2 border-gray-300 focus:border-blue-500"></button>
                  <button className="w-8 h-8 rounded-full bg-blue-600 border-2 border-gray-300 focus:border-blue-500"></button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => console.log('Added to cart:', product)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition transform flex items-center space-x-2 shadow-lg"
              >
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                  <div className="text-xs text-gray-600">Fast Shipping</div>
                </div>
                <div className="text-center">
                  <RefreshCw className="w-6 h-6 mx-auto text-green-600 mb-1" />
                  <div className="text-xs text-gray-600">7-Day Exchange</div>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto text-purple-600 mb-1" />
                  <div className="text-xs text-gray-600">Authentic</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Sections */}
          <div className="border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Features */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Product Features
                  </h3>
                  <ul className="space-y-3">
                    {productFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Condition Guide */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    Condition Guide
                  </h3>
                  <div className="space-y-3">
                    {conditionGuide.map((condition, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="font-semibold text-gray-900">{condition.rating}</span>
                        <span className="text-gray-600 text-sm">{condition.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || 'This premium pre-owned item has been carefully inspected and authenticated by our team. Each product comes with our guarantee of authenticity and quality. We ensure that what you see in the pictures is exactly what you will receive.'}
                </p>
              </div>

              {/* Related Products */}
              {finalRelatedProducts.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {finalRelatedProducts.map((relatedProduct) => (
                      <div key={relatedProduct.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="relative h-48">
                          <Image
                            src={relatedProduct.image}
                            alt={relatedProduct.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2 truncate">{relatedProduct.name}</h4>
                          <p className="text-xs text-gray-500 mb-2">{relatedProduct.category}</p>
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="font-bold text-blue-600">${relatedProduct.price}</span>
                            <span className="line-through text-gray-400 text-sm">${relatedProduct.originalPrice}</span>
                          </div>
                          <button 
                            onClick={() => window.location.href = `/products/${relatedProduct.id}`}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}