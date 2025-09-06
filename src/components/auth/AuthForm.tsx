import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
      } else {
        await signUp(email, password);
        toast({
          title: "Account created!",
          description: "Welcome to Goaly! Please set up your profile.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-surface px-4">
      <Card className="w-full max-w-md shadow-lg border-border-soft">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">G</span>
          </div>
          <div>
            <CardTitle className="text-2xl text-text-primary">
              {isLogin ? 'Welcome back' : 'Join Goaly'}
            </CardTitle>
            <CardDescription className="text-text-secondary mt-2">
              {isLogin 
                ? 'Sign in to your account to continue' 
                : 'Create an account to start sharing'
              }
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-primary">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input border-input-border focus:border-input-focus"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-text-primary">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input border-input-border focus:border-input-focus"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              variant="premium"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>
          
          <Separator className="bg-border-soft" />
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline text-sm"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};