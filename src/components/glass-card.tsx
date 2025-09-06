import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20",
        "shadow-xl shadow-black/10",
        hover && "hover:bg-white/15 hover:border-white/30 transition-all duration-300",
        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-50",
        className
      )}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}