
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use real Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      
      // We still use localStorage as a secondary flag for your existing AdminLayout check
      localStorage.setItem('gz_admin_auth', 'true');
      
      toast({
        title: "Welcome Back",
        description: "Admin access granted.",
      });
      
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: error.message || "Invalid email or password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm bg-card border-primary/20 shadow-2xl">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">Admin Login</CardTitle>
          <CardDescription className="text-[10px] uppercase font-bold text-muted-foreground">
            Staff Access Only
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest">Admin Email</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="admin@khalexhub.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="bg-background border-primary/20 h-10 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="bg-background border-primary/20 h-10 text-xs"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-4">
            <Button 
              type="submit" 
              className="w-full h-11 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Login'}
              {!isLoading && <LogIn className="ml-2 w-4 h-4" />}
            </Button>
            <Button variant="ghost" asChild className="text-[8px] uppercase font-black text-muted-foreground hover:text-primary">
              <a href="/">Return to Shop</a>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
