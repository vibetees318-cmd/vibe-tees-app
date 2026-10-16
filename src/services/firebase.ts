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
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { User, Order, ShippingAddress, BankAccountDetails } from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with specific database ID if configured
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Verify connection as specified in guidelines
async function testFirestoreConnection() {
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
  const userRef = doc(db, 'users', fbUser.uid);
  const snap = await getDoc(userRef);

  let appUser: User;
  if (snap.exists()) {
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
    await setDoc(userRef, appUser);
  }

  return appUser;
}

/**
 * Sync user profile to Firestore
 */
export async function syncUserToFirestore(user: User): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.userID);
    await setDoc(userRef, user, { merge: true });
  } catch (err) {
    console.error('Failed to sync user to Firestore:', err);
  }
}

/**
 * Sync order to Firestore
 */
export async function syncOrderToFirestore(order: Order): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', order.orderID);
    await setDoc(orderRef, order, { merge: true });
  } catch (err) {
    console.error('Failed to sync order to Firestore:', err);
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
  }
}

/**
 * Fetch orders from Firestore for tracking
 */
export async function fetchUserOrdersFromFirestore(userId: string): Promise<Order[]> {
  try {
    const q = query(collection(db, 'orders'), where('userID', '==', userId));
    const snap = await getDocs(q);
    const orders: Order[] = [];
    snap.forEach((d) => orders.push(d.data() as Order));
    return orders;
  } catch (err) {
    console.warn('Could not fetch from Firestore, falling back to local state:', err);
    return [];
  }
}
