export type UserRole = 'Customer' | 'Admin';
export type AppMode = 'Customer' | 'Reseller';

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  pinCode: string;
  houseNo?: string;
  area?: string;
}

export interface SavedAddressItem extends ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  houseNo?: string;
  area?: string;
  isDefault?: boolean;
  tag?: 'Home' | 'Work' | 'Warehouse';
}

export interface BankAccountDetails {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName?: string;
}

export interface PayoutRecord {
  id: string;
  date: string;
  amount: number;
  transactionId: string;
  status: 'Transferred' | 'Processing';
  paymentMethod: 'Bank Transfer (NEFT/IMPS)' | 'Instant UPI Payout';
}

export interface SharedProductItem {
  productID: string;
  title: string;
  image: string;
  views: number;
  inquiries: number;
  sharedAt: string;
  platform: 'WhatsApp' | 'Instagram';
  customPrice?: number;
  margin?: number;
}

export interface NotificationPreferences {
  orderUpdates: boolean;
  payoutAlerts: boolean;
  promotionalDrops: boolean;
  whatsappUpdates: boolean;
}

export interface User {
  userID: string;
  fullName: string;
  email: string;
  phone: string;
  shippingAddress: ShippingAddress;
  savedAddresses?: SavedAddressItem[];
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;

  // Reselling Ecosystem Fields
  mode?: AppMode;
  isResellerVerified?: boolean;
  resellerStoreName?: string;
  hasGst?: boolean;
  gstin?: string;
  enrolmentId?: string;
  pickupAddress?: ShippingAddress;
  bankAccountDetails?: BankAccountDetails;
  upiID?: string;
  totalEarnings?: number;
  pendingPayout?: number;
  transferredPayout?: number;
  payoutHistory?: PayoutRecord[];
  sharedProducts?: SharedProductItem[];
  notificationPreferences?: NotificationPreferences;
}

export type ProductCategory = 'All' | 'Oversized' | 'Streetwear' | 'Retro' | 'Hoodies';

export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type StockStatus = 'In Stock' | 'Out of Stock';

export interface Product {
  productID: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  category: 'Oversized' | 'Streetwear' | 'Retro' | 'Hoodies';
  images: string[];
  sizesAvailable: ProductSize[];
  stockStatus: StockStatus;
  fabricGsm?: number;
  fit?: string;
  tag?: string;
  rating?: number;
  reviewCount?: number;
  isResellerItem?: boolean;
  resellerName?: string;
  resellerPayout?: number;
}

export interface CartItem {
  cartID: string;
  userID: string;
  productID: string;
  selectedSize: ProductSize;
  quantity: number;
  addedAt: string;
  product?: Product;
}

export type PaymentStatus = 'Paid' | 'Cash on Delivery';
export type PaymentMethod = 'COD' | 'UPI' | 'Card';
export type OrderStatus = 'Placed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';
export type PayoutStatus = 'Pending' | 'Transferred' | 'N/A';

export interface OrderTrackingStep {
  status: OrderStatus;
  label: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface OrderItem {
  productID: string;
  title: string;
  image: string;
  selectedSize: ProductSize;
  quantity: number;
  price: number;
  category: string;
}

export interface VideoReelDeal {
  id: string;
  videoUrl: string;
  posterImage: string;
  badge: string;
  discountPercent: number;
  productID: string;
  title: string;
  originalPrice: number;
  dealPrice: number;
  dayIndex?: number;
  tagline?: string;
}

export interface Order {
  orderID: string;
  userID: string;
  itemsList: OrderItem[];
  shippingAddress: ShippingAddress & { fullName: string; phone: string };
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDeliveryDate: string;
  trackingUpdates: OrderTrackingStep[];

  // Reseller Economics Breakdown Fields
  basePrice: number;
  resellerMargin: number;
  finalCustomerPrice: number;
  payoutStatus: PayoutStatus;
  isResellerOrder?: boolean;
  resellerStoreName?: string;
  cancellationReason?: string;
  isResellingToCustomer?: boolean; // Meesho style toggle: Yes / No
}
