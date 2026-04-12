
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings, 
  Database, 
  LogOut, 
  Bell, 
  Search,
  Menu,
  X,
  Plus,
  Gamepad2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const auth = localStorage.getItem('gz_admin_auth');
    if (auth !== 'true') router.push('/admin/login');
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [router]);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { label: 'Inventory', icon: Package, href: '/admin/products' },
    { label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
    { label: 'Customers', icon: Users, href: '/admin/customers' },
    { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
    { label: 'Settings', icon: Settings, href: '/admin/settings' },
    { label: 'Backup', icon: Database, href: '/admin/backup' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('gz_admin_auth');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Gamepad2 className="w-8 h-8 text-primary" />
              {isSidebarOpen && <span className="font-headline font-black tracking-tighter text-xl">COMMAND</span>}
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.label} href={item.href}>
                  <Button 
                    variant={isActive ? "secondary" : "ghost"} 
                    className={`w-full justify-start gap-3 ${isActive ? 'bg-primary/10 text-primary border-none' : 'hover:bg-primary/5 hover:text-primary'}`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {isSidebarOpen && <span>{item.label}</span>}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10" 
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span>Power Off</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 border-b bg-card/50 backdrop-blur-md flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="hidden lg:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
              <Clock className="w-3 h-3 text-primary" />
              {currentTime.toLocaleTimeString()} | {currentTime.toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                placeholder="Global Search..." 
                className="bg-background border border-primary/10 rounded-full h-10 pl-10 pr-4 text-sm w-64 focus:outline-none focus:border-primary transition-all"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-primary text-primary-foreground text-[8px]">3</Badge>
            </Button>
            <div className="flex items-center gap-3 pl-6 border-l border-primary/10">
              <div className="text-right">
                <div className="text-xs font-black uppercase">Commander Admin</div>
                <div className="text-[10px] text-primary font-bold">Elite Status</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative">
          {children}
          
          {/* Quick Action FAB */}
          <Link href="/admin/products?new=true">
            <Button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 hover:scale-110 transition-transform z-50">
              <Plus className="w-8 h-8" />
            </Button>
          </Link>
        </main>
      </div>
    </div>
  );
}
