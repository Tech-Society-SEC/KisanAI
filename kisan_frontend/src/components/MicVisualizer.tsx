import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MicVisualizerProps {
  isActive: boolean;
}

export function MicVisualizer({ isActive }: MicVisualizerProps) {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    if (isActive) {
      // Generate random bar heights to simulate audio input
      const interval = setInterval(() => {
        setBars(Array.from({ length: 5 }, () => Math.random() * 40 + 10));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setBars([15, 15, 15, 15, 15]);
    }
  }, [isActive]);

  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          animate={{
            height: isActive ? `${height}px` : '10px',
            backgroundColor: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
          }}
          transition={{
            duration: 0.1,
            ease: 'easeOut'
          }}
          className="w-1 rounded-full"
          style={{ minHeight: '10px' }}
        />
      ))}
    </div>
  );
}
