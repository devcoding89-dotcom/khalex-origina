
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
  specs?: Record<string, string>;
  isDigital?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  whatsapp: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Asus ROG Phone 8 Pro',
    category: 'phones',
    description: 'The ultimate gaming phone with Snapdragon 8 Gen 3 and 165Hz display.',
    price: 1199,
    oldPrice: 1299,
    stock: 5,
    imageUrl: 'https://picsum.photos/seed/gp1/600/400',
    specs: { display: '6.78" OLED', refresh: '165Hz', ram: '16GB' }
  },
  {
    id: 'p2',
    name: 'Razer Blade 16',
    category: 'laptops',
    description: 'Precision gaming laptop with RTX 4090 and Dual Mode Mini-LED display.',
    price: 3299,
    stock: 2,
    imageUrl: 'https://picsum.photos/seed/gl1/600/400',
    specs: { gpu: 'RTX 4090', cpu: 'i9-13950HX', display: '4K/FHD+' }
  },
  {
    id: 'p3',
    name: 'Legendary CoD Account',
    category: 'cod',
    description: 'Level 150 account with Mythic Holger and multiple Legendary skins.',
    price: 250,
    stock: 1,
    isDigital: true,
    imageUrl: 'https://picsum.photos/seed/cod1/600/400',
    specs: { rank: 'Legendary', level: '150', skins: 'Mythic/Legendary' }
  },
  {
    id: 'p4',
    name: '10,000 CP Top-up',
    category: 'cp',
    description: 'Fast and secure COD Points top-up pack for global region.',
    price: 99,
    stock: 999,
    isDigital: true,
    imageUrl: 'https://picsum.photos/seed/cp1/600/400',
    specs: { region: 'Global', time: '5-10 mins' }
  }
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
    if (isInitialized) {
      localStorage.setItem('gz_products', JSON.stringify(products));
    }
  }, [products, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('gz_cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('gz_orders', JSON.stringify(orders));
    }
  }, [orders, isInitialized]);

  const addProduct = (p: Product) => setProducts([...products, p]);
  const updateProduct = (p: Product) => setProducts(products.map(item => item.id === p.id ? p : item));
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

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
  const clearCart = () => setCart([]);

  const createOrder = (customerName: string, whatsapp: string) => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerName,
      whatsapp,
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
    clearCart,
    createOrder,
    updateOrderStatus
  };
}
