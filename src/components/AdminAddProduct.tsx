import React, { useState } from 'react';
import { api } from '../services/api';
import { Product, ProductCategory } from '../types';
import { Sparkles, CheckCircle2, Image as ImageIcon, X, ArrowLeft, Plus } from 'lucide-react';

interface AdminAddProductProps {
  onProductAdded?: (newProduct: Product) => void;
  onClose?: () => void;
  isModal?: boolean;
}

const PRESET_IMAGES = [
  {
    name: 'Acid Wash',
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Cyberpunk',
    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Slate Hoodie',
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Tokyo Graphic',
    url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
  },
];

export default function AdminAddProduct({
  onProductAdded,
  onClose,
  isModal = false,
}: AdminAddProductProps) {
  const [product, setProduct] = useState({
    title: '',
    price: '',
    originalPrice: '',
    imageUrl: '',
    category: 'Oversized',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addedProduct, setAddedProduct] = useState<Product | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!product.title.trim()) {
      setErrorMessage('Please enter a product title');
      return;
    }
    if (!product.price || Number(product.price) <= 0) {
      setErrorMessage('Please enter a valid selling price');
      return;
    }

    setIsSubmitting(true);

    try {
      // Yahan Firebase / Supabase / API me save karne ka real logic
      const sellingPrice = Number(product.price);
      const mrp = product.originalPrice ? Number(product.originalPrice) : Math.round(sellingPrice * 1.35);

      // Clean category mapping
      let resolvedCategory: ProductCategory = 'Oversized';
      if (product.category.toLowerCase().includes('hoodie')) {
        resolvedCategory = 'Hoodies';
      } else if (product.category.toLowerCase().includes('retro')) {
        resolvedCategory = 'Retro';
      } else if (product.category.toLowerCase().includes('street')) {
        resolvedCategory = 'Streetwear';
      }

      const imageUrl =
        product.imageUrl.trim() ||
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80';

      const newProduct = await api.createProduct({
        title: product.title.trim(),
        price: sellingPrice,
        discountPrice: mrp,
        category: resolvedCategory,
        images: [imageUrl],
        description:
          product.description.trim() ||
          `${product.title} - 240 GSM combed cotton heavyweight streetwear tee with drop-shoulder silhouette, ribbed crew neck, and high-density screen print.`,
        sizesAvailable: ['S', 'M', 'L', 'XL', 'XXL'],
        stockStatus: 'In Stock',
        fabricGsm: 240,
        fit: 'Oversized Boxy Fit',
      });

      setAddedProduct(newProduct);
      setSuccessMessage('Product Added Successfully to Firebase & Catalog!');

      if (onProductAdded) {
        onProductAdded(newProduct);
      }

      // Reset form
      setProduct({
        title: '',
        price: '',
        originalPrice: '',
        imageUrl: '',
        category: 'Oversized',
        description: '',
      });
    } catch (err: any) {
      console.error('Failed to add product:', err);
      setErrorMessage(err?.message || 'Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerContent = (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md text-gray-900 border border-gray-100 relative">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 -ml-1 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Add New Product</span>
            <span className="text-[10px] font-mono font-semibold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              Admin &amp; Supplier
            </span>
          </h2>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold">{successMessage}</p>
              {addedProduct && (
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  ID: {addedProduct.productID} · ₹{addedProduct.price} · {addedProduct.category}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-900 font-bold ml-2 text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-600 hover:text-red-900 font-bold ml-2 text-sm"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Product Title</label>
          <input
            type="text"
            placeholder="Product Title"
            value={product.title}
            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder:text-gray-400"
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
            required
          />
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Selling Price (₹)</label>
            <input
              type="number"
              placeholder="Selling Price (₹)"
              value={product.price}
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder:text-gray-400"
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Original Price / MRP (₹)</label>
            <input
              type="number"
              placeholder="Original Price / MRP (₹)"
              value={product.originalPrice}
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder:text-gray-400"
              onChange={(e) => setProduct({ ...product, originalPrice: e.target.value })}
            />
          </div>
        </div>

        {/* Category Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
          <select
            value={product.category}
            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white"
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
          >
            <option value="Oversized">Oversized Tees</option>
            <option value="Streetwear">Streetwear Drops</option>
            <option value="Retro">Retro Vintage</option>
            <option value="Hoodies">Heavyweight Hoodies</option>
          </select>
        </div>

        {/* Image URL Input */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL</label>
          <input
            type="text"
            placeholder="Image URL"
            value={product.imageUrl}
            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder:text-gray-400"
            onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
          />

          {/* Quick Presets */}
          <div className="mt-2">
            <span className="text-[11px] text-gray-500 font-medium block mb-1">
              Quick presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_IMAGES.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => setProduct({ ...product, imageUrl: preset.url })}
                  className="px-2 py-0.5 text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-200 transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Image Live Preview */}
        {product.imageUrl && (
          <div className="p-2 border border-gray-200 rounded-lg flex items-center gap-3 bg-gray-50">
            <img
              src={product.imageUrl}
              alt="Preview"
              className="w-14 h-14 object-cover rounded bg-white border border-gray-200"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="min-w-0 text-xs">
              <span className="font-semibold text-gray-800 block">Preview Loaded</span>
              <span className="text-gray-500 truncate block text-[11px]">
                {product.title || 'Untitled Product'}
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black hover:bg-zinc-800 text-white py-2.5 rounded font-semibold text-sm transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving to Firebase...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </>
          )}
        </button>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-md max-h-[92vh] overflow-y-auto no-scrollbar">
          {containerContent}
        </div>
      </div>
    );
  }

  return containerContent;
}
export { AdminAddProduct };
