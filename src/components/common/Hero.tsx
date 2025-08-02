// Hero.tsx
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { heroSlides } from '@/data/sliders';

interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  productImage: string;
  cta: string;
  accent: string;
}



const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleSlideChange((prev: number) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSlideChange = (newSlide: number | ((prev: number) => number)) => {
    if (typeof newSlide === 'function') {
      setCurrentSlide(newSlide);
    } else {
      setCurrentSlide(newSlide);
    }
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <section className="relative h-[700px] overflow-hidden">
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
          >
            <div className="absolute inset-0">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.backgroundImage})`,
                  transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="text-white space-y-6">
                    <div className={`transition-all ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}> 
                      <span className="inline-block bg-blue-600 px-4 py-2 rounded-full text-sm font-semibold">{slide.accent}</span>
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">{slide.title}</h1>
                    </div>
                    <div className={`transition-all ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-blue-100">{slide.subtitle}</h2>
                      <p className="text-lg text-gray-200 max-w-lg">{slide.description}</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center space-x-3">
                      <span>{slide.cta}</span>
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <div className={`hidden lg:flex justify-center transform ${index === currentSlide ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-8 opacity-0 scale-95'}`}>
                    <div className="relative">
                      <img src={slide.productImage} alt={slide.title} className="w-80 h-80 object-cover rounded-2xl shadow-2xl" />
                      <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-3 rounded-full animate-pulse">
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
      <button onClick={() => handleSlideChange((currentSlide - 1 + heroSlides.length) % heroSlides.length)} disabled={isAnimating} className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-3 rounded-full">
        <ChevronLeft size={28} />
      </button>
      <button onClick={() => handleSlideChange((currentSlide + 1) % heroSlides.length)} disabled={isAnimating} className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-3 rounded-full">
        <ChevronRight size={28} />
      </button>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`${index === currentSlide ? 'w-8 h-3 bg-white' : 'w-3 h-3 bg-white/50'} rounded-full transition-all duration-300`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
