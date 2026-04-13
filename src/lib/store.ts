
"use client";

import { useState, useEffect } from 'react';

// --- DATABASE TYPES & SCHEMAS ---

export type Category = 'phones' | 'laptops' | 'gadgets' | 'cod' | 'cp' | 'all';
export type ProductType = 'physical' | 'digital' | 'service';
export type ProductStatus = 'active' | 'draft' | 'sold_out' | 'discontinued';
export type OrderStatus = 'pending' | 'processing' | 'ready' | 'shipped' | 'completed' | 'cancelled' | 'refunded' | 'on_hold';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';
export type CustomerGroup = 'new' | 'regular' | 'vip' | 'wholesale' | 'blocked';
export type OrderPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku?: string;
}

export interface Product {
  // Identity & Basic Info
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: Category;
  subcategory?: string;
  type: ProductType;
  description: string;
  
  // Pricing
  price: number;
  oldPrice?: number;
  costPrice: number; // For profit calculation
  
  // Inventory
  stock: number;
  stockAlert: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  
  // Media & Metadata
  imageUrl: string;
  videoUrl?: string;
  specs: Record<string, string>;
  tags: string[];
  
  // Status & Marketing
  status: ProductStatus;
  isFeatured: boolean;
  isNewArrival?: boolean;
  salesCount: number;
  views: number;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // History
  createdAt: string;
  updatedAt: string;
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
  riskScore: 'low' | 'medium' | 'high';
  ipHistory: string[];
  notes: string[];
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  by: string;
  note?: string;
}

export interface Order {
  id: string;
  displayId: string;
  customerId: string;
  customerSnapshot: {
    name: string;
    whatsapp: string;
    email?: string;
  };
  codUid?: string;
  codIgn?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  profit: number; // total - (costPrice * qty)
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  priority: OrderPriority;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  timeline: OrderTimeline[];
}

export interface AuditLog {
  id: string;
  action: string;
  target: string;
  admin: string;
  timestamp: string;
  details?: string;
  ip?: string;
}

export interface StoreSettings {
  storeName: string;
  whatsapp: string;
  email: string;
  address: string;
  currencySymbol: string;
  currencyPosition: 'before' | 'after';
  maintenanceMode: boolean;
  taxRate: number;
  freeShippingThreshold: number;
  theme: 'dark' | 'light';
}

// --- DEFAULT DATA SEED ---

