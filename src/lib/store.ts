
"use client";

import { useState, useEffect } from 'react';

export type Category = 'phones' | 'laptops' | 'gadgets' | 'cod' | 'cp' | 'all';
export type OrderStatus = 'pending' | 'processing' | 'ready' | 'shipped' | 'completed' | 'cancelled' | 'refunded' | 'on_hold';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';
export type CustomerGroup = 'new' | 'regular' | 'vip' | 'wholesale' | 'blocked';

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category;
  description: string;
  price: number;
  oldPrice?: number;
  costPrice?: number;
  stock: number;
  stockAlert: number;
  imageUrl: string;
  specs: Record<string, string>;
  type: 'physical' | 'digital' | 'service';
  isFeatured?: boolean;
  status: 'active' | 'draft' | 'sold_out' | 'discontinued';
  variants?: ProductVariant[];
  tags: string[];
  salesCount: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  email?: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: string;
  joinedDate: string;
  group: CustomerGroup;
  notes: string[];
  tags: string[];
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  by: string;
  note?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  whatsapp: string;
  email?: string;
  codUid?: string;
  codIgn?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  timeline: OrderTimeline[];
  internalNotes?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export interface AuditLog {
  id: string;
  action: string;
  target: string;
  admin: string;
  timestamp: string;
  details?: string;
}

export interface StoreSettings {
  storeName: string;
  whatsapp: string;
  email: string;
  currencySymbol: string;
  currencyPosition: 'before' | 'after';
  maintenanceMode: boolean;
  taxRate: number;
  freeShippingThreshold: number;
  theme: 'dark' | 'light';
}

