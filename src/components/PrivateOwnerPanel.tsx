import React, { useState } from 'react';
import { api } from '../services/api';
import { Product, ProductCategory, ProductSize } from '../types';
import {
  Crown,
  Printer,
  Sparkles,
  CheckCircle2,
  X,
  ArrowLeft,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Warehouse,
  Palette,
  Check,
  Scale,
  Shirt,
  Box,
  Tag,
  Star,
  ExternalLink,
} from 'lucide-react';

interface PrivateOwnerPanelProps {
  isOwner: boolean;
  onProductAdded?: (newProduct: Product) => void;
  onClose?: () => void;
  onSwitchToOwner?: () => void;
  isModal?: boolean;
}

// Preset color options with visual streetwear swatches
const PRESET_COLORS = [
  { name: 'Jet Black', hex: '#111111', textLight: true },
  { name: 'Vintage Charcoal', hex: '#2e2e2e', textLight: true },
  { name: 'Off-White / Bone', hex: '#f5f2eb', textLight: false },
  { name: 'Washed Olive', hex: '#445138', textLight: true },
  { name: 'Crimson Acid', hex: '#6b1d1d', textLight: true },
  { name: 'Royal Electric Blue', hex: '#1d3557', textLight: true },
  { name: 'Smoky Lavender', hex: '#8a7d9b', textLight: true },
  { name: 'Desert Sand / Clay', hex: '#c4a482', textLight: false },
];

const PRESET_IMAGE_OPTIONS = [
  {
    label: 'Acid Wash',
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    sku: 'PTR-TSHIRT-ACID-OVS',
  },
  {
    label: 'Retro Cyber',
    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    sku: 'PTR-TSHIRT-CYBER-OVS',
  },
  {
    label: 'Slate Hoodie',
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    sku: 'PTR-HOODIE-SLATE-HVY',
  },
  {
    label: 'Tokyo Anime',
    url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
    sku: 'PTR-TSHIRT-TOKYO-OVS',
  },
  {
    label: 'Streetwear Model Lookbook',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    sku: 'PTR-LOOKBOOK-OVS',
  },
];

const GSM_PRESETS = [
  { gsm: 220, label: '220 GSM (Summer Light)' },
  { gsm: 240, label: '240 GSM (Boxy Classic)' },
  { gsm: 280, label: '280 GSM (Heavyweight Drop)' },
  { gsm: 320, label: '320 GSM (Loopknit French Terry)' },
  { gsm: 450, label: '450 GSM (Heavy Hoodie Fleece)' },
];

const ALL_SIZES: ProductSize[] = ['S', 'M', 'L', 'XL', 'XXL'];

