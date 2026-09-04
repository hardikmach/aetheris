import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface PillButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PillButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className, 
  ...props 
}: PillButtonProps) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(255,0,0,0.3)]',
    secondary: 'bg-white text-black hover:bg-white/90',
    outline: 'border border-white/20 hover:bg-white/5 backdrop-blur-sm transition-colors',
    ghost: 'hover:bg-white/5 text-on-surface/80 hover:text-on-surface',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs font-medium',
    md: 'px-6 py-2.5 text-sm font-semibold',
    lg: 'px-8 py-3.5 text-base font-bold',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'pill transition-all duration-200 flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
