import React, { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  RefreshCw,
  MapPin,
  CreditCard,
  Banknote,
  DollarSign,
  ChevronRight,
  TrendingUp,
  Receipt,
  Eye,
  XCircle,
} from 'lucide-react';
import { Order, OrderStatus, User } from '../types';
import { api } from '../services/api';
import { OrderItemCard } from '../components/OrderItemCard';

interface OrdersScreenProps {
  currentUser: User | null;
  orders: Order[];
  onOrderUpdated: (updatedOrder: Order) => void;
  onContinueShopping: () => void;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({
  currentUser,
  orders,
  onOrderUpdated,
  onContinueShopping,
}) => {
  // Tabs: "Active" | "Delivered" | "Cancelled / Returned"
  const [filterTab, setFilterTab] = useState<'Active' | 'Delivered' | 'Cancelled / Returned'>('Active');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState<Order | null>(null);

  // Filter orders by tab
  const filteredOrders = orders.filter((order) => {
    if (filterTab === 'Active') {
      return order.orderStatus === 'Placed' || order.orderStatus === 'Shipped' || order.orderStatus === 'Out for Delivery';
    }
    if (filterTab === 'Delivered') {
      return order.orderStatus === 'Delivered';
    }
    if (filterTab === 'Cancelled / Returned') {
      return order.orderStatus === 'Cancelled' || order.orderStatus === 'Returned';
    }
    return true;
  });

  // Default selected order if none picked
  const activeOrder = orders.find((o) => o.orderID === selectedOrderId) || filteredOrders[0] || null;

  const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
    Placed: 'Shipped',
    Shipped: 'Out for Delivery',
    'Out for Delivery': 'Delivered',
    Delivered: null,
    Cancelled: null,
    Returned: null,
  };

