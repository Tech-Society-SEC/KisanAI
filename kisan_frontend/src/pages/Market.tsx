import { useState } from 'react';
import { Volume2, Filter, RefreshCw, TrendingUp, TrendingDown, Cloud, AlertTriangle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const PRICE_ALERTS = [
  {
    crop: 'Rice',
    message: 'Price increased by ₹100/quintal in last 3 days',
    trend: 'up',
    percentage: '+3.2%'
  },
  {
    crop: 'Wheat',
    message: 'Expected price rise next week due to procurement',
    trend: 'up',
    percentage: '+2.3%'
  },
  {
    crop: 'Cotton',
    message: 'High demand from textile industry',
    trend: 'up',
    percentage: '+5.6%'
  }
];

const MANDI_PRICES = [
  {
    crop: 'Rice',
    variety: 'Basmati',
    market: 'Delhi Mandi',
    currentPrice: 3200,
    previousPrice: 3100,
    change: 3.2
  },
  {
    crop: 'Wheat',
    variety: 'HD-2967',
    market: 'Haryana Mandi',
    currentPrice: 2150,
    previousPrice: 2200,
    change: -2.3
  },
  {
    crop: 'Cotton',
    variety: 'Shankar-6',
    market: 'Gujarat Mandi',
    currentPrice: 5800,
    previousPrice: 5600,
    change: 3.6
  },
  {
    crop: 'Sugarcane',
    variety: 'Co-238',
    market: 'UP Mandi',
    currentPrice: 350,
    previousPrice: 340,
    change: 2.9
  },
  {
    crop: 'Soybean',
    variety: 'JS-335',
    market: 'MP Mandi',
    currentPrice: 4200,
    previousPrice: 4300,
    change: -2.3
  }
];

export default function Market() {
  const [lastUpdated] = useState(new Date().toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  }));
  const [searchQuery, setSearchQuery] = useState('');
  const [trendFilter, setTrendFilter] = useState('all');
  const [showTopOnly, setShowTopOnly] = useState(false);

  const filteredPrices = MANDI_PRICES.filter(price => {
    const matchesSearch = price.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          price.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          price.market.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTrend = trendFilter === 'all' || 
                         (trendFilter === 'rising' && price.change > 0) ||
                         (trendFilter === 'falling' && price.change < 0) ||
                         (trendFilter === 'stable' && price.change === 0);
    
    return matchesSearch && matchesTrend;
  }).slice(0, showTopOnly ? 3 : undefined);

  const handleListen = () => {
    // Voice output for prices
    const speech = new SpeechSynthesisUtterance(
      `Current market prices: Rice is ${MANDI_PRICES[0].currentPrice} rupees per quintal, up ${MANDI_PRICES[0].change} percent`
    );
    window.speechSynthesis.speak(speech);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl space-y-4 sm:space-y-6 overflow-x-hidden">
        {/* Weather Alert */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <Cloud className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Heavy rain expected tomorrow. Prepare for harvesting.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Market Prices</h1>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crop, variety, or market..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <Select value={trendFilter} onValueChange={setTrendFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="All Trends" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trends</SelectItem>
                <SelectItem value="rising">Rising</SelectItem>
                <SelectItem value="falling">Falling</SelectItem>
                <SelectItem value="stable">Stable</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant={showTopOnly ? "default" : "outline"} 
              onClick={() => setShowTopOnly(!showTopOnly)}
              className="flex-1 sm:flex-none sm:whitespace-nowrap"
            >
              Top Crops
            </Button>
            <Button variant="outline" onClick={handleListen} className="flex-1 sm:flex-none">
              <Volume2 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Listen</span>
            </Button>
            <Button variant="outline" onClick={handleRefresh} className="flex-1 sm:flex-none">
              <RefreshCw className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Price Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-card via-card to-success/5">
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h2 className="text-xl font-bold">Price Alerts</h2>
            </div>
            <div className="space-y-3">
              {PRICE_ALERTS.map((alert, index) => (
                <motion.div
                  key={alert.crop}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-card border-2 border-success/20 hover:border-success/40 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <Badge className="bg-success text-white hover:bg-success px-3 py-1">
                      {alert.crop}
                    </Badge>
                    <p className="text-sm font-medium">{alert.message}</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-success/10 rounded-full">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm font-bold text-success">{alert.percentage}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Today's Mandi Prices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-card via-card to-primary/5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Today's Mandi Prices
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Last updated: {lastUpdated}
                </p>
              </div>
            </div>

            {/* Mobile list (no horizontal scroll) */}
            <div className="sm:hidden space-y-3">
              {filteredPrices.map((price, index) => (
                <motion.div
                  key={price.crop + price.variety}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <Card className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold">{price.crop}</h3>
                          <Badge variant="secondary" className="text-[10px]">{price.variety}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{price.market}</p>
                      </div>
                      <div className={
                        `flex items-center gap-1 px-2 py-0.5 rounded-full ${price.change > 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`
                      }>
                        {price.change > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span className="text-xs font-bold whitespace-nowrap">{price.change > 0 ? '+' : ''}{price.change}%</span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Current</p>
                        <p className="text-lg font-bold">₹{price.currentPrice.toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal">/q</span></p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Yesterday</p>
                        <p className="text-sm font-semibold">₹{price.previousPrice.toLocaleString()}</p>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {price.change > 0 ? 'Good time to sell' : 'Wait for better rates.'}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Table for sm+ screens */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[80px]">Crop</TableHead>
                    <TableHead className="min-w-[100px]">Variety</TableHead>
                    <TableHead className="min-w-[120px]">Market</TableHead>
                    <TableHead className="min-w-[120px]">Current Price</TableHead>
                    <TableHead className="min-w-[110px]">Previous</TableHead>
                    <TableHead className="min-w-[100px]">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrices.map((price, index) => (
                    <motion.tr
                      key={price.crop + price.variety}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="hover:bg-muted/30 transition-all duration-200"
                    >
                      <TableCell className="font-bold text-sm sm:text-base">{price.crop}</TableCell>
                      <TableCell className="text-muted-foreground font-medium text-xs sm:text-sm">{price.variety}</TableCell>
                      <TableCell className="text-muted-foreground text-xs sm:text-sm">{price.market}</TableCell>
                      <TableCell className="font-bold text-base sm:text-lg">
                        ₹{price.currentPrice.toLocaleString()}
                        <span className="text-xs text-muted-foreground font-normal"> /q</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-medium text-xs sm:text-sm">
                        ₹{price.previousPrice.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className={`${price.change > 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'} flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full`}>
                          {price.change > 0 ? (
                            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                          ) : (
                            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
                          )}
                          <span className="font-bold text-xs sm:text-sm whitespace-nowrap">
                            {price.change > 0 ? '+' : ''}{price.change}%
                          </span>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
