import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      {/* Home Link */}
      <Link 
        href="/" 
        className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
        aria-label="Home"
      >
        <Home size={16} />
      </Link>
      
      {items.length > 0 && (
        <ChevronRight size={14} className="text-gray-400" />
      )}

      {/* Breadcrumb Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center space-x-2">
            {item.href && !isLast ? (
              <Link 
                href={item.href}
                className="text-gray-500 hover:text-blue-600 transition-colors max-w-40 truncate"
                title={item.label}
              >
                {item.label}
              </Link>
            ) : (
              <span 
                className={`max-w-40 truncate ${
                  isLast 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-500'
                }`}
                title={item.label}
              >
                {item.label}
              </span>
            )}
            
            {!isLast && (
              <ChevronRight size={14} className="text-gray-400" />
            )}
          </div>
        );
      })}
    </nav>
  );
}