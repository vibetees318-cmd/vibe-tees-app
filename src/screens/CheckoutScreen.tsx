import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Store,
  DollarSign,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import { CartItem, PaymentMethod, SavedAddressItem, ShippingAddress, User } from '../types';

interface CheckoutScreenProps {
  currentUser: User | null;
  cartItems: CartItem[];
  onBack: () => void;
  onPlaceOrder: (orderParams: {
    shippingAddress: ShippingAddress & { fullName: string; phone: string };
    paymentMethod: PaymentMethod;
    subtotal: number;
    deliveryFee: number;
    totalAmount: number;
    basePrice?: number;
    resellerMargin?: number;
    isResellingToCustomer?: boolean;
    resellerStoreName?: string;
  }) => Promise<void>;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  currentUser,
  cartItems,
  onBack,
  onPlaceOrder,
}) => {
  const FREE_SHIPPING_THRESHOLD = 1999;
  const baseSubtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.discountPrice || 1299;
    return acc + price * item.quantity;
  }, 0);

  const deliveryFee = baseSubtotal >= FREE_SHIPPING_THRESHOLD || baseSubtotal === 0 ? 0 : 99;

  // MEESHO-STYLE RESELLING FLOW STATE
  const [isReselling, setIsReselling] = useState(currentUser?.mode === 'Reseller');
  const [customerFinalPrice, setCustomerFinalPrice] = useState(baseSubtotal + 500);
  const [resellerCustomStore, setResellerCustomStore] = useState(
    currentUser?.resellerStoreName || 'DripLab Streetwear by Alex'
  );

  // Live Margin Calculation
  const profitMargin = Math.max(0, customerFinalPrice - (baseSubtotal + deliveryFee));

  // Saved Addresses vs New Address Entry
  const savedAddresses = currentUser?.savedAddresses || [];
  const defaultSaved = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    defaultSaved ? defaultSaved.id : 'new'
  );
  const [isEnteringNewAddress, setIsEnteringNewAddress] = useState<boolean>(
    savedAddresses.length === 0
  );

  // On-Demand Address Fields: Full Name, Phone, House No, Area, PIN Code, City, State
  const [fullName, setFullName] = useState(
    defaultSaved?.fullName || currentUser?.fullName || ''
  );
  const [phone, setPhone] = useState(
    defaultSaved?.phone || currentUser?.phone || ''
  );
  const [houseNo, setHouseNo] = useState(
    defaultSaved?.houseNo || defaultSaved?.street?.split(',')[0] || ''
  );
  const [area, setArea] = useState(
    defaultSaved?.area || defaultSaved?.street?.split(',').slice(1).join(',').trim() || ''
  );
  const [city, setCity] = useState(defaultSaved?.city || '');
  const [state, setState] = useState(defaultSaved?.state || '');
  const [pinCode, setPinCode] = useState(defaultSaved?.pinCode || '');
  const [saveToProfile, setSaveToProfile] = useState(true);

  // When a saved address is picked, sync fields
  const handleSelectSavedAddress = (addr: SavedAddressItem) => {
    setSelectedAddressId(addr.id);
    setIsEnteringNewAddress(false);
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setHouseNo(addr.houseNo || addr.street?.split(',')[0] || '');
    setArea(addr.area || addr.street?.split(',').slice(1).join(',').trim() || '');
    setCity(addr.city);
    setState(addr.state);
    setPinCode(addr.pinCode);
  };

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !phone.trim() || !houseNo.trim() || !area.trim() || !city.trim() || !state.trim() || !pinCode.trim()) {
      setError('Please complete all delivery address fields (Full Name, Phone, House No, Area, PIN Code, City, State).');
      return;
    }

    if (pinCode.trim().length < 4) {
      setError('Please enter a valid PIN / Postal Code.');
      return;
    }

    if (isReselling && customerFinalPrice < baseSubtotal + deliveryFee) {
      setError(`Customer price must be at least ₹${baseSubtotal + deliveryFee} (Supplier base price + delivery).`);
      return;
    }

    setIsSubmitting(true);
    try {
      const fullStreet = `${houseNo.trim()}, ${area.trim()}`;

      // If user entered a new address and opted to save, store under "My Saved Addresses"
      if (isEnteringNewAddress && saveToProfile && currentUser) {
        const newSavedAddr: SavedAddressItem = {
          id: 'addr-' + Date.now(),
          fullName: fullName.trim(),
          phone: phone.trim(),
          houseNo: houseNo.trim(),
          area: area.trim(),
          street: fullStreet,
          city: city.trim(),
          state: state.trim(),
          pinCode: pinCode.trim(),
          isDefault: savedAddresses.length === 0,
          tag: 'Home',
        };
        await api.saveAddress(currentUser.userID, newSavedAddr);
      }

      await onPlaceOrder({
        shippingAddress: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          houseNo: houseNo.trim(),
          area: area.trim(),
          street: fullStreet,
          city: city.trim(),
          state: state.trim(),
          pinCode: pinCode.trim(),
        },
        paymentMethod,
        subtotal: isReselling ? customerFinalPrice : baseSubtotal,
        deliveryFee,
        totalAmount: isReselling ? customerFinalPrice : baseSubtotal + deliveryFee,
        basePrice: baseSubtotal,
        resellerMargin: isReselling ? profitMargin : 0,
        isResellingToCustomer: isReselling,
        resellerStoreName: resellerCustomStore,
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-white min-h-screen pb-32 max-w-lg mx-auto w-full">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
          aria-label="Back to Cart"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-base font-display font-bold text-white leading-none">
            Checkout & Fulfillment
          </h2>
          <span className="text-[11px] font-mono text-zinc-400">Step 2 of 2 · Secure Dispatch</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 1. MEESHO-STYLE RESELLING TOGGLE & LIVE MARGIN CALCULATOR */}
        {/* ------------------------------------------------------------- */}
        <section className="p-4 rounded-2xl bg-zinc-900/90 border border-amber-400/30 space-y-3.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Reselling this Order?</span>
                <span className="text-[10px] text-zinc-400 block">Meesho-style direct customer dropship</span>
              </div>
            </div>

            {/* Yes / No Toggle Pill */}
            <div className="flex items-center bg-zinc-950 rounded-xl p-0.5 border border-zinc-800">
              <button
                type="button"
                onClick={() => setIsReselling(false)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  !isReselling
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => setIsReselling(true)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  isReselling
                    ? 'bg-amber-400 text-zinc-950 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Yes
              </button>
            </div>
          </div>

          {/* Reselling Margin Input & Live Calculator (Shows only when Reselling = Yes) */}
          {isReselling && (
            <div className="pt-3 border-t border-zinc-800/80 space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Supplier Base Price
                  </label>
                  <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-zinc-300 font-bold tabular-nums">
                    ₹{(baseSubtotal + deliveryFee).toLocaleString('en-IN')}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-400 mb-1">
                    Set Final Price for Customer
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-xs">₹</span>
                    <input
                      type="number"
                      value={customerFinalPrice}
                      onChange={(e) => setCustomerFinalPrice(Number(e.target.value))}
                      min={baseSubtotal + deliveryFee}
                      step={50}
                      className="w-full bg-zinc-950 border border-amber-400/60 rounded-xl pl-6 pr-2.5 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Live Margin Calculation Display */}
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-mono text-emerald-300 block">
                    Your Profit Margin
                  </span>
                  <span className="text-[11px] text-zinc-300">
                    ₹{customerFinalPrice} (Customer Price) − ₹{baseSubtotal + deliveryFee} (Base)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-emerald-400 font-sans tabular-nums">
                    +₹{profitMargin.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-emerald-300 block font-mono">Credited to UPI</span>
                </div>
              </div>

              {/* White-Label Invoice Note */}
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Custom Store / Brand Name for Shipping Label
                </label>
                <div className="relative">
                  <Store className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={resellerCustomStore}
                    onChange={(e) => setResellerCustomStore(e.target.value)}
                    placeholder="Your Boutique / Brand Name"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <p className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Base price is strictly hidden. Customer invoice will show ₹{customerFinalPrice} under "{resellerCustomStore}".</span>
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ------------------------------------------------------------- */}
        {/* 2. ON-DEMAND CUSTOMER ADDRESS ENTRY & 1-CLICK SAVED ADDRESSES */}
        {/* ------------------------------------------------------------- */}
        <section className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <MapPin className="w-4 h-4" />
              <span>{isReselling ? "Customer's Delivery Address" : 'Delivery Shipping Address'}</span>
            </div>
            {savedAddresses.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setIsEnteringNewAddress(!isEnteringNewAddress);
                  if (!isEnteringNewAddress) {
                    setSelectedAddressId('new');
                    setHouseNo('');
                    setArea('');
                    setCity('');
                    setState('');
                    setPinCode('');
                  } else if (defaultSaved) {
                    handleSelectSavedAddress(defaultSaved);
                  }
                }}
                className="text-[11px] text-amber-400 hover:underline font-semibold"
              >
                {isEnteringNewAddress ? 'Use Saved Address' : '+ Add New Address'}
              </button>
            )}
          </div>

          {/* A. 1-Click Saved Addresses Picker (if user has saved addresses and not entering new) */}
          {!isEnteringNewAddress && savedAddresses.length > 0 ? (
            <div className="space-y-2">
              <span className="text-[11px] text-zinc-400 block font-mono">
                Select from "My Saved Addresses" (1-Click Delivery):
              </span>
              <div className="grid grid-cols-1 gap-2">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectSavedAddress(addr)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-zinc-950 border-amber-400 shadow-sm ring-1 ring-amber-400/30'
                          : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="savedAddress"
                            checked={isSelected}
                            onChange={() => handleSelectSavedAddress(addr)}
                            className="accent-amber-400"
                          />
                          <strong className="text-xs text-white">{addr.fullName}</strong>
                          {addr.tag && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                              {addr.tag}
                            </span>
                          )}
                          {addr.isDefault && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                              Default
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400 font-mono">{addr.phone}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1 pl-5">
                        {addr.houseNo ? `${addr.houseNo}, ` : ''}{addr.area ? `${addr.area}, ` : ''}{addr.street || ''}, {addr.city}, {addr.state} - <span className="font-mono text-zinc-200">{addr.pinCode}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* B. On-Demand Address Input Form: Full Name, Phone, House No, Area, PIN Code, City, State */
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-[11px] text-amber-300 flex items-center justify-between">
                <span>Enter shipping destination for order dispatch</span>
                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEnteringNewAddress(false);
                      if (defaultSaved) handleSelectSavedAddress(defaultSaved);
                    }}
                    className="text-amber-400 font-bold hover:underline"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    {isReselling ? "Customer Full Name *" : 'Recipient Full Name *'}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    {isReselling ? "Customer Mobile Phone *" : 'Mobile Phone (for delivery SMS) *'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* House No & Area */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    House No / Flat / Building *
                  </label>
                  <input
                    type="text"
                    value={houseNo}
                    onChange={(e) => setHouseNo(e.target.value)}
                    placeholder="e.g. Flat 402, Royal Residency"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Area / Street / Landmark *
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. 100ft Road, near Metro"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* City, State, PIN Code */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">State *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Karnataka"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="560038"
                    required
                    maxLength={6}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* Save Address to Profile Checkbox */}
              <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={saveToProfile}
                  onChange={(e) => setSaveToProfile(e.target.checked)}
                  className="accent-amber-400 w-4 h-4 rounded"
                />
                <span className="text-[11px] text-zinc-300">
                  Save this address under <strong className="text-amber-400">"My Saved Addresses"</strong> for 1-click checkout next time
                </span>
              </label>
            </div>
          )}
        </section>

        {/* ------------------------------------------------------------- */}
        {/* 3. PAYMENT METHOD */}
        {/* ------------------------------------------------------------- */}
        <section className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <CreditCard className="w-4 h-4" />
              <span>Payment Collection Method</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
              Encrypted
            </span>
          </div>

          <div className="space-y-2">
            {/* Option A: Cash on Delivery (COD) - Crucial for Resellers! */}
            <label
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                paymentMethod === 'COD'
                  ? 'bg-zinc-950 border-amber-400 shadow-sm'
                  : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="accent-amber-400"
                />
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Cash on Delivery (COD)</span>
                    {isReselling && (
                      <span className="text-[9px] bg-amber-400 text-zinc-950 px-1 rounded font-bold">
                        Collect ₹{customerFinalPrice} from Customer
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-zinc-400 block mt-0.5">
                    Courier collects ₹{isReselling ? customerFinalPrice : baseSubtotal + deliveryFee} in cash or UPI scan at delivery.
                  </span>
                </div>
              </div>
              <Banknote className="w-4 h-4 text-zinc-400" />
            </label>

            {/* Option B: Pre-paid Online (UPI / Card) */}
            <label
              className={`p-3 rounded-xl border flex flex-col gap-2 cursor-pointer transition-colors ${
                paymentMethod === 'UPI'
                  ? 'bg-zinc-950 border-amber-400 shadow-sm'
                  : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="accent-amber-400"
                  />
                  <div>
                    <span className="text-xs font-bold text-white">Online Payment (Prepaid UPI)</span>
                    <span className="text-[11px] text-zinc-400 block mt-0.5">
                      Pay supplier cost right now via GPay, PhonePe, or Paytm
                    </span>
                  </div>
                </div>
                <Smartphone className="w-4 h-4 text-zinc-400" />
              </div>

              {paymentMethod === 'UPI' && (
                <div className="mt-1 pt-2 border-t border-zinc-800 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUpiApp('gpay')}
                    className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-semibold border ${
                      selectedUpiApp === 'gpay' ? 'bg-amber-400 text-zinc-950 border-amber-400' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    Google Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedUpiApp('phonepe')}
                    className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-semibold border ${
                      selectedUpiApp === 'phonepe' ? 'bg-amber-400 text-zinc-950 border-amber-400' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    PhonePe
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedUpiApp('paytm')}
                    className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-semibold border ${
                      selectedUpiApp === 'paytm' ? 'bg-amber-400 text-zinc-950 border-amber-400' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    Paytm
                  </button>
                </div>
              )}
            </label>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* 4. ORDER SUMMARY */}
        {/* ------------------------------------------------------------- */}
        <section className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-2 text-xs">
          <div className="flex justify-between text-zinc-400">
            <span>Base Supplier Subtotal ({cartItems.length} items)</span>
            <span className="tabular-nums font-mono text-zinc-200">₹{baseSubtotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between text-zinc-400">
            <span>Shipping / Delivery</span>
            <span>{deliveryFee === 0 ? <span className="text-emerald-400 font-semibold">FREE</span> : `₹${deliveryFee}`}</span>
          </div>

          {isReselling && (
            <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-zinc-800">
              <span>Your Profit Margin (Escrow payout)</span>
              <span className="font-mono tabular-nums">+₹{profitMargin.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
            <span>{isReselling ? "Customer Collectible Amount" : "Total Payable"}</span>
            <span className="text-amber-400 tabular-nums text-base">
              ₹{(isReselling ? customerFinalPrice : baseSubtotal + deliveryFee).toLocaleString('en-IN')}
            </span>
          </div>
        </section>

        {/* Sticky Bottom Action Bar with Place Order CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/90 p-4">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono text-zinc-400 block">
                {isReselling ? 'Customer Invoice' : 'Total Due'}
              </span>
              <span className="text-lg font-black font-sans text-amber-400 tabular-nums">
                ₹{(isReselling ? customerFinalPrice : baseSubtotal + deliveryFee).toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-amber-400/10"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Placing Order...'
                  : isReselling
                  ? `Place Dropship Order · ₹${customerFinalPrice}`
                  : `Place Order · ₹${baseSubtotal + deliveryFee}`}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