const DEFAULT_PRODUCTS: Product[] = [
  { 
    id: 'phone-001', 
    name: 'ASUS ROG Phone 7 Ultimate', 
    slug: 'asus-rog-phone-7-ultimate',
    category: 'phones', 
    type: 'physical', 
    description: 'Snapdragon 8 Gen 2, 165Hz AMOLED display. The ultimate gaming powerhouse.', 
    price: 950000, 
    oldPrice: 1100000, 
    costPrice: 750000,
    stock: 5, 
    stockAlert: 2,
    imageUrl: 'https://picsum.photos/seed/rog7/600/400', 
    specs: { Screen: '6.78"', RAM: '16GB', Storage: '512GB' }, 
    isFeatured: true, 
    status: 'active', 
    salesCount: 12, 
    views: 450,
    tags: ['gaming', 'premium'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'laptop-001', 
    name: 'ASUS ROG Strix G16', 
    slug: 'asus-rog-strix-g16',
    category: 'laptops', 
    type: 'physical', 
    description: 'Intel Core i9, RTX 4070, 240Hz Nebula Display.', 
    price: 2450000, 
    oldPrice: 2700000, 
    costPrice: 1900000,
    stock: 3, 
    stockAlert: 1,
    imageUrl: 'https://picsum.photos/seed/strix/600/400', 
    specs: { GPU: 'RTX 4070', CPU: 'i9-13980HX', RAM: '32GB' }, 
    isFeatured: true, 
    status: 'active', 
    salesCount: 5, 
    views: 320,
    tags: ['laptop', 'pro'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'cod-001', 
    name: 'Legendary Account - Lvl 150', 
    slug: 'cod-legendary-acc-150',
    category: 'cod', 
    type: 'digital', 
    description: 'Max level account with multiple mythic weapons and rare skins.', 
    price: 350000, 
    stock: 1, 
    stockAlert: 0,
    imageUrl: 'https://picsum.photos/seed/acc1/600/400', 
    specs: { Rank: 'Legendary', Level: '150', Mythics: '5' }, 
    isFeatured: true, 
    status: 'active', 
    salesCount: 2, 
    views: 890,
    tags: ['legendary', 'max-level'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'cp-001', 
    name: '10,000 CP + Bonus', 
    slug: 'cp-10000-bonus',
    category: 'cp', 
    type: 'service', 
    description: 'Direct top-up to your UID. Guaranteed delivery within 15 minutes.', 
    price: 125000, 
    stock: 999, 
    stockAlert: 50,
    imageUrl: 'https://picsum.photos/seed/cp10/600/400', 
    specs: { Amount: '11,500 CP', Method: 'Direct UID' }, 
    isFeatured: true, 
    status: 'active', 
    salesCount: 85, 
    views: 1200,
    tags: ['cp', 'topup'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function useStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'GameZone',
    whatsapp: '+2348000000000',
    email: 'admin@gamezone.ng',
    currencySymbol: '₦',
    currencyPosition: 'before',
    maintenanceMode: false,
    taxRate: 0,
    freeShippingThreshold: 500000,
    theme: 'dark'
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedProducts = localStorage.getItem('gz_products');
    const savedCart = localStorage.getItem('gz_cart');
    const savedOrders = localStorage.getItem('gz_orders');
    const savedCustomers = localStorage.getItem('gz_customers');
    const savedSettings = localStorage.getItem('gz_settings');
    const savedLogs = localStorage.getItem('gz_audit_logs');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    else setProducts(DEFAULT_PRODUCTS);

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
    
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      // Force Naira if not set correctly in local storage from previous sessions
      if (parsed.currencySymbol === '$') parsed.currencySymbol = '₦';
      setSettings(parsed);
    }
    
    if (savedLogs) setAuditLogs(JSON.parse(savedLogs));

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('gz_products', JSON.stringify(products));
      localStorage.setItem('gz_cart', JSON.stringify(cart));
      localStorage.setItem('gz_orders', JSON.stringify(orders));
      localStorage.setItem('gz_customers', JSON.stringify(customers));
      localStorage.setItem('gz_settings', JSON.stringify(settings));
      localStorage.setItem('gz_audit_logs', JSON.stringify(auditLogs));
    }
  }, [products, cart, orders, customers, settings, auditLogs, isInitialized]);

  const logAction = (action: string, target: string, details?: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      target,
      admin: 'Commander Admin',
      timestamp: new Date().toISOString(),
      details
    };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 100));
  };

  const addProduct = (p: Product) => {
    setProducts([...products, { ...p, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), salesCount: 0, views: 0 }]);
    logAction('CREATE_PRODUCT', p.name);
  };

  const updateProduct = (p: Product) => {
    setProducts(products.map(item => item.id === p.id ? { ...p, updatedAt: new Date().toISOString() } : item));
    logAction('UPDATE_PRODUCT', p.name);
  };

  const deleteProduct = (id: string) => {
    const p = products.find(item => item.id === id);
    setProducts(products.filter(p => p.id !== id));
    if (p) logAction('DELETE_PRODUCT', p.name);
  };

  const addToCart = (p: Product, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === p.id);
      if (existing) return prev.map(item => item.id === p.id ? { ...item, quantity: item.quantity + qty } : item);
      return [...prev, { ...p, quantity: qty }];
    });
  };

  const removeFromCart = (id: string) => setCart(cart.filter(item => item.id !== id));
  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(cart.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };
  const clearCart = () => setCart([]);

  const createOrder = (orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'items' | 'total' | 'customerId' | 'paymentStatus' | 'timeline' | 'priority'>) => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    let customer = customers.find(c => c.whatsapp === orderData.whatsapp);
    if (!customer) {
      customer = {
        id: `CUST-${Date.now()}`,
        name: orderData.customerName,
        whatsapp: orderData.whatsapp,
        email: orderData.email,
        totalSpent: total,
        orderCount: 1,
        lastOrderDate: new Date().toISOString(),
        joinedDate: new Date().toISOString(),
        group: 'new',
        notes: [],
        tags: []
      };
      setCustomers([...customers, customer]);
    } else {
      setCustomers(customers.map(c => c.id === customer!.id ? {
        ...c,
        totalSpent: c.totalSpent + total,
        orderCount: c.orderCount + 1,
        lastOrderDate: new Date().toISOString(),
        group: (c.orderCount + 1) > 10 ? 'vip' : 'regular'
      } : c));
    }

    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      customerId: customer.id,
      items: [...cart],
      total,
      status: 'pending',
      paymentStatus: 'pending',
      priority: 'normal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [{ status: 'pending', timestamp: new Date().toISOString(), by: 'system', note: 'Order Transmission Received' }]
    };

    setProducts(products.map(p => {
      const cartItem = cart.find(ci => ci.id === p.id);
      if (cartItem) return { ...p, salesCount: p.salesCount + cartItem.quantity, stock: p.stock - cartItem.quantity };
      return p;
    }));

    setOrders([newOrder, ...orders]);
    clearCart();
    logAction('NEW_ORDER', newOrder.id, `Amount: ${settings.currencySymbol}${total.toLocaleString()}`);
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: OrderStatus, note?: string) => {
    setOrders(orders.map(o => o.id === id ? { 
      ...o, 
      status, 
      updatedAt: new Date().toISOString(),
      timeline: [...o.timeline, { status, timestamp: new Date().toISOString(), by: 'Commander Admin', note }]
    } : o));
    logAction('UPDATE_ORDER_STATUS', id, `New Status: ${status}`);
  };

  const updateOrderPaymentStatus = (id: string, paymentStatus: PaymentStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, paymentStatus, updatedAt: new Date().toISOString() } : o));
    logAction('UPDATE_PAYMENT_STATUS', id, `New Status: ${paymentStatus}`);
  };

  const updateSettings = (s: StoreSettings) => {
    setSettings(s);
    logAction('UPDATE_SETTINGS', 'Global');
  };

  return {
    products,
    cart,
    orders,
    customers,
    settings,
    auditLogs,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    createOrder,
    updateOrderStatus,
    updateOrderPaymentStatus,
    updateSettings,
    logAction
  };
}
