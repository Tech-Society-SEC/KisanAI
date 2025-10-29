import { useState } from 'react';
import { Search, Volume2, Cloud, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const CATEGORIES = [
  'All',
  'Income Support',
  'Insurance',
  'Credit',
  'Soil Management',
  'Organic Farming',
  'Water Management'
];

const SCHEMES_DATA = [
  {
    id: '1',
    title: 'PM-KISAN',
    category: 'Income Support',
    status: 'Active',
    description: 'Direct income support of ₹6000 per year to farmer families',
    benefits: '₹2000 every 4 months',
    eligibility: 'All landholding farmer families',
    deadline: '2024-03-31',
    location: 'All India'
  },
  {
    id: '2',
    title: 'Crop Insurance Scheme',
    category: 'Insurance',
    status: 'Registration Open',
    description: 'Pradhan Mantri Fasal Bima Yojana for crop protection',
    benefits: 'Up to ₹2 lakh insurance coverage',
    eligibility: 'All farmers growing notified crops',
    deadline: '2024-02-28',
    location: 'All India'
  },
  {
    id: '3',
    title: 'Kisan Credit Card',
    category: 'Credit',
    status: 'Active',
    description: 'Easy access to credit for agricultural needs',
    benefits: 'Credit up to ₹3 lakh at 4% interest',
    eligibility: 'Farmers with landholding/crop loan eligibility',
    deadline: '2024-12-31',
    location: 'All India'
  },
  {
    id: '4',
    title: 'Soil Health Card Scheme',
    category: 'Soil Management',
    status: 'Active',
    description: 'Free soil testing and health cards for farmers',
    benefits: 'Free soil testing every 2 years',
    eligibility: 'All farmers',
    deadline: '2024-06-30',
    location: 'All India'
  },
  {
    id: '5',
    title: 'Organic Farming Scheme',
    category: 'Organic Farming',
    status: 'Registration Open',
    description: 'Support for organic farming practices and certification',
    benefits: '₹50,000 per hectare support',
    eligibility: 'Farmers adopting organic practices',
    deadline: '2024-04-15',
    location: 'All India'
  },
  {
    id: '6',
    title: 'Drip Irrigation Subsidy',
    category: 'Water Management',
    status: 'Active',
    description: 'Financial assistance for micro irrigation systems',
    benefits: 'Up to 55% subsidy on drip irrigation',
    eligibility: 'Small and marginal farmers',
    deadline: '2024-05-30',
    location: 'All India'
  }
];

export default function Schemes() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSchemes = SCHEMES_DATA.filter(scheme => {
    const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
    const matchesSearch = scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVoicePlay = (scheme: typeof SCHEMES_DATA[0]) => {
    const speech = new SpeechSynthesisUtterance(
      `${scheme.title}. ${scheme.description}. Benefits: ${scheme.benefits}. Eligibility: ${scheme.eligibility}`
    );
    window.speechSynthesis.speak(speech);
    toast({ title: "Playing scheme details" });
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-foreground">Government Schemes</h1>
          <div className="flex gap-2 flex-1 max-w-md">
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search schemes..."
              className="flex-1"
            />
            <Button size="icon" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Schemes Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSchemes.map((scheme, index) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="p-6 h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card via-card to-primary/5 border-2">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-foreground">{scheme.title}</h3>
                    <Badge variant="outline" className="text-xs border-primary/30">
                      {scheme.category}
                    </Badge>
                  </div>
                  <div className="flex gap-2 items-start">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleVoicePlay(scheme)}
                      className="h-9 w-9 hover:bg-success/10"
                    >
                      <Volume2 className="h-4 w-4 text-success" />
                    </Button>
                    <Badge className={`${getStatusColor(scheme.status)} font-semibold`}>
                      {scheme.status}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  {scheme.description}
                </p>

                {/* Benefits */}
                <div className="mb-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
                  <p className="text-xs font-semibold text-warning mb-1 uppercase tracking-wide">Benefits</p>
                  <p className="text-base font-bold text-warning">{scheme.benefits}</p>
                </div>

                {/* Eligibility */}
                <div className="mb-5 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Eligibility</p>
                  <p className="text-sm font-medium">{scheme.eligibility}</p>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Deadline: {scheme.deadline}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">{scheme.location}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-success hover:bg-success/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => toast({ title: "Application opening soon!" })}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Apply Now
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredSchemes.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No schemes found matching your criteria</p>
          </Card>
        )}
      </main>
    </div>
  );
}
