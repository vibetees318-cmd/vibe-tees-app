import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ShieldCheck,
  Building2,
  MapPin,
  CreditCard,
  Store,
  HelpCircle,
  Sparkles,
  AlertCircle,
  FileText,
  Truck,
  Briefcase,
  PhoneCall,
  MessageCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { BankAccountDetails, ShippingAddress, User } from '../types';

interface ResellerVerificationPortalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onVerified: (user: User) => void;
}

export const ResellerVerificationPortal: React.FC<ResellerVerificationPortalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onVerified,
}) => {
  // Current active step (1 to 4)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Help modal state
  const [showHelpModal, setShowHelpModal] = useState(false);

  // -------------------------------------------------------------
  // STEP 1: BUSINESS DETAILS (GST SELECTION)
  // -------------------------------------------------------------
  const [hasGst, setHasGst] = useState<'yes' | 'no' | null>(null);
  const [gstin, setGstin] = useState(currentUser?.gstin || '');
  const [gstVerified, setGstVerified] = useState(false);
  const [isVerifyingGst, setIsVerifyingGst] = useState(false);
  const [enrolmentId, setEnrolmentId] = useState(currentUser?.enrolmentId || '');

  // -------------------------------------------------------------
  // STEP 2: PICKUP ADDRESS
  // -------------------------------------------------------------
  const [pincode, setPincode] = useState(
    currentUser?.pickupAddress?.pinCode || currentUser?.shippingAddress?.pinCode || '560038'
  );
  const [buildingNo, setBuildingNo] = useState(
    currentUser?.pickupAddress?.houseNo || 'Flat 402, Royal Heights'
  );
  const [streetName, setStreetName] = useState(
    currentUser?.pickupAddress?.area || currentUser?.pickupAddress?.street || '100ft Indiranagar Road'
  );
  const [city, setCity] = useState(
    currentUser?.pickupAddress?.city || currentUser?.shippingAddress?.city || 'Bengaluru'
  );
  const [state, setState] = useState(
    currentUser?.pickupAddress?.state || currentUser?.shippingAddress?.state || 'Karnataka'
  );

  // -------------------------------------------------------------
  // STEP 3: BANK DETAILS (FOR PAYOUTS)
  // -------------------------------------------------------------
  const [accountNumber, setAccountNumber] = useState(
    currentUser?.bankAccountDetails?.accountNumber || '50100482910381'
  );
  const [reAccountNumber, setReAccountNumber] = useState(
    currentUser?.bankAccountDetails?.accountNumber || '50100482910381'
  );
  const [ifscCode, setIfscCode] = useState(
    currentUser?.bankAccountDetails?.ifscCode || 'HDFC0001248'
  );
  const [accountHolderName, setAccountHolderName] = useState(
    currentUser?.bankAccountDetails?.accountHolderName || currentUser?.fullName || 'Pranjit Baghwar'
  );
  const [bankName, setBankName] = useState(
    currentUser?.bankAccountDetails?.bankName || 'HDFC Bank Ltd.'
  );

  // -------------------------------------------------------------
  // STEP 4: SUPPLIER / STORE DETAILS
  // -------------------------------------------------------------
  const [storeName, setStoreName] = useState(
    currentUser?.resellerStoreName || 'Vibe Tees Supplier'
  );
  const [fullName, setFullName] = useState(currentUser?.fullName || 'Pranjit Baghwar');
  const [email, setEmail] = useState(currentUser?.email || 'pranjitbaghwar5@gmail.com');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Final submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  // Handle GSTIN format verification simulation
  const handleVerifyGst = () => {
    const cleanGst = gstin.trim().toUpperCase();
    if (cleanGst.length < 15) {
      setError('Please enter a valid 15-character GSTIN (e.g. 29ABCDE1234F1Z5)');
      return;
    }
    setError(null);
    setIsVerifyingGst(true);
    setTimeout(() => {
      setIsVerifyingGst(false);
      setGstVerified(true);
      setGstin(cleanGst);
    }, 500);
  };

  // Pincode auto-fill helper
  const handlePincodeChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setPincode(clean);
    if (clean.length === 6) {
      if (clean.startsWith('56')) {
        setCity('Bengaluru');
        setState('Karnataka');
      } else if (clean.startsWith('11')) {
        setCity('New Delhi');
        setState('Delhi');
      } else if (clean.startsWith('40')) {
        setCity('Mumbai');
        setState('Maharashtra');
      } else if (clean.startsWith('70')) {
        setCity('Kolkata');
        setState('West Bengal');
      }
    }
  };

  // Step 1 Validation
  const isStep1Valid = () => {
    if (hasGst === 'yes') {
      return gstin.trim().length >= 15 && gstVerified;
    }
    if (hasGst === 'no') {
      return enrolmentId.trim().length >= 8;
    }
    return false;
  };

  // Step 2 Validation
  const isStep2Valid = () => {
    return (
      pincode.trim().length === 6 &&
      buildingNo.trim().length > 0 &&
      streetName.trim().length > 0 &&
      city.trim().length > 0 &&
      state.trim().length > 0
    );
  };

  // Step 3 Validation
  const isStep3Valid = () => {
    const accountsMatch =
      accountNumber.trim().length >= 8 && accountNumber.trim() === reAccountNumber.trim();
    const ifscValid = ifscCode.trim().length >= 6;
    const nameValid = accountHolderName.trim().length >= 2;
    return accountsMatch && ifscValid && nameValid;
  };

  // Step 4 Validation
  const isStep4Valid = () => {
    return (
      storeName.trim().length >= 3 &&
      fullName.trim().length >= 2 &&
      email.trim().includes('@') &&
      agreedToTerms
    );
  };

  // Handle Next / Continue Navigation
  const handleContinue = async () => {
    setError(null);

    if (currentStep === 1) {
      if (!isStep1Valid()) {
        if (hasGst === 'yes' && !gstVerified) {
          setError('Please click "Verify GST" to authenticate your GSTIN.');
        } else {
          setError('Please complete the Business Details requirement to continue.');
        }
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!isStep2Valid()) {
        setError('Please fill in all Pickup Address fields with a valid 6-digit Pincode.');
        return;
      }
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!isStep3Valid()) {
        if (accountNumber.trim() !== reAccountNumber.trim()) {
          setError('Bank account numbers do not match. Please re-enter carefully.');
        } else {
          setError('Please complete all Bank Details fields.');
        }
        return;
      }
      setCurrentStep(4);
      return;
    }

    if (currentStep === 4) {
      if (!isStep4Valid()) {
        setError('Please provide your Store Name, Full Name, Email, and accept terms.');
        return;
      }

      if (!currentUser) {
        setError('User session not found. Please log in.');
        return;
      }

      // Final Submission
      setIsSubmitting(true);
      try {
        const pickupAddr: ShippingAddress = {
          street: `${buildingNo.trim()}, ${streetName.trim()}`,
          city: city.trim(),
          state: state.trim(),
          pinCode: pincode.trim(),
          houseNo: buildingNo.trim(),
          area: streetName.trim(),
        };

        const bankDetails: BankAccountDetails = {
          accountNumber: accountNumber.trim(),
          ifscCode: ifscCode.trim().toUpperCase(),
          accountHolderName: accountHolderName.trim(),
          bankName: bankName.trim() || 'Verified Bank',
        };

        const updated = await api.verifyReseller(currentUser.userID, {
          resellerStoreName: storeName.trim(),
          fullName: fullName.trim(),
          email: email.trim(),
          hasGst: hasGst === 'yes',
          gstin: hasGst === 'yes' ? gstin.trim().toUpperCase() : undefined,
          enrolmentId: hasGst === 'no' ? enrolmentId.trim().toUpperCase() : undefined,
          pickupAddress: pickupAddr,
          bankAccountDetails: bankDetails,
        });

        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F59E0B', '#10B981', '#3B82F6', '#FFFFFF'],
          });
        } catch {
          // ignore
        }

        setIsCompleted(true);
        onVerified(updated);
      } catch (err: any) {
        setError(err?.message || 'Failed to complete verification. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Stepper items metadata
  const stepsMeta = [
    { id: 1, label: 'Business Details', icon: Briefcase },
    { id: 2, label: 'Pickup Address', icon: Truck },
    { id: 3, label: 'Bank Details', icon: CreditCard },
    { id: 4, label: 'Supplier Details', icon: Store },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-zinc-950 sm:border sm:border-zinc-800 sm:rounded-3xl text-white shadow-2xl flex flex-col h-full sm:h-auto sm:max-h-[92vh] overflow-hidden relative">
        {/* ============================================================= */}
        {/* 1. HEADER & STEPPER BAR                                       */}
        {/* Title: "Complete Account Details" with "Help?" button         */}
        {/* ============================================================= */}
        <div className="bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 px-4 pt-4 pb-3 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (currentStep > 1) {
                    setCurrentStep((prev) => (prev - 1) as any);
                  } else {
                    onClose();
                  }
                }}
                className="p-1.5 -ml-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base font-display font-black tracking-wide text-white">
                Complete Account Details
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-amber-400 flex items-center gap-1 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Help?</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 4-Step Progress Stepper Bar */}
          <div className="pt-1 pb-1">
            <div className="grid grid-cols-4 relative">
              {/* Stepper connecting line */}
              <div className="absolute top-4 left-[12%] right-[12%] h-[2px] bg-zinc-800 -z-0" />
              <div
                className="absolute top-4 left-[12%] h-[2px] bg-amber-400 -z-0 transition-all duration-300"
                style={{
                  width: `${((currentStep - 1) / 3) * 76}%`,
                }}
              />

              {stepsMeta.map((s) => {
                const Icon = s.icon;
                const isCurrent = currentStep === s.id;
                const isPassed = currentStep > s.id;

                return (
                  <div key={s.id} className="flex flex-col items-center text-center relative z-10">
                    <button
                      type="button"
                      disabled={!isPassed && !isCurrent}
                      onClick={() => {
                        if (isPassed) setCurrentStep(s.id as any);
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-emerald-500 text-zinc-950 shadow-md ring-2 ring-emerald-500/30'
                          : isCurrent
                          ? 'bg-amber-400 text-zinc-950 font-black shadow-lg ring-4 ring-amber-400/20 scale-105'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-500'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                    </button>
                    <span
                      className={`text-[10px] mt-1.5 leading-tight font-medium max-w-[70px] truncate ${
                        isCurrent
                          ? 'text-amber-400 font-bold'
                          : isPassed
                          ? 'text-zinc-200'
                          : 'text-zinc-500'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* MAIN BODY: STEP PAGES                                         */}
        {/* ============================================================= */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-800/80 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* SUCCESS SCREEN UPON COMPLETION */}
          {isCompleted ? (
            <div className="py-10 text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                  Verification Approved
                </span>
                <h3 className="text-xl font-display font-black text-white mt-1">
                  Supplier Account Activated!
                </h3>
                <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto leading-relaxed">
                  Your store <strong className="text-white">"{storeName}"</strong> is now verified to list and resell 0% commission streetwear drops across India.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-left space-y-2 text-xs max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Store Name:</span>
                  <span className="font-bold text-white">{storeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Tax Type:</span>
                  <span className="font-mono text-amber-400">
                    {hasGst === 'yes' ? `GSTIN: ${gstin}` : `EID: ${enrolmentId}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Payout Destination:</span>
                  <span className="font-mono text-zinc-300">
                    {bankName} (••••{accountNumber.slice(-4)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Pickup Pincode:</span>
                  <span className="font-mono text-zinc-300">{pincode} ({city})</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full max-w-sm py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 transition-all active:scale-95"
              >
                Go to Reseller Hub &amp; Start Selling
              </button>
            </div>
          ) : (
            <>
              {/* ------------------------------------------------------- */}
              {/* STEP 1: BUSINESS DETAILS (GST SELECTION)                */}
              {/* ------------------------------------------------------- */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-base font-display font-black text-white">
                      Do you have a GST number?
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                      Select your tax registration status to proceed with seller enrollment.
                    </p>
                  </div>

                  {/* Selection Cards (Radio Buttons) */}
                  <div className="space-y-3">
                    {/* OPTION A: YES */}
                    <div
                      onClick={() => {
                        setHasGst('yes');
                        setError(null);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        hasGst === 'yes'
                          ? 'bg-zinc-900 border-amber-400 shadow-md ring-1 ring-amber-400/30'
                          : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="pt-0.5">
                          <input
                            type="radio"
                            name="gstOption"
                            checked={hasGst === 'yes'}
                            onChange={() => setHasGst('yes')}
                            className="accent-amber-400 w-4 h-4 cursor-pointer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <strong className="text-sm font-bold text-white block">Yes</strong>
                          <span className="text-xs text-zinc-400 block mt-0.5">
                            Enter your GSTIN and sell anywhere easily
                          </span>
                        </div>
                      </div>

                      {/* CONDITIONAL INPUT: GSTIN */}
                      {hasGst === 'yes' && (
                        <div className="mt-4 pt-3 border-t border-zinc-800/80 space-y-2 animate-in fade-in">
                          <label className="block text-[11px] font-bold text-zinc-300">
                            Enter 15-Digit GSTIN *
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={15}
                              value={gstin}
                              onChange={(e) => {
                                setGstin(e.target.value.toUpperCase());
                                setGstVerified(false);
                              }}
                              placeholder="e.g. 29ABCDE1234F1Z5"
                              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:border-amber-400"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyGst}
                              disabled={gstin.trim().length < 15 || isVerifyingGst}
                              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                gstVerified
                                  ? 'bg-emerald-500 text-zinc-950 cursor-default'
                                  : 'bg-amber-400 hover:bg-amber-300 text-zinc-950 disabled:opacity-50'
                              }`}
                            >
                              {isVerifyingGst
                                ? 'Verifying...'
                                : gstVerified
                                ? 'Verified ✓'
                                : 'Verify GST'}
                            </button>
                          </div>

                          {gstVerified ? (
                            <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-1">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>Verified Business Entity: Active Regular GSTIN</span>
                            </p>
                          ) : (
                            <p className="text-[10px] text-zinc-500">
                              Format: 2 digits state code + 10 digits PAN + 3 entity digits.
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* OPTION B: NO */}
                    <div
                      onClick={() => {
                        setHasGst('no');
                        setError(null);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        hasGst === 'no'
                          ? 'bg-zinc-900 border-amber-400 shadow-md ring-1 ring-amber-400/30'
                          : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="pt-0.5">
                          <input
                            type="radio"
                            name="gstOption"
                            checked={hasGst === 'no'}
                            onChange={() => setHasGst('no')}
                            className="accent-amber-400 w-4 h-4 cursor-pointer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <strong className="text-sm font-bold text-white">No</strong>
                            {/* GREEN TAG: Get Enrolment ID (EID) in mins ⚡ */}
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-[10px] font-bold">
                              <span>Get Enrolment ID (EID) in mins ⚡</span>
                            </span>
                          </div>
                          <span className="text-xs text-zinc-400 block mt-1">
                            Worry not, you can sell without GST
                          </span>
                        </div>
                      </div>

                      {/* CONDITIONAL INPUT: ENROLMENT ID / PAN */}
                      {hasGst === 'no' && (
                        <div className="mt-4 pt-3 border-t border-zinc-800/80 space-y-2 animate-in fade-in">
                          <label className="block text-[11px] font-bold text-zinc-300">
                            Enter Enrolment ID (EID) or PAN Number *
                          </label>
                          <input
                            type="text"
                            maxLength={16}
                            value={enrolmentId}
                            onChange={(e) => setEnrolmentId(e.target.value.toUpperCase())}
                            placeholder="e.g. EID123456789012 or ABCDE1234F"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:border-amber-400"
                          />
                          <p className="text-[10px] text-zinc-400 leading-relaxed">
                            Under GST council rules, intra-state e-commerce sellers under ₹40 lakh turnover can generate a free Enrolment ID (EID) in 2 minutes on the GST portal without full registration.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------- */}
              {/* STEP 2: PICKUP ADDRESS                                  */}
              {/* ------------------------------------------------------- */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-base font-display font-black text-white">
                      Pickup Address
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                      Where should our courier partner pick up packages for customer fulfillment?
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-zinc-400 mb-1">Pincode *</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        placeholder="e.g. 560038"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono tracking-wider focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Building / House No. *</label>
                      <input
                        type="text"
                        value={buildingNo}
                        onChange={(e) => setBuildingNo(e.target.value)}
                        placeholder="e.g. Flat 402, Royal Residency / Unit 5B"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Street Name / Area *</label>
                      <input
                        type="text"
                        value={streetName}
                        onChange={(e) => setStreetName(e.target.value)}
                        placeholder="e.g. 100ft Indiranagar Road, Near Metro"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-zinc-400 mb-1">City *</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Bengaluru"
                          required
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 mb-1">State *</label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="e.g. Karnataka"
                          required
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Free daily courier pickup arranged by Delhivery &amp; Bluedart.</span>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------- */}
              {/* STEP 3: BANK DETAILS (FOR PAYOUTS)                      */}
              {/* ------------------------------------------------------- */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-base font-display font-black text-white">
                      Bank Details (For Payouts)
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                      All your sales revenue and dropship profit margins will be deposited here.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-zinc-400 mb-1">Account Number *</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter bank account number"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-zinc-400">Re-enter Account Number *</label>
                        {reAccountNumber.length > 0 && (
                          <span
                            className={`text-[10px] font-mono ${
                              accountNumber === reAccountNumber
                                ? 'text-emerald-400'
                                : 'text-red-400'
                            }`}
                          >
                            {accountNumber === reAccountNumber
                              ? '✓ Numbers Match'
                              : '✕ Numbers Mismatch'}
                          </span>
                        )}
                      </div>
                      <input
                        type="password"
                        value={reAccountNumber}
                        onChange={(e) => setReAccountNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="Re-enter bank account number"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">IFSC Code *</label>
                      <input
                        type="text"
                        value={ifscCode}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          setIfscCode(val);
                          if (val.startsWith('HDFC')) setBankName('HDFC Bank Ltd.');
                          else if (val.startsWith('SBIN')) setBankName('State Bank of India');
                          else if (val.startsWith('ICIC')) setBankName('ICICI Bank Ltd.');
                          else if (val.startsWith('KKBK')) setBankName('Kotak Mahindra Bank');
                        }}
                        placeholder="e.g. HDFC0001248"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Account Holder Name *</label>
                      <input
                        type="text"
                        value={accountHolderName}
                        onChange={(e) => setAccountHolderName(e.target.value)}
                        placeholder="Full name as per bank records"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-[11px] text-emerald-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Verified via penny drop test. Daily automated settlements.</span>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------- */}
              {/* STEP 4: SUPPLIER / STORE DETAILS                        */}
              {/* ------------------------------------------------------- */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-base font-display font-black text-white">
                      Supplier &amp; Store Details
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                      This information appears on customer invoices and outer shipping packaging.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-zinc-400 mb-1">
                        Store Name (e.g. "Vibe Tees Supplier") *
                      </label>
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="e.g. Vibe Tees Supplier / DripLab Streetwear"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-amber-400"
                      />
                      <span className="text-[10px] text-zinc-500 mt-1 block">
                        Base pricing is hidden. Customers see this store name on shipping labels.
                      </span>
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Email ID *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="accent-amber-400 w-4 h-4 mt-0.5 cursor-pointer"
                    />
                    <span className="text-[11px] text-zinc-300 leading-relaxed">
                      I agree to the Vibe Tees Supplier &amp; Reseller Agreement, 0% Commission Catalog Rules, and Doorstep Courier Return Policy.
                    </span>
                  </label>
                </div>
              )}
            </>
          )}
        </div>

        {/* ============================================================= */}
        {/* 6. NAVIGATION CONTROL (STICKY BOTTOM BUTTON)                  */}
        {/* Disabled until required selection, turns active/accent color  */}
        {/* ============================================================= */}
        {!isCompleted && (
          <div className="sticky bottom-0 left-0 right-0 p-4 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/90 z-40">
            {(() => {
              const isValid =
                currentStep === 1
                  ? isStep1Valid()
                  : currentStep === 2
                  ? isStep2Valid()
                  : currentStep === 3
                  ? isStep3Valid()
                  : isStep4Valid();

              const buttonLabel =
                currentStep === 1
                  ? 'Continue to Pickup Address'
                  : currentStep === 2
                  ? 'Continue to Bank Details'
                  : currentStep === 3
                  ? 'Continue to Supplier Details'
                  : isSubmitting
                  ? 'Activating Account...'
                  : 'Submit & Complete Account';

              return (
                <button
                  type="button"
                  disabled={!isValid || isSubmitting}
                  onClick={handleContinue}
                  className={`w-full h-12 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isValid && !isSubmitting
                      ? 'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-lg shadow-amber-400/20 cursor-pointer'
                      : 'bg-zinc-800/80 text-zinc-500 border border-zinc-700/40 cursor-not-allowed opacity-60'
                  }`}
                >
                  <span>{buttonLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              );
            })()}
          </div>
        )}

        {/* ============================================================= */}
        {/* HELP? MODAL                                                   */}
        {/* ============================================================= */}
        {showHelpModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white shadow-2xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                <h4 className="text-sm font-bold flex items-center gap-2 text-amber-400">
                  <HelpCircle className="w-4 h-4" />
                  <span>Supplier Enrollment Help</span>
                </h4>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-zinc-300 space-y-2.5 leading-relaxed">
                <div>
                  <strong className="text-white block font-semibold">Can I sell without a GSTIN?</strong>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Yes! Government rules allow intra-state e-commerce sales using an Enrolment ID (EID) without GST registration if turnover is under ₹40 lakh.
                  </p>
                </div>

                <div>
                  <strong className="text-white block font-semibold">What is a Pickup Address?</strong>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    It is the warehouse, shop, or home address from which courier partners (Delhivery/Bluedart) pick up your packaged orders.
                  </p>
                </div>

                <div>
                  <strong className="text-white block font-semibold">When are margins paid?</strong>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Earnings are credited directly to your registered bank account every 7 days or upon verified courier delivery.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex gap-2">
                <a
                  href="tel:+918008423833"
                  className="flex-1 py-2 rounded-xl bg-zinc-800 text-[11px] text-center font-bold text-zinc-300 flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call Desk</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(false)}
                  className="flex-1 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs uppercase"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
