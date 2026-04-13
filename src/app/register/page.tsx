
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, ShieldCheck, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Navigation } from '@/components/Navigation';
import { useAuth, useUser } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';

export default function CustomerRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    if (!userLoading && user) {
      router.push('/');
    }
  }, [user, userLoading, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please make sure both passwords are the same.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password should be at least 6 characters.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      
      toast({
        title: "Account Created",
        description: "Welcome! You can now start shopping.",
      });
      router.push('/');
    } catch (error: any) {
      console.error(error);
      let message = "Could not create account. Please try again.";
      
      if (error.code === 'auth/invalid-api-key') {
        message = "Firebase API Key is missing or invalid. Please check your config.";
      } else if (error.code === 'auth/email-already-in-use') {
        message = "This email is already registered.";
      } else if (error.message) {
        message = error.message;
      }

      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: message,
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
        title: "Welcome",
        description: "Account created with Google successfully.",
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Registration Failed",
        description: error.message,
      });
    }
  };

  if (userLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-primary font-headline animate-pulse">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm bg-card border-primary/20 shadow-2xl">
          <CardHeader className="text-center space-y-1">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">Sign Up</CardTitle>
            <CardDescription className="text-[10px] uppercase font-bold text-muted-foreground">
              Create an account to join the shop
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest">Full Name</Label>
                <Input 
                  id="name" 
                  type="text"
                  placeholder="Your Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required 
                  className="bg-background border-primary/20 h-10 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest">Email Address</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="name@email.com" 
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
                  placeholder="At least 6 characters"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background border-primary/20 h-10 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="Re-type your password"
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-background border-primary/20 h-10 text-xs"
                />
              </div>

              <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg flex gap-2 items-center">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <p className="text-[8px] text-muted-foreground uppercase font-bold leading-tight">
                  Your data is protected by secure encryption.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-4">
              <Button 
                type="submit" 
                className="w-full h-11 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
                {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full h-11 border-primary/20 font-black uppercase tracking-widest text-xs"
              >
                Sign up with Google
              </Button>
              <div className="flex justify-center w-full mt-2">
                <Link 
                  href="/login"
                  className="text-[10px] uppercase font-black text-primary hover:underline"
                >
                  Already have an account? Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
