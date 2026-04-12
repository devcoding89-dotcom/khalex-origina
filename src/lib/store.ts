
"use client";

import { useState, useEffect } from 'react';

export type Category = 'phones' | 'laptops' | 'gadgets' | 'cod' | 'cp' | 'all';

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  imageUrl: string;
  specs: Record<string, string>;
  type: 'physical' | 'digital' | 'service';
  isFeatured?: boolean;
  status: 'active' | 'sold-out';
  variants?: ProductVariant[];
  tags?: string[];
  salesCount: number;
  createdAt: string;
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
  group: 'new' | 'regular' | 'vip';
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
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  createdAt: string;
  notes?: string;
}

export interface StoreSettings {
  storeName: string;
  whatsapp: string;
  email: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  maintenanceMode: boolean;
  taxRate: number;
}

const DEFAULT_PRODUCTS: Product[] = [
  { id: 'phone-001', name: 'ASUS ROG Phone 7 Ultimate', category: 'phones', type: 'physical', description: 'Snapdragon 8 Gen 2, 165Hz AMOLED display.', price: 999, oldPrice: 1199, stock: 5, imageUrl: 'https://picsum.photos/seed/rog7/600/400', specs: { Screen: '6.78"', RAM: '16GB' }, isFeatured: true, status: 'active', salesCount: 12, createdAt: new Date().toISOString() },
  { id: 'laptop-001', name: 'ASUS ROG Strix G16', category: 'laptops', type: 'physical', description: 'RTX 4070 gaming laptop.', price: 1799, stock: 4, imageUrl: 'https://picsum.photos/seed/strixg16/600/400', specs: { GPU: 'RTX 4070', CPU: 'i9' }, isFeatured: true, status: 'active', salesCount: 8, createdAt: new Date().toISOString() },
  { id: 'cod-001', name: 'Legendary Account - Lvl 150', category: 'cod', type: 'digital', description: 'Max level account with multiple mythic weapons.', price: 299, stock: 1, imageUrl: 'https://picsum.photos/seed/acc1/600/400', specs: { Rank: 'Legendary', Level: '150' }, isFeatured: true, status: 'active', salesCount: 2, createdAt: new Date().toISOString() },
  { id: 'cp-001', name: '5000 + 500 Bonus CP', category: 'cp', type: 'service', description: 'Best value for serious players.', price: 65, stock: 999, imageUrl: 'https://picsum.photos/seed/cp5000/600/400', specs: { Delivery: 'Instant' }, isFeatured: true, status: 'active', salesCount: 45, createdAt: new Date().toISOString() },
];

export function useStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'GameZone',
    whatsapp: '+1234567890',
    email: 'admin@gamezone.com',
    currencySymbol: '$',
    freeShippingThreshold: 500,
    maintenanceMode: false,
    taxRate: 0
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedProducts = localStorage.getItem('gz_products');
    const savedCart = localStorage.getItem('gz_cart');
    const savedOrders = localStorage.getItem('gz_orders');
    const savedCustomers = localStorage.getItem('gz_customers');
    const savedSettings = localStorage.getItem('gz_settings');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    else setProducts(DEFAULT_PRODUCTS);

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('gz_products', JSON.stringify(products));
      localStorage.setItem('gz_cart', JSON.stringify(cart));
      localStorage.setItem('gz_orders', JSON.stringify(orders));
      localStorage.setItem('gz_customers', JSON.stringify(customers));
      localStorage.setItem('gz_settings', JSON.stringify(settings));
    }
  }, [products, cart, orders, customers, settings, isInitialized]);

  const addProduct = (p: Product) => setProducts([...products, { ...p, createdAt: new Date().toISOString(), salesCount: 0 }]);
  const updateProduct = (p: Product) => setProducts(products.map(item => item.id === p.id ? p : item));
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

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

  const createOrder = (orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'items' | 'total' | 'customerId' | 'paymentStatus'>) => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    // Manage Customer
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
        group: 'new'
      };
      setCustomers([...customers, customer]);
    } else {
      setCustomers(customers.map(c => c.id === customer!.id ? {
        ...c,
        totalSpent: c.totalSpent + total,
        orderCount: c.orderCount + 1,
        lastOrderDate: new Date().toISOString(),
        group: (c.orderCount + 1) > 5 ? 'vip' : 'regular'
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
      createdAt: new Date().toISOString()
    };

    // Update sales count for products
    setProducts(products.map(p => {
      const cartItem = cart.find(ci => ci.id === p.id);
      if (cartItem) return { ...p, salesCount: p.salesCount + cartItem.quantity };
      return p;
    }));

    setOrders([newOrder, ...orders]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const updateOrderPaymentStatus = (id: string, paymentStatus: Order['paymentStatus']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, paymentStatus } : o));
  };

  const updateSettings = (s: StoreSettings) => setSettings(s);

  return {
    products,
    cart,
    orders,
    customers,
    settings,
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
