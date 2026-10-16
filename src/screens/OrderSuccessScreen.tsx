import React, { useEffect } from 'react';
import { CheckCircle2, Package, ArrowRight, Home, Calendar, MapPin, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order } from '../types';

interface OrderSuccessScreenProps {
  order: Order;
  onTrackOrder: (order: Order) => void;
  onContinueShopping: () => void;
}

export const OrderSuccessScreen: React.FC<OrderSuccessScreenProps> = ({
  order,
  onTrackOrder,
  onContinueShopping,
}) => {
  useEffect(() => {
    // Fire celebratory confetti bursts
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#F4F4F5', '#10B981'],
      });
    } catch (e) {
      // Ignore if canvas not supported
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-5 bg-zinc-950 text-white min-h-[640px] max-w-lg mx-auto w-full">
      {/* Top Success Badge */}
      <div className="w-full flex flex-col items-center text-center pt-4 space-y-3">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          </div>
          <div className="absolute -top-1 -right-1 p-1 bg-amber-400 text-zinc-950 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-semibold">
            Order Confirmed
          </span>
          <h2 className="text-2xl font-display font-extrabold text-white mt-1">
            Thank You for Dropping In!
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs">
            We've received your streetwear order and sent the digital invoice receipt.
          </p>
        </div>
      </div>

      {/* Order Info Card */}
      <div className="w-full rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 my-5 space-y-4">
        {/* Order ID & Status */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[10px] uppercase font-mono text-zinc-500 block">Unique Order ID</span>
            <span className="text-base font-bold font-mono text-amber-400">{order.orderID}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-zinc-500 block">Payment Method</span>
            <span className="text-xs font-semibold text-zinc-200">
              {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid Online (UPI)'}
            </span>
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
          <div className="p-2 rounded-lg bg-zinc-900 text-amber-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="text-zinc-400 block text-[11px]">Estimated Doorstep Delivery</span>
            <span className="text-white font-semibold">{order.estimatedDeliveryDate}</span>
          </div>
        </div>

        {/* Shipping Address Summary */}
        <div className="flex items-start gap-2.5 text-xs text-zinc-300">
          <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-white font-medium block">
              {order.shippingAddress.fullName} · {order.shippingAddress.phone}
            </span>
            <span className="text-zinc-400 text-[11px]">
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
            </span>
          </div>
        </div>

        {/* Items Brief */}
        <div className="pt-2 border-t border-zinc-800 space-y-1.5 text-xs">
          <span className="text-[11px] font-mono text-zinc-400 block uppercase">
            Items ({order.itemsList.reduce((acc, i) => acc + i.quantity, 0)})
          </span>
          {order.itemsList.map((item, idx) => (
            <div key={idx} className="flex justify-between text-zinc-300">
              <span className="truncate max-w-[220px]">
                {item.quantity}× {item.title} ({item.selectedSize})
              </span>
              <span className="font-mono text-white tabular-nums">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-white pt-2 border-t border-zinc-800 text-sm">
            <span>Total Paid</span>
            <span className="text-amber-400 font-sans tabular-nums">
              ₹{order.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2.5 pb-2">
        <button
          onClick={() => onTrackOrder(order)}
          className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-400/10"
        >
          <Package className="w-4 h-4" />
          <span>Track Order Live</span>
        </button>

        <button
          onClick={onContinueShopping}
          className="w-full h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
      </div>
    </div>
  );
};
