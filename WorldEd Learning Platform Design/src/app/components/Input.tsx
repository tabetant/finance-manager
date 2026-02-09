import React from 'react';
import { Search } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  showSearch?: boolean;
}

export function Input({ icon, showSearch, className = '', ...props }: InputProps) {
  return (
    <div className="relative">
      {(icon || showSearch) && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {showSearch ? <Search size={18} /> : icon}
        </div>
      )}
      <input
        className={`
          w-full px-4 py-2 bg-input-background border border-border rounded-md
          focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
          transition-all duration-200
          ${(icon || showSearch) ? 'pl-10' : ''}
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
