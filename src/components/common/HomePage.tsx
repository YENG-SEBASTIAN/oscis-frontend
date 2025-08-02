import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart, Eye, Truck, Shield, RotateCcw, Award, Zap, Users } from 'lucide-react';

const HomePage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const [featuredProducts] = useState([
        {
            id: 1,
            name: "Premium Leather Sneakers",
            price: 149.99,
            originalPrice: 199.99,
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
            rating: 4.8,
            reviews: 324,
            badge: "Best Seller",
            category: "Sneakers"
        },
        {
            id: 2,
            name: "Athletic Running Shoes",
            price: 89.99,
            originalPrice: 119.99,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
            rating: 4.6,
            reviews: 189,
            badge: "New Arrival",
            category: "Sports"
        },
        {
            id: 3,
            name: "Classic Oxford Dress Shoes",
            price: 199.99,
            originalPrice: 249.99,
            image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop",
            rating: 4.9,
            reviews: 156,
            badge: "Limited Edition",
            category: "Formal"
        },
        {
            id: 4,
            name: "Casual Canvas Loafers",
            price: 79.99,
            originalPrice: 99.99,
            image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop",
            rating: 4.7,
            reviews: 243,
            badge: "Popular",
            category: "Casual"
        }
    ]);

    const [categories] = useState([
        { name: "Sneakers", icon: "👟", count: "180+ styles", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop" },
        { name: "Formal Shoes", icon: "👞", count: "95+ styles", image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=300&h=200&fit=crop" },
        { name: "Boots", icon: "🥾", count: "120+ styles", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=300&h=200&fit=crop" },
        { name: "Sports", icon: "⚽", count: "160+ styles", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop" },
        { name: "Sandals", icon: "🩴", count: "85+ styles", image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=300&h=200&fit=crop" },
        { name: "Heels", icon: "👠", count: "110+ styles", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=200&fit=crop" }
    ]);

    const heroSlides = [
        {
            title: "Step Into Excellence",
            subtitle: "Premium Footwear Collection 2024",
            description: "Discover luxury meets comfort with up to 40% off selected premium shoes",
            backgroundImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h=600&fit=crop",
            productImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
            cta: "Shop Premium Collection",
            accent: "New Season"
        },
        {
            title: "Run Your World",
            subtitle: "Athletic Performance Series",
            description: "Professional-grade running shoes designed for champions. Free shipping on orders over $75",
            backgroundImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=600&fit=crop",
            productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
            cta: "Explore Athletic Line",
            accent: "Performance"
        },
        {
            title: "Elegance Redefined",
            subtitle: "Formal & Business Collection",
            description: "Handcrafted leather shoes for the modern professional. Limited time: Buy 2, Get 1 Free",
            backgroundImage: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1200&h=600&fit=crop",
            productImage: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&h=500&fit=crop",
            cta: "Shop Formal Wear",
            accent: "Luxury"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            handleSlideChange((prev: any) => (prev + 1) % heroSlides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [heroSlides.length]);

    const handleSlideChange = (newSlide: any) => {
        if (typeof newSlide === 'function') {
            setCurrentSlide(newSlide);
        } else {
            setCurrentSlide(newSlide);
        }
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 800);
    };

    const nextSlide = () => {
        handleSlideChange((currentSlide + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        handleSlideChange((currentSlide - 1 + heroSlides.length) % heroSlides.length);
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <section className="relative h-[700px] overflow-hidden">
                    <div className="absolute inset-0">
                        {heroSlides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                                    }`}
                            >
                                {/* Background with gradient overlay */}
                                <div className="absolute inset-0">
                                    <div
                                        className="w-full h-full bg-cover bg-center transform transition-transform duration-12000 ease-out"
                                        style={{
                                            backgroundImage: `url(${slide.backgroundImage})`,
                                            transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)'
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 flex items-center">
                                    <div className="container mx-auto px-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                            {/* Text Content */}
                                            <div className="text-white space-y-6">
                                                <div className={`transform transition-all duration-1000 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                                    }`} style={{ transitionDelay: '200ms' }}>
                                                    <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                                        {slide.accent}
                                                    </span>
                                                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                                                        {slide.title}
                                                    </h1>
                                                </div>

                                                <div className={`transform transition-all duration-1000 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                                    }`} style={{ transitionDelay: '400ms' }}>
                                                    <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-4 text-blue-100">
                                                        {slide.subtitle}
                                                    </h2>
                                                    <p className="text-lg md:text-xl text-gray-200 max-w-lg leading-relaxed">
                                                        {slide.description}
                                                    </p>
                                                </div>

                                                <div className={`transform transition-all duration-1000 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                                    }`} style={{ transitionDelay: '600ms' }}>
                                                    <button className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-3">
                                                        <span>{slide.cta}</span>
                                                        <ChevronRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Product Image */}
                                            <div className={`hidden lg:flex justify-center items-center transform transition-all duration-1000 ${index === currentSlide ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-8 opacity-0 scale-95'
                                                }`} style={{ transitionDelay: '300ms' }}>
                                                <div className="relative">
                                                    <div className="absolute -inset-4 bg-white/10 backdrop-blur-sm rounded-3xl"></div>
                                                    <img
                                                        src={slide.productImage}
                                                        alt={slide.title}
                                                        className="relative w-80 h-80 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg animate-pulse">
                                                        <Zap size={24} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        disabled={isAnimating}
                        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 disabled:opacity-50"
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <button
                        onClick={nextSlide}
                        disabled={isAnimating}
                        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 disabled:opacity-50"
                    >
                        <ChevronRight size={28} />
                    </button>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                        {heroSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleSlideChange(index)}
                                disabled={isAnimating}
                                className={`transition-all duration-300 ${index === currentSlide
                                        ? 'w-8 h-3 bg-white rounded-full'
                                        : 'w-3 h-3 bg-white/50 hover:bg-white/70 rounded-full'
                                    }`}
                            />
                        ))}
                    </div>
                </section>

                {/* Categories Section */}
                <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Shop by Category</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Find the perfect footwear for every occasion and style</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categories.map((category, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-4"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <div className="text-3xl mb-2">{category.icon}</div>
                                            <h3 className="text-xl font-bold">{category.name}</h3>
                                            <p className="text-sm text-gray-200">{category.count}</p>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform group-hover:scale-105">
                                            Explore {category.name}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Products */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Featured Footwear</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Handpicked premium shoes that combine style, comfort, and quality</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-2xl shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-500 group overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                {product.badge}
                                            </span>
                                        </div>
                                        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                            <button className="bg-white p-2 rounded-full shadow-xl hover:bg-red-50 transition-colors duration-200 hover:scale-110">
                                                <Heart size={18} className="text-gray-600 hover:text-red-500" />
                                            </button>
                                            <button className="bg-white p-2 rounded-full shadow-xl hover:bg-blue-50 transition-colors duration-200 hover:scale-110">
                                                <Eye size={18} className="text-gray-600 hover:text-blue-500" />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center mb-4">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                                                        className="drop-shadow-sm"
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-500 ml-2 font-medium">
                                                ({product.reviews} reviews)
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl font-bold text-gray-800">
                                                    ${product.price}
                                                </span>
                                                <span className="text-lg text-gray-400 line-through">
                                                    ${product.originalPrice}
                                                </span>
                                            </div>
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                                                Save ${(product.originalPrice - product.price).toFixed(2)}
                                            </span>
                                        </div>
                                        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2">
                                            <ShoppingCart size={18} />
                                            <span>Add to Cart</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


            <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div >
    </>
  );
};

export default HomePage;