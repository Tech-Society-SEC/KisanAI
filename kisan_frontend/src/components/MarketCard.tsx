import { TrendingUp, TrendingDown, Volume2, Save, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarketPrice } from '@/lib/types';
import { SpeechSynthesisService } from '@/lib/speech';
import { cn } from '@/lib/utils';

interface MarketCardProps {
  data: MarketPrice;
  compact?: boolean;
  onSave?: () => void;
}

const ttsService = new SpeechSynthesisService();

export function MarketCard({ data, compact = false, onSave }: MarketCardProps) {
  const trendPercent = Math.abs(data.trend).toFixed(2);
  const isUp = data.trend > 0;
  const isStable = Math.abs(data.trend) < 2;

  const getRecommendation = () => {
    if (data.today >= data.yesterday * 1.02) return "Good time to sell";
    if (data.today <= data.yesterday * 0.98) return "Wait — price down";
    return "Stable — sell if you need cash";
  };

  const handlePlayVoice = () => {
    const summary = `${data.crop} price today in ${data.market.split(',')[0]}: ₹${data.today} per quintal, ${isUp ? 'up' : 'down'} ${trendPercent}% from yesterday. Recommendation: ${getRecommendation()}.`;
    ttsService.speak(summary);
  };

  if (compact) {
    return (
      <Card className="p-3 bg-card">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold capitalize">{data.crop}</h4>
          <Badge variant={isUp ? "default" : "destructive"} className="text-xs">
            {isUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {trendPercent}%
          </Badge>
        </div>
        <p className="text-2xl font-bold">₹{data.today}</p>
        <p className="text-xs text-muted-foreground">{getRecommendation()}</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold capitalize">{data.crop}</h3>
          <Badge 
            variant={isUp ? "default" : "destructive"}
            className={cn(isStable && "bg-muted text-muted-foreground")}
          >
            {isUp ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {trendPercent}%
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{data.market}</p>
      </div>

      {/* Price display */}
      <div className="space-y-2">
        <div>
          <p className="text-sm text-muted-foreground">Today's Price</p>
          <p className="text-4xl font-bold text-foreground">₹{data.today}</p>
          <p className="text-sm text-muted-foreground">{data.unit}</p>
        </div>

        <div className="flex gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Yesterday</p>
            <p className="font-semibold">₹{data.yesterday}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Change</p>
            <p className={cn(
              "font-semibold",
              isUp ? "text-success" : "text-destructive"
            )}>
              {isUp ? '+' : ''}{data.trend.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* 7-day sparkline */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Last 7 Days Trend</p>
        <div className="relative h-16 flex items-end gap-0.5">
          {data.last7.map((price, i) => {
            const max = Math.max(...data.last7);
            const min = Math.min(...data.last7);
            const range = max - min || 1;
            const height = Math.max(((price - min) / range) * 100, 10);
            const isToday = i === data.last7.length - 1;
            
            return (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-t transition-all hover:opacity-80",
                  isToday ? "bg-primary" : "bg-primary/60"
                )}
                style={{ height: `${height}%` }}
                title={`${isToday ? 'Today' : `${7-i} days ago`}: ₹${price}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>7 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Recommendation */}
      <div className="p-3 bg-accent/10 rounded-lg">
        <p className="text-sm font-medium">Recommendation</p>
        <p className="text-sm text-muted-foreground">{getRecommendation()}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2">
        <Button onClick={handlePlayVoice} variant="outline" size="sm">
          <Volume2 className="h-4 w-4 mr-2" />
          Play Voice
        </Button>

        <Button variant="outline" size="sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          7-Day Chart
        </Button>

        {onSave && (
          <Button onClick={onSave} variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Alert
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Updated {new Date(data.timestamp).toLocaleString()}
      </p>
    </Card>
  );
}