  const handleAdvanceStatus = async (orderId: string, nextStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    try {
      const updated = await api.updateOrderStatus(orderId, nextStatus);
      onOrderUpdated(updated);
    } catch (err) {
      console.error('Failed to advance order status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    const confirm = window.confirm('Are you sure you want to cancel this order? Margin will be voided.');
    if (!confirm) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await api.updateOrderStatus(orderId, 'Cancelled');
      onOrderUpdated(updated);
    } catch (err) {
      console.error('Failed to cancel order:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-white p-4 space-y-4 pb-32 max-w-lg mx-auto w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-display font-bold text-white leading-none">
              Order Tracking & Fulfillment
            </h2>
            <span className="text-[11px] font-mono text-zinc-400">
              Customer & Reseller Order Dashboard
            </span>
          </div>
        </div>

        {/* Reseller store pill */}
        {currentUser?.resellerStoreName && (
          <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
            {currentUser.resellerStoreName.split(' ')[0]} Hub
          </span>
        )}
      </div>

      {/* Filter Tabs: "Active" | "Delivered" | "Cancelled / Returned" */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800 text-xs">
        <button
          onClick={() => setFilterTab('Active')}
          className={`py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
            filterTab === 'Active'
              ? 'bg-amber-400 text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>Active</span>
          <span className="text-[10px] font-mono opacity-80">
            ({orders.filter((o) => ['Placed', 'Shipped', 'Out for Delivery'].includes(o.orderStatus)).length})
          </span>
        </button>

        <button
          onClick={() => setFilterTab('Delivered')}
          className={`py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
            filterTab === 'Delivered'
              ? 'bg-amber-400 text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>Delivered</span>
          <span className="text-[10px] font-mono opacity-80">
            ({orders.filter((o) => o.orderStatus === 'Delivered').length})
          </span>
        </button>

        <button
          onClick={() => setFilterTab('Cancelled / Returned')}
          className={`py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
            filterTab === 'Cancelled / Returned'
              ? 'bg-amber-400 text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>Cancelled</span>
          <span className="text-[10px] font-mono opacity-80">
            ({orders.filter((o) => ['Cancelled', 'Returned'].includes(o.orderStatus)).length})
          </span>
        </button>
      </div>

      {/* Orders List / Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-zinc-800 bg-zinc-900/40 my-4 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 mx-auto flex items-center justify-center text-zinc-500">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">No {filterTab.toLowerCase()} orders</h4>
            <p className="text-xs text-zinc-400 mt-1">
              {filterTab === 'Active'
                ? 'All your recent streetwear orders have either been delivered or you have not placed an order yet.'
                : `No orders in the ${filterTab.toLowerCase()} state.`}
            </p>
          </div>
          <button
            onClick={onContinueShopping}
            className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 text-xs font-bold transition-transform active:scale-95"
          >
            Browse Streetwear Drops
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Order Cards List matching the requested UI specification */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
                {filterTab} Orders ({filteredOrders.length})
              </span>
              <span className="text-[11px] text-zinc-500">
                Tap card to view tracking & details
              </span>
            </div>

            <div>
              {filteredOrders.map((order) => (
                <OrderItemCard
                  key={order.orderID}
                  order={order}
                  isSelected={activeOrder?.orderID === order.orderID}
                  onClick={() => setSelectedOrderId(order.orderID)}
                />
              ))}
            </div>
          </div>

          {/* Active Order Detailed Tracking View */}
          {activeOrder && (
            <div className="space-y-4 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  Tracking &amp; Fulfillment · {activeOrder.orderID}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">
                  Total: ₹{activeOrder.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            <div className="space-y-4">
              {/* Order Header Summary Card */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3.5 shadow-sm">
                <div className="flex items-start justify-between pb-3 border-b border-zinc-800/80">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block">Order Reference</span>
                    <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
                      <span>{activeOrder.orderID}</span>
                      <span className="text-[11px] font-sans font-normal text-zinc-400">
                        · {new Date(activeOrder.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </h3>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        activeOrder.orderStatus === 'Delivered'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                          : activeOrder.orderStatus === 'Cancelled'
                          ? 'bg-red-950/80 text-red-400 border border-red-800/60'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {activeOrder.orderStatus}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 block mt-1">
                      {activeOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid Online (UPI)'}
                    </span>
                  </div>
                </div>

                {/* Reseller Economics Breakdown Box (Base Price, Margin Added, Final Customer Price) */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase font-mono text-[11px]">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Reseller Margin Breakdown
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        activeOrder.payoutStatus === 'Transferred'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : activeOrder.payoutStatus === 'Pending'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      Payout: {activeOrder.payoutStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-zinc-900 text-center">
                    <div className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800/60">
                      <span className="text-[10px] font-mono text-zinc-400 block">Base Price</span>
                      <span className="text-xs font-bold text-zinc-200 tabular-nums">
                        ₹{activeOrder.basePrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/30">
                      <span className="text-[10px] font-mono text-amber-400 block">Your Margin</span>
                      <span className="text-xs font-black text-amber-300 tabular-nums">
                        +₹{activeOrder.resellerMargin.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800/60">
                      <span className="text-[10px] font-mono text-zinc-400 block">Final Price</span>
                      <span className="text-xs font-bold text-white tabular-nums">
                        ₹{activeOrder.finalCustomerPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {activeOrder.payoutStatus === 'Pending' && activeOrder.orderStatus !== 'Cancelled' && (
                    <p className="text-[11px] text-zinc-400 pt-0.5">
                      * Reseller margin of <strong className="text-amber-400">₹{activeOrder.resellerMargin}</strong> will be transferred to your registered UPI ID within 24–48 hours of verified doorstep delivery.
                    </p>
                  )}
                </div>

                {/* Live Milestone Timeline */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
                      Milestone Timeline
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Est. Arrival: <strong className="text-white">{activeOrder.estimatedDeliveryDate}</strong>
                    </span>
                  </div>

                  <div className="space-y-3 pl-1">
                    {activeOrder.trackingUpdates.map((step, idx) => {
                      const isLast = idx === activeOrder.trackingUpdates.length - 1;
                      return (
                        <div key={idx} className="flex gap-3 relative">
                          {!isLast && (
                            <div
                              className={`absolute left-3 top-6 bottom-0 w-0.5 -ml-[1px] ${
                                step.completed ? 'bg-amber-400' : 'bg-zinc-800'
                              }`}
                            />
                          )}
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                              step.completed
                                ? 'bg-amber-400 text-zinc-950 font-bold'
                                : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                            }`}
                          >
                            {step.completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                          </div>
                          <div className="flex-1 pb-3">
                            <div className="flex items-center justify-between">
                              <h5 className={`text-xs font-bold ${step.completed ? 'text-white' : 'text-zinc-500'}`}>
                                {step.label}
                              </h5>
                              <span className="text-[10px] font-mono text-zinc-400">{step.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-0.5">{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Customer & Shipping Details */}
                <div className="pt-3 border-t border-zinc-800/80 space-y-2 text-xs">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase block">
                    Recipient & Delivery Address
                  </span>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-zinc-300">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white block">
                        {activeOrder.shippingAddress.fullName} · {activeOrder.shippingAddress.phone}
                      </span>
                      <span className="text-zinc-400 text-[11px] block mt-0.5">
                        {activeOrder.shippingAddress.street}, {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - {activeOrder.shippingAddress.pinCode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="pt-2 space-y-2 text-xs">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase block">
                    Order Items ({activeOrder.itemsList.reduce((acc, i) => acc + i.quantity, 0)})
                  </span>
                  {activeOrder.itemsList.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-10 h-10 rounded-lg object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <h6 className="font-semibold text-white truncate text-xs">{item.title}</h6>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono mt-0.5">
                            <span className="bg-zinc-800 px-1.5 py-0.2 rounded text-zinc-300">Size: {item.selectedSize}</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-white tabular-nums font-bold text-xs shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons: Invoice View, Status Simulator, Cancellation */}
                <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => setShowInvoiceModal(activeOrder)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Customer Invoice</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Advance Status simulator */}
                    {nextStatusMap[activeOrder.orderStatus] && (
                      <button
                        onClick={() =>
                          handleAdvanceStatus(
                            activeOrder.orderID,
                            nextStatusMap[activeOrder.orderStatus]!
                          )
                        }
                        disabled={isUpdatingStatus}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-95 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingStatus ? 'animate-spin' : ''}`} />
                        <span>Simulate: {nextStatusMap[activeOrder.orderStatus]}</span>
                      </button>
                    )}

                    {/* Cancel action if order is active */}
                    {(activeOrder.orderStatus === 'Placed' || activeOrder.orderStatus === 'Shipped') && (
                      <button
                        onClick={() => handleCancelOrder(activeOrder.orderID)}
                        className="px-2.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-950/80 text-red-400 border border-red-800/60 text-xs font-medium transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      )}

      {/* Invoice Modal Preview */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase">Official Invoice</span>
                <h4 className="text-sm font-bold">{showInvoiceModal.resellerStoreName || 'Vibe Tees'}</h4>
              </div>
              <button
                onClick={() => setShowInvoiceModal(null)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Invoice No:</span>
                <span className="font-mono text-white font-bold">{showInvoiceModal.orderID}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Customer:</span>
                <span className="text-white">{showInvoiceModal.shippingAddress.fullName}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Payment Mode:</span>
                <span className="text-white">{showInvoiceModal.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-zinc-400 pt-1 border-t border-zinc-800">
                <span>Customer Billed Amount:</span>
                <span className="text-amber-400 font-bold tabular-nums">
                  ₹{showInvoiceModal.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 text-center">
              * Shipped under certified dropship agreement by Vibe Tees Logistics Network.
            </div>

            <button
              onClick={() => setShowInvoiceModal(null)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white"
            >
              Close Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
