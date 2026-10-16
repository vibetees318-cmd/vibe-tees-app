import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Ruler,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  Check,
} from 'lucide-react';
import { Product, ProductSize } from '../types';

interface ProductDetailScreenProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, size: ProductSize, quantity: number) => void;
  onBuyNow: (product: Product, size: ProductSize, quantity: number) => void;
  onOpenSizeGuide: () => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
  onOpenSizeGuide,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.sizesAvailable[0] || 'L'
  );
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);

  const discountPercent = Math.round(
    ((product.price - product.discountPrice) / product.price) * 100
  );

  const isOutOfStock = product.stockStatus === 'Out of Stock';

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, selectedSize, quantity);
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2000);
  };

  const handleBuy = () => {
    if (isOutOfStock) return;
    onBuyNow(product, selectedSize, quantity);
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-white min-h-screen pb-24">
      {/* Top PDP Nav Bar */}
      <div className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
          aria-label="Back to catalog"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
          {product.category}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`p-2 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors ${
              isWishlisted ? 'text-red-400 border-red-500/40' : 'text-zinc-300 hover:text-white'
            }`}
            aria-label="Wishlist item"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-400' : ''}`} />
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.title, url: window.location.href }).catch(() => {});
              }
            }}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            aria-label="Share product"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image Gallery / Slider */}
      <div className="relative aspect-square w-full max-w-lg mx-auto bg-zinc-900 overflow-hidden">
        <img
          src={product.images[activeImageIndex] || product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />

        {/* Gallery Navigation Controls */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Floating Stock / Discount Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discountPercent > 0 && (
            <span className="text-[11px] font-bold text-amber-400 bg-zinc-950/90 px-2 py-0.5 rounded tracking-wide border border-amber-400/30">
              {discountPercent}% SAVING
            </span>
          )}
          {product.fabricGsm && (
            <span className="text-[10px] font-mono text-zinc-300 bg-zinc-950/90 px-2 py-0.5 rounded border border-zinc-700">
              {product.fabricGsm} GSM Heavyweight
            </span>
          )}
        </div>

        {/* Dot Indicators */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1 bg-black/40 backdrop-blur-md rounded-full">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  activeImageIndex === idx ? 'w-4 bg-amber-400' : 'w-1.5 bg-zinc-500 hover:bg-zinc-300'
                }`}
                aria-label={`View photo ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Information Container */}
      <div className="px-4 py-5 space-y-5 max-w-lg mx-auto w-full">
        {/* Title & Brand */}
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
            <span className="font-mono">{product.category} Series</span>
            {product.rating && (
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-zinc-500">({product.reviewCount || 120} reviews)</span>
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            {product.title}
          </h2>
          {product.isResellerItem && (
            <p className="text-xs text-cyan-300 font-mono mt-1">
              Curated by Verified Reseller: {product.resellerName || 'Vault Partner'}
            </p>
          )}
        </div>

        {/* Pricing Layout with Strike-Through Original Price */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-zinc-400">Total Price (incl. all taxes)</div>
            <div className="flex items-baseline gap-2.5 mt-0.5">
              <span className="text-2xl font-extrabold text-white tabular-nums">
                ₹{product.discountPrice.toLocaleString('en-IN')}
              </span>
              {product.price > product.discountPrice && (
                <span className="text-sm text-zinc-400 line-through tabular-nums">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Stock Status Indicator */}
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                isOutOfStock
                  ? 'bg-red-950/70 text-red-400 border border-red-800/60'
                  : 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-red-400' : 'bg-emerald-400'}`} />
              {product.stockStatus}
            </span>
          </div>
        </div>

        {/* Size Selector */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-semibold text-zinc-200">
              Select Size: <span className="text-amber-400 font-mono">{selectedSize}</span>
            </label>
            <button
              onClick={onOpenSizeGuide}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Size Guide</span>
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {product.sizesAvailable.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-11 rounded-xl text-xs font-bold transition-all flex items-center justify-center border ${
                    isSelected
                      ? 'bg-amber-400 text-zinc-950 border-amber-400 shadow-md scale-105'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity Counter */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
          <span className="text-xs font-medium text-zinc-300">Quantity</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              className="w-8 h-8 rounded-lg bg-zinc-800 text-white flex items-center justify-center hover:bg-zinc-700 disabled:opacity-40 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-bold font-mono tabular-nums w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              disabled={quantity >= 10 || isOutOfStock}
              className="w-8 h-8 rounded-lg bg-zinc-800 text-white flex items-center justify-center hover:bg-zinc-700 disabled:opacity-40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Description & Technical Fabric Specs */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-display font-bold uppercase tracking-wider text-zinc-300">
            Garment Specifications
          </h4>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 uppercase block font-mono">Silhouette</span>
              <span className="font-medium text-zinc-200">{product.fit || 'Drop-Shoulder Boxy Fit'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 uppercase block font-mono">Fabric Grade</span>
              <span className="font-medium text-zinc-200">{product.fabricGsm || 280} GSM Combed Cotton</span>
            </div>
          </div>
        </div>

        {/* Shipping & Guarantee Badges */}
        <div className="pt-2 border-t border-zinc-800/80 space-y-2 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Fast Express Dispatch within 24 Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
            <span>7-Day Hassle-Free Streetwear Size Exchange</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>100% Authentic Heavyweight Fabric Guarantee</span>
          </div>
        </div>
      </div>

      {/* Added to Bag Toast */}
      {showAddedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-zinc-950 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Added {quantity} × {product.title} ({selectedSize}) to Bag</span>
        </div>
      )}

      {/* Sticky Bottom Action Bar with "Add to Cart" and "Buy Now" */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/90 p-3 sm:p-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className="flex-1 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={handleBuy}
            disabled={isOutOfStock}
            className="flex-1 h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 shadow-lg shadow-amber-400/10"
          >
            <Zap className="w-4 h-4 fill-zinc-950" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