export default function PrivateOwnerPanel({
  isOwner,
  onProductAdded,
  onClose,
  onSwitchToOwner,
  isModal = false,
}: PrivateOwnerPanelProps) {
  // A-to-Z Product Configuration State
  const [productData, setProductData] = useState({
    title: '',
    category: 'Oversized' as 'Oversized' | 'Streetwear' | 'Retro' | 'Hoodies',
    price: '',
    mrp: '',
    tag: 'New Drop · 280 GSM',
    description: '',
    // Multi-color selector
    colors: ['Jet Black', 'Vintage Charcoal'],
    customColorInput: '',
    // Multi-size checkboxes
    sizes: ['S', 'M', 'L', 'XL', 'XXL'] as ProductSize[],
    // Inventory Stock Count input
    stockCount: '100',
    lowStockThreshold: '15',
    // Fabric GSM & Material Specs
    fabricGsm: 280,
    material: '100% Combed Bio-Washed Cotton',
    fit: 'Signature Boxy Drop-Shoulder',
    // Multiple Photo Uploads
    imageUrls: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    ],
    newImageUrlInput: '',
    // Toggle: Self-Stock (In-House) vs Printrove POD Fulfillment
    fulfillmentType: 'Printrove-POD' as 'In-House' | 'Printrove-POD',
    inHouseWarehouseBin: 'WH-MUM-BAY-04',
    inHouseDispatchLeadDays: '1',
    podProvider: 'Printrove',
    podSKU: 'PTR-TSHIRT-BLK-OVS',
    podPrintTechnique: 'Direct-to-Garment (DTG)',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // STRICT ACCESS CHECK: Only vibetees318@gmail.com
  if (!isOwner) {
    return (
      <div className="p-8 text-center bg-black min-h-screen text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-950/80 border border-red-800 text-red-500 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="p-6 text-center text-red-500 font-semibold max-w-md bg-zinc-950 border border-red-900/50 rounded-2xl">
          Access Restricted: Sirf Vibe Tees Owner hi yeh page access kar sakte hain.
          <p className="text-xs text-zinc-400 mt-2 font-normal">
            Authorized Owner Email: <strong className="text-zinc-200">vibetees318@gmail.com</strong>
          </p>
        </div>

        {onSwitchToOwner && (
          <button
            onClick={onSwitchToOwner}
            className="px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-bold text-xs flex items-center gap-2 hover:bg-yellow-300 transition-colors shadow-lg"
          >
            <Crown className="w-4 h-4" />
            <span>Switch to Owner Mode</span>
          </button>
        )}

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-white underline pt-2"
          >
            Back to Store
          </button>
        )}
      </div>
    );
  }

  // Color Toggling Handlers
  const handleToggleColor = (colorName: string) => {
    setProductData((prev) => {
      const exists = prev.colors.includes(colorName);
      if (exists) {
        if (prev.colors.length === 1) return prev; // Keep at least one
        return { ...prev, colors: prev.colors.filter((c) => c !== colorName) };
      } else {
        return { ...prev, colors: [...prev.colors, colorName] };
      }
    });
  };

  const handleAddCustomColor = (e: React.FormEvent) => {
    e.preventDefault();
    const val = productData.customColorInput.trim();
    if (val && !productData.colors.includes(val)) {
      setProductData((prev) => ({
        ...prev,
        colors: [...prev.colors, val],
        customColorInput: '',
      }));
    }
  };

  // Size Checkbox Handlers
  const handleToggleSize = (size: ProductSize) => {
    setProductData((prev) => {
      const exists = prev.sizes.includes(size);
      if (exists) {
        if (prev.sizes.length === 1) return prev;
        return { ...prev, sizes: prev.sizes.filter((s) => s !== size) };
      } else {
        return { ...prev, sizes: [...prev.sizes, size] };
      }
    });
  };

  const handleSelectAllSizes = () => {
    setProductData((prev) => ({ ...prev, sizes: [...ALL_SIZES] }));
  };

  // Multiple Photo Handlers
  const handleAddImageUrl = (urlToAdd?: string) => {
    const url = (urlToAdd || productData.newImageUrlInput).trim();
    if (url && !productData.imageUrls.includes(url)) {
      setProductData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, url],
        newImageUrlInput: '',
      }));
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setProductData((prev) => {
      if (prev.imageUrls.length <= 1) return prev; // Keep at least one
      return {
        ...prev,
        imageUrls: prev.imageUrls.filter((_, i) => i !== indexToRemove),
      };
    });
  };

  const handleSetCoverImage = (index: number) => {
    setProductData((prev) => {
      const item = prev.imageUrls[index];
      const rest = prev.imageUrls.filter((_, i) => i !== index);
      return { ...prev, imageUrls: [item, ...rest] };
    });
  };

  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result && typeof reader.result === 'string') {
            handleAddImageUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Form Submit Handler
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!productData.title.trim()) {
      setErrorMessage('Please enter a product title');
      return;
    }
    if (!productData.price || Number(productData.price) <= 0) {
      setErrorMessage('Please enter a valid selling price');
      return;
    }
    if (productData.sizes.length === 0) {
      setErrorMessage('Please select at least one available size');
      return;
    }
    if (productData.imageUrls.length === 0) {
      setErrorMessage('Please provide at least one product photo');
      return;
    }

    setIsSubmitting(true);

    try {
      const sellingPrice = Number(productData.price);
      const mrpPrice = productData.mrp ? Number(productData.mrp) : Math.round(sellingPrice * 1.4);
      const stockTotal = Number(productData.stockCount) || 50;

      const newProduct = await api.createProduct({
        title: productData.title.trim(),
        price: sellingPrice,
        discountPrice: mrpPrice,
        category: productData.category,
        description:
          productData.description.trim() ||
          `${productData.title} - ${productData.material}, ${productData.fabricGsm} GSM Heavyweight Streetwear Drop in ${productData.fit}. Handcrafted with reinforced shoulder taping and high-definition fade-resistant dye.`,
        images: productData.imageUrls,
        sizesAvailable: productData.sizes,
        colors: productData.colors,
        stockCount: stockTotal,
        stockStatus: stockTotal > 0 ? 'In Stock' : 'Out of Stock',
        fabricGsm: productData.fabricGsm,
        fit: productData.fit,
        material: productData.material,
        tag: productData.tag || 'New Drop',
        fulfillmentType: productData.fulfillmentType,
        podProvider: productData.fulfillmentType === 'Printrove-POD' ? productData.podProvider : undefined,
        podSKU: productData.fulfillmentType === 'Printrove-POD' ? productData.podSKU : undefined,
        isPodEnabled: productData.fulfillmentType === 'Printrove-POD',
      });

      setSuccessBanner(
        `Drop "${productData.title}" (${productData.fulfillmentType}) successfully added to store catalog & Firestore!`
      );

      if (onProductAdded) {
        onProductAdded(newProduct);
      }

      // Reset form partially
      setProductData((prev) => ({
        ...prev,
        title: '',
        price: '',
        mrp: '',
        description: '',
        stockCount: '100',
      }));
    } catch (err: any) {
      console.error('Failed to create product:', err);
      setErrorMessage(err?.message || 'Error publishing product configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const discountPercent =
    productData.price && productData.mrp
      ? Math.max(
          0,
          Math.round(
            ((Number(productData.mrp) - Number(productData.price)) / Number(productData.mrp)) * 100
          )
        )
      : null;

  const panelContent = (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 pb-28 max-w-3xl mx-auto w-full">
      {/* Top Header */}
      <div className="border-b border-zinc-800 pb-4 mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 -ml-1.5 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-yellow-400 flex items-center gap-2">
              <Crown className="w-5 h-5" />
              <span>👑 Owner Private Panel</span>
            </h1>
            <p className="text-xs text-zinc-400">
              A-to-Z Streetwear Catalog, Inventory, Multi-Variant &amp; Fulfillment Setup
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-yellow-400/10 text-yellow-400 text-xs px-2.5 py-1 rounded-full border border-yellow-400/30 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>vibetees318</span>
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 text-xs flex items-start justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white text-sm">Product Published!</p>
              <p className="mt-0.5 text-yellow-100">{successBanner}</p>
              <p className="mt-1 text-[11px] text-zinc-400">
                Synced to database, live on customer storefront &amp; mapped for fulfillment.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-zinc-400 hover:text-white font-bold text-base"
          >
            ×
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-white font-bold">
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleAddProduct} className="space-y-6">
        {/* ========================================================= */}
        {/* SECTION 1: ESSENTIAL PRODUCT DETAILS                      */}
        {/* ========================================================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <h2 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
            <Shirt className="w-4 h-4" />
            <span>1. Product Identity &amp; Category</span>
          </h2>

          <div>
            <label className="text-xs text-zinc-400 font-medium">Product Title / Drop Name</label>
            <input
              type="text"
              placeholder="e.g. Acid-Wash Oversized Heavyweight Tee"
              required
              value={productData.title}
              onChange={(e) => setProductData({ ...productData, title: e.target.value })}
              className="w-full mt-1.5 p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 font-medium">Category</label>
              <select
                value={productData.category}
                onChange={(e) =>
                  setProductData({ ...productData, category: e.target.value as ProductCategory })
                }
                className="w-full mt-1.5 p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="Oversized">Oversized Tees (Signature Drop)</option>
                <option value="Streetwear">Streetwear Graphics</option>
                <option value="Retro">Retro Anime &amp; 90s Vintage</option>
                <option value="Hoodies">Heavyweight Winter Hoodies</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-medium">Badge Tag (Appears on Card)</label>
              <input
                type="text"
                placeholder="e.g. New Drop · 280 GSM"
                value={productData.tag}
                onChange={(e) => setProductData({ ...productData, tag: e.target.value })}
                className="w-full mt-1.5 p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: PRICING & MRP                                  */}
        {/* ========================================================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span>2. Pricing &amp; MRP</span>
            </h2>
            {discountPercent !== null && discountPercent > 0 && (
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                {discountPercent}% OFF Customer Deal
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-xs text-zinc-400 font-medium">Selling Price (₹)</label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-3 text-zinc-500 font-semibold text-sm">₹</span>
                <input
                  type="number"
                  placeholder="699"
                  required
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                  className="w-full pl-7 pr-3 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white font-mono font-bold focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-medium">MRP / Strikethrough (₹)</label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-3 text-zinc-500 font-semibold text-sm">₹</span>
                <input
                  type="number"
                  placeholder="1999"
                  value={productData.mrp}
                  onChange={(e) => setProductData({ ...productData, mrp: e.target.value })}
                  className="w-full pl-7 pr-3 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-zinc-300 font-mono focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: MULTI-COLOR SELECTOR                           */}
        {/* ========================================================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span>3. Multi-Color Variants</span>
            </h2>
            <span className="text-xs text-zinc-400">
              {productData.colors.length} color{productData.colors.length > 1 ? 's' : ''} active
            </span>
          </div>

          <p className="text-xs text-zinc-400">
            Click to select/unselect drop colorways or type a custom palette below:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_COLORS.map((col) => {
              const isSelected = productData.colors.includes(col.name);
              return (
                <button
                  type="button"
                  key={col.name}
                  onClick={() => handleToggleColor(col.name)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium text-left transition-all ${
                    isSelected
                      ? 'border-yellow-400 bg-yellow-400/10 text-white shadow-sm'
                      : 'border-zinc-800 bg-zinc-800/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/20 shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: col.hex }}
                  >
                    {isSelected && (
                      <Check
                        className={`w-2.5 h-2.5 stroke-[3] ${
                          col.textLight ? 'text-white' : 'text-zinc-950'
                        }`}
                      />
                    )}
                  </span>
                  <span className="truncate">{col.name}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Color Input */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="Add Custom Color (e.g. Acid Mint, Rust Orange)"
              value={productData.customColorInput}
              onChange={(e) =>
                setProductData({ ...productData, customColorInput: e.target.value })
              }
              className="flex-1 p-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
            />
            <button
              type="button"
              onClick={handleAddCustomColor}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-white transition-colors"
            >
              + Add Color
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 4: MULTI-SIZE CHECKBOXES (S, M, L, XL, XXL)       */}
        {/* ========================================================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>4. Multi-Size Matrix</span>
            </h2>
            <button
              type="button"
              onClick={handleSelectAllSizes}
              className="text-xs text-yellow-400 hover:underline font-semibold"
            >
              Select All Sizes
            </button>
          </div>

          <p className="text-xs text-zinc-400">
            Check the sizes produced for this drop. All checked sizes will be available to customers:
          </p>

          <div className="grid grid-cols-5 gap-2">
            {ALL_SIZES.map((sz) => {
              const isChecked = productData.sizes.includes(sz);
              return (
                <label
                  key={sz}
                  onClick={() => handleToggleSize(sz)}
                  className={`p-3 rounded-xl border text-center font-bold text-sm cursor-pointer select-none transition-all flex flex-col items-center gap-1 ${
                    isChecked
                      ? 'border-yellow-400 bg-yellow-400 text-zinc-950 shadow-md'
                      : 'border-zinc-800 bg-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="sr-only"
                  />
                  <span>{sz}</span>
                  <span className="text-[10px] font-normal opacity-80">
                    {isChecked ? 'Enabled' : 'Off'}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 5: INVENTORY STOCK COUNT & THRESHOLDS             */}
        {/* ========================================================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
              <Box className="w-4 h-4" />
              <span>5. Inventory Stock Count &amp; Tracking</span>
            </h2>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                Number(productData.stockCount) > 0
                  ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                  : 'bg-red-950/80 border-red-800 text-red-400'
              }`}
            >
              {Number(productData.stockCount) > 0 ? '● In Stock' : '✕ Out of Stock'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-xs text-zinc-400 font-medium">Initial Total Stock Count (Units)</label>
              <input
                type="number"
                min="0"
                placeholder="100"
                required
                value={productData.stockCount}
                onChange={(e) => setProductData({ ...productData, stockCount: e.target.value })}
                className="w-full mt-1.5 p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white font-mono font-bold focus:outline-none focus:border-yellow-400"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Total available units across all sizes
              </span>
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-medium">Low Stock Alert Threshold</label>
              <input
                type="number"
                min="1"
                placeholder="15"
                value={productData.lowStockThreshold}
                onChange={(e) =>
                  setProductData({ ...productData, lowStockThreshold: e.target.value })
                }
                className="w-full mt-1.5 p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-yellow-400"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Triggers "Only X Left" urgency badge in store
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 6: FABRIC GSM & MATERIAL SPECS                    */}
        {/* ========================================================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <h2 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>6. Fabric GSM &amp; Material Technicals</span>
          </h2>

          {/* GSM presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-zinc-400 font-medium">Fabric Weight (GSM)</label>
              <span className="text-xs font-bold font-mono text-yellow-400">
                {productData.fabricGsm} GSM
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {GSM_PRESETS.map((g) => (
                <button
                  type="button"
                  key={g.gsm}
                  onClick={() => setProductData({ ...productData, fabricGsm: g.gsm })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    productData.fabricGsm === g.gsm
                      ? 'bg-yellow-400 text-zinc-950 border-yellow-400 shadow-sm'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 font-medium">Material Composition</label>
              <input
                type="text"
                placeholder="100% Combed Bio-Washed Cotton"
                value={productData.material}
                onChange={(e) => setProductData({ ...productData, material: e.target.value })}
                className="w-full mt-1.5 p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-medium">Drop Silhouette / Fit</label>
              <select
                value={productData.fit}
                onChange={(e) => setProductData({ ...productData, fit: e.target.value })}
                className="w-full mt-1.5 p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="Signature Boxy Drop-Shoulder">Signature Boxy Drop-Shoulder</option>
                <option value="Relaxed Oversized Drape">Relaxed Oversized Drape</option>
                <option value="Classic Regular Streetwear">Classic Regular Streetwear</option>
                <option value="Heavyweight Pullover Hoodie">Heavyweight Pullover Hoodie</option>
                <option value="Cropped Boxy Cut">Cropped Boxy Cut</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-400 font-medium">Description &amp; Fabric Notes</label>
            <textarea
              rows={3}
              placeholder="100% Cotton 280 GSM Heavyweight Fabric. Pre-shrunk with anti-pilling bio-wash and thick 1.25-inch ribbed neckband..."
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              className="w-full mt-1.5 p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 7: MULTIPLE PHOTO UPLOADS & GALLERY               */}
        {/* ========================================================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>7. Multiple Photos &amp; Lookbook Gallery</span>
            </h2>
            <span className="text-xs text-zinc-400">
              {productData.imageUrls.length} Image{productData.imageUrls.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Add URL or File */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Paste image URL (https://...)"
              value={productData.newImageUrlInput}
              onChange={(e) =>
                setProductData({ ...productData, newImageUrlInput: e.target.value })
              }
              className="flex-1 p-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
            />
            <button
              type="button"
              onClick={() => handleAddImageUrl()}
              className="px-4 py-2.5 bg-yellow-400 text-zinc-950 font-bold rounded-xl text-xs hover:bg-yellow-300 transition-colors shrink-0"
            >
              + Add URL
            </button>
          </div>

          {/* Local file upload option */}
          <div className="flex items-center gap-2">
            <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-2 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Local Photo</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleLocalFileUpload}
                className="sr-only"
              />
            </label>
            <span className="text-[11px] text-zinc-500">or pick quick streetwear presets:</span>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-1.5">
            {PRESET_IMAGE_OPTIONS.map((item) => (
              <button
                type="button"
                key={item.label}
                onClick={() => handleAddImageUrl(item.url)}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 transition-colors"
              >
                + {item.label}
              </button>
            ))}
          </div>

          {/* Image Thumbnail Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {productData.imageUrls.map((url, idx) => (
              <div
                key={url + idx}
                className="relative aspect-[3/4] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 group"
              >
                <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                {idx === 0 && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-zinc-950 text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                    Cover Photo
                  </span>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 text-xs">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetCoverImage(idx)}
                      className="px-2 py-1 bg-yellow-400 text-zinc-950 font-bold rounded text-[10px]"
                    >
                      Set as Cover
                    </button>
                  )}
                  {productData.imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 8: FULFILLMENT TOGGLE (Self-Stock vs Printrove POD) */}
        {/* ========================================================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
              <Warehouse className="w-4 h-4" />
              <span>8. Fulfillment Channel &amp; POD Dispatch</span>
            </h2>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
              Channel: {productData.fulfillmentType}
            </span>
          </div>

          {/* Toggle buttons */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
            <button
              type="button"
              onClick={() =>
                setProductData({ ...productData, fulfillmentType: 'In-House' })
              }
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                productData.fulfillmentType === 'In-House'
                  ? 'bg-yellow-400 text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Warehouse className="w-4 h-4" />
              <span>Self-Stock (In-House)</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setProductData({ ...productData, fulfillmentType: 'Printrove-POD' })
              }
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                productData.fulfillmentType === 'Printrove-POD'
                  ? 'bg-yellow-400 text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Printrove POD Auto-Fulfill</span>
            </button>
          </div>

          {/* In-House Warehouse Settings */}
          {productData.fulfillmentType === 'In-House' ? (
            <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/80 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>🏢 In-House Warehouse &amp; Shelf Configuration</span>
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  Direct Dispatch
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-zinc-400 block mb-1">Warehouse Bin / Shelf Location</label>
                  <input
                    type="text"
                    value={productData.inHouseWarehouseBin}
                    onChange={(e) =>
                      setProductData({ ...productData, inHouseWarehouseBin: e.target.value })
                    }
                    placeholder="e.g. WH-MUM-BAY-04"
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Dispatch Lead Time (Days)</label>
                  <select
                    value={productData.inHouseDispatchLeadDays}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        inHouseDispatchLeadDays: e.target.value,
                      })
                    }
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="0">Same Day Express Dispatch</option>
                    <option value="1">24 Hours (Next Day Dispatch)</option>
                    <option value="2">48 Hours (Standard Processing)</option>
                  </select>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400">
                Customer orders for this item will generate in-house picking slips and ship under your brand packaging from your own hub.
              </p>
            </div>
          ) : (
            /* Printrove POD Settings */
            <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/80 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                  <Printer className="w-4 h-4" />
                  <span>🖨️ Printrove POD Fulfillment Mapping</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  API Auto-Push Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-zinc-400 block mb-1">POD Partner Provider</label>
                  <select
                    value={productData.podProvider}
                    onChange={(e) =>
                      setProductData({ ...productData, podProvider: e.target.value })
                    }
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="Printrove">Printrove POD (API Connected)</option>
                    <option value="Qikink">Qikink Dropship</option>
                    <option value="Gelato">Gelato Global Hub</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">
                    POD Product SKU / Variant Mapping ID
                  </label>
                  <input
                    type="text"
                    required={productData.fulfillmentType === 'Printrove-POD'}
                    value={productData.podSKU}
                    onChange={(e) => setProductData({ ...productData, podSKU: e.target.value })}
                    placeholder="e.g. PTR-TSHIRT-BLK-OVS"
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Printing Technique</label>
                <select
                  value={productData.podPrintTechnique}
                  onChange={(e) =>
                    setProductData({ ...productData, podPrintTechnique: e.target.value })
                  }
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-yellow-400"
                >
                  <option value="Direct-to-Garment (DTG)">Direct-to-Garment (DTG) - High Detail &amp; Colors</option>
                  <option value="High-Density Screen Print">High-Density Screen Print - Textured &amp; Durable</option>
                  <option value="Sublimation">All-over Sublimation Print</option>
                  <option value="Embroidery">Custom Heavy Embroidery</option>
                </select>
              </div>

              <p className="text-[11px] text-zinc-400">
                Whenever a customer places an order, it will automatically push via{' '}
                <code className="text-yellow-400 font-mono text-[10px]">/api/orders/push-printrove</code>{' '}
                with your configured <code className="text-white font-mono text-[10px]">{productData.podSKU}</code> for instant automated printing.
              </p>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* SUBMIT BUTTON                                             */}
        {/* ========================================================= */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-display font-black text-sm uppercase tracking-wide transition-all shadow-xl shadow-yellow-400/20 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                <span>Configuring &amp; Publishing Drop...</span>
              </>
            ) : (
              <span>🚀 Publish Product Drop to Storefront</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-md p-2 sm:p-6 animate-in fade-in duration-200">
        <div className="w-full max-w-3xl mx-auto my-4">
          {panelContent}
        </div>
      </div>
    );
  }

  return panelContent;
}
export { PrivateOwnerPanel };
