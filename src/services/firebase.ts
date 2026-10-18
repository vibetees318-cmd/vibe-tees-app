import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { User, Order, ShippingAddress, BankAccountDetails, Product } from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with specific database ID if configured
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Verify connection as specified in guidelines
async function testFirestoreConnection() {
  const path = 'test/connection';
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is running in offline/cached mode');
    }
  }
}
testFirestoreConnection();

/**
 * Firebase Auth Google Sign-in helper
 */
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const fbUser = result.user;

  // Check if user document already exists in Firestore
  const path = `users/${fbUser.uid}`;
  const userRef = doc(db, 'users', fbUser.uid);
  let snap;
  try {
    snap = await getDoc(userRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    throw err;
  }

  let appUser: User;
  if (snap && snap.exists()) {
    appUser = snap.data() as User;
  } else {
    // Create new user profile in Firestore
    appUser = {
      userID: fbUser.uid,
      fullName: fbUser.displayName || 'Vibe Tees Member',
      email: fbUser.email || 'user@vibetees.com',
      phone: fbUser.phoneNumber || '+91 98765 43210',
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
    try {
      await setDoc(userRef, appUser);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }

  return appUser;
}

/**
 * Sync user profile to Firestore
 */
export async function syncUserToFirestore(user: User): Promise<void> {
  const path = `users/${user.userID}`;
  try {
    const userRef = doc(db, 'users', user.userID);
    await setDoc(userRef, user, { merge: true });
  } catch (err) {
    console.error('Failed to sync user to Firestore:', err);
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Sync order to Firestore for live tracking
 */
export async function syncOrderToFirestore(order: Order): Promise<void> {
  const path = `orders/${order.orderID}`;
  try {
    const orderRef = doc(db, 'orders', order.orderID);
    await setDoc(orderRef, order, { merge: true });
  } catch (err) {
    console.error('Failed to sync order to Firestore:', err);
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Save supplier EID & verification details to Firestore
 */
export async function saveSupplierVerificationToFirestore(data: {
  userID: string;
  storeName: string;
  fullName: string;
  email: string;
  hasGst: boolean;
  gstin?: string;
  enrolmentId?: string;
  pickupAddress?: ShippingAddress;
  bankAccountDetails?: BankAccountDetails;
}): Promise<void> {
  const path = `supplier_verifications/${data.userID}`;
  try {
    const verifRef = doc(db, 'supplier_verifications', data.userID);
    await setDoc(
      verifRef,
      {
        ...data,
        status: 'VERIFIED',
        submittedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Failed to save supplier verification to Firestore:', err);
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Fetch orders from Firestore for tracking
 */
export async function fetchUserOrdersFromFirestore(userId: string): Promise<Order[]> {
  const path = 'orders';
  try {
    const q = query(collection(db, path), where('userID', '==', userId));
    const snap = await getDocs(q);
    const orders: Order[] = [];
    snap.forEach((d) => orders.push(d.data() as Order));
    return orders;
  } catch (err) {
    console.warn('Could not fetch from Firestore, falling back to local state:', err);
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

/**
 * Save new product to Firestore catalog
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  const path = `products/${product.productID}`;
  try {
    const productRef = doc(db, 'products', product.productID);
    await setDoc(productRef, product, { merge: true });
  } catch (err) {
    console.error('Failed to save product to Firestore:', err);
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Fetch all products from Firestore catalog
 */
export async function fetchProductsFromFirestore(): Promise<Product[]> {
  const path = 'products';
  try {
    const snap = await getDocs(collection(db, path));
    const items: Product[] = [];
    snap.forEach((d) => items.push(d.data() as Product));
    return items;
  } catch (err) {
    console.warn('Could not fetch products from Firestore, using local fallback:', err);
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}
