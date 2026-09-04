import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark';
}

export const GlassCard = ({ children, className, variant = 'light', ...props }: GlassCardProps) => {
  return (
    <motion.div
      className={cn(
        'rounded-xl border',
        variant === 'light' ? 'glass' : 'glass-dark',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
