"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Navigation } from '@/components/Navigation';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function CustomerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, loading: userLoading } = useUser();

  // Redirect if already logged in
  useEffect(() => {
    if (!userLoading && user) {
      router.push('/');
    }
  }, [user, userLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome Back",
        description: "You have logged in successfully.",
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Please check your email and password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: "Welcome Back",
        description: "Logged in with Google successfully.",
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Login Failed",
        description: error.message,
      });
    }
  };

  if (userLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-primary font-headline animate-pulse">SYNCHRONIZING...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm bg-card border-primary/20 shadow-2xl">
          <CardHeader className="text-center space-y-1">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <UserCircle className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">Login</CardTitle>
            <CardDescription className="text-[10px] uppercase font-bold text-muted-foreground">
              Login to your account to shop
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest">Email Address</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="name@example.com" 
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

              <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg flex gap-2 items-center">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <p className="text-[8px] text-muted-foreground uppercase font-bold leading-tight">
                  Secure login keeps your data safe.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-4">
              <Button 
                type="submit" 
                className="w-full h-11 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs"
                disabled={isLoading}
              >
                {isLoading ? 'Checking...' : 'Login'}
                {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full h-11 border-primary/20 font-black uppercase tracking-widest text-xs"
              >
                Login with Google
              </Button>
              <div className="flex justify-between w-full mt-2">
                <Button 
                  type="button"
                  variant="link" 
                  className="text-[8px] uppercase font-black text-muted-foreground p-0 h-auto"
                >
                  Forgot Password?
                </Button>
                <Button 
                  type="button"
                  variant="link" 
                  onClick={() => router.push('/register')}
                  className="text-[8px] uppercase font-black text-primary p-0 h-auto"
                >
                  Register Now
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
