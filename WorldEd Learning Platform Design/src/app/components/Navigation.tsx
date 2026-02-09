import React from 'react';
import { Globe, Bell, User, Search, Sparkles } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';

interface NavigationProps {
  onEddiClick?: () => void;
  currentPage?: string;
}

export function Navigation({ onEddiClick, currentPage = 'dashboard' }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'courses', label: 'Courses' },
    { id: 'progress', label: 'My Progress' },
    { id: 'resources', label: 'Resources' },
  ];
  
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
              <Globe className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">WorldEd</h1>
              <p className="text-xs text-muted-foreground -mt-1">Master anything, anywhere</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`
                  text-sm font-medium transition-colors pb-1
                  ${currentPage === item.id 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          {/* Search Bar - Desktop */}
          <div className="hidden lg:block w-80">
            <Input 
              placeholder="Search courses, modules, topics..." 
              showSearch 
              className="text-sm"
            />
          </div>
          
          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Eddi AI Button */}
            <Button 
              variant="ghost"
              size="sm"
              onClick={onEddiClick}
              className="bg-gradient-to-r from-[var(--worlded-purple)] to-[var(--worlded-pink)] text-white hover:opacity-90 shadow-md"
            >
              <Sparkles size={16} />
              <span className="hidden sm:inline">Ask Eddi</span>
            </Button>
            
            {/* Notifications */}
            <button className="p-2 hover:bg-muted rounded-lg transition-colors relative">
              <Bell size={20} className="text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
            </button>
            
            {/* User Avatar */}
            <button className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-sm">
              <User size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
