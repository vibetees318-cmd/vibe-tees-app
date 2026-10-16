import {
  AppMode,
  BankAccountDetails,
  CartItem,
  NotificationPreferences,
  Order,
  OrderItem,
  OrderStatus,
  PayoutStatus,
  Product,
  ProductCategory,
  ProductSize,
  SavedAddressItem,
  ShippingAddress,
  User,
  UserRole,
import { DEMO_USERS, INITIAL_PRODUCTS } from '../data/seedProducts';
import {
  syncUserToFirestore,
  syncOrderToFirestore,
  saveSupplierVerificationToFirestore,
} from './firebase';

const STORAGE_KEYS = {
  USERS: 'vt_users_v3',
  CURRENT_USER: 'vt_current_user_v3',
  PRODUCTS: 'vt_products_v3',
  CART: 'vt_cart_v3',
  ORDERS: 'vt_orders_v3',
  THEME: 'vt_theme_v3',
};

// Seed initial state in localStorage
function initializeLocalStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USERS[0]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CART)) {
    const sampleCart: CartItem[] = [
      {
        cartID: 'cart-' + Math.random().toString(36).substring(2, 9),
        userID: DEMO_USERS[0].userID,
        productID: INITIAL_PRODUCTS[0].productID,
        selectedSize: 'L',
        quantity: 1,
        addedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(sampleCart));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    const sampleOrders: Order[] = [
      // 1. ACTIVE ORDER: In Transit
      {
        orderID: 'VT-94021',
        userID: DEMO_USERS[0].userID,
        itemsList: [
          {
            productID: INITIAL_PRODUCTS[1].productID,
            title: INITIAL_PRODUCTS[1].title,
            image: INITIAL_PRODUCTS[1].images[0],
            selectedSize: 'XL',
            quantity: 1,
            price: 1999,
            category: INITIAL_PRODUCTS[1].category,
          },
        ],
        shippingAddress: {
          fullName: 'Marcus Vance',
          phone: '+1 (555) 782-9011',
          street: '124 Hawthorne Blvd, Suite 8',
          city: 'San Francisco',
          state: 'California',
          pinCode: '94103',
        },
        subtotal: 1999,
        deliveryFee: 0,
        totalAmount: 1999,
        paymentStatus: 'Paid',
        paymentMethod: 'UPI',
        orderStatus: 'Shipped',
        createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        estimatedDeliveryDate: new Date(Date.now() + 48 * 3600 * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        basePrice: 1499,
        resellerMargin: 500,
        finalCustomerPrice: 1999,
        payoutStatus: 'Pending',
        isResellerOrder: true,
        resellerStoreName: 'DripLab Streetwear by Alex',
        trackingUpdates: [
          {
            status: 'Placed',
            label: 'Order Confirmed',
            timestamp: new Date(Date.now() - 36 * 3600 * 1000).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
            description: 'Order confirmed and verified via UPI payment.',
            completed: true,
          },
          {
            status: 'Shipped',
            label: 'Dispatched from Hub',
            timestamp: new Date(Date.now() - 14 * 3600 * 1000).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
            description: 'Barcoded and packaged in matte weatherproof polybag.',
            completed: true,
          },
          {
            status: 'Out for Delivery',
            label: 'In Transit to Local Facility',
            timestamp: 'Expected Tomorrow',
            description: 'Package en route to local delivery courier station.',
            completed: false,
          },
          {
            status: 'Delivered',
            label: 'Doorstep Handover',
            timestamp: 'Pending',
            description: 'Customer signature and OTP delivery verification.',
            completed: false,
          },
        ],
      },
      // 2. ACTIVE ORDER: Placed (COD)
      {
        orderID: 'VT-94188',
        userID: DEMO_USERS[0].userID,
        itemsList: [
          {
            productID: INITIAL_PRODUCTS[0].productID,
            title: INITIAL_PRODUCTS[0].title,
            image: INITIAL_PRODUCTS[0].images[0],
            selectedSize: 'L',
            quantity: 1,
            price: 1699,
            category: INITIAL_PRODUCTS[0].category,
          },
        ],
        shippingAddress: {
          fullName: 'Devon Patel',
          phone: '+1 (555) 492-1823',
          street: '88 King Street East',
          city: 'Seattle',
          state: 'Washington',
          pinCode: '98104',
        },
        subtotal: 1699,
        deliveryFee: 0,
        totalAmount: 1699,
        paymentStatus: 'Cash on Delivery',
        paymentMethod: 'COD',
        orderStatus: 'Placed',
        createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        estimatedDeliveryDate: new Date(Date.now() + 72 * 3600 * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        basePrice: 1299,
        resellerMargin: 400,
        finalCustomerPrice: 1699,
        payoutStatus: 'Pending',
        isResellerOrder: true,
        resellerStoreName: 'DripLab Streetwear by Alex',
        trackingUpdates: [
          {
            status: 'Placed',
            label: 'Order Confirmed',
            timestamp: new Date(Date.now() - 6 * 3600 * 1000).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
            description: 'COD order confirmed with buyer. Margin holds pending delivery.',
            completed: true,
          },
          {
            status: 'Shipped',
            label: 'Dispatched from Hub',
            timestamp: 'Expected within 12h',
            description: 'Garment queued for quality audit.',
            completed: false,
          },
          {
            status: 'Out for Delivery',
            label: 'In Transit',
            timestamp: 'Pending',
            description: 'Courier dispatch.',
            completed: false,
          },
          {
            status: 'Delivered',
            label: 'Delivered',
            timestamp: 'Pending',
            description: 'Cash received & margin credited to wallet.',
            completed: false,
          },
        ],
      },
      // 3. DELIVERED ORDER
      {
        orderID: 'VT-88902',
        userID: DEMO_USERS[0].userID,
        itemsList: [
          {
            productID: INITIAL_PRODUCTS[2].productID,
            title: INITIAL_PRODUCTS[2].title,
            image: INITIAL_PRODUCTS[2].images[0],
            selectedSize: 'M',
            quantity: 1,
            price: 3499,
            category: INITIAL_PRODUCTS[2].category,
          },
        ],
        shippingAddress: {
          fullName: 'Elena Rostova',
          phone: '+1 (555) 601-3829',
          street: '312 W 23rd St, Apt 5',
          city: 'New York',
          state: 'NY',
          pinCode: '10011',
        },
        subtotal: 3499,
        deliveryFee: 0,
        totalAmount: 3499,
        paymentStatus: 'Paid',
        paymentMethod: 'UPI',
        orderStatus: 'Delivered',
        createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
        estimatedDeliveryDate: 'Oct 11, 2026',
        basePrice: 2899,
        resellerMargin: 600,
        finalCustomerPrice: 3499,
        payoutStatus: 'Transferred',
        isResellerOrder: true,
        resellerStoreName: 'DripLab Streetwear by Alex',
        trackingUpdates: [
          {
            status: 'Placed',
            label: 'Order Confirmed',
            timestamp: 'Oct 08, 2026, 11:30 AM',
            description: 'Order confirmed and payment captured.',
            completed: true,
          },
          {
            status: 'Shipped',
            label: 'Dispatched from Hub',
            timestamp: 'Oct 09, 2026, 04:15 PM',
            description: 'Shipped with express tracking.',
            completed: true,
          },
          {
            status: 'Out for Delivery',
            label: 'In Transit',
            timestamp: 'Oct 11, 2026, 09:20 AM',
            description: 'Out for delivery with courier agent.',
            completed: true,
          },
          {
            status: 'Delivered',
            label: 'Delivered',
            timestamp: 'Oct 11, 2026, 02:40 PM',
            description: 'Delivered to recipient. Reseller margin ₹600 credited to bank.',
            completed: true,
          },
        ],
      },
      // 4. CANCELLED / RETURNED ORDER
      {
        orderID: 'VT-87211',
        userID: DEMO_USERS[0].userID,
        itemsList: [
          {
            productID: INITIAL_PRODUCTS[3].productID,
            title: INITIAL_PRODUCTS[3].title,
            image: INITIAL_PRODUCTS[3].images[0],
            selectedSize: 'S',
            quantity: 1,
            price: 1399,
            category: INITIAL_PRODUCTS[3].category,
          },
        ],
        shippingAddress: {
          fullName: 'Zack Morris',
          phone: '+1 (555) 912-4029',
          street: '19 Bayside Ave',
          city: 'Miami',
          state: 'Florida',
          pinCode: '33101',
        },
        subtotal: 1399,
        deliveryFee: 99,
        totalAmount: 1498,
        paymentStatus: 'Cash on Delivery',
        paymentMethod: 'COD',
        orderStatus: 'Cancelled',
        cancellationReason: 'Buyer uncontactable during delivery attempt (RTO Returned).',
        createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
        estimatedDeliveryDate: 'Cancelled',
        basePrice: 1199,
        resellerMargin: 200,
        finalCustomerPrice: 1399,
        payoutStatus: 'N/A',
        isResellerOrder: true,
        resellerStoreName: 'DripLab Streetwear by Alex',
        trackingUpdates: [
          {
            status: 'Placed',
            label: 'Order Confirmed',
            timestamp: 'Oct 03, 2026',
            description: 'Order placed by customer.',
            completed: true,
          },
          {
            status: 'Cancelled',
            label: 'Cancelled / RTO Return',
            timestamp: 'Oct 05, 2026',
            description: 'Order returned to warehouse due to customer cancellation.',
            completed: true,
          },
        ],
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(sampleOrders));
  }
}

initializeLocalStorage();

const delay = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // -------------------------------------------------------------
  // USERS & AUTH REST ENDPOINTS
  // -------------------------------------------------------------
  async getCurrentUser(): Promise<User | null> {
    await delay(20);
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  async login(identifier: string, secret: string, isOTP = false): Promise<User> {
    await delay(80);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const cleanId = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');
    let found = users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        (cleanDigits.length >= 6 && u.phone.replace(/\D/g, '').includes(cleanDigits.slice(-10)))
    );

    if (!found) {
      found = {
        userID: 'usr-' + Math.random().toString(36).substring(2, 9),
        fullName: isOTP ? `Vibe Fan ${cleanDigits.slice(-4) || 'VIP'}` : identifier.split('@')[0] || 'Vibe Member',
        email: cleanId.includes('@') ? cleanId : `${cleanDigits || 'user'}@vibetees.user`,
        phone: !cleanId.includes('@') ? identifier : '+1 (555) 019-2831',
        shippingAddress: {
          street: '',
          city: '',
          state: '',
          pinCode: '',
        },
        savedAddresses: [],
        role: 'Customer',
        mode: 'Customer',
        isResellerVerified: false,
        resellerStoreName: '',
        totalEarnings: 0,
        pendingPayout: 0,
        transferredPayout: 0,
        createdAt: new Date().toISOString(),
      };
      users.push(found);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(found));
    return found;
  },

  async loginWithPhoneOTP(phone: string): Promise<User> {
    await delay(80);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const cleanDigits = phone.replace(/\D/g, '');
    let found = users.find((u) => u.phone.replace(/\D/g, '').slice(-10) === cleanDigits.slice(-10));

    if (!found) {
      found = {
        userID: 'usr-' + Math.random().toString(36).substring(2, 9),
        fullName: `Member · ${cleanDigits.slice(-4) || 'New'}`,
        email: `${cleanDigits || 'user'}@vibetees.user`,
        phone: phone,
        shippingAddress: {
          street: '',
          city: '',
          state: '',
          pinCode: '',
        },
        savedAddresses: [],
        role: 'Customer',
        mode: 'Customer',
        isResellerVerified: false,
        resellerStoreName: '',
        totalEarnings: 0,
        pendingPayout: 0,
        transferredPayout: 0,
        createdAt: new Date().toISOString(),
      };
      users.push(found);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(found));
    return found;
  },

  async verifyReseller(
    userId: string,
    data: {
      resellerStoreName: string;
      fullName?: string;
      email?: string;
      hasGst?: boolean;
      gstin?: string;
      enrolmentId?: string;
      pickupAddress?: ShippingAddress;
      bankAccountDetails?: BankAccountDetails;
      upiID?: string;
    }
  ): Promise<User> {
    await delay(100);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const idx = users.findIndex((u) => u.userID === userId);
    if (idx === -1) throw new Error('User not found');

    users[idx] = {
      ...users[idx],
      isResellerVerified: true,
      mode: 'Reseller',
      fullName: data.fullName || users[idx].fullName,
      email: data.email || users[idx].email,
      resellerStoreName: data.resellerStoreName,
      hasGst: data.hasGst,
      gstin: data.gstin,
      enrolmentId: data.enrolmentId,
      pickupAddress: data.pickupAddress || users[idx].pickupAddress,
      bankAccountDetails: data.bankAccountDetails || users[idx].bankAccountDetails,
      upiID: data.upiID || users[idx].upiID,
    };

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[idx]));

    // Sync supplier EID data & reseller profile to Firestore
    saveSupplierVerificationToFirestore({
      userID: userId,
      storeName: data.resellerStoreName,
      fullName: data.fullName || users[idx].fullName,
      email: data.email || users[idx].email,
      hasGst: !!data.hasGst,
      gstin: data.gstin,
      enrolmentId: data.enrolmentId,
      pickupAddress: data.pickupAddress || users[idx].pickupAddress,
      bankAccountDetails: data.bankAccountDetails || users[idx].bankAccountDetails,
    }).catch((err) => console.warn('Firestore supplier verif sync:', err));

    syncUserToFirestore(users[idx]).catch((err) => console.warn('Firestore user sync:', err));

    return users[idx];
  },

  async resetResellerVerification(userId: string): Promise<User> {
    await delay(50);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const idx = users.findIndex((u) => u.userID === userId);
    if (idx === -1) throw new Error('User not found');

    users[idx] = {
      ...users[idx],
      isResellerVerified: false,
      mode: 'Customer',
    };

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[idx]));
    return users[idx];
  },

  async signup(data: {
    fullName: string;
    email: string;
    phone: string;
    role?: UserRole;
    shippingAddress?: ShippingAddress;
  }): Promise<User> {
    await delay(80);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const newUser: User = {
      userID: 'usr-' + Math.random().toString(36).substring(2, 9),
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      phone: data.phone,
      shippingAddress: data.shippingAddress || {
        street: '77 Mercer St',
        city: 'New York',
        state: 'NY',
        pinCode: '10012',
      },
      savedAddresses: [
        {
          id: 'addr-default',
          fullName: data.fullName,
          phone: data.phone,
          street: data.shippingAddress?.street || '77 Mercer St',
          city: data.shippingAddress?.city || 'New York',
          state: data.shippingAddress?.state || 'NY',
          pinCode: data.shippingAddress?.pinCode || '10012',
          isDefault: true,
          tag: 'Home',
        },
      ],
      role: data.role || 'Customer',
      mode: 'Reseller',
      isResellerVerified: true,
      resellerStoreName: `${data.fullName.split(' ')[0]}'s Streetwear Hub`,
      totalEarnings: 0,
      pendingPayout: 0,
      transferredPayout: 0,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return newUser;
  },

  async switchDemoUser(role: UserRole): Promise<User> {
    await delay(30);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const target = users.find((u) => u.role === role) || DEMO_USERS.find((u) => u.role === role) || users[0];
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(target));
    return target;
  },

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    await delay(50);
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const index = users.findIndex((u) => u.userID === userId);
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[index]));
    return users[index];
  },

  async updateBankDetails(userId: string, bankDetails: BankAccountDetails): Promise<User> {
    return this.updateUserProfile(userId, { bankAccountDetails: bankDetails });
  },

  async updateUpiId(userId: string, upiId: string): Promise<User> {
    return this.updateUserProfile(userId, { upiID: upiId });
  },

  async updateResellerStoreName(userId: string, storeName: string): Promise<User> {
    return this.updateUserProfile(userId, { resellerStoreName: storeName });
  },

  async toggleAppMode(userId: string, mode: AppMode): Promise<User> {
    return this.updateUserProfile(userId, { mode });
  },

  async updateNotificationPreferences(userId: string, prefs: NotificationPreferences): Promise<User> {
    return this.updateUserProfile(userId, { notificationPreferences: prefs });
  },

  async saveAddress(userId: string, address: SavedAddressItem): Promise<User> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Not logged in');
    let addresses = user.savedAddresses || [];

    if (address.isDefault) {
      addresses = addresses.map((a) => ({ ...a, isDefault: false }));
    }

    const existingIndex = addresses.findIndex((a) => a.id === address.id);
    if (existingIndex > -1) {
      addresses[existingIndex] = address;
    } else {
      addresses.push(address);
    }

    return this.updateUserProfile(userId, {
      savedAddresses: addresses,
      shippingAddress: address.isDefault
        ? { street: address.street, city: address.city, state: address.state, pinCode: address.pinCode }
        : user.shippingAddress,
    });
  },

  async deleteAddress(userId: string, addressId: string): Promise<User> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Not logged in');
    const addresses = (user.savedAddresses || []).filter((a) => a.id !== addressId);
    return this.updateUserProfile(userId, { savedAddresses: addresses });
  },

  async logout(): Promise<void> {
    await delay(30);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // -------------------------------------------------------------
  // PRODUCTS REST ENDPOINTS
  // -------------------------------------------------------------
  async getProducts(params?: { category?: ProductCategory; query?: string }): Promise<Product[]> {
    await delay(40);
    let products: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    if (!products.length) {
      products = INITIAL_PRODUCTS;
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }

    if (params?.category && params.category !== 'All') {
      products = products.filter((p) => p.category.toLowerCase() === params.category?.toLowerCase());
    }

    if (params?.query && params.query.trim()) {
      const q = params.query.trim().toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tag?.toLowerCase().includes(q)
      );
    }

    return products;
  },

  async getProductById(productId: string): Promise<Product | null> {
    await delay(20);
    const products: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    return products.find((p) => p.productID === productId) || null;
  },

  async createProduct(productData: Omit<Product, 'productID'>): Promise<Product> {
    await delay(80);
    const products: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const newProduct: Product = {
      ...productData,
      productID: 'VT-PROD-' + (products.length + 1).toString().padStart(2, '0') + '-' + Math.random().toString(36).substring(2, 5).toUpperCase(),
    };
    products.unshift(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return newProduct;
  },

  // -------------------------------------------------------------
  // CART REST ENDPOINTS
  // -------------------------------------------------------------
  async getCart(userId: string): Promise<CartItem[]> {
    await delay(30);
    const rawCart: CartItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
    const userCart = rawCart.filter((c) => c.userID === userId);
    const products: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    return userCart.map((item) => ({
      ...item,
      product: products.find((p) => p.productID === item.productID),
    }));
  },

  async addToCart(userId: string, productId: string, selectedSize: ProductSize, quantity = 1): Promise<CartItem[]> {
    await delay(50);
    const rawCart: CartItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
    const existingIndex = rawCart.findIndex(
      (c) => c.userID === userId && c.productID === productId && c.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      rawCart[existingIndex].quantity += quantity;
    } else {
      rawCart.push({
        cartID: 'cart-' + Math.random().toString(36).substring(2, 9),
        userID: userId,
        productID: productId,
        selectedSize,
        quantity,
        addedAt: new Date().toISOString(),
      });
    }

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(rawCart));
    return this.getCart(userId);
  },

  async updateCartQuantity(cartId: string, quantity: number, userId: string): Promise<CartItem[]> {
    await delay(30);
    let rawCart: CartItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
    if (quantity <= 0) {
      rawCart = rawCart.filter((c) => c.cartID !== cartId);
    } else {
      const item = rawCart.find((c) => c.cartID === cartId);
      if (item) item.quantity = quantity;
    }
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(rawCart));
    return this.getCart(userId);
  },

  async removeFromCart(cartId: string, userId: string): Promise<CartItem[]> {
    await delay(30);
    let rawCart: CartItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
    rawCart = rawCart.filter((c) => c.cartID !== cartId);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(rawCart));
    return this.getCart(userId);
  },

  async clearCart(userId: string): Promise<void> {
    await delay(20);
    let rawCart: CartItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
    rawCart = rawCart.filter((c) => c.userID !== userId);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(rawCart));
  },

  // -------------------------------------------------------------
  // ORDERS REST ENDPOINTS
  // -------------------------------------------------------------
  async getOrders(userId?: string, role?: UserRole): Promise<Order[]> {
    await delay(40);
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    if (role === 'Admin') {
      return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return orders
      .filter((o) => (userId ? o.userID === userId : true))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createOrder(params: {
    userID: string;
    itemsList: OrderItem[];
    shippingAddress: ShippingAddress & { fullName: string; phone: string };
    paymentMethod: 'COD' | 'UPI' | 'Card';
    subtotal: number;
    deliveryFee: number;
    totalAmount: number;
    basePrice?: number;
    resellerMargin?: number;
    resellerStoreName?: string;
  }): Promise<Order> {
    await delay(100);
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const uniqueNumber = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `VT-${uniqueNumber}`;

    const estDate = new Date(Date.now() + 3 * 24 * 3600 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    const basePrice = params.basePrice || Math.round(params.subtotal * 0.75);
    const resellerMargin = params.resellerMargin || (params.subtotal - basePrice);

    const newOrder: Order = {
      orderID: newOrderId,
      userID: params.userID,
      itemsList: params.itemsList,
      shippingAddress: params.shippingAddress,
      subtotal: params.subtotal,
      deliveryFee: params.deliveryFee,
      totalAmount: params.totalAmount,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid',
      orderStatus: 'Placed',
      createdAt: new Date().toISOString(),
      estimatedDeliveryDate: estDate,
      basePrice,
      resellerMargin,
      finalCustomerPrice: params.totalAmount,
      payoutStatus: 'Pending',
      isResellerOrder: true,
      resellerStoreName: params.resellerStoreName || 'DripLab Streetwear by Alex',
      trackingUpdates: [
        {
          status: 'Placed',
          label: 'Order Confirmed',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: `Order verified with ${params.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Instant Payment'}. Sent to dispatch.`,
          completed: true,
        },
        {
          status: 'Shipped',
          label: 'Dispatched from Hub',
          timestamp: 'Expected within 24h',
          description: 'Garments inspected, poly-bagged, and handed to express courier.',
          completed: false,
        },
        {
          status: 'Out for Delivery',
          label: 'In Transit',
          timestamp: 'Pending',
          description: 'Local courier facility dispatch.',
          completed: false,
        },
        {
          status: 'Delivered',
          label: 'Delivered to Doorstep',
          timestamp: 'Pending',
          description: 'Signed and delivered. Reseller margin credited to bank.',
          completed: false,
        },
      ],
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Sync order to Firestore for persistent tracking
    syncOrderToFirestore(newOrder).catch((err) => console.warn('Firestore order sync:', err));

    // Update user earnings
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const uIdx = users.findIndex((u) => u.userID === params.userID);
    if (uIdx > -1) {
      users[uIdx].pendingPayout = (users[uIdx].pendingPayout || 0) + resellerMargin;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[uIdx]));
    }

    await this.clearCart(params.userID);
    return newOrder;
  },

  async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<Order> {
    await delay(50);
    const orders: Order[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const index = orders.findIndex((o) => o.orderID === orderId);
    if (index === -1) throw new Error('Order not found');

    const statusOrder: OrderStatus[] = ['Placed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIdx = statusOrder.indexOf(newStatus);

    let updatedTracking = orders[index].trackingUpdates;
    if (newStatus === 'Cancelled' || newStatus === 'Returned') {
      updatedTracking = [
        ...orders[index].trackingUpdates,
        {
          status: newStatus,
          label: newStatus === 'Cancelled' ? 'Cancelled / RTO Return' : 'Returned & Refunded',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: 'Order cycle closed.',
          completed: true,
        },
      ];
    } else {
      updatedTracking = orders[index].trackingUpdates.map((step) => {
        const stepIdx = statusOrder.indexOf(step.status);
        const isCompleted = stepIdx <= currentIdx;
        return {
          ...step,
          completed: isCompleted,
          timestamp: isCompleted && step.timestamp === 'Pending' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : step.timestamp,
        };
      });
    }

    let payoutStatus: PayoutStatus = orders[index].payoutStatus;
    if (newStatus === 'Delivered') {
      payoutStatus = 'Transferred';
    } else if (newStatus === 'Cancelled' || newStatus === 'Returned') {
      payoutStatus = 'N/A';
    }

    orders[index] = {
      ...orders[index],
      orderStatus: newStatus,
      paymentStatus: newStatus === 'Delivered' ? 'Paid' : orders[index].paymentStatus,
      payoutStatus,
      trackingUpdates: updatedTracking,
    };

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return orders[index];
  },
};
