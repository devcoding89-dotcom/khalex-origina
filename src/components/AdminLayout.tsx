
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings, 
  Database, 
  Bell, 
  Search,
  Menu,
  X,
  Plus,
  Gamepad2,
  Clock,
  Zap,
  Wifi,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const isOverrideActive = localStorage.getItem('admin_override_session') === 'active';
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && !isOverrideActive) {
        router.push('/admin/login');
      } else {
        setIsAuthenticating(false);
      }
    });

    if (isOverrideActive) {
      setIsAuthenticating(false);
    }

    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      unsubscribe();
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [auth, router]);

  const handleLogout = async () => {
    localStorage.removeItem('admin_override_session');
    await signOut(auth);
    router.push('/admin/login');
  };

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-primary font-headline animate-pulse text-xs uppercase tracking-widest">
        Verifying Credentials...
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { label: 'Products', icon: Package, href: '/admin/products' },
    { label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
    { label: 'Customers', icon: Users, href: '/admin/customers' },
    { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
    { label: 'Settings', icon: Settings, href: '/admin/settings' },
    { label: 'Backup', icon: Database, href: '/admin/backup' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Gamepad2 className="w-8 h-8 text-primary" />
              {isSidebarOpen && <span className="font-headline font-black tracking-tighter text-lg uppercase italic">Admin Hub</span>}
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
                    className={`w-full justify-start gap-3 h-9 text-[10px] font-black uppercase tracking-widest ${isActive ? 'bg-primary/10 text-primary border-none' : 'hover:bg-primary/5 hover:text-primary'}`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {isSidebarOpen && <span>{item.label}</span>}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="w-full justify-start gap-3 h-9 text-[10px] font-black uppercase tracking-widest text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
              {isSidebarOpen && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-card/50 backdrop-blur-md flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <Menu className="w-4 h-4" />
            </Button>
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                <Clock className="w-3 h-3 text-primary" />
                {currentTime ? `${currentTime.toLocaleTimeString()}` : '--:--:--'}
              </div>
              <Badge variant="outline" className={`text-[7px] font-black border-none gap-1.5 ${isOnline ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                {isOnline ? (
                  <>
                    <Zap className="w-2.5 h-2.5" />
                    SYSTEM ONLINE
                  </>
                ) : (
                  <>
                    <Wifi className="w-2.5 h-2.5" />
                    OFFLINE
                  </>
                )}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <input 
                placeholder="Search..." 
                className="bg-background border border-primary/10 rounded-full h-8 pl-9 pr-4 text-[10px] w-48 focus:outline-none focus:border-primary transition-all uppercase font-bold"
              />
            </div>
            <Link href="/admin/notifications">
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 w-3.5 h-3.5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-[7px] font-black">3</Badge>
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
          
          <Link href="/admin/products?new=true">
            <Button className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-110 transition-transform z-50">
              <Plus className="w-6 h-6" />
            </Button>
          </Link>
        </main>
      </div>
    </div>
  );
}
