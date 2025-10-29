import { useState } from 'react';
import { RotateCcw, Trash2, Clock, Camera, TrendingUp, FileText, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getHistory, clearHistory } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const categoryIcons = {
  diagnosis: Camera,
  market: TrendingUp,
  schemes: FileText,
  chat: MessageCircle,
};

export default function History() {
  const { toast } = useToast();
  const [history] = useState(getHistory());

  const handleClearHistory = () => {
    clearHistory();
    toast({ title: "History cleared successfully" });
    window.location.reload();
  };

  const getCategoryIcon = (type: string) => {
    const Icon = categoryIcons[type as keyof typeof categoryIcons] || Clock;
    return Icon;
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">History</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your recent queries and activities
            </p>
          </div>
          {history.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearHistory}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-12 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No History Yet</h3>
              <p className="text-sm text-muted-foreground">
                Your queries and activities will appear here
              </p>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => {
              const Icon = getCategoryIcon(item.type || 'chat');
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-5 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-semibold text-base line-clamp-1">
                            {item.query}
                          </h3>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {item.type || 'query'}
                          </Badge>
                        </div>
                        
                        {item.preview && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {item.preview}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(item.timestamp).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          
                          <Button variant="ghost" size="sm" className="gap-2">
                            <RotateCcw className="h-3 w-3" />
                            View Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
