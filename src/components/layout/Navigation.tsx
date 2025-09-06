import { Plus, User, Settings, LogOut, Home, Bookmark } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/enhanced-button';

export const Navigation = () => {
  const { userProfile, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: Home, href: '/', label: 'Home' },
    { icon: Bookmark, href: '/bookmarks', label: 'Bookmarks' },
    { icon: User, href: '/profile', label: 'Profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border-soft bg-card/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">G</span>
            </div>
            <span className="font-semibold text-text-primary text-xl">Goaly</span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(({ icon: Icon, href, label }) => (
              <Link
                key={href}
                to={href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive(href)
                    ? 'bg-primary-soft text-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-secondary'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            <Link to="/create">
              <Button variant="accent" size="sm" className="rounded-full">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Post</span>
              </Button>
            </Link>

            {userProfile?.isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-text-secondary hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-around py-2 border-t border-border-soft">
          {navItems.map(({ icon: Icon, href, label }) => (
            <Link
              key={href}
              to={href}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                isActive(href)
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};