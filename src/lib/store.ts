'use client';

import { useMemo } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { useFirestore, useCollection, useDoc } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
  costPrice: number;
  stock: number;
  stockAlert: number;
  trackInventory: boolean;
  imageUrl: string;
  videoUrl?: string;
  specs: Record<string, string>;
  status: ProductStatus;
  isFeatured: boolean;
  salesCount: number;
  views: number;
  createdAt: any;
}

export interface Order {
  id: string;
  customerName: string;
  whatsapp: string;
  email?: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  items: any[];
  createdAt: any;
  timeline: any[];
}

export interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: any;
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

// --- STORE HOOK ---
export function useStore() {
  const db = useFirestore();

  // Queries
  const productsQuery = useMemo(() => query(collection(db, 'products'), orderBy('createdAt', 'desc')), [db]);
  const ordersQuery = useMemo(() => query(collection(db, 'orders'), orderBy('createdAt', 'desc')), [db]);
  const customersQuery = useMemo(() => query(collection(db, 'customers'), orderBy('totalSpent', 'desc')), [db]);
  const settingsRef = useMemo(() => doc(db, 'settings', 'global'), [db]);

  // Data
  const { data: productsData } = useCollection<Product>(productsQuery);
  const { data: ordersData } = useCollection<Order>(ordersQuery);
  const { data: customersData } = useCollection<Customer>(customersQuery);
  const { data: settingsData } = useDoc<StoreSettings>(settingsRef);

  const products = productsData || [];
  const orders = ordersData || [];
  const customers = customersData || [];
  const settings: StoreSettings = settingsData || {
    storeName: 'KHALEX hub',
    whatsapp: '09166905298',
    email: 'khaleedadefemi1@gmail.com',
    address: 'no7 hiltop estate aboru lagos',
    currencySymbol: '₦',
    maintenanceMode: false,
    taxRate: 0
  };

  // Mutations
  const addProduct = (p: Partial<Product>) => {
    const id = p.id || `p-${Date.now()}`;
    const ref = doc(db, 'products', id);
    setDoc(ref, { 
      ...p, 
      id, 
      createdAt: serverTimestamp(),
      salesCount: 0,
      views: 0
    }, { merge: true }).catch(err => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: ref.path, operation: 'create', requestResourceData: p }));
    });
  };

  const updateProduct = (p: Product) => {
    const ref = doc(db, 'products', p.id);
    setDoc(ref, { ...p, updatedAt: serverTimestamp() }, { merge: true }).catch(err => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: ref.path, operation: 'update', requestResourceData: p }));
    });
  };

  const deleteProduct = (id: string) => {
    const ref = doc(db, 'products', id);
    deleteDoc(ref).catch(err => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: ref.path, operation: 'delete' }));
    });
  };

  const createOrder = (orderData: any) => {
    const id = `ORD-${Date.now()}`;
    const ref = doc(db, 'orders', id);
    const newOrder = {
      ...orderData,
      id,
      status: 'pending',
      paymentStatus: 'pending',
      priority: 'normal',
      createdAt: serverTimestamp(),
      timeline: [{ status: 'pending', timestamp: new Date().toISOString(), by: 'System', note: 'Mission received.' }]
    };
    setDoc(ref, newOrder).catch(err => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: ref.path, operation: 'create', requestResourceData: newOrder }));
    });
    return { ...newOrder, id };
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    const ref = doc(db, 'orders', id);
    setDoc(ref, { 
      status, 
      timeline: [{ status, timestamp: new Date().toISOString(), by: 'Admin', note: `Status updated to ${status}` }] 
    }, { merge: true });
  };

  const updateOrderPaymentStatus = (id: string, paymentStatus: PaymentStatus) => {
    const ref = doc(db, 'orders', id);
    setDoc(ref, { paymentStatus }, { merge: true });
  };

  const updateSettings = (s: StoreSettings) => {
    setDoc(settingsRef, s, { merge: true });
  };

  const addToCart = (p: Product, qty: number = 1) => {
    // Local cart logic remains the same (client-side only for now)
    const savedCart = JSON.parse(localStorage.getItem('gz_cart') || '[]');
    const existing = savedCart.find((item: any) => item.id === p.id);
    let newCart;
    if (existing) {
      newCart = savedCart.map((item: any) => item.id === p.id ? { ...item, quantity: item.quantity + qty } : item);
    } else {
      newCart = [...savedCart, { ...p, quantity: qty }];
    }
    localStorage.setItem('gz_cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  // Cart reading needs to be handled via window storage event in individual components
  const cart = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('gz_cart') || '[]') : [];

  return {
    products,
    orders,
    customers,
    settings,
    cart,
    addProduct,
    updateProduct,
    deleteProduct,
    createOrder,
    updateOrderStatus,
    updateOrderPaymentStatus,
    updateSettings,
    addToCart,
    removeFromCart: (id: string) => {
       const newCart = cart.filter((item: any) => item.id !== id);
       localStorage.setItem('gz_cart', JSON.stringify(newCart));
       window.dispatchEvent(new Event('storage'));
    },
    clearCart: () => {
      localStorage.setItem('gz_cart', '[]');
      window.dispatchEvent(new Event('storage'));
    }
  };
}