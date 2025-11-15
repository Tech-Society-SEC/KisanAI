import { NavLink } from 'react-router-dom';
import { Camera, TrendingUp, FileText, HelpCircle, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface BottomNavbarProps {
  onMicClick: () => void;
}

const navItems = [
  { path: '/diagnosis', label: 'Diagnosis', icon: Camera },
  { path: '/market', label: 'Market', icon: TrendingUp },
];

const navItemsRight = [
  { path: '/schemes', label: 'Schemes', icon: FileText },
  { path: '/help', label: 'Help', icon: HelpCircle },
];

export function BottomNavbar({ onMicClick }: BottomNavbarProps) {
  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border shadow-lg"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {/* Left items */}
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all touch-target ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}

        {/* Center - Mic Button (larger, elevated) */}
        <Button
          onClick={onMicClick}
          size="icon"
          className="relative w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-xl scale-110 z-10 -mt-6"
        >
          <Mic className="h-6 w-6 text-primary-foreground" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute inset-0 border-4 border-primary rounded-full"
          />
        </Button>

        {/* Right items */}
        {navItemsRight.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all touch-target ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
}
