import React, { useState } from 'react';
import { X, Sparkles, Upload, CheckCircle2, DollarSign } from 'lucide-react';
import { Product, ProductCategory, ProductSize } from '../types';
import acidWashImg from '../assets/images/tee_oversized_acid_wash_1792082131228.jpg';
import retroCyberImg from '../assets/images/tee_retro_cyber_anime_1792082132438.jpg';
import hoodieHeavyweightImg from '../assets/images/hoodie_heavyweight_slate_1792082132014.jpg';

interface ResellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemListed: (product: Product) => void;
  sellerName?: string;
}

export const ResellerModal: React.FC<ResellerModalProps> = ({
  isOpen,
  onClose,
  onItemListed,
  sellerName = 'Vibe Creator',
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Oversized' | 'Streetwear' | 'Retro' | 'Hoodies'>('Oversized');
  const [price, setPrice] = useState(1999);
  const [discountPrice, setDiscountPrice] = useState(1499);
  const [description, setDescription] = useState('');
  const [fabricGsm, setFabricGsm] = useState(280);
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>(['L', 'XL']);
  const [selectedImage, setSelectedImage] = useState(acidWashImg);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleSize = (size: ProductSize) => {
    if (selectedSizes.includes(size)) {
      if (selectedSizes.length > 1) {
        setSelectedSizes(selectedSizes.filter((s) => s !== size));
      }
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const payoutAmount = Math.round(discountPrice * 0.85);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newProductData: Omit<Product, 'productID'> = {
        title,
        description: description || 'Limited drop curated by verified community reseller. Heavyweight pre-shrunk cotton with drop shoulder silhouette.',
        price: Number(price),
        discountPrice: Number(discountPrice),
        category,
        images: [selectedImage],
        sizesAvailable: selectedSizes,
        stockStatus: 'In Stock',
        fabricGsm: Number(fabricGsm),
        fit: 'Signature Boxy Fit',
        tag: 'Resale Vault · Verified',
        rating: 5.0,
        reviewCount: 1,
        isResellerItem: true,
        resellerName: sellerName,
        resellerPayout: payoutAmount,
      };

      onItemListed(newProductData as any);
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl p-5 text-zinc-100 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">Resell / List Streetwear Piece</h3>
              <p className="text-[11px] text-zinc-400">Add to Vibe Tees Vault with 85% Instant Payout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">Listed on Vibe Tees Vault!</h4>
            <p className="text-xs text-zinc-400">
              Your streetwear drop is now live in the store catalog for customers to purchase.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Garment Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cyberpunk Archive Vintage Heavy Tee"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Oversized">Oversized</option>
                  <option value="Streetwear">Streetwear</option>
                  <option value="Retro">Retro</option>
                  <option value="Hoodies">Hoodies</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Fabric Weight (GSM)</label>
                <input
                  type="number"
                  value={fabricGsm}
                  onChange={(e) => setFabricGsm(Number(e.target.value))}
                  min={180}
                  max={500}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Retail Price (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Selling Price (₹)</label>
                <input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(Number(e.target.value))}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Payout Callout */}
            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-between text-xs text-amber-300">
              <span className="font-medium">Estimated Reseller Payout:</span>
              <span className="font-bold font-mono text-sm">₹{payoutAmount} (85%)</span>
            </div>

            {/* Size Availability */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Available Sizes
              </label>
              <div className="flex gap-2">
                {(['S', 'M', 'L', 'XL', 'XXL'] as ProductSize[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      selectedSizes.includes(size)
                        ? 'bg-amber-400 text-zinc-950 border-amber-400'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Studio Asset Style Selection */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Catalog Photographic Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { img: acidWashImg, label: 'Acid Wash' },
                  { img: retroCyberImg, label: 'Cyber Retro' },
                  { img: hoodieHeavyweightImg, label: 'Heavyweight' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(item.img)}
                    className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${
                      selectedImage === item.img ? 'border-amber-400 scale-102' : 'border-zinc-800 opacity-60'
                    }`}
                  >
                    <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-black/70 px-1 rounded text-white">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Description / Notes</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Condition, wash details, screen print details..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing Drop...' : 'Publish to Vibe Vault'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
