import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

const statusSteps = [
  { key: 'Pending', label: 'Pending', icon: <Clock className="w-5 h-5" /> },
  { key: 'Paid & Confirmed', label: 'Confirmed', icon: <CheckCircle className="w-5 h-5" /> },
  { key: 'Processing', label: 'Processing', icon: <Package className="w-5 h-5" /> },
  { key: 'Shipped', label: 'Shipped', icon: <Truck className="w-5 h-5" /> },
  { key: 'Delivered', label: 'Delivered', icon: <CheckCircle className="w-5 h-5" /> },
  { key: 'Cancelled', label: 'Cancelled', icon: <XCircle className="w-5 h-5" /> },
];

export default function OrderTracking({ order }: { order: any }) {
  let timelineSteps = statusSteps;
  if (order.order_status === 'Cancelled') {
    timelineSteps = statusSteps.filter(
      (s) => s.key === 'Pending' || s.key === 'Cancelled'
    );
  }
  const currentStepIndex = timelineSteps.findIndex(
    (s) => s.key === order.order_status
  );

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
      <h2 className="text-lg font-bold text-black mb-6">Order Tracking</h2>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {timelineSteps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          return (
            <div key={step.key} className="flex items-center sm:flex-1">
              <div
                className={`flex flex-col items-center sm:items-start ${
                  index < timelineSteps.length - 1 ? 'sm:w-full' : ''
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isCompleted
                      ? order.order_status === 'Cancelled' &&
                        step.key === 'Cancelled'
                        ? 'bg-red-600 text-white'
                        : 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`mt-2 text-sm font-semibold ${
                    isCompleted
                      ? order.order_status === 'Cancelled' &&
                        step.key === 'Cancelled'
                        ? 'text-red-600'
                        : 'text-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < timelineSteps.length - 1 && (
                <div
                  className={`hidden sm:block h-1 w-full ${
                    index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
