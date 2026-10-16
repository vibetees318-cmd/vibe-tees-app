import React, { useState } from 'react';
import { Plus, Check, Star, Share2, MessageCircle, Copy } from 'lucide-react';
import { AppMode, Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  isAddedJustNow?: boolean;
  appMode?: AppMode;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
  isAddedJustNow = false,
  appMode = 'Customer',
}) => {
  const [copiedShare, setCopiedShare] = useState(false);

  const discountPercent = Math.round(
    ((product.price - product.discountPrice) / product.price) * 100
  );

  const isOutOfStock = product.stockStatus === 'Out of Stock';

  // Reseller calculations (suggested markup of ₹400 - ₹600)
  const suggestedMarkup = product.category === 'Hoodies' ? 600 : 400;
  const suggestedSellingPrice = product.discountPrice + suggestedMarkup;

  const handleShareAndEarn = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Prepare white-labeled share text (never mentions base supplier price)
    const shareText = `🔥 *${product.title}*\n\n` +
      `✨ Premium Heavyweight Streetwear Drop (${product.fabricGsm || 280} GSM Combed Cotton)\n` +
      `🏷️ Special Price: *₹${suggestedSellingPrice.toLocaleString('en-IN')}* (Retail: ₹${product.price.toLocaleString('en-IN')})\n` +
      `📏 Sizes Available: ${product.sizesAvailable.join(', ')}\n` +
      `📦 Fast Doorstep Delivery & Cash on Delivery Available!\n\n` +
      `Reply to order directly or ask for more angles!`;

    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-zinc-900/70 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-200 cursor-pointer shadow-sm hover:-translate-y-0.5"
    >
      {/* Product Image Slot */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
        <img
          src={product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ${
            isOutOfStock ? 'opacity-50 grayscale' : ''
          }`}
        />

        {/* Clean Unboxed Overlay Indicators */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {discountPercent > 0 && !isOutOfStock && (
            <span className="text-[10px] font-bold text-amber-400 bg-zinc-950/90 px-1.5 py-0.5 rounded tracking-wide border border-amber-400/30">
              {discountPercent}% OFF
            </span>
          )}
          {appMode === 'Reseller' && (
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/90 px-1.5 py-0.5 rounded border border-emerald-800/60 font-bold">
              Margin: +₹{suggestedMarkup}
            </span>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest px-3 py-1 bg-zinc-900/90 border border-zinc-700 rounded-md">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick Add Floating Button (in Customer Mode) */}
        {!isOutOfStock && appMode !== 'Reseller' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            className={`absolute bottom-2 right-2 p-2 rounded-xl transition-all shadow-md active:scale-95 ${
              isAddedJustNow
                ? 'bg-emerald-500 text-zinc-950 scale-105'
                : 'bg-white/95 text-zinc-950 hover:bg-amber-400 opacity-90 group-hover:opacity-100'
            }`}
            title="Quick Add to Bag"
            aria-label={`Quick add ${product.title}`}
          >
            {isAddedJustNow ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
          </button>
        )}
      </div>

      {/* Card Content & Metadata */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Subtle clean metadata */}
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1 font-mono">
            <span>{product.category}</span>
            {product.fabricGsm && (
              <>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>{product.fabricGsm} GSM</span>
              </>
            )}
            {product.rating && (
              <span className="ml-auto flex items-center gap-0.5 text-amber-400 font-sans font-semibold">
                <Star className="w-3 h-3 fill-amber-400 stroke-none" />
                <span>{product.rating.toFixed(1)}</span>
              </span>
            )}
          </div>

          <h4 className="text-xs sm:text-sm font-semibold text-zinc-100 line-clamp-1 group-hover:text-amber-300 transition-colors">
            {product.title}
          </h4>
        </div>

        {/* Pricing Layout */}
        <div className="mt-2.5 pt-2 border-t border-zinc-800/60">
          {appMode === 'Reseller' ? (
            /* RESELLER MODE PRICING & SHARE BUTTON */
            <div className="space-y-2">
              <div className="flex items-baseline justify-between text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 block font-mono">Supplier Base</span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    ₹{product.discountPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-amber-400 block font-mono">Sell at</span>
                  <span className="text-sm font-extrabold text-amber-400 tabular-nums">
                    ₹{suggestedSellingPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Share & Earn Button (WhatsApp style) */}
              <button
                onClick={handleShareAndEarn}
                className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Copied for WhatsApp!</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-3.5 h-3.5 fill-zinc-950" />
                    <span>Share & Earn ₹{suggestedMarkup}</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* CUSTOMER MODE PRICING */
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-sm sm:text-base font-bold font-sans text-white tabular-nums">
                  ₹{product.discountPrice.toLocaleString('en-IN')}
                </span>
                {product.price > product.discountPrice && (
                  <span className="text-xs text-zinc-400 line-through tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <span className="text-[10px] text-zinc-400 font-medium">
                {product.sizesAvailable.length} sizes
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
