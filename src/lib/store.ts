
"use client";

import { useState, useEffect } from 'react';

export type Category = 'phones' | 'laptops' | 'gadgets' | 'cod' | 'cp' | 'all';

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
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  whatsapp: string;
  email?: string;
  codUid?: string;
  codIgn?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

const DEFAULT_PRODUCTS: Product[] = [
  { id: 'phone-001', name: 'ASUS ROG Phone 7 Ultimate', category: 'phones', type: 'physical', description: 'The ultimate gaming phone with Snapdragon 8 Gen 2, 165Hz AMOLED display.', price: 999, oldPrice: 1199, stock: 5, imageUrl: 'https://picsum.photos/seed/rog7/600/400', specs: { Screen: '6.78" 165Hz', Processor: 'SD 8 Gen 2', RAM: '16GB' }, isFeatured: true, status: 'active' },
  { id: 'phone-002', name: 'RedMagic 9 Pro', category: 'phones', type: 'physical', description: 'Under-display camera, built-in cooling fan, SD 8 Gen 3.', price: 899, stock: 3, imageUrl: 'https://picsum.photos/seed/rm9/600/400', specs: { Battery: '6500mAh', Cooling: 'Active Fan' }, status: 'active' },
  { id: 'laptop-001', name: 'ASUS ROG Strix G16', category: 'laptops', type: 'physical', description: 'High-performance gaming laptop with RTX 4070 and 240Hz display.', price: 1799, oldPrice: 1999, stock: 4, imageUrl: 'https://picsum.photos/seed/strixg16/600/400', specs: { Screen: '16" 240Hz', CPU: 'i9-13980HX', GPU: 'RTX 4070' }, isFeatured: true, status: 'active' },
  { id: 'gadget-001', name: 'Razer BlackShark V2 Pro', category: 'gadgets', type: 'physical', description: 'Wireless esports headset with THX 7.1 surround sound.', price: 179, stock: 15, imageUrl: 'https://picsum.photos/seed/headset/600/400', specs: { Type: 'Wireless', Battery: '24h' }, isFeatured: true, status: 'active' },
  { id: 'cod-001', name: 'Legendary Account - Level 150', category: 'cod', type: 'digital', description: 'Max level account with Legendary rank and multiple mythic weapons.', price: 299, stock: 1, imageUrl: 'https://picsum.photos/seed/acc1/600/400', specs: { Level: '150', Rank: 'Legendary', KD: '2.8' }, isFeatured: true, status: 'active' },
  { id: 'cp-001', name: '5000 + 500 Bonus CP', category: 'cp', type: 'service', description: '5500 CP total. Best value package for serious players.', price: 65, oldPrice: 75, stock: 999, imageUrl: 'https://picsum.photos/seed/cp5000/600/400', specs: { Points: '5500', Delivery: '5-10m' }, isFeatured: true, status: 'active' },
];

export function useStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedProducts = localStorage.getItem('gz_products');
    const savedCart = localStorage.getItem('gz_cart');
    const savedOrders = localStorage.getItem('gz_orders');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    else setProducts(DEFAULT_PRODUCTS);

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) localStorage.setItem('gz_products', JSON.stringify(products));
  }, [products, isInitialized]);

  useEffect(() => {
    if (isInitialized) localStorage.setItem('gz_cart', JSON.stringify(cart));
  }, [cart, isInitialized]);

  useEffect(() => {
    if (isInitialized) localStorage.setItem('gz_orders', JSON.stringify(orders));
  }, [orders, isInitialized]);

  const addProduct = (p: Product) => setProducts([...products, p]);
  const updateProduct = (p: Product) => setProducts(products.map(item => item.id === p.id ? p : item));
  const deleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const addToCart = (p: Product, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === p.id);
      if (existing) {
        return prev.map(item => item.id === p.id ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prev, { ...p, quantity: qty }];
    });
  };

  const removeFromCart = (id: string) => setCart(cart.filter(item => item.id !== id));
  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(cart.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };
  const clearCart = () => setCart([]);

  const createOrder = (orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'items' | 'total'>) => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      items: [...cart],
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setOrders([newOrder, ...orders]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  return {
    products,
    cart,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    createOrder,
    updateOrderStatus
  };
}
