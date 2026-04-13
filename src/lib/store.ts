
'use client';

import { useMemo } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  limit,
  DocumentData
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
  trackInventory: boolean;
  imageUrl: string;
  videoUrl?: string;
  specs: Record<string, string>;
  status: ProductStatus;
  isFeatured: boolean;
  type: 'physical' | 'digital' | 'service';
  salesCount: number;
  views: number;
  createdAt: any;
  updatedAt?: any;
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
  priority: 'low' | 'normal' | 'high' | 'urgent';
  items: any[];
  createdAt: any;
  timeline: {
    status: string;
    timestamp: string;
    by: string;
    note: string;
  }[];
}

export interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  email?: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: any;
  joinedDate: string;
  group: 'regular' | 'vip' | 'new';
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

// Helper to remove undefined values from objects for Firestore compatibility
function sanitizeData(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );
}

// --- STORE HOOK ---
export function useStore() {
  const db = useFirestore();

  // Queries - Real-time listeners
  const productsQuery = useMemo(() => query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(100)), [db]);
  const ordersQuery = useMemo(() => query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(100)), [db]);
  const customersQuery = useMemo(() => query(collection(db, 'customers'), limit(100)), [db]);
  const settingsRef = useMemo(() => doc(db, 'settings', 'global'), [db]);

  const { data: productsData, loading: productsLoading } = useCollection<Product>(productsQuery);
  const { data: ordersData } = useCollection<Order>(ordersQuery);
  const { data: customersData } = useCollection<Customer>(customersQuery);
  const { data: settingsData } = useDoc<StoreSettings>(settingsRef);

  const products = productsData || [];
  const orders = ordersData || [];
  const customers = customersData || [];
  
  const settings: StoreSettings = settingsData || {
    storeName: 'KHALEX hub',
    whatsapp: '2349166905298',
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
    const newProduct = { 
      ...p, 
      id, 
      createdAt: serverTimestamp(),
      salesCount: p.salesCount || 0,
      views: p.views || 0,
      status: p.status || 'active',
      isFeatured: !!p.isFeatured,
      trackInventory: true,
      stockAlert: p.stockAlert || 5,
      price: Number(p.price) || 0,
      costPrice: Number(p.costPrice) || 0
    };

    const finalData = sanitizeData(newProduct);

    setDoc(ref, finalData, { merge: true })
      .catch((err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: ref.path,
          operation: 'create',
          requestResourceData: finalData
        } satisfies SecurityRuleContext));
      });
  };

  const updateProduct = (p: Product) => {
    const ref = doc(db, 'products', p.id);
    const updateData = { 
      ...p, 
      updatedAt: serverTimestamp(),
      price: Number(p.price),
      costPrice: Number(p.costPrice)
    };

    const finalData = sanitizeData(updateData);

    setDoc(ref, finalData, { merge: true })
      .catch((err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: ref.path,
          operation: 'update',
          requestResourceData: finalData
        } satisfies SecurityRuleContext));
      });
  };

  const deleteProduct = (id: string) => {
    const ref = doc(db, 'products', id);
    deleteDoc(ref)
      .catch((err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: ref.path,
          operation: 'delete'
        } satisfies SecurityRuleContext));
      });
  };

  const createOrder = (orderData: any) => {
    const timestamp = Date.now();
    const id = `ORD-${timestamp}`;
    const displayId = `#${timestamp.toString().slice(-6)}`;
    const ref = doc(db, 'orders', id);
    
    const newOrder = {
      ...orderData,
      id,
      displayId,
      status: 'pending',
      paymentStatus: 'pending',
      priority: 'normal',
      createdAt: serverTimestamp(),
      timeline: [{ 
        status: 'pending', 
        timestamp: new Date().toISOString(), 
        by: 'System', 
        note: 'Order received. We are checking it.' 
      }]
    };

    const finalOrder = sanitizeData(newOrder);
    
    setDoc(ref, finalOrder).catch((err) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: ref.path,
        operation: 'create',
        requestResourceData: finalOrder
      } satisfies SecurityRuleContext));
    });

    // Update or Create Customer
    const customerRef = doc(db, 'customers', orderData.whatsapp);
    const existingCustomer = customers.find(c => c.whatsapp === orderData.whatsapp);
    
    const customerData = {
      id: orderData.whatsapp,
      name: orderData.customerName,
      whatsapp: orderData.whatsapp,
      email: orderData.email || '',
      totalSpent: (existingCustomer?.totalSpent || 0) + Number(orderData.total),
      orderCount: (existingCustomer?.orderCount || 0) + 1,
      lastOrderDate: serverTimestamp(),
      joinedDate: existingCustomer?.joinedDate || new Date().toISOString(),
      group: existingCustomer?.group || 'regular'
    };

    setDoc(customerRef, sanitizeData(customerData), { merge: true });

    return { ...newOrder, id };
  };

  const updateOrderStatus = (id: string, status: OrderStatus, customNote?: string) => {
    const ref = doc(db, 'orders', id);
    const existingOrder = orders.find(o => o.id === id);
    const currentTimeline = existingOrder?.timeline || [];
    
    const updateData = { 
      status, 
      timeline: [...currentTimeline, { 
        status, 
        timestamp: new Date().toISOString(), 
        by: 'Admin', 
        note: customNote || `Order status updated to ${status.toUpperCase()}` 
      }] 
    };

    setDoc(ref, updateData, { merge: true });
  };

  const updateOrderPaymentStatus = (id: string, paymentStatus: PaymentStatus) => {
    const ref = doc(db, 'orders', id);
    setDoc(ref, { paymentStatus }, { merge: true });
  };

  const updateSettings = (s: StoreSettings) => {
    setDoc(settingsRef, sanitizeData(s), { merge: true });
  };

  // Local Storage Cart logic (stays on device)
  const addToCart = (p: Product, qty: number = 1) => {
    if (typeof window === 'undefined') return;
    const savedCart = JSON.parse(localStorage.getItem('khalex_cart') || '[]');
    const existing = savedCart.find((item: any) => item.id === p.id);
    let newCart;
    if (existing) {
      newCart = savedCart.map((item: any) => item.id === p.id ? { ...item, quantity: item.quantity + qty } : item);
    } else {
      newCart = [...savedCart, { ...p, quantity: qty }];
    }
    localStorage.setItem('khalex_cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const cart = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('khalex_cart') || '[]') : [];

  return {
    products,
    productsLoading,
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
       localStorage.setItem('khalex_cart', JSON.stringify(newCart));
       window.dispatchEvent(new Event('storage'));
    },
    updateQuantity: (id: string, qty: number) => {
       if (qty < 1) return;
       const newCart = cart.map((item: any) => item.id === id ? { ...item, quantity: qty } : item);
       localStorage.setItem('khalex_cart', JSON.stringify(newCart));
       window.dispatchEvent(new Event('storage'));
    },
    clearCart: () => {
      localStorage.setItem('khalex_cart', '[]');
      window.dispatchEvent(new Event('storage'));
    }
  };
}
