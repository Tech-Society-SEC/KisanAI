import { useState, useEffect } from 'react';
import { Mic, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingMicProps {
  onClick: () => void;
  isListening?: boolean;
  hasMessages?: boolean;
}

export function FloatingMic({ onClick, isListening = false, hasMessages = false }: FloatingMicProps) {
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    setShowPulse(isListening);
  }, [isListening]);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="relative">
        <AnimatePresence>
          {showPulse && (
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-destructive"
            />
          )}
        </AnimatePresence>

        <Button
          size="lg"
          onClick={onClick}
          className={cn(
            "h-16 w-16 rounded-full shadow-2xl touch-target transition-all",
            isListening 
              ? "bg-destructive hover:bg-destructive/90 glow" 
              : "bg-gradient-to-br from-primary to-secondary hover:scale-110"
          )}
          aria-label={isListening ? "Stop listening" : "Start voice chat"}
        >
          {hasMessages ? (
            <MessageSquare className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>

        {hasMessages && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-success text-[10px] font-bold text-white">
            !
          </span>
        )}
      </div>
    </motion.div>
  );
}
