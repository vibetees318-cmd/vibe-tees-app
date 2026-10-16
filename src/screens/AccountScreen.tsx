import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  ShoppingCart,
  ChevronRight,
  Camera,
  Edit3,
  Phone,
  Headphones,
  Gift,
  Building2,
  CreditCard,
  Receipt,
  Banknote,
  Heart,
  Share2,
  Store,
  Wallet,
  Briefcase,
  Settings as SettingsIcon,
  Star,
  Gavel,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Copy,
  ExternalLink,
  X,
  Lock,
  Bell,
  MapPin,
  Plus,
  Trash2,
  HelpCircle,
  Send,
  Check,
  MessageCircle,
  PhoneCall,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Bot,
  Film,
} from 'lucide-react';
import {
  BankAccountDetails,
  NotificationPreferences,
  Product,
  ProductSize,
  SavedAddressItem,
  User,
} from '../types';
import { api } from '../services/api';
import { INITIAL_PRODUCTS } from '../data/seedProducts';
import { ResellerVerificationPortal } from '../components/ResellerVerificationPortal';

interface AccountScreenProps {
  currentUser: User | null;
  onUserUpdated: (user: User) => void;
  onLogout: () => void;
  onOpenResellerModal?: () => void;
  onNavigateHome?: () => void;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
  cartCount?: number;
  onAddToCart?: (product: Product, size: ProductSize, quantity: number) => void;
  onSelectProduct?: (product: Product) => void;
  onOpenChatbot?: () => void;
  onOpenAiVideoModal?: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  currentUser,
  onUserUpdated,
  onLogout,
  onOpenResellerModal,
  onNavigateHome,
  onOpenCart,
  onOpenSearch,
  cartCount = 0,
  onAddToCart,
  onSelectProduct,
  onOpenChatbot,
  onOpenAiVideoModal,
}) => {
  // Modal visibility states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showReferModal, setShowReferModal] = useState(false);
  const [showBankUpiModal, setShowBankUpiModal] = useState(false);
  const [bankUpiTab, setBankUpiTab] = useState<'upi' | 'bank'>('upi');
  const [showPaymentRefundModal, setShowPaymentRefundModal] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showSharedProductsModal, setShowSharedProductsModal] = useState(false);
  const [showFollowedShopsModal, setShowFollowedShopsModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showVerificationPortal, setShowVerificationPortal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | 'return'>('privacy');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Profile Edit Form State
  const [profileName, setProfileName] = useState(currentUser?.fullName || 'Pranjit Baghwar');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || 'pranjitbaghwar5@gmail.com');

  // Bank & UPI State
  const [upiId, setUpiId] = useState(currentUser?.upiID || 'pranjit@okhdfcbank');
  const [accountHolder, setAccountHolder] = useState(
    currentUser?.bankAccountDetails?.accountHolderName || currentUser?.fullName || 'Pranjit Baghwar'
  );
  const [accountNumber, setAccountNumber] = useState(
    currentUser?.bankAccountDetails?.accountNumber || '50100482910381'
  );
  const [ifscCode, setIfscCode] = useState(
    currentUser?.bankAccountDetails?.ifscCode || 'HDFC0001248'
  );
  const [bankName, setBankName] = useState(
    currentUser?.bankAccountDetails?.bankName || 'HDFC Bank Ltd.'
  );

  // Wishlist State (seeded with initial streetwear picks)
  const [wishlist, setWishlist] = useState<Product[]>([
    INITIAL_PRODUCTS[0],
    INITIAL_PRODUCTS[2],
    INITIAL_PRODUCTS[3],
  ]);

  // Followed Shops State
  const [followedShops, setFollowedShops] = useState([
    {
      id: 'shop-01',
      name: 'Vibe Tees Official Hub',
      category: 'Streetwear & Oversized',
      rating: 4.9,
      followers: '142K',
      isFollowing: true,
      badge: 'Official',
    },
    {
      id: 'shop-02',
      name: 'Tokyo Underground Studio',
      category: 'Anime & Cyberpunk Graphics',
      rating: 4.8,
      followers: '89K',
      isFollowing: true,
      badge: 'Top Seller',
    },
    {
      id: 'shop-03',
      name: 'Acid Wash Vintage Co.',
      category: 'Heavyweight Retro Washed',
      rating: 4.7,
      followers: '54K',
      isFollowing: false,
      badge: 'Trending',
    },
  ]);

  // Refer & Earn State
  const [referralCopied, setReferralCopied] = useState(false);
  const referralCode = 'PRANJIT25';

  // Ratings State
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingTags, setRatingTags] = useState<string[]>([
    'Heavy GSM Cotton',
    'Fast Payouts',
  ]);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Settings State
  const [notifications, setNotifications] = useState<NotificationPreferences>(
    currentUser?.notificationPreferences || {
      orderUpdates: true,
      payoutAlerts: true,
      promotionalDrops: false,
      whatsappUpdates: true,
    }
  );

  // Address editing state
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrHouse, setAddrHouse] = useState('');
  const [addrArea, setAddrArea] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPin, setAddrPin] = useState('');

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      const updated = await api.updateUserProfile(currentUser.userID, {
        fullName: profileName.trim(),
        phone: profilePhone.trim(),
        email: profileEmail.trim(),
      });
      onUserUpdated(updated);
      setShowProfileModal(false);
      showToast('Profile updated successfully!');
    } catch {
      showToast('Failed to update profile');
    }
  };

  // Handle Bank & UPI Save
  const handleSaveBankUpi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      if (bankUpiTab === 'upi') {
        const updated = await api.updateUpiId(currentUser.userID, upiId.trim());
        onUserUpdated(updated);
        showToast('Instant UPI ID linked successfully!');
      } else {
        const details: BankAccountDetails = {
          accountHolderName: accountHolder.trim(),
          accountNumber: accountNumber.trim(),
          ifscCode: ifscCode.trim(),
          bankName: bankName.trim(),
        };
        const updated = await api.updateBankDetails(currentUser.userID, details);
        onUserUpdated(updated);
        showToast('Bank Account details saved for payouts!');
      }
      setShowBankUpiModal(false);
    } catch {
      showToast('Failed to save payment details');
    }
  };

  // Handle Wishlist Move to Cart
  const handleMoveWishlistToCart = (prod: Product) => {
    if (onAddToCart) {
      onAddToCart(prod, 'L', 1);
      showToast(`Added "${prod.title}" to cart (Size L)`);
    }
  };

  const handleRemoveFromWishlist = (prodId: string) => {
    setWishlist((prev) => prev.filter((p) => p.productID !== prodId));
    showToast('Removed item from Wishlist');
  };

  // Handle Follow Shop Toggle
  const handleToggleFollow = (shopId: string) => {
    setFollowedShops((prev) =>
      prev.map((s) => (s.id === shopId ? { ...s, isFollowing: !s.isFollowing } : s))
    );
  };

  // Handle Referral Copy
  const handleCopyReferral = () => {
    const text = `Join Vibe Tees using my reseller invite code ${referralCode} and get ₹250 bonus credits on your first order! https://vibetees.app/invite/${referralCode}`;
    navigator.clipboard?.writeText(text);
    setReferralCopied(true);
    showToast('Referral link copied to clipboard!');
    setTimeout(() => setReferralCopied(false), 2000);
  };

  // Handle Address Save
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const newAddr: SavedAddressItem = {
      id: 'addr-' + Date.now(),
      fullName: addrName || currentUser.fullName,
      phone: addrPhone || currentUser.phone,
      houseNo: addrHouse,
      area: addrArea,
      street: `${addrHouse}, ${addrArea}`,
      city: addrCity,
      state: addrState,
      pinCode: addrPin,
      isDefault: true,
      tag: 'Home',
    };
    try {
      const updated = await api.saveAddress(currentUser.userID, newAddr);
      onUserUpdated(updated);
      setShowAddressModal(false);
      showToast('New delivery address saved!');
    } catch {
      showToast('Failed to save address');
    }
  };

  const isResellerVerified = !!currentUser?.isResellerVerified;

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-white min-h-screen pb-28 max-w-lg mx-auto w-full">
      {/* ------------------------------------------------------------- */}
      {/* TOAST NOTIFICATION                                            */}
      {/* ------------------------------------------------------------- */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-zinc-950 px-4 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-4 h-4 fill-zinc-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER (Meesho Style)                                  */}
      {/* Header with Back arrow, "ACCOUNT" title, Search & Cart badge  */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="p-1.5 -ml-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-display font-black tracking-wider text-white uppercase">
            ACCOUNT
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearch || onNavigateHome}
            className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenCart}
            className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-bold flex items-center justify-center font-mono shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* ------------------------------------------------------------- */}
        {/* PROFILE ROW                                                   */}
        {/* Avatar with edit icon, User Name, and right arrow '>'        */}
        {/* ------------------------------------------------------------- */}
        <div
          onClick={() => setShowProfileModal(true)}
          className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-between cursor-pointer group active:scale-[0.99] shadow-sm"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {/* User Avatar with Edit Badge */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-display font-black text-2xl flex items-center justify-center shadow-md">
                {(currentUser?.fullName || 'P').charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center text-amber-400 shadow">
                <Camera className="w-3 h-3" />
              </div>
            </div>

            {/* User Name & Details */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white truncate">
                  {currentUser?.fullName || 'Pranjit Baghwar'}
                </h2>
                {isResellerVerified && (
                  <span className="shrink-0 inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                {currentUser?.phone || '+91 98765 43210'}
              </p>
              <span className="text-[11px] text-amber-400/90 font-medium inline-flex items-center gap-1 mt-0.5">
                <span>View and edit profile</span>
              </span>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TOP 2-CARD GRID ACTION BUTTONS (Meesho Style)                 */}
        {/* Card 1: "Help Centre" (phone icon)                           */}
        {/* Card 2: "Refer & Earn" (gift box icon)                       */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Help Centre / Gemini Support */}
          <button
            onClick={() => (onOpenChatbot ? onOpenChatbot() : setShowHelpModal(true))}
            className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 transition-all flex items-center gap-3 text-left active:scale-[0.98] shadow-sm group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block leading-tight flex items-center gap-1">
                <span>Help Centre</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[10px] text-amber-400/90 font-medium block mt-0.5 truncate">
                Gemini AI Concierge 24x7
              </span>
            </div>
          </button>

          {/* Card 2: Refer & Earn */}
          <button
            onClick={() => setShowReferModal(true)}
            className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-3 text-left active:scale-[0.98] shadow-sm group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Gift className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block leading-tight">
                Refer &amp; Earn
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5 truncate">
                Earn ₹250 Per Friend
              </span>
            </div>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. "MY PAYMENTS" SECTION                                      */}
        {/* - Bank & UPI Details                                          */}
        {/* - Payment & Refund                                            */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-1.5 pt-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
            My Payments
          </h3>
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 divide-y divide-zinc-800/80 overflow-hidden shadow-sm">
            {/* Bank & UPI Details */}
            <div
              onClick={() => setShowBankUpiModal(true)}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Bank &amp; UPI Details
                  </span>
                  <span className="text-[11px] text-zinc-400 block">
                    Manage bank account &amp; instant UPI for reseller payouts
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Payment & Refund */}
            <div
              onClick={() => setShowPaymentRefundModal(true)}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 text-emerald-400 flex items-center justify-center shrink-0">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Payment &amp; Refund
                  </span>
                  <span className="text-[11px] text-zinc-400 block">
                    Customer transactions, margins &amp; refund history
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. "MY ACTIVITY" SECTION                                      */}
        {/* - Wishlisted Products (Heart)                                 */}
        {/* - Shared Products (Share2)                                    */}
        {/* - Followed Shops (Store + 'New' badge)                        */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-1.5 pt-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
            My Activity
          </h3>
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 divide-y divide-zinc-800/80 overflow-hidden shadow-sm">
            {/* Wishlisted Products */}
            <div
              onClick={() => setShowWishlistModal(true)}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 text-rose-400 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Wishlisted Products
                  </span>
                  <span className="text-[11px] text-zinc-400 block">
                    Saved favorite graphic &amp; oversized tees
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
                  {wishlist.length} items
                </span>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Shared Products */}
            <div
              onClick={() => setShowSharedProductsModal(true)}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 text-blue-400 flex items-center justify-center shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Shared Products
                  </span>
                  <span className="text-[11px] text-zinc-400 block">
                    Catalog &amp; collections shared on WhatsApp / Instagram
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 border border-blue-900/60 px-2 py-0.5 rounded-full">
                  1.4k views
                </span>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Followed Shops */}
            <div
              onClick={() => setShowFollowedShopsModal(true)}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 text-purple-400 flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white block">
                      Followed Shops
                    </span>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-400 text-zinc-950 tracking-wider">
                      NEW
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400 block">
                    Streetwear partner boutiques &amp; creator labels
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 4. "OTHERS" SECTION                                           */}
        {/* - Vibe Tees Balance (Wallet + Badge e.g., ₹0)                 */}
        {/* - Become a Reseller / Supplier (Briefcase + Badge)            */}
        {/* - Settings (Gear)                                             */}
        {/* - Rate Vibe Tees (Star)                                       */}
        {/* - Legal and Policies (Gavel)                                  */}
        {/* - Logout (Exit)                                               */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-1.5 pt-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
            Others
          </h3>
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 divide-y divide-zinc-800/80 overflow-hidden shadow-sm">
            {/* Vibe Tees Balance */}
            <div
              onClick={() => setShowBalanceModal(true)}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Vibe Tees Balance
                  </span>
                  <span className="text-[11px] text-zinc-400 block">
                    Wallet cashbacks, referral credits &amp; rewards
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                  ₹0
                </span>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Become a Reseller / Supplier */}
            <div
              onClick={() => setShowVerificationPortal(true)}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Become a Reseller / Supplier
                  </span>
                  <span className="text-[11px] text-zinc-400 block">
                    Zero investment wholesale reselling &amp; custom branding
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isResellerVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-950 bg-amber-400 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 fill-zinc-950" />
                    Incomplete
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* AI Hero Video Animator (Veo 3.1) */}
            <div
              onClick={() => (onOpenAiVideoModal ? onOpenAiVideoModal() : null)}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400/20 to-rose-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white block">
                      AI Hero Video Animator
                    </span>
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-amber-400 text-zinc-950">
                      Veo 3.1
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400 block">
                    Turn photo uploads into cinematic 16:9 / 9:16 banner reels
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Settings */}
            <div
              onClick={() => setShowSettingsModal(true)}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Settings
                  </span>
                  <span className="text-[11px] text-zinc-400 block">
                    Notifications, saved addresses &amp; security
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Rate Vibe Tees */}
            <div
              onClick={() => setShowRateModal(true)}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 text-yellow-400 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Rate Vibe Tees
                  </span>
                  <span className="text-[11px] text-zinc-400 block">
                    Share your experience on App Store &amp; Play Store
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Legal and Policies */}
            <div
              onClick={() => setShowLegalModal(true)}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
                  <Gavel className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Legal and Policies
                  </span>
                  <span className="text-[11px] text-zinc-400 block">
                    Privacy Policy, Terms of Service &amp; 7-Day Return Rules
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Logout */}
            <div
              onClick={() => setShowLogoutConfirm(true)}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-red-950/20 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-950/60 border border-red-900/60 text-red-400 flex items-center justify-center shrink-0">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-red-400 block">
                    Logout
                  </span>
                  <span className="text-[11px] text-zinc-500 block">
                    Sign out of your active session
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 5. BOTTOM FOOTER BRANDING & VERSION CREDITS                   */}
        {/* "Made with love for Bharat" + Pranjit Baghwar credits         */}
        {/* ------------------------------------------------------------- */}
        <div className="pt-4 space-y-3 text-center">
          {/* Made with love for Bharat Banner Graphic */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-950/30 via-zinc-900 to-emerald-950/30 border border-zinc-800/90 flex items-center justify-center gap-2 shadow-sm">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            <span className="text-xs font-bold text-zinc-200 tracking-wide">
              Made with love for Bharat
            </span>
            <span className="text-xs">🇮🇳</span>
          </div>

          {/* Credits & Version */}
          <div className="space-y-1 text-zinc-500">
            <p className="text-[11px] font-medium text-zinc-400">
              Designed &amp; Developed by <strong className="text-zinc-200">Pranjit Baghwar</strong> • In Partnership with Vibe Tees
            </p>
            <p className="text-[10px] font-mono">
              App Version: 1.0.0
            </p>
            <p className="text-[10px]">
              Direct Support:{' '}
              <a
                href="mailto:vibetees318@gmail.com"
                className="text-amber-400 hover:underline font-mono"
              >
                vibetees318@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* MODAL 1: PROFILE DETAILS MODAL                                */}
      {/* ============================================================= */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>User Profile Details</span>
              </h4>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center py-2">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 font-display font-black text-2xl flex items-center justify-center shadow-lg">
                  {profileName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center text-amber-400">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>
              <span className="text-xs text-zinc-400 mt-2">Member ID: {currentUser?.userID || 'usr-vip-01'}</span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Mobile Number (Login &amp; OTP)</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-zinc-400 block">Reseller Status</span>
                  <span className="text-xs font-bold text-white">
                    {isResellerVerified ? 'Verified Meesho-style Partner' : 'Standard Customer'}
                  </span>
                </div>
                {isResellerVerified ? (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Active
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileModal(false);
                      setShowVerificationPortal(true);
                    }}
                    className="text-[10px] font-bold text-amber-400 underline"
                  >
                    Verify Now
                  </button>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 2: HELP CENTRE MODAL                                    */}
      {/* ============================================================= */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Headphones className="w-4 h-4 text-amber-400" />
                <span>Help Centre &amp; 24x7 Support</span>
              </h4>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Need assistance with an order, courier dispatch, size exchange, or reseller profit payout? We are here to help.
            </p>

            <div className="space-y-2.5">
              <a
                href="tel:+918008423833"
                className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-400/50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Toll-Free Helpline</span>
                    <span className="text-[10px] text-zinc-400 font-mono">+91 800-VIBE-TEE (Mon–Sun)</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400" />
              </a>

              <a
                href="https://wa.me/919876543210?text=Hi%20Vibe%20Tees%20Support,%20I%20need%20help%20with%20my%20order"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-400/50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">WhatsApp Instant Support</span>
                    <span className="text-[10px] text-zinc-400">Chat with priority partner rep</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400" />
              </a>

              <a
                href="mailto:vibetees318@gmail.com"
                className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-blue-400/50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-400/10 text-blue-400 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Email Desk</span>
                    <span className="text-[10px] text-zinc-400 font-mono">vibetees318@gmail.com</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-400" />
              </a>
            </div>

            {/* Quick FAQs Accordion */}
            <div className="pt-2 border-t border-zinc-800 space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Frequently Asked Questions
              </span>
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                <span className="font-semibold text-white block">When are reseller margins credited?</span>
                <p className="text-[11px] text-zinc-400">
                  Margins are credited directly to your registered UPI VPA or Bank Account within 24 hours of successful courier delivery.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                <span className="font-semibold text-white block">How does the 7-day return policy work?</span>
                <p className="text-[11px] text-zinc-400">
                  Customers can initiate an instant size exchange or defect return within 7 calendar days from doorstep delivery.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 text-xs font-semibold text-white hover:bg-zinc-700"
            >
              Close Help Centre
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 3: REFER & EARN MODAL                                   */}
      {/* ============================================================= */}
      {showReferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Gift className="w-4 h-4 text-emerald-400" />
                <span>Refer Friends &amp; Earn ₹250</span>
              </h4>
              <button
                onClick={() => setShowReferModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-zinc-950 to-zinc-950 border border-emerald-800/60 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h5 className="text-base font-bold text-white">
                Earn 25% Margin on Friend&apos;s First 3 Orders
              </h5>
              <p className="text-xs text-zinc-300">
                Share your invite code with friends or aspiring streetwear resellers. When they place or resell their first order, you both earn bonus cash!
              </p>
            </div>

            {/* Referral Code Box */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">Your Referral Code</span>
                <span className="text-base font-mono font-black text-amber-400 tracking-wider">
                  {referralCode}
                </span>
              </div>
              <button
                onClick={handleCopyReferral}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
              >
                {referralCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{referralCopied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block font-mono">Invited Friends</span>
                <span className="text-base font-bold text-white">18</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block font-mono">Bonus Earned</span>
                <span className="text-base font-bold text-emerald-400">₹4,500</span>
              </div>
            </div>

            <button
              onClick={() => {
                const text = encodeURIComponent(
                  `Check out Vibe Tees! Use my referral code ${referralCode} for ₹250 instant discount: https://vibetees.app`
                );
                window.open(`https://wa.me/?text=${text}`, '_blank');
              }}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Invite via WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 4: BANK & UPI DETAILS MODAL                             */}
      {/* ============================================================= */}
      {showBankUpiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Bank &amp; UPI Payout Settings</span>
              </h4>
              <button
                onClick={() => setShowBankUpiModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-Tabs: Instant UPI vs Bank Account */}
            <div className="grid grid-cols-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs">
              <button
                type="button"
                onClick={() => setBankUpiTab('upi')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  bankUpiTab === 'upi'
                    ? 'bg-amber-400 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Instant UPI ID
              </button>
              <button
                type="button"
                onClick={() => setBankUpiTab('bank')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  bankUpiTab === 'bank'
                    ? 'bg-amber-400 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Bank Account
              </button>
            </div>

            <form onSubmit={handleSaveBankUpi} className="space-y-3 text-xs">
              {bankUpiTab === 'upi' ? (
                <>
                  <div>
                    <label className="block text-zinc-400 mb-1">UPI VPA Address</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. pranjit@okhdfcbank"
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-[11px] text-emerald-300 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>
                      Instant UPI transfers are triggered immediately upon courier delivery confirmation. Works with GPay, PhonePe, and Paytm.
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-zinc-400 mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Bank Account Number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBankUpiModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold"
                >
                  Save Payout Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 5: PAYMENT & REFUND HISTORY MODAL                       */}
      {/* ============================================================= */}
      {showPaymentRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span>Payment &amp; Refund History</span>
              </h4>
              <button
                onClick={() => setShowPaymentRefundModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Summary card */}
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-mono block">Total Settled Profit</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">₹14,850</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 uppercase font-mono block">Pending Escrow</span>
                <span className="text-lg font-bold text-amber-400 font-mono">₹3,200</span>
              </div>
            </div>

            {/* List of recent transactions */}
            <div className="space-y-2 text-xs">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Recent Settlements &amp; Remittances
              </span>

              {[
                {
                  id: 'TXN-908124890123',
                  title: 'Order Margin #VT-94021',
                  amount: '+₹500',
                  status: 'Credited to UPI',
                  date: 'Today, 2:45 PM',
                  isCredit: true,
                },
                {
                  id: 'TXN-882109412948',
                  title: 'Bulk Drop Margin #VT-93881',
                  amount: '+₹7,150',
                  status: 'Credited to Bank',
                  date: 'Oct 04, 2026',
                  isCredit: true,
                },
                {
                  id: 'TXN-849102941029',
                  title: 'Size Exchange Adjustment',
                  amount: '₹0 (Free Swap)',
                  status: 'Settled',
                  date: 'Sep 28, 2026',
                  isCredit: false,
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white block">{item.title}</span>
                    <span className="text-[10px] font-mono text-zinc-500 block">{item.id}</span>
                    <span className="text-[10px] text-zinc-400 mt-0.5 block">{item.date}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-mono font-bold block ${
                        item.isCredit ? 'text-emerald-400' : 'text-zinc-300'
                      }`}
                    >
                      {item.amount}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowPaymentRefundModal(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 text-xs font-semibold text-white hover:bg-zinc-700"
            >
              Close Ledger
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 6: WISHLISTED PRODUCTS MODAL                            */}
      {/* ============================================================= */}
      {showWishlistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <span>Wishlisted Products ({wishlist.length})</span>
              </h4>
              <button
                onClick={() => setShowWishlistModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Heart className="w-10 h-10 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-400">Your wishlist is currently empty.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {wishlist.map((prod) => (
                  <div
                    key={prod.productID}
                    className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-3"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      className="w-16 h-16 rounded-lg object-cover bg-zinc-900 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-white truncate">{prod.title}</h5>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold font-mono text-amber-400">
                          ₹{prod.discountPrice}
                        </span>
                        <span className="text-[10px] text-zinc-500 line-through font-mono">
                          ₹{prod.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleMoveWishlistToCart(prod)}
                          className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>Add to Cart</span>
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(prod.productID)}
                          className="p-1 rounded-lg text-zinc-500 hover:text-red-400"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowWishlistModal(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 text-xs font-semibold text-white hover:bg-zinc-700"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 7: SHARED PRODUCTS MODAL                                */}
      {/* ============================================================= */}
      {showSharedProductsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-400" />
                <span>Shared Catalog &amp; Analytics</span>
              </h4>
              <button
                onClick={() => setShowSharedProductsModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block font-mono">Catalog Views</span>
                <span className="text-sm font-bold text-white font-mono">1,420</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block font-mono">Inquiries</span>
                <span className="text-sm font-bold text-amber-400 font-mono">38</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block font-mono">Orders</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">14</span>
              </div>
            </div>

            {/* Shared Products List */}
            <div className="space-y-2.5">
              {[INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[1]].map((prod) => (
                <div
                  key={prod.productID}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-white truncate">{prod.title}</h5>
                      <span className="text-[10px] text-zinc-400 font-mono">Shared on WhatsApp</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(
                        `Check out ${prod.title} on Vibe Tees for ₹${prod.discountPrice}! https://vibetees.app`
                      );
                      window.open(`https://wa.me/?text=${text}`, '_blank');
                    }}
                    className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    title="Share Again"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowSharedProductsModal(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 text-xs font-semibold text-white hover:bg-zinc-700"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 8: FOLLOWED SHOPS MODAL                                 */}
      {/* ============================================================= */}
      {showFollowedShopsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Store className="w-4 h-4 text-purple-400" />
                <span>Followed Shops</span>
              </h4>
              <button
                onClick={() => setShowFollowedShopsModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Get notified immediately whenever your favorite streetwear creators and verified supplier hubs launch new drops.
            </p>

            <div className="space-y-3">
              {followedShops.map((shop) => (
                <div
                  key={shop.id}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-bold text-white truncate">{shop.name}</h5>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                        {shop.badge}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      {shop.category} • ★ {shop.rating} ({shop.followers})
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleFollow(shop.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      shop.isFollowing
                        ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        : 'bg-amber-400 text-zinc-950 hover:bg-amber-300'
                    }`}
                  >
                    {shop.isFollowing ? 'Following' : '+ Follow'}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowFollowedShopsModal(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 text-xs font-semibold text-white hover:bg-zinc-700"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 9: VIBE TEES BALANCE MODAL                              */}
      {/* ============================================================= */}
      {showBalanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Wallet className="w-4 h-4 text-amber-400" />
                <span>Vibe Tees Balance</span>
              </h4>
              <button
                onClick={() => setShowBalanceModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Big Balance Card */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-1">
              <span className="text-xs text-zinc-400 uppercase font-mono">Available Wallet Cash</span>
              <div className="text-3xl font-black font-mono text-emerald-400">₹0</div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Your reselling profit margins are automatically transferred directly to your linked UPI address.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-300 space-y-1">
              <strong className="block text-white">Promotional Credits: ₹250</strong>
              <p className="text-[11px] text-zinc-300">
                You can apply promotional cashback credits at checkout on orders above ₹1,499.
              </p>
            </div>

            <button
              onClick={() => setShowBalanceModal(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 text-xs font-semibold text-white hover:bg-zinc-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 10: SETTINGS MODAL (Notifications, Addresses, etc)       */}
      {/* ============================================================= */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <SettingsIcon className="w-4 h-4 text-zinc-400" />
                <span>Account Settings</span>
              </h4>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-3 text-xs">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Notification Preferences
              </span>

              {[
                { key: 'orderUpdates', label: 'Order & Shipping Tracking Alerts' },
                { key: 'payoutAlerts', label: 'Instant Reseller Payout SMS' },
                { key: 'whatsappUpdates', label: 'WhatsApp Order Updates & Invoices' },
                { key: 'promotionalDrops', label: 'New Oversized Tee Flash Drops' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer"
                >
                  <span className="text-zinc-300">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={notifications[item.key as keyof NotificationPreferences]}
                    onChange={(e) => {
                      const next = { ...notifications, [item.key]: e.target.checked };
                      setNotifications(next);
                      if (currentUser) {
                        api.updateNotificationPreferences(currentUser.userID, next);
                      }
                      showToast('Preferences updated');
                    }}
                    className="accent-amber-400 w-4 h-4"
                  />
                </label>
              ))}
            </div>

            {/* Address Management Shortcut */}
            <div className="pt-2 border-t border-zinc-800 space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Delivery Addresses
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowAddressModal(true);
                }}
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-400/50 flex items-center justify-between text-xs text-white"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>+ Add New Shipping Address</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 text-xs font-semibold text-white hover:bg-zinc-700"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 11: RATE VIBE TEES MODAL                                */}
      {/* ============================================================= */}
      {showRateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>Rate Vibe Tees</span>
              </h4>
              <button
                onClick={() => setShowRateModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {ratingSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h5 className="font-bold text-white text-sm">Thank You for Your Review!</h5>
                <p className="text-xs text-zinc-400">
                  Your feedback helps us make Vibe Tees India&apos;s best streetwear and reselling hub.
                </p>
                <button
                  onClick={() => setShowRateModal(false)}
                  className="mt-3 w-full py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-white"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-xs text-zinc-400">
                  How was your shopping and reselling experience with Vibe Tees?
                </p>

                {/* Stars Selector */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingStars(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= ratingStars
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Tell us what you loved about the fabric, fits, or payout speed..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                />

                <button
                  onClick={() => {
                    setRatingSubmitted(true);
                    showToast('Review submitted. Thank you!');
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase"
                >
                  Submit Review
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 12: LEGAL AND POLICIES MODAL                            */}
      {/* ============================================================= */}
      {showLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="text-sm font-bold flex items-center gap-2 text-amber-400">
                <Gavel className="w-4 h-4" />
                <span>Legal Disclosures &amp; Policies</span>
              </h4>
              <button
                onClick={() => setShowLegalModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="grid grid-cols-3 p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px]">
              {(['privacy', 'terms', 'return'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setLegalTab(tab)}
                  className={`py-1.5 rounded-lg font-bold capitalize transition-all ${
                    legalTab === tab
                      ? 'bg-amber-400 text-zinc-950 shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab === 'privacy' ? 'Privacy' : tab === 'terms' ? 'Terms' : '7-Day Return'}
                </button>
              ))}
            </div>

            <div className="text-xs text-zinc-300 space-y-3 leading-relaxed">
              {legalTab === 'privacy' && (
                <>
                  <p>
                    <strong>1. Information Collection &amp; Use:</strong> Vibe Tees collects phone numbers, delivery addresses, and payment credentials exclusively to fulfill orders, deliver shipments via courier networks, and disburse reseller margin payouts.
                  </p>
                  <p>
                    <strong>2. Bank &amp; UPI Security:</strong> All bank account numbers and UPI VPAs are processed via certified PCI-DSS compliant payment gateways with AES-256 standard encryption.
                  </p>
                  <p>
                    <strong>3. Customer Anonymity:</strong> For dropshipped reseller orders, end-customers only see the reseller&apos;s custom store name on shipping labels and packaging slips.
                  </p>
                </>
              )}

              {legalTab === 'terms' && (
                <>
                  <p>
                    <strong>1. Reseller Margin Settlement:</strong> Reseller profit margins are calculated dynamically at checkout and credited to the reseller&apos;s linked UPI or Bank account within 24 hours of verified courier delivery.
                  </p>
                  <p>
                    <strong>2. Cash on Delivery (COD) Rules:</strong> In the event of a customer rejection or return to origin (RTO) on COD parcels, no profit margin is disbursed.
                  </p>
                  <p>
                    <strong>3. Authentic Standards:</strong> All garments adhere strictly to Vibe Tees 260–450 GSM streetwear standards.
                  </p>
                </>
              )}

              {legalTab === 'return' && (
                <>
                  <p>
                    <strong>1. 7-Day Exchange Window:</strong> Customers have 7 full calendar days from doorstep delivery to request a hassle-free size exchange or quality return.
                  </p>
                  <p>
                    <strong>2. Garment Condition:</strong> Garments must remain unworn, unwashed, and retain original tags and protective polybags.
                  </p>
                  <p>
                    <strong>3. Margin Adjustments:</strong> If a customer initiates a product return, the corresponding margin is adjusted automatically in escrow.
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setShowLegalModal(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 text-xs font-semibold text-white hover:bg-zinc-700"
            >
              Close Policies
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 13: LOGOUT CONFIRMATION DIALOG                          */}
      {/* ============================================================= */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xs bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-800 text-red-400 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Log out of Vibe Tees?</h4>
              <p className="text-xs text-zinc-400 mt-1">
                You will need to verify your phone number via OTP to log in again.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-xs font-bold text-white shadow"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 14: ADD ADDRESS MODAL                                   */}
      {/* ============================================================= */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Add Delivery Address</span>
              </h4>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={addrName}
                  onChange={(e) => setAddrName(e.target.value)}
                  placeholder="Recipient Name"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={addrPhone}
                  onChange={(e) => setAddrPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">House / Flat / Building No.</label>
                <input
                  type="text"
                  value={addrHouse}
                  onChange={(e) => setAddrHouse(e.target.value)}
                  placeholder="e.g. Flat 402, Royal Residency"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Area / Locality / Street</label>
                <input
                  type="text"
                  value={addrArea}
                  onChange={(e) => setAddrArea(e.target.value)}
                  placeholder="e.g. 100ft Road, Indiranagar"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">City</label>
                  <input
                    type="text"
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    placeholder="City"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">State</label>
                  <input
                    type="text"
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    placeholder="State"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={addrPin}
                    onChange={(e) => setAddrPin(e.target.value)}
                    placeholder="PIN"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* RESELLER VERIFICATION PORTAL (Step 1 -> 2 -> 3 Flow)          */}
      {/* ============================================================= */}
      <ResellerVerificationPortal
        isOpen={showVerificationPortal}
        onClose={() => setShowVerificationPortal(false)}
        currentUser={currentUser}
        onVerified={(updatedUser) => {
          onUserUpdated(updatedUser);
          showToast('Congratulations! Reseller status is now Verified!');
        }}
      />
    </div>
  );
};
