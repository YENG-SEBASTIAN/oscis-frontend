'use client';

import React from 'react';

interface CategoryCardProps {
  name: string;
  image: string;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, image, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
    >
      <div className="relative h-48 sm:h-56 md:h-60 lg:h-64">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/fallback.jpg'; // fallback image
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{name}</h3>
        </div>
      </div>

      <div className="p-4">
        <button className="w-full bg-black hover:bg-gray-700 text-white py-2 rounded-xl font-medium transition-all duration-300 transform group-hover:scale-105">
          Explore {name}
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;
