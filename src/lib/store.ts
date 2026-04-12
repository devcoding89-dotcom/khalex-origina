
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
  // Phones
  { id: 'p1', name: 'Asus ROG Phone 8 Pro', category: 'phones', type: 'physical', description: 'Snapdragon 8 Gen 3, 165Hz LTPO AMOLED.', price: 1199, oldPrice: 1299, stock: 5, isFeatured: true, imageUrl: 'https://picsum.photos/seed/rog8/600/400', specs: { CPU: 'SD 8 Gen 3', RAM: '16GB', Screen: '6.78" 165Hz' } },
  { id: 'p2', name: 'RedMagic 9 Pro', category: 'phones', type: 'physical', description: 'Under-display camera, built-in cooling fan.', price: 899, stock: 3, imageUrl: 'https://picsum.photos/seed/rm9/600/400', specs: { Battery: '6500mAh', Cooling: 'Active Fan' } },
  { id: 'p3', name: 'iPhone 15 Pro Max', category: 'phones', type: 'physical', description: 'A17 Pro chip, Titanium design, AAA gaming ready.', price: 1099, stock: 10, imageUrl: 'https://picsum.photos/seed/ip15/600/400' },
  // Laptops
  { id: 'l1', name: 'Asus ROG Strix SCAR 18', category: 'laptops', type: 'physical', description: 'RTX 4090, i9-14900HX, 18-inch Mini LED.', price: 3899, stock: 2, isFeatured: true, imageUrl: 'https://picsum.photos/seed/scar18/600/400' },
  { id: 'l2', name: 'Alienware m18 R2', category: 'laptops', type: 'physical', description: 'Beastly performance with legendary design.', price: 3200, stock: 4, imageUrl: 'https://picsum.photos/seed/m18/600/400' },
  { id: 'l3', name: 'MSI Titan GT77', category: 'laptops', type: 'physical', description: 'Desktop replacement powerhouse.', price: 4200, stock: 1, imageUrl: 'https://picsum.photos/seed/titan/600/400' },
  // Gadgets
  { id: 'g1', name: 'Razer BlackShark V2 Pro', category: 'gadgets', type: 'physical', description: 'Legendary esports wireless headset.', price: 199, stock: 15, imageUrl: 'https://picsum.photos/seed/headset/600/400' },
  { id: 'g2', name: 'Logitech G Pro X Superlight 2', category: 'gadgets', type: 'physical', description: 'The champion of gaming mice.', price: 159, stock: 20, imageUrl: 'https://picsum.photos/seed/mouse/600/400' },
  { id: 'g3', name: 'Razer Huntsman V3 Pro', category: 'gadgets', type: 'physical', description: 'Analog optical keyboard for pro speed.', price: 249, stock: 10, imageUrl: 'https://picsum.photos/seed/keyboard/600/400' },
  { id: 'g4', name: 'Xbox Elite Series 2', category: 'gadgets', type: 'physical', description: 'The worlds most advanced controller.', price: 179, stock: 8, imageUrl: 'https://picsum.photos/seed/controller/600/400' },
  // Accounts
  { id: 'a1', name: 'Legendary Account L150', category: 'cod', type: 'digital', description: 'Mythic skins, 10+ Legendary weapons, Damascus unlocked.', price: 450, stock: 1, isDigital: true, imageUrl: 'https://picsum.photos/seed/acc1/600/400', specs: { Level: '150', Rank: 'Legendary', KD: '2.5' } },
  { id: 'a2', name: 'Pro Account L120', category: 'cod', type: 'digital', description: 'Solid account with Season 1 OG skins.', price: 150, stock: 1, isDigital: true, imageUrl: 'https://picsum.photos/seed/acc2/600/400' },
  { id: 'a3', name: 'Starter Account L80', category: 'cod', type: 'digital', description: 'Basic clean account ready for ranking.', price: 45, stock: 5, isDigital: true, imageUrl: 'https://picsum.photos/seed/acc3/600/400' },
  { id: 'a4', name: 'Smurf Account L50', category: 'cod', type: 'digital', description: 'High KD smurf account.', price: 25, stock: 10, isDigital: true, imageUrl: 'https://picsum.photos/seed/acc4/600/400' },
  // CP
  { id: 'cp1', name: '1,000 CP Points', category: 'cp', type: 'service', description: 'Standard points pack.', price: 10, stock: 999, isDigital: true, imageUrl: 'https://picsum.photos/seed/cp1000/600/400' },
  { id: 'cp2', name: '2,000 + 100 Bonus CP', category: 'cp', type: 'service', description: 'Bonus pack.', price: 20, stock: 999, isDigital: true, imageUrl: 'https://picsum.photos/seed/cp2000/600/400' },
  { id: 'cp3', name: '5,000 + 500 Bonus CP', category: 'cp', type: 'service', description: 'Large pack.', price: 49, stock: 999, isDigital: true, imageUrl: 'https://picsum.photos/seed/cp5000/600/400' },
  { id: 'cp4', name: '10,000 + 1500 Bonus CP', category: 'cp', type: 'service', description: 'The ultimate pack.', price: 99, stock: 999, isFeatured: true, isDigital: true, imageUrl: 'https://picsum.photos/seed/cp10000/600/400' },
  { id: 'cp5', name: 'Battle Pass Bundle', category: 'cp', type: 'service', description: 'Unlock current season BP + 25 tiers.', price: 25, stock: 999, isDigital: true, imageUrl: 'https://picsum.photos/seed/bp/600/400' },
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
