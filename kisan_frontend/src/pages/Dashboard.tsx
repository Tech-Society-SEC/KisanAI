import { useNavigate } from 'react-router-dom';
import { Camera, TrendingUp, FileText, HelpCircle, User, Cloud, AlertTriangle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getProfile } from '@/lib/storage';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const navigate = useNavigate();
  const profile = getProfile();

  const features = [
    {
      icon: Camera,
      title: 'Crop Diagnosis',
      description: 'Identify pests & diseases instantly',
      color: 'bg-primary',
      route: '/diagnosis'
    },
    {
      icon: TrendingUp,
      title: 'Market Prices',
      description: 'Real-time crop prices & trends',
      color: 'bg-secondary',
      route: '/market'
    },
    {
      icon: FileText,
      title: 'Government Schemes',
      description: 'Find subsidies & benefits',
      color: 'bg-brown',
      route: '/schemes'
    },
    {
      icon: HelpCircle,
      title: 'Help & History',
      description: 'Tutorial & past queries',
      color: 'bg-accent',
      route: '/help'
    }
  ];

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.name || 'Farmer'}!</p>
          </div>

          {/* Welcome message with animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-2 mb-2 mt-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              How can I help you today?
            </h2>
            <p className="text-muted-foreground">
              Tap the mic button or choose a feature below
            </p>
          </motion.div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 touch-target border-2 border-transparent hover:border-primary/20"
                  onClick={() => navigate(feature.route)}
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className={`${feature.color} p-3 rounded-xl text-white shadow-lg`}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="h-6 w-6" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick tips with animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 max-w-2xl mx-auto bg-gradient-to-r from-accent/10 to-secondary/10 border-2 border-accent/20">
              <div className="flex items-start gap-3">
                <span className="text-3xl">💡</span>
                <div>
                  <h3 className="font-semibold mb-2 text-lg">Quick Tip</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the floating mic button to quickly ask about crop prices, get diagnosis,
                    or find government schemes. Just speak naturally in your language!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
