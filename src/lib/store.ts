
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
  type: 'physical' | 'digital' | 'service';
  isFeatured?: boolean;
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
  // 3 Phones
  { id: 'phone-001', name: 'ASUS ROG Phone 7 Ultimate', category: 'phones', type: 'physical', description: 'The ultimate gaming phone with Snapdragon 8 Gen 2, 165Hz AMOLED display.', price: 999, oldPrice: 1199, stock: 5, imageUrl: 'https://picsum.photos/seed/rog7/600/400', specs: { Screen: '6.78" 165Hz', Processor: 'SD 8 Gen 2', RAM: '16GB' }, isFeatured: true },
  { id: 'phone-002', name: 'RedMagic 9 Pro', category: 'phones', type: 'physical', description: 'Under-display camera, built-in cooling fan, SD 8 Gen 3.', price: 899, stock: 3, imageUrl: 'https://picsum.photos/seed/rm9/600/400', specs: { Battery: '6500mAh', Cooling: 'Active Fan' } },
  { id: 'phone-003', name: 'iPhone 15 Pro Max', category: 'phones', type: 'physical', description: 'A17 Pro chip, Titanium design, AAA gaming ready.', price: 1099, stock: 10, imageUrl: 'https://picsum.photos/seed/ip15/600/400' },
  
  // 3 Laptops
  { id: 'laptop-001', name: 'ASUS ROG Strix G16', category: 'laptops', type: 'physical', description: 'High-performance gaming laptop with RTX 4070 and 240Hz display.', price: 1799, oldPrice: 1999, stock: 4, imageUrl: 'https://picsum.photos/seed/strixg16/600/400', specs: { Screen: '16" 240Hz', CPU: 'i9-13980HX', GPU: 'RTX 4070' }, isFeatured: true },
  { id: 'laptop-002', name: 'Alienware m18 R2', category: 'laptops', type: 'physical', description: 'Beastly 18-inch performance with legendary Alienware design.', price: 3200, stock: 2, imageUrl: 'https://picsum.photos/seed/m18r2/600/400' },
  { id: 'laptop-003', name: 'MSI Titan GT77', category: 'laptops', type: 'physical', description: 'Desktop replacement powerhouse with 4K Mini LED.', price: 4200, stock: 1, imageUrl: 'https://picsum.photos/seed/titan/600/400' },
  
  // 4 Gadgets
  { id: 'gadget-001', name: 'Razer BlackShark V2 Pro', category: 'gadgets', type: 'physical', description: 'Wireless esports headset with THX 7.1 surround sound.', price: 179, stock: 15, imageUrl: 'https://picsum.photos/seed/headset/600/400', isFeatured: true },
  { id: 'gadget-002', name: 'Logitech G Pro X Superlight 2', category: 'gadgets', type: 'physical', description: 'The champion of gaming mice, ultra-lightweight.', price: 159, stock: 20, imageUrl: 'https://picsum.photos/seed/mouse/600/400' },
  { id: 'gadget-003', name: 'Razer Huntsman V3 Pro', category: 'gadgets', type: 'physical', description: 'Analog optical keyboard for professional speed.', price: 249, stock: 10, imageUrl: 'https://picsum.photos/seed/keyboard/600/400' },
  { id: 'gadget-004', name: 'Xbox Elite Series 2', category: 'gadgets', type: 'physical', description: 'The world\'s most advanced controller.', price: 179, stock: 8, imageUrl: 'https://picsum.photos/seed/controller/600/400' },
  
  // 4 CoD Accounts
  { id: 'cod-001', name: 'Legendary Account - Level 150', category: 'cod', type: 'digital', description: 'Max level, Legendary rank, Damascus unlocked, 10+ Legendary skins.', price: 299, stock: 1, isDigital: true, imageUrl: 'https://picsum.photos/seed/acc1/600/400', specs: { Level: '150', Rank: 'Legendary', KD: '2.8' }, isFeatured: true },
  { id: 'cod-002', name: 'Pro Account L120', category: 'cod', type: 'digital', description: 'Solid account with Season 1 OG skins.', price: 150, stock: 1, isDigital: true, imageUrl: 'https://picsum.photos/seed/acc2/600/400' },
  { id: 'cod-003', name: 'Starter Account L80', category: 'cod', type: 'digital', description: 'Clean account ready for ranking.', price: 45, stock: 5, isDigital: true, imageUrl: 'https://picsum.photos/seed/acc3/600/400' },
  { id: 'cod-004', name: 'Smurf Account L50', category: 'cod', type: 'digital', description: 'High KD smurf account.', price: 25, stock: 10, isDigital: true, imageUrl: 'https://picsum.photos/seed/acc4/600/400' },
  
  // 5 CP Packages
  { id: 'cp-001', name: '1000 CP Points', category: 'cp', type: 'service', description: 'Standard points pack.', price: 15, stock: 999, isDigital: true, imageUrl: 'https://picsum.photos/seed/cp1000/600/400' },
  { id: 'cp-002', name: '2000 + 100 Bonus CP', category: 'cp', type: 'service', description: 'Best for Battle Pass.', price: 25, stock: 999, isDigital: true, imageUrl: 'https://picsum.photos/seed/cp2000/600/400' },
  { id: 'cp-003', name: '5000 + 500 Bonus CP', category: 'cp', type: 'service', description: 'Serious value pack.', price: 65, oldPrice: 75, stock: 999, isDigital: true, imageUrl: 'https://picsum.photos/seed/cp5000/600/400', isFeatured: true },
  { id: 'cp-004', name: '10000 + 1500 Bonus CP', category: 'cp', type: 'service', description: 'Ultimate points pack.', price: 99, stock: 999, isDigital: true, imageUrl: 'https://picsum.photos/seed/cp10000/600/400' },
  { id: 'cp-005', name: 'Battle Pass Bundle', category: 'cp', type: 'service', description: 'Unlock current season BP + 25 tiers.', price: 30, stock: 999, isDigital: true, imageUrl: 'https://picsum.photos/seed/bp/600/400' },
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
