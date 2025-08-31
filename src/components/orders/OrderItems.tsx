import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { AppSettings } from '@/settings/settings';

export default function OrderItems({ order }: { order: any }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
      <h3 className="text-lg font-bold mb-4 text-black">
        Items ({order.items.length})
      </h3>
      <div className="space-y-4">
        {order.items.map((item: any) => (
          <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
            <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              <Image
                src={item.product_image || '/placeholder.png'}
                alt={item.product_name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-md font-bold text-black">
                {item.product_name}
              </h4>
              <p className="text-sm text-black">Qty: {item.quantity}</p>
              <p className="text-sm text-black">
                Price: {AppSettings.currency}
                {item.price}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-black">
                {AppSettings.currency}
                {item.total_price}
              </p>
              <button className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                <ShoppingCart className="h-4 w-4 mr-1" />
                Buy Again
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
