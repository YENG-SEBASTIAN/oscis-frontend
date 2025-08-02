'use client';

import React from 'react';

interface CategoryCardProps {
  name: string;
  count: string;
  image: string;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, count, image, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-sm text-gray-200">{count}</p>
        </div>
      </div>

      <div className="p-6">
        <button
          className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-transform duration-300 transform group-hover:scale-105">
          Explore {name}
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;
