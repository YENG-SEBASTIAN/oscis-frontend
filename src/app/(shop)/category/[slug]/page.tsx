import { notFound } from 'next/navigation';
import { categories } from '@/data/category';
import ProductList from '@/components/product/ProductCard';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) return notFound();

  const products = category.products || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/category"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="mr-1 h-4 w-4 text-blue-400" />
          Back to all categories
        </Link>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{category.description}</p>
        {products.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      <ProductList products={products} />
    </div>
  );
}