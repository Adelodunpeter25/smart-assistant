import { memo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MobileSidebar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[60] md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-64 bg-background border-l z-[70] md:hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md hover:bg-accent transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col p-4 space-y-4">
              <a href="/" className="text-sm hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                Home
              </a>
              <a href="/about" className="text-sm hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                About
              </a>
              <a href="/contact" className="text-sm hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                Contact
              </a>
              <div className="pt-4 space-y-2">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => { setIsOpen(false); window.dispatchEvent(new Event('openLogin')); }}>
                  Sign In
                </Button>
                <Button size="sm" className="w-full" onClick={() => { setIsOpen(false); window.dispatchEvent(new Event('openRegister')); }}>
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
});

MobileSidebar.displayName = 'MobileSidebar';
