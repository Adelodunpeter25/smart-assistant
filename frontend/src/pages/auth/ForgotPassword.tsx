import { useState, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ForgotPasswordProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackToLogin: () => void;
}

const ForgotPassword = memo(({ open, onOpenChange, onBackToLogin }: ForgotPasswordProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSent(true);
    setLoading(false);
  };

  const handleClose = () => {
    setSent(false);
    setEmail('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Reset Password</DialogTitle>
          <DialogDescription>
            {sent ? 'Check your email for reset instructions' : 'Enter your email to receive a password reset link'}
          </DialogDescription>
        </DialogHeader>
        {sent ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
            </p>
            <Button className="w-full" onClick={onBackToLogin}>
              Back to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="reset-email" className="text-sm font-medium">Email</label>
              <Input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent"></span> : 'Send Reset Link'}
            </Button>
            <button type="button" onClick={onBackToLogin} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
              Back to Sign In
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
});

ForgotPassword.displayName = 'ForgotPassword';

export default ForgotPassword;
