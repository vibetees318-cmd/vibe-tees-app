import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface CartScreenProps {
  cartItems: CartItem[];
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onRemoveItem: (cartId: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const FREE_SHIPPING_THRESHOLD = 1999;

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.discountPrice || 1299;
    return acc + price * item.quantity;
  }, 0);

  const deliveryFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 99;
  const totalAmount = subtotal + deliveryFee;
  const differenceForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  if (cartItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-zinc-950 text-white min-h-[500px] space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 shadow-inner">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-display font-bold text-white">Your Bag is Empty</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs">
            Explore our curated oversized heavyweight drops and limited streetwear capsules.
          </p>
        </div>
        <button
          onClick={onContinueShopping}
          className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-md"
        >
          Explore Streetwear Drops
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-white p-4 space-y-5 pb-12 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-display font-bold text-white">
            Shopping Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
          </h2>
        </div>
        <span className="text-xs font-mono text-zinc-400">Vibe Studio Cart</span>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-zinc-300">
            {differenceForFreeShipping <= 0 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Unlocked Free Express Delivery!
              </span>
            ) : (
              <span>
                Add <strong className="text-amber-400 font-mono">₹{differenceForFreeShipping}</strong> more for Free Delivery
              </span>
            )}
          </span>
          <span className="text-[11px] font-mono text-zinc-400">
            Min ₹{FREE_SHIPPING_THRESHOLD}
          </span>
        </div>
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
          />
        </div>
      </div>

      {/* Itemized List of Products */}
      <div className="space-y-3">
        {cartItems.map((item) => {
          const product = item.product;
          const itemPrice = product?.discountPrice || 1299;

          return (
            <div
              key={item.cartID}
              className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex gap-3.5 items-center relative hover:border-zinc-700 transition-colors"
            >
              {/* Product Thumbnail */}
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                <img
                  src={product?.images[0]}
                  alt={product?.title || 'Tee'}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                    {product?.title || 'Streetwear Tee'}
                  </h4>
                  <button
                    onClick={() => onRemoveItem(item.cartID)}
                    className="p-1 text-zinc-500 hover:text-red-400 rounded-md transition-colors"
                    title="Remove item"
                    aria-label={`Remove ${product?.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Size and specs */}
                <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400">
                  <span className="font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-[11px] text-zinc-300 border border-zinc-700">
                    Size: {item.selectedSize}
                  </span>
                  {product?.fabricGsm && (
                    <span className="text-[11px] text-zinc-500">
                      {product.fabricGsm} GSM
                    </span>
                  )}
                </div>

                {/* Pricing & Quantity modifier */}
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-800/60">
                  <span className="text-sm font-bold text-white tabular-nums">
                    ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                  </span>

                  <div className="flex items-center gap-2 bg-zinc-800/80 rounded-lg p-0.5 border border-zinc-700/80">
                    <button
                      onClick={() => onUpdateQuantity(item.cartID, item.quantity - 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-mono font-bold w-4 text-center tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.cartID, item.quantity + 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Summary Breakdown */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2.5 text-xs">
        <h4 className="font-display font-bold uppercase tracking-wider text-zinc-400 text-[11px] mb-1">
          Price Summary
        </h4>

        <div className="flex items-center justify-between text-zinc-300">
          <span>Bag Subtotal</span>
          <span className="tabular-nums font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex items-center justify-between text-zinc-300">
          <span>Standard Delivery</span>
          <span className="tabular-nums">
            {deliveryFee === 0 ? (
              <span className="text-emerald-400 font-semibold">FREE</span>
            ) : (
              `₹${deliveryFee}`
            )}
          </span>
        </div>

        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-sm font-bold text-white">
          <span>Total Amount</span>
          <span className="text-amber-400 tabular-nums font-extrabold text-base">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Natural Checkout Action Card (Scrolls smoothly above bottom navigation) */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-zinc-400 block">Total Due</span>
            <span className="text-xl font-black font-sans text-amber-400 tabular-nums">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
            All Taxes Included
          </span>
        </div>

        <button
          onClick={onProceedToCheckout}
          className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-400/20"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Trust seal */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Safe &amp; Encrypted 256-bit Checkout • 7-Day Easy Returns</span>
        </div>
      </div>
    </div>
  );
};
