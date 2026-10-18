import React, { useState } from 'react';
import { Product, ProductCategory } from '../types';

export interface GridProductItem {
  id?: string;
  productID?: string;
  image?: string;
  images?: string[];
  title: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  discount?: number;
  isSale?: boolean;
  rating?: number;
  reviews?: number;
  reviewCount?: number;
  category?: string;
}

interface ProductGridProps {
  products: (Product | GridProductItem)[];
  onSelectProduct?: (product: Product | any) => void;
  selectedCategory?: ProductCategory;
  onSelectCategory?: (category: ProductCategory) => void;
  sortBy?: 'featured' | 'price-low' | 'price-high' | 'rating';
  onSortChange?: (sort: 'featured' | 'price-low' | 'price-high' | 'rating') => void;
  onToggleWishlist?: (productId: string) => void;
  wishlistIds?: string[];
}

export default function ProductGrid({
  products,
  onSelectProduct,
  selectedCategory = 'All',
  onSelectCategory,
  sortBy = 'featured',
  onSortChange,
  onToggleWishlist,
  wishlistIds = [],
}: ProductGridProps) {
  // Local state for interactive dropdowns & local wishlist toggles
  const [activeSort, setActiveSort] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>(sortBy);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [localWishlist, setLocalWishlist] = useState<Record<string, boolean>>({});

  const categories: ProductCategory[] = ['All', 'Oversized', 'Streetwear', 'Retro', 'Hoodies'];

  const handleHeartClick = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setLocalWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
    if (onToggleWishlist) {
      onToggleWishlist(productId);
    }
  };

  const handleSortSelect = (val: 'featured' | 'price-low' | 'price-high' | 'rating') => {
    setActiveSort(val);
    setShowSortMenu(false);
    if (onSortChange) {
      onSortChange(val);
    }
  };

  // Normalization helper for each item
  const normalizedProducts = products.map((p: any) => {
    const id = p.id || p.productID || 'item-' + Math.random().toString(36).substring(2, 7);
    const image =
      p.image ||
      (p.images && p.images.length > 0 ? p.images[0] : null) ||
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80';
    const price = Number(p.price) || 999;
    const originalPrice =
      Number(p.originalPrice) ||
      (p.discountPrice && p.discountPrice > price
        ? p.discountPrice
        : Math.round(price * 1.35));
    const discount =
      p.discount !== undefined
        ? p.discount
        : Math.max(10, Math.round(((originalPrice - price) / originalPrice) * 100));
    const isSale = p.isSale !== undefined ? p.isSale : discount >= 20 || p.tag === 'Sale';
    const rating = p.rating || 4.8;
    const reviews = p.reviews || p.reviewCount || 128;

    return {
      raw: p,
      id,
      image,
      title: p.title || 'Streetwear Graphic Tee',
      price,
      originalPrice,
      discount,
      isSale,
      rating,
      reviews,
    };
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-20 text-gray-900">
      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 flex justify-between items-center px-4 py-2 text-sm text-gray-700 shadow-xs">
        {/* Sort Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSortMenu(!showSortMenu);
              setShowCategoryMenu(false);
            }}
            className="flex items-center gap-1 font-medium hover:text-black py-1 px-2 rounded-md transition-colors"
          >
            <span>↕ Sort</span>
          </button>

          {showSortMenu && (
            <div className="absolute left-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1 text-xs">
              <button
                onClick={() => handleSortSelect('featured')}
                className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                  activeSort === 'featured' ? 'font-bold text-black bg-gray-50' : 'text-gray-700'
                }`}
              >
                Featured Drops
              </button>
              <button
                onClick={() => handleSortSelect('price-low')}
                className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                  activeSort === 'price-low' ? 'font-bold text-black bg-gray-50' : 'text-gray-700'
                }`}
              >
                Price: Low to High
              </button>
              <button
                onClick={() => handleSortSelect('price-high')}
                className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                  activeSort === 'price-high' ? 'font-bold text-black bg-gray-50' : 'text-gray-700'
                }`}
              >
                Price: High to Low
              </button>
              <button
                onClick={() => handleSortSelect('rating')}
                className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                  activeSort === 'rating' ? 'font-bold text-black bg-gray-50' : 'text-gray-700'
                }`}
              >
                Highest Rated ★
              </button>
            </div>
          )}
        </div>

        {/* Category Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowCategoryMenu(!showCategoryMenu);
              setShowSortMenu(false);
            }}
            className="flex items-center gap-1 font-medium hover:text-black py-1 px-2 rounded-md transition-colors"
          >
            <span>{selectedCategory !== 'All' ? selectedCategory : 'Category'} ▾</span>
          </button>

          {showCategoryMenu && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory(cat);
                    setShowCategoryMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                    selectedCategory === cat ? 'font-bold text-black bg-gray-50' : 'text-gray-700'
                  }`}
                >
                  {cat === 'All' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filters Button */}
        <div>
          <button
            onClick={() => setShowFiltersModal(true)}
            className="flex items-center gap-1 font-medium hover:text-black py-1 px-2 rounded-md transition-colors"
          >
            <span>Filters ⚙</span>
          </button>
        </div>
      </div>

      {/* 2-Column Product Grid */}
      <div className="grid grid-cols-2 gap-2 p-2">
        {normalizedProducts.map((product) => {
          const isWishlisted = localWishlist[product.id] || wishlistIds.includes(product.id);

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct && onSelectProduct(product.raw)}
              className="bg-white rounded-md overflow-hidden border border-gray-200 relative shadow-sm cursor-pointer transition-transform active:scale-[0.99] hover:shadow-md"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] bg-gray-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {product.isSale && (
                  <span className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                    SALE
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => handleHeartClick(e, product.id)}
                  className={`absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-gray-600 hover:text-red-600 hover:bg-white transition-colors shadow-xs ${
                    isWishlisted ? 'text-red-500 fill-red-500' : ''
                  }`}
                  aria-label="Wishlist item"
                >
                  ♥
                </button>
              </div>

              {/* Product Details */}
              <div className="p-2">
                <p className="text-xs text-gray-500 font-semibold uppercase">Vibe Tees</p>
                <h3 className="text-xs text-gray-800 font-medium truncate mt-0.5">
                  {product.title}
                </h3>

                {/* Price Row */}
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
                  <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                  <span className="text-xs font-semibold text-green-600">{product.discount}% off</span>
                </div>

                {/* Badges & Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    {product.rating} ★
                  </span>
                  <span className="text-[10px] text-gray-400">({product.reviews})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Drawer / Modal */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl p-5 text-gray-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="font-bold text-sm">Product Filters</h4>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ×
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-gray-700 uppercase">Category</span>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => onSelectCategory && onSelectCategory(c)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      selectedCategory === c
                        ? 'bg-black text-white border-black'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter range */}
            <div className="space-y-1.5 pt-2 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-700 uppercase">Price Range</span>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  onClick={() => setShowFiltersModal(false)}
                  className="py-1.5 px-2 bg-gray-100 hover:bg-gray-200 rounded border border-gray-200 text-center"
                >
                  Under ₹1,499
                </button>
                <button
                  onClick={() => setShowFiltersModal(false)}
                  className="py-1.5 px-2 bg-gray-100 hover:bg-gray-200 rounded border border-gray-200 text-center"
                >
                  ₹1,500 - ₹2,499
                </button>
                <button
                  onClick={() => setShowFiltersModal(false)}
                  className="py-1.5 px-2 bg-gray-100 hover:bg-gray-200 rounded border border-gray-200 text-center"
                >
                  ₹2,500+
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowFiltersModal(false)}
              className="w-full py-2.5 rounded-lg bg-black text-white text-xs font-bold transition-all active:scale-[0.99]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export { ProductGrid };
