import { memo } from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = memo(() => {
  return (
    <footer className="border-t bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/icon.svg" alt="Smart Assistant" className="w-8 h-8" />
              <h3 className="font-bold text-lg">Smart Assistant</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered productivity tool for modern teams
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#blog" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#careers" className="hover:text-foreground transition-colors">Careers</a></li>
            </ul>
          </div>
          <div className="md:col-start-3">
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Smart Assistant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
