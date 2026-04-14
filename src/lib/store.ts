
'use client';

import { useMemo } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  serverTimestamp,
  limit,
  DocumentData,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { useFirestore, useCollection, useDoc } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

// --- TYPES ---
export type Category = 'phones' | 'laptops' | 'gadgets' | 'cod' | 'cp' | 'all';
export type ProductStatus = 'active' | 'draft' | 'sold_out';
export type OrderStatus = 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  oldPrice?: number;
  costPrice: number;
  stock: number;
  stockAlert: number;
  imageUrl: string;
  specs: Record<string, string>;
  status: ProductStatus;
  isFeatured: boolean;
  salesCount: number;
  views: number;
  createdAt: any;
  type?: 'physical' | 'digital';
}

export interface Order {
  id: string;
  displayId: string;
  customerName: string;
  whatsapp: string;
  email?: string;
  codUid?: string;
  codIgn?: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: any[];
  createdAt: any;
  timeline: any[];
  priority?: 'normal' | 'urgent';
}

export interface StoreSettings {
  storeName: string;
  whatsapp: string;
  email: string;
  address: string;
  currencySymbol: string;
  maintenanceMode: boolean;
  taxRate: number;
}

// Helper to remove undefined values for Firestore compatibility
function sanitizeData(obj: any) {
  const sanitized: any = {};
  if (!obj || typeof obj !== 'object') return obj;
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined) {
      sanitized[key] = (typeof value === 'object' && value !== null && !Array.isArray(value)) 
        ? sanitizeData(value) 
        : value;
    }
  });
  return sanitized;
}

// --- STORE HOOK ---
export function useStore() {
  const db = useFirestore();

  // Live cloud listeners
  const productsQuery = useMemo(() => query(collection(db, 'products'), limit(500)), [db]);
  const ordersQuery = useMemo(() => query(collection(db, 'orders'), limit(200)), [db]);
  const settingsRef = useMemo(() => doc(db, 'settings', 'global'), [db]);

  const { data: productsData, loading: productsLoading } = useCollection<Product>(productsQuery);
  const { data: ordersData } = useCollection<Order>(ordersQuery);
  const { data: settingsData } = useDoc<StoreSettings>(settingsRef);

  const products = useMemo(() => {
    if (!productsData) return [];
    return [...productsData].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  }, [productsData]);

  const orders = useMemo(() => {
    if (!ordersData) return [];
    return [...ordersData].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  }, [ordersData]);

  const settings: StoreSettings = settingsData || {
    storeName: 'KHALEX hub',
    whatsapp: '2349166905298',
    email: 'khaleedadefemi1@gmail.com',
    address: 'no7 hiltop estate aboru lagos',
    currencySymbol: '₦',
    maintenanceMode: false,
    taxRate: 0
  };

  // --- ACTIONS ---

  const addProduct = (p: Partial<Product>) => {
    const id = p.id || `p-${Date.now()}`;
    const ref = doc(db, 'products', id);
    const finalData = sanitizeData({
      ...p,
      id,
      createdAt: serverTimestamp(),
      salesCount: 0,
      views: 0
    });

    setDoc(ref, finalData, { merge: true }).catch(err => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: ref.path,
        operation: 'create',
        requestResourceData: finalData
      }));
    });
  };

  const updateProduct = (p: Product) => {
    const ref = doc(db, 'products', p.id);
    const finalData = sanitizeData({ ...p, updatedAt: serverTimestamp() });
    setDoc(ref, finalData, { merge: true }).catch(err => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: ref.path,
        operation: 'update',
        requestResourceData: finalData
      }));
    });
  };

  const deleteProduct = (id: string) => {
    const ref = doc(db, 'products', id);
    deleteDoc(ref).catch(err => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: ref.path,
        operation: 'delete'
      }));
    });
  };

  const createOrder = (orderData: Partial<Order>) => {
    const id = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const ref = doc(db, 'orders', id);
    const finalData = sanitizeData({
      ...orderData,
      id,
      displayId: id,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: serverTimestamp(),
      timeline: [{
        status: 'Order Placed',
        timestamp: new Date().toISOString(),
        note: 'Customer initiated mission deployment.',
        by: 'System'
      }]
    });

    setDoc(ref, finalData, { merge: true }).catch(err => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: ref.path,
        operation: 'create',
        requestResourceData: finalData
      }));
    });
    
    // Clear cart on success
    localStorage.setItem('khalex_cart', '[]');
    window.dispatchEvent(new Event('storage'));
    
    return finalData;
  };

  const updateOrderStatus = (id: string, status: OrderStatus, note: string = '') => {
    const ref = doc(db, 'orders', id);
    const order = orders.find(o => o.id === id);
    if (!order) return;

    const timelineEntry = {
      status: status.toUpperCase(),
      timestamp: new Date().toISOString(),
      note: note || `Mission status updated to ${status}.`,
      by: 'Administrator'
    };

    setDoc(ref, { 
      status, 
      timeline: [...(order.timeline || []), timelineEntry] 
    }, { merge: true });
  };

  const updateOrderPaymentStatus = (id: string, paymentStatus: PaymentStatus) => {
    const ref = doc(db, 'orders', id);
    setDoc(ref, { paymentStatus }, { merge: true });
  };

  const updateSettings = (s: StoreSettings) => {
    setDoc(settingsRef, sanitizeData(s), { merge: true });
  };

  const purgeDatabase = async () => {
    // Clear Products
    const prodSnap = await getDocs(collection(db, 'products'));
    prodSnap.forEach(d => deleteDoc(doc(db, 'products', d.id)));

    // Clear Orders
    const orderSnap = await getDocs(collection(db, 'orders'));
    orderSnap.forEach(d => deleteDoc(doc(db, 'orders', d.id)));

    // Clear Customers (if implemented as a collection)
    const custSnap = await getDocs(collection(db, 'customers'));
    custSnap.forEach(d => deleteDoc(doc(db, 'customers', d.id)));
  };

  const cart = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('khalex_cart') || '[]') : [];

  return {
    products,
    productsLoading,
    orders,
    settings,
    cart,
    addProduct,
    updateProduct,
    deleteProduct,
    createOrder,
    updateOrderStatus,
    updateOrderPaymentStatus,
    updateSettings,
    purgeDatabase,
    addToCart: (p: Product, qty: number = 1) => {
      const existing = cart.find((i: any) => i.id === p.id);
      const newCart = existing 
        ? cart.map((i: any) => i.id === p.id ? { ...i, quantity: i.quantity + qty } : i)
        : [...cart, { ...sanitizeData(p), quantity: qty }];
      localStorage.setItem('khalex_cart', JSON.stringify(newCart));
      window.dispatchEvent(new Event('storage'));
    },
    updateQuantity: (id: string, qty: number) => {
      if (qty < 1) return;
      const newCart = cart.map((i: any) => i.id === id ? { ...i, quantity: qty } : i);
      localStorage.setItem('khalex_cart', JSON.stringify(newCart));
      window.dispatchEvent(new Event('storage'));
    },
    removeFromCart: (id: string) => {
      const newCart = cart.filter((i: any) => i.id !== id);
      localStorage.setItem('khalex_cart', JSON.stringify(newCart));
      window.dispatchEvent(new Event('storage'));
    },
    clearCart: () => {
      localStorage.setItem('khalex_cart', '[]');
      window.dispatchEvent(new Event('storage'));
    }
  };
}
