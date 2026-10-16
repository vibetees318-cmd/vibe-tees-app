import React, { useState } from 'react';
import { X, Check, ShoppingBag } from 'lucide-react';
import { Product, ProductSize } from '../types';

interface QuickAddModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAdd: (product: Product, size: ProductSize) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirmAdd,
}) => {
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);

  if (!isOpen || !product) return null;

  const currentSize = selectedSize || product.sizesAvailable[0];

  const handleAdd = () => {
    if (currentSize) {
      onConfirmAdd(product, currentSize);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl p-5 text-white shadow-2xl animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-12 h-12 rounded-xl object-cover border border-zinc-700/80 bg-zinc-950"
            />
            <div>
              <h4 className="text-sm font-semibold line-clamp-1">{product.title}</h4>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-sm font-bold text-amber-400 tabular-nums">
                  ₹{product.discountPrice.toLocaleString('en-IN')}
                </span>
                {product.price > product.discountPrice && (
                  <span className="text-xs text-zinc-400 line-through tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Size Selection */}
        <div className="py-4">
          <label className="block text-xs font-medium text-zinc-300 mb-2.5">
            Select Size
          </label>
          <div className="flex flex-wrap gap-2">
            {product.sizesAvailable.map((size) => {
              const isSelected = currentSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-11 h-11 rounded-xl text-xs font-bold transition-all flex items-center justify-center border ${
                    isSelected
                      ? 'bg-amber-400 text-zinc-950 border-amber-400 shadow-sm scale-105'
                      : 'bg-zinc-800/80 text-zinc-200 border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleAdd}
          className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-md"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add {currentSize} to Bag</span>
        </button>
      </div>
    </div>
  );
};
