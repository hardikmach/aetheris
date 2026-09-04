import { motion } from 'motion/react';

export const BackgroundOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 80, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ top: '-10%', left: '-10%' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[100px]"
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 100, -80, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ bottom: '10%', right: '-5%' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,0)_0%,rgba(19,19,19,1)_100%)]" />
    </div>
  );
};
