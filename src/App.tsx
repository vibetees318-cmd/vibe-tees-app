import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import {
  AppMode,
  CartItem,
  Order,
  PaymentMethod,
  Product,
  ProductCategory,
  ProductSize,
  ShippingAddress,
  User,
  UserRole,
} from './types';

// UI Components & Shell
import { Navbar } from './components/Navbar';
import { BottomTabBar, TabId } from './components/BottomTabBar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { QuickAddModal } from './components/QuickAddModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { ResellerModal } from './components/ResellerModal';
import { SupportModal } from './components/SupportModal';
import { GeminiChatbotModal } from './components/GeminiChatbotModal';
import { AiVideoBannerModal } from './components/AiVideoBannerModal';
import { Bot, Sparkles } from 'lucide-react';

// Screens
import { SplashScreen } from './screens/SplashScreen';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { OrderSuccessScreen } from './screens/OrderSuccessScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { AccountScreen } from './screens/AccountScreen';
import { CategoriesScreen } from './screens/CategoriesScreen';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Splash animation state (bypassed to show Auth Screen directly on load as requested)
  const [showSplash, setShowSplash] = useState(false);

  // Global App Mode: 'Customer' | 'Reseller' (Meesho style)
  const [appMode, setAppMode] = useState<AppMode>('Customer');

  // Auth & User state (starts directly on Sign-Up / Login Screen for instant Mobile Number OTP preview)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthScreen, setShowAuthScreen] = useState(true);

  // Navigation state: separated Orders, Categories and Account screen routing
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [activeScreen, setActiveScreen] = useState<
    'main' | 'pdp' | 'cart' | 'checkout' | 'order_success' | 'orders' | 'account' | 'categories'
  >('main');

  // Domain data collections
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Selection & Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showResellerModal, setShowResellerModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showChatbotModal, setShowChatbotModal] = useState(false);
  const [showAiVideoModal, setShowAiVideoModal] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');

  // Initialize data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const user = await api.getCurrentUser();
        setCurrentUser(user);
        if (user?.mode) {
          setAppMode(user.mode);
        }

        const prods = await api.getProducts();
        setProducts(prods);

        if (user) {
          const userCart = await api.getCart(user.userID);
          setCart(userCart);
          const userOrders = await api.getOrders(user.userID, user.role);
          setOrders(userOrders);
        }
      } catch (err) {
        console.error('Data initialization error:', err);
      }
    }
    loadData();
  }, []);

  // Sync cart and orders when user changes
  const handleUserChange = async (user: User) => {
    setCurrentUser(user);
    if (user.mode) {
      setAppMode(user.mode);
    }
    setShowAuthScreen(false);
    const userCart = await api.getCart(user.userID);
    setCart(userCart);
    const userOrders = await api.getOrders(user.userID, user.role);
    setOrders(userOrders);
  };

  // Toggle App Mode (Customer vs Reseller)
  const handleToggleAppMode = async (mode: AppMode) => {
    setAppMode(mode);
    if (currentUser) {
      try {
        const updated = await api.toggleAppMode(currentUser.userID, mode);
        setCurrentUser(updated);
      } catch (err) {
        console.error('Failed to toggle app mode:', err);
      }
    }
  };

  // Interactive Tap on Dynamic Video Reel Deals
  const handleSelectProductById = (productId: string, specialDealPrice?: number) => {
    const prod = products.find((p) => p.productID === productId);
    if (prod) {
      if (specialDealPrice) {
        setSelectedProduct({
          ...prod,
          discountPrice: specialDealPrice,
        });
      } else {
        setSelectedProduct(prod);
      }
      setActiveScreen('pdp');
    }
  };

  // Switch demo user role (Customer <-> Admin)
  const handleSwitchRole = async (role: UserRole) => {
    try {
      const switched = await api.switchDemoUser(role);
      handleUserChange(switched);
    } catch (e) {
      console.error(e);
    }
  };

  // Cart operations
  const handleAddToCart = async (product: Product, size: ProductSize, quantity = 1) => {
    const userId = currentUser?.userID || 'guest-user';
    const updatedCart = await api.addToCart(userId, product.productID, size, quantity);
    setCart(updatedCart);

    setRecentlyAddedId(product.productID);
    setTimeout(() => setRecentlyAddedId(null), 1800);
  };

  const handleUpdateQuantity = async (cartId: string, quantity: number) => {
    if (!currentUser) return;
    const updated = await api.updateCartQuantity(cartId, quantity, currentUser.userID);
    setCart(updated);
  };

  const handleRemoveFromCart = async (cartId: string) => {
    if (!currentUser) return;
    const updated = await api.removeFromCart(cartId, currentUser.userID);
    setCart(updated);
  };

  const handleBuyNow = async (product: Product, size: ProductSize, quantity: number) => {
    await handleAddToCart(product, size, quantity);
    setActiveScreen('checkout');
  };

  // Checkout & Place Order
  const handlePlaceOrder = async (orderParams: {
    shippingAddress: ShippingAddress & { fullName: string; phone: string };
    paymentMethod: PaymentMethod;
    subtotal: number;
    deliveryFee: number;
    totalAmount: number;
  }) => {
    if (!currentUser) return;

    const itemsList = cart.map((item) => ({
      productID: item.productID,
      title: item.product?.title || 'Streetwear Item',
      image: item.product?.images[0] || '',
      selectedSize: item.selectedSize,
      quantity: item.quantity,
      price: item.product?.discountPrice || 1299,
      category: item.product?.category || 'Streetwear',
    }));

    const basePrice = Math.round(orderParams.subtotal * 0.75);
    const resellerMargin = orderParams.subtotal - basePrice;

    const newOrder = await api.createOrder({
      userID: currentUser.userID,
      itemsList,
      shippingAddress: orderParams.shippingAddress,
      paymentMethod: orderParams.paymentMethod,
      subtotal: orderParams.subtotal,
      deliveryFee: orderParams.deliveryFee,
      totalAmount: orderParams.totalAmount,
      basePrice,
      resellerMargin,
      resellerStoreName: currentUser.resellerStoreName || 'DripLab Streetwear by Alex',
    });

    setLatestOrder(newOrder);
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setActiveScreen('order_success');
  };

  // Reselling creation
  const handleItemListed = async (newProductData: Omit<Product, 'productID'>) => {
    try {
      const created = await api.createProduct(newProductData);
      setProducts((prev) => [created, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  // STRICT SEPARATED NAVIGATION HANDLERS:
  // - "Categories" Tab -> Navigates strictly to CategoriesScreen (Meesho Dual-Pane)
  // - "Orders" Tab -> Navigates strictly to OrdersScreen
  // - "Account" Tab -> Navigates strictly to AccountScreen
  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setActiveScreen('main');
      setSelectedCategory('All');
    } else if (tab === 'categories' || tab === 'explore') {
      setActiveScreen('categories');
    } else if (tab === 'cart') {
      setActiveScreen('cart');
    } else if (tab === 'orders') {
      setActiveScreen('orders');
    } else if (tab === 'account') {
      setActiveScreen('account');
    }
  };

  const handleOpenPDP = (product: Product) => {
    setSelectedProduct(product);
    setActiveScreen('pdp');
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const activeOrdersCount = orders.filter((o) =>
    ['Placed', 'Shipped', 'Out for Delivery'].includes(o.orderStatus)
  ).length;

  return (
    <div
      style={{ width: '100vw', minHeight: '100vh' }}
      className={`w-screen min-h-screen ${
        theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'
      } flex flex-col relative overflow-x-hidden`}
    >
      <OfflineIndicator />

      {/* 1. Splash Screen Intro (Dismissible) */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* 2. Top Header Navigation (Shown when not on PDP, Account, Categories, or full auth) */}
      {activeScreen !== 'pdp' &&
        activeScreen !== 'order_success' &&
        activeTab !== 'account' &&
        activeScreen !== 'account' &&
        activeTab !== 'categories' &&
        activeScreen !== 'categories' &&
        !showAuthScreen && (
          <Navbar
            cartCount={cartTotalCount}
            onOpenCart={() => {
              setActiveTab('cart');
              setActiveScreen('cart');
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentRole={currentUser?.role || 'Customer'}
            appMode={appMode}
          onToggleAppMode={handleToggleAppMode}
          onOpenResellerModal={() => setShowResellerModal(true)}
          onNavigateHome={() => {
            setActiveTab('home');
            setActiveScreen('main');
            setSelectedCategory('All');
            setSearchQuery('');
          }}
          activeScreen={activeScreen}
        />
      )}

      {/* Main Screen Router with SEPARATED Orders and Account Screens */}
      <main
        className="flex-1 flex flex-col pb-[80px]"
        style={{ paddingBottom: '80px' }}
      >
        {showAuthScreen ? (
          <AuthScreen
            onSuccess={handleUserChange}
            onCancel={() => setShowAuthScreen(false)}
          />
        ) : activeScreen === 'pdp' && selectedProduct ? (
          <ProductDetailScreen
            product={selectedProduct}
            onBack={() => setActiveScreen('main')}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onOpenSizeGuide={() => setShowSizeGuide(true)}
          />
        ) : activeScreen === 'checkout' ? (
          <CheckoutScreen
            currentUser={currentUser}
            cartItems={cart}
            onBack={() => setActiveScreen('cart')}
            onPlaceOrder={handlePlaceOrder}
          />
        ) : activeScreen === 'order_success' && latestOrder ? (
          <OrderSuccessScreen
            order={latestOrder}
            onTrackOrder={(o) => {
              setActiveTab('orders');
              setActiveScreen('orders');
            }}
            onContinueShopping={() => {
              setActiveTab('home');
              setActiveScreen('main');
            }}
          />
        ) : activeScreen === 'cart' || activeTab === 'cart' ? (
          <CartScreen
            cartItems={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onProceedToCheckout={() => setActiveScreen('checkout')}
            onContinueShopping={() => {
              setActiveTab('home');
              setActiveScreen('main');
            }}
          />
        ) : activeScreen === 'orders' || activeTab === 'orders' ? (
          /* DEDICATED ORDERS TAB SCREEN */
          <OrdersScreen
            currentUser={currentUser}
            orders={orders}
            onOrderUpdated={(updated) => {
              setOrders((prev) =>
                prev.map((o) => (o.orderID === updated.orderID ? updated : o))
              );
            }}
            onContinueShopping={() => {
              setActiveTab('home');
              setActiveScreen('main');
            }}
          />
        ) : activeScreen === 'account' || activeTab === 'account' ? (
          /* DEDICATED ACCOUNT TAB SCREEN (Meesho-Style Clean List Layout) */
          <AccountScreen
            currentUser={currentUser}
            onUserUpdated={(updated) => {
              setCurrentUser(updated);
              if (updated.mode) setAppMode(updated.mode);
            }}
            onLogout={async () => {
              await api.logout();
              setCurrentUser(null);
              setShowAuthScreen(true);
            }}
            onOpenResellerModal={() => setShowResellerModal(true)}
            onNavigateHome={() => {
              setActiveTab('home');
              setActiveScreen('main');
            }}
            onOpenCart={() => {
              setActiveTab('cart');
              setActiveScreen('cart');
            }}
            onOpenSearch={() => {
              setActiveTab('home');
              setActiveScreen('main');
            }}
            cartCount={cartTotalCount}
            onAddToCart={handleAddToCart}
            onSelectProduct={(prod) => {
              setSelectedProduct(prod);
              setActiveScreen('pdp');
            }}
          />
        ) : activeScreen === 'categories' || activeTab === 'categories' ? (
          /* DEDICATED CATEGORIES TAB SCREEN (Meesho-Style Dual-Pane Vertical Sidebar Navigation) */
          <CategoriesScreen
            onBack={() => {
              setActiveTab('home');
              setActiveScreen('main');
            }}
            onSelectCategory={(cat, subTitle) => {
              setSelectedCategory(cat);
              if (subTitle && !subTitle.toLowerCase().includes('all') && !subTitle.toLowerCase().includes('popular')) {
                setSearchQuery(subTitle);
              } else {
                setSearchQuery('');
              }
              setActiveTab('home');
              setActiveScreen('main');
            }}
            onOpenCart={() => {
              setActiveTab('cart');
              setActiveScreen('cart');
            }}
            cartCount={cartTotalCount}
          />
        ) : (
          /* Storefront / Catalog Home Screen */
          <HomeScreen
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            onSelectProduct={handleOpenPDP}
            onSelectProductById={handleSelectProductById}
            onQuickAdd={(p) => setQuickAddProduct(p)}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            onOpenResellerModal={() => setShowResellerModal(true)}
            appMode={appMode}
            onToggleAppMode={handleToggleAppMode}
            recentlyAddedId={recentlyAddedId}
          />
        )}
      </main>

      {/* 3. Bottom Ergonomic Tab Bar (Shown across main browsing views) */}
      {activeScreen !== 'pdp' && activeScreen !== 'checkout' && activeScreen !== 'order_success' && !showAuthScreen && (
        <BottomTabBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          cartCount={cartTotalCount}
          activeOrdersCount={activeOrdersCount}
        />
      )}

      {/* Quick Add Size Selection Sheet */}
      <QuickAddModal
        product={quickAddProduct}
        isOpen={!!quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
        onConfirmAdd={handleAddToCart}
      />

      {/* Streetwear Size Guide Modal */}
      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />

      {/* Reseller Creator Modal */}
      <ResellerModal
        isOpen={showResellerModal}
        onClose={() => setShowResellerModal(false)}
        onItemListed={handleItemListed}
        sellerName={currentUser?.resellerStoreName || currentUser?.fullName || 'Alex Rivera'}
      />

      {/* Concierge & FAQ Support Modal */}
      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
}
