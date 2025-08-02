import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
  });
  const [loading, setLoading] = useState(false);
  const setUser = useStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || (!isLogin && !formData.name)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    // Simulate email verification process
    setTimeout(() => {
      if (isLogin) {
        // Simulate login
        toast.success('Login successful! Welcome back to your journey.');
      } else {
        // Simulate registration
        const newUser = {
          id: uuidv4(),
          name: formData.name,
          email: formData.email,
          characterId: '',
          difficulty: formData.difficulty,
          registeredAt: new Date().toISOString()
        };
        
        setUser(newUser);
        toast.success(`Kia ora ${formData.name}! Welcome to your Māori adventure journey.`);
      }
      setLoading(false);
      onClose();
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="maori-card max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">
            {isLogin ? 'Haere Mai - Welcome Back' : 'Join Your Journey'}
          </DialogTitle>
          <p className="text-muted-foreground text-center">
            {isLogin 
              ? 'Continue your cultural adventure' 
              : 'Begin your 30-day Māori cultural journey'
            }
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">
                Your Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your name"
                className="bg-background/50 border-primary/20 focus:border-primary"
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your.email@example.com"
              className="bg-background/50 border-primary/20 focus:border-primary"
              required
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-foreground font-medium">
                Choose Your Path
              </Label>
              <Select value={formData.difficulty} onValueChange={(value: any) => handleInputChange('difficulty', value)}>
                <SelectTrigger className="bg-background/50 border-primary/20">
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">
                    <div className="flex flex-col">
                      <span className="font-medium">Beginner (Easy)</span>
                      <span className="text-sm text-muted-foreground">Perfect for newcomers to Māori culture</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="intermediate">
                    <div className="flex flex-col">
                      <span className="font-medium">Intermediate (Normal)</span>
                      <span className="text-sm text-muted-foreground">Some knowledge of Māori culture</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="advanced">
                    <div className="flex flex-col">
                      <span className="font-medium">Advanced (Hard)</span>
                      <span className="text-sm text-muted-foreground">Deep cultural understanding required</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                {isLogin ? 'Signing In...' : 'Sending Verification...'}
              </div>
            ) : (
              isLogin ? 'Enter Journey' : 'Start Adventure'
            )}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-primary/80"
            >
              {isLogin 
                ? "New to the journey? Sign up" 
                : "Already registered? Sign in"
              }
            </Button>
          </div>
        </form>

        {!isLogin && (
          <div className="text-center text-sm text-muted-foreground p-4 bg-muted/20 rounded-lg">
            🌟 By registering, you'll receive a verification email and can participate in our 
            prize draws throughout your 30-day journey!
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};