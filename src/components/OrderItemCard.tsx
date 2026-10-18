import React from 'react';
import { Order, OrderItem } from '../types';

export interface OrderCardData {
  productImage?: string;
  title?: string;
  status?: string;
  deliveryDate?: string;
  size?: string;
  qty?: number | string;
  orderID?: string;
  orderStatus?: string;
  estimatedDeliveryDate?: string;
  itemsList?: OrderItem[];
  totalAmount?: number;
  paymentMethod?: string;
}

interface OrderItemCardProps {
  order: OrderCardData | Order;
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
}

export const OrderItemCard: React.FC<OrderItemCardProps> = ({
  order,
  onClick,
  isSelected = false,
  className = '',
}) => {
  const o = order as any;
  // Resolve fields from either top-level or order.itemsList / order model
  const firstItem = o.itemsList && o.itemsList.length > 0 ? o.itemsList[0] : null;

  const productImage: string =
    o.productImage ||
    firstItem?.image ||
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80';

  const title: string =
    o.title ||
    firstItem?.title ||
    'Streetwear Graphic Tee';

  const status: string =
    o.status ||
    o.orderStatus ||
    'Placed';

  const deliveryDate: string =
    o.deliveryDate ||
    (o.estimatedDeliveryDate
      ? `Arriving by ${o.estimatedDeliveryDate}`
      : 'Arriving in 3-5 days');

  const size: string =
    o.size ||
    firstItem?.selectedSize ||
    'L';

  const qty: number | string =
    o.qty !== undefined
      ? o.qty
      : firstItem?.quantity !== undefined
      ? firstItem.quantity
      : o.itemsList
      ? o.itemsList.reduce((acc: number, i: any) => acc + (i.quantity || 1), 0)
      : 1;

  return (
    <div
      onClick={onClick}
      className={`bg-white p-4 rounded-lg border ${
        isSelected ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-gray-100'
      } mb-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md ${
        onClick ? 'cursor-pointer active:scale-[0.99]' : ''
      } ${className}`}
    >
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <img
          src={productImage}
          alt={title}
          className="w-20 h-20 object-cover rounded-md bg-gray-100"
          loading="lazy"
        />

        {/* Details */}
        <div>
          <h3 className="font-semibold text-gray-900 text-base">{status}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{deliveryDate}</p>
          <p className="text-xs text-gray-600 mt-1">
            Size: <span className="font-medium text-gray-800">{size}</span> • Qty:{' '}
            <span className="font-medium text-gray-800">{qty}</span>
          </p>
        </div>
      </div>

      {/* Arrow Icon */}
      <span className="text-gray-400 text-lg font-light select-none">&gt;</span>
    </div>
  );
};