const DEFAULT_PRODUCTS: Product[] = [
  { 
    id: 'phone-001', 
    sku: 'PHN-ROG7-ULT',
    name: 'ASUS ROG Phone 7 Ultimate', 
    slug: 'asus-rog-phone-7-ultimate',
    category: 'phones', 
    type: 'physical', 
    description: 'The absolute pinnacle of mobile gaming. Snapdragon 8 Gen 2, 165Hz AMOLED, and the AeroActive Portal.', 
    price: 950000, 
    oldPrice: 1100000, 
    costPrice: 780000,
    stock: 5, 
    stockAlert: 2,
    trackInventory: true,
    allowBackorder: false,
    imageUrl: 'https://picsum.photos/seed/rog7/600/400', 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-gaming-setup-with-neon-lights-4240-large.mp4',
    specs: { Screen: '6.78"', RAM: '16GB', Storage: '512GB', Refresh: '165Hz' }, 
    isFeatured: true, 
    status: 'active', 
    salesCount: 12, 
    views: 450,
    tags: ['gaming', 'premium', 'flagship'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'laptop-001', 
    sku: 'LAP-STRIX-G16',
    name: 'ASUS ROG Strix G16', 
    slug: 'asus-rog-strix-g16',
    category: 'laptops', 
    type: 'physical', 
    description: 'Intel Core i9-13980HX, RTX 4070, and a stunning 240Hz Nebula Display.', 
    price: 2450000, 
    oldPrice: 2700000, 
    costPrice: 2100000,
    stock: 3, 
    stockAlert: 1,
    trackInventory: true,
    allowBackorder: true,
    imageUrl: 'https://picsum.photos/seed/strix/600/400', 
    specs: { GPU: 'RTX 4070', CPU: 'i9-13980HX', RAM: '32GB', Storage: '1TB SSD' }, 
    isFeatured: true, 
    status: 'active', 
    salesCount: 5, 
    views: 320,
    tags: ['laptop', 'pro', 'rtx'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'cod-001', 
    sku: 'DIG-COD-L150',
    name: 'Legendary Account - Lvl 150', 
    slug: 'cod-legendary-acc-150',
    category: 'cod', 
    type: 'digital', 
    description: 'Max level account with multiple mythic weapons, rare camos, and Legendary rank status.', 
    price: 350000, 
    costPrice: 200000,
    stock: 1, 
    stockAlert: 0,
    trackInventory: true,
    allowBackorder: false,
    imageUrl: 'https://picsum.photos/seed/acc1/600/400', 
    specs: { Rank: 'Legendary', Level: '150', Mythics: '5', Region: 'Global' }, 
    isFeatured: true, 
    status: 'active', 
    salesCount: 2, 
    views: 890,
    tags: ['legendary', 'max-level', 'mythic'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'cp-001', 
    sku: 'SRV-CP-10K',
    name: '10,000 CP + Bonus', 
    slug: 'cp-10000-bonus',
    category: 'cp', 
    type: 'service', 
    description: 'Direct top-up to your player UID. Fast delivery guaranteed.', 
    price: 125000, 
    costPrice: 110000,
    stock: 999, 
    stockAlert: 50,
    trackInventory: false,
    allowBackorder: true,
    imageUrl: 'https://picsum.photos/seed/cp10/600/400', 
    specs: { Amount: '11,500 CP', Method: 'Direct UID', Time: '5-15 mins' }, 
    isFeatured: true, 
    status: 'active', 
    salesCount: 85, 
    views: 1200,
    tags: ['cp', 'topup', 'fast'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// --- STORE HOOK ---

export function useStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'KHALEX hub',
    whatsapp: '09166905298',
    email: 'khaleedadefemi1@gmail.com',
    address: 'no7 hiltop estate aboru lagos',
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
    
    // Force specific brand info to prevent stale data
    const baseSettings = {
      storeName: 'KHALEX hub',
      whatsapp: '09166905298',
      email: 'khaleedadefemi1@gmail.com',
      address: 'no7 hiltop estate aboru lagos',
      currencySymbol: '₦'
    };

    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings({
        ...parsed,
        ...baseSettings
      });
    } else {
      setSettings(prev => ({ ...prev, ...baseSettings }));
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
      admin: typeof window !== 'undefined' ? localStorage.getItem('gz_admin_user') || 'System' : 'System',
      timestamp: new Date().toISOString(),
      details,
      ip: '127.0.0.1'
    };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 500));
  };

  const addProduct = (p: Product) => {
    setProducts([...products, { ...p, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
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

  const createOrder = (orderData: { 
    customerName: string; 
    whatsapp: string; 
    email?: string; 
    codUid?: string; 
    codIgn?: string; 
  }) => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const profit = cart.reduce((acc, item) => acc + ((item.price - (item.costPrice || 0)) * item.quantity), 0);
    const total = subtotal; // Simpler for MVP, could add tax/shipping

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
        riskScore: 'low',
        ipHistory: ['127.0.0.1'],
        notes: []
      };
      setCustomers([...customers, customer]);
    } else {
      setCustomers(customers.map(c => c.id === customer!.id ? {
        ...c,
        totalSpent: c.totalSpent + total,
        orderCount: c.orderCount + 1,
        lastOrderDate: new Date().toISOString(),
        group: (c.totalSpent + total) > 5000000 ? 'vip' : 'regular'
      } : c));
    }

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      displayId: `#${Date.now().toString().slice(-4)}`,
      customerId: customer.id,
      customerSnapshot: {
        name: orderData.customerName,
        whatsapp: orderData.whatsapp,
        email: orderData.email
      },
      codUid: orderData.codUid,
      codIgn: orderData.codIgn,
      items: [...cart],
      subtotal,
      tax: 0,
      total,
      profit,
      status: 'pending',
      paymentStatus: 'pending',
      priority: 'normal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [{ 
        status: 'pending', 
        timestamp: new Date().toISOString(), 
        by: 'System', 
        note: 'Strategic order received and logged.' 
      }]
    };

    setProducts(products.map(p => {
      const cartItem = cart.find(ci => ci.id === p.id);
      if (cartItem && p.trackInventory) {
        return { ...p, salesCount: p.salesCount + cartItem.quantity, stock: p.stock - cartItem.quantity };
      }
      return p;
    }));

    setOrders([newOrder, ...orders]);
    clearCart();
    logAction('NEW_ORDER', newOrder.displayId, `Value: ${settings.currencySymbol}${total.toLocaleString()}`);
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: OrderStatus, note?: string) => {
    const adminUser = typeof window !== 'undefined' ? localStorage.getItem('gz_admin_user') || 'Admin' : 'Admin';
    setOrders(orders.map(o => o.id === id ? { 
      ...o, 
      status, 
      updatedAt: new Date().toISOString(),
      timeline: [...o.timeline, { 
        status, 
        timestamp: new Date().toISOString(), 
        by: adminUser, 
        note 
      }]
    } : o));
    logAction('UPDATE_ORDER_STATUS', id, `Status moved to: ${status}`);
  };

  const updateOrderPaymentStatus = (id: string, paymentStatus: PaymentStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, paymentStatus, updatedAt: new Date().toISOString() } : o));
    logAction('UPDATE_PAYMENT_STATUS', id, `Payment marked as: ${paymentStatus}`);
  };

  const updateSettings = (s: StoreSettings) => {
    setSettings(s);
    logAction('UPDATE_SETTINGS', 'Store Core');
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
    updateSettings
  };
}
