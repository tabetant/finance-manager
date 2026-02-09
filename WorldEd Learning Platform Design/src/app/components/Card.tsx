import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div 
      className={`
        bg-card border border-border rounded-xl p-6 
        ${hover ? 'hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer' : 'shadow-sm'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
