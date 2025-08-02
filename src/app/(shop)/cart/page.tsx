'use client';

import { X, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  inStock: boolean;
};

export default function CartPage() {
    const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 199.99,
      image: '/headphones.jpg',
      quantity: 1,
      inStock: true,
    },
    {
      id: '2',
      name: 'Ergonomic Office Chair',
      price: 249.99,
      image: '/chair.jpg',
      quantity: 2,
      inStock: true,
    },
    {
      id: '3',
      name: 'Limited Edition Smartwatch',
      price: 349.99,
      image: '/watch.jpg',
      quantity: 1,
      inStock: false,
    },
  ]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.success('Item removed from cart');
  };

  const checkout = () => {
    toast.success('Redirecting to checkout...');
    router.push("/checkout")
    // You can navigate to your checkout page here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">Your Cart</h1>
          <p className="text-gray-600 mt-2">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-300" />
              <h2 className="mt-4 text-xl font-semibold text-gray-800">Your cart is empty</h2>
              <p className="mt-1 text-gray-500">Start adding some amazing products.</p>
              <Link
                href="/products"
                className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-start gap-4 p-5 hover:bg-gray-50">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)}</p>
                          {!item.inStock && (
                            <span className="mt-1 inline-block text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                              Out of stock
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-rose-500 transition"
                          aria-label="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={!item.inStock}
                            className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Summary */}
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <div className="flex justify-between text-lg font-medium text-gray-800 mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">Shipping and taxes will be calculated during checkout.</p>
                <button
                  onClick={checkout}
                  disabled={cartItems.some((item) => !item.inStock)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 text-white font-semibold bg-blue-600 hover:bg-blue-700 transition rounded-lg disabled:opacity-50"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-center mt-4">
                  <Link href="/products" className="text-sm text-blue-600 hover:text-blue-500 transition">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
