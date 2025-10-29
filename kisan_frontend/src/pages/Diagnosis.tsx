import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, Upload, Image as ImageIcon, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DiagnosisCard } from '@/components/DiagnosisCard';
import { DiagnosisResult } from '@/lib/types';
import { saveToHistory } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import earlyBlightImg from '@/assets/early-blight.jpg';
import yellowLeafSpotImg from '@/assets/yellow-leaf-spot.jpg';

// Top Indian crops
const CROPS = [
  'Tomato', 'Rice', 'Wheat', 'Maize', 'Cotton', 
  'Sugarcane', 'Onion', 'Potato', 'Paddy', 'Groundnut'
];

// Sample diagnosis data for demo
const SAMPLE_DIAGNOSES: Record<string, DiagnosisResult> = {
  'Early Blight': {
    disease: 'Early Blight',
    scientific: 'Alternaria solani',
    confidence: 0.89,
    status: 'high',
    advice: [
      'Remove and destroy infected leaves immediately',
      'Apply copper-based fungicide every 7-10 days',
      'Ensure proper spacing between plants for air circulation'
    ],
    timestamp: new Date().toISOString(),
    image: earlyBlightImg
  },
  'Yellow Leaf Spot': {
    disease: 'Yellow Leaf Spot',
    scientific: 'Mycosphaerella musicola',
    confidence: 0.76,
    status: 'medium',
    advice: [
      'Remove affected leaves to prevent spread',
      'Improve drainage and reduce overhead watering',
      'Apply potassium-rich fertilizer to strengthen plants'
    ],
    timestamp: new Date().toISOString(),
    image: yellowLeafSpotImg
  }
};

export default function Diagnosis() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [diagnosisCards, setDiagnosisCards] = useState<DiagnosisResult[]>([]);

  useEffect(() => {
    // Handle image passed from chat
    const file = location.state?.file;
    if (file) {
      handleFile(file);
    }
  }, [location.state]);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setSelectedImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !selectedCrop) {
      toast({ 
        title: "Missing information", 
        description: "Please select a crop first",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API delay for demo
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Use sample data for demo
    const sampleKeys = Object.keys(SAMPLE_DIAGNOSES);
    const randomSample = SAMPLE_DIAGNOSES[sampleKeys[Math.floor(Math.random() * sampleKeys.length)]];
    
    const newDiagnosis: DiagnosisResult = {
      ...randomSample,
      image: selectedImage,
      timestamp: new Date().toISOString()
    };

    // Add to diagnosis cards array
    setDiagnosisCards(prev => [...prev, newDiagnosis]);

    // Save to history
    saveToHistory({
      id: Date.now().toString(),
      query: `${selectedCrop} diagnosis`,
      type: 'diagnosis',
      timestamp: new Date().toISOString(),
      preview: newDiagnosis.disease,
      data: newDiagnosis
    });

    toast({ 
      title: newDiagnosis.status === 'high' ? "✓ High confidence" : "⚠ Medium confidence",
      description: newDiagnosis.disease
    });

    setIsAnalyzing(false);
    setSelectedImage(null);
    setSelectedCrop('');
  };

  const handleUseSample = async (sampleData: DiagnosisResult) => {
    setIsAnalyzing(true);
    
    // Simulate API delay for realistic demo
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newDiagnosis = {
      ...sampleData,
      timestamp: new Date().toISOString()
    };

    setDiagnosisCards(prev => [...prev, newDiagnosis]);

    // Save to history
    saveToHistory({
      id: Date.now().toString(),
      query: 'Sample crop diagnosis',
      type: 'diagnosis',
      timestamp: new Date().toISOString(),
      preview: sampleData.disease,
      data: newDiagnosis
    });

    toast({ 
      title: sampleData.status === 'high' ? "✓ High confidence" : "⚠ Medium confidence",
      description: sampleData.disease
    });

    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">Crop Diagnosis</h1>
          <p className="text-muted-foreground">Select crop and upload image for AI analysis</p>
        </div>

        {/* Crop Selection */}
        <Card className="mb-6 p-4">
          <label className="text-sm font-medium mb-2 block">Select Your Crop</label>
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose crop type..." />
            </SelectTrigger>
            <SelectContent>
              {CROPS.map(crop => (
                <SelectItem key={crop} value={crop}>{crop}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {diagnosisCards.length === 0 ? (
          <div className="space-y-6">
            {/* Image preview or upload */}
            {selectedImage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="p-4">
                  <img 
                    src={selectedImage} 
                    alt="Selected crop" 
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="flex-1"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze Image'
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedImage(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Card 
                  className="p-8 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Take Photo</h3>
                      <p className="text-sm text-muted-foreground">
                        Capture image of affected crop
                      </p>
                    </div>
                  </div>
                </Card>

                <Card 
                  className="p-8 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Upload Photo</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose from gallery
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Demo Cards Section */}
                <div className="space-y-4 mt-8">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Try Sample Diagnoses</h3>
                    <p className="text-sm text-muted-foreground">
                      Click on a sample to see instant diagnosis
                    </p>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.values(SAMPLE_DIAGNOSES).map((sample, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                          onClick={() => handleUseSample(sample)}
                        >
                          <CardContent className="p-4">
                            <img 
                              src={sample.image} 
                              alt={sample.disease}
                              className="w-full h-40 object-cover rounded-lg mb-3"
                            />
                            <div className="space-y-2">
                              <div>
                                <h4 className="font-semibold text-lg">{sample.disease}</h4>
                                <p className="text-xs text-muted-foreground">{sample.scientific}</p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <div className="text-xs font-medium">
                                  Confidence: {Math.round(sample.confidence * 100)}%
                                </div>
                                <div className={`h-2 w-2 rounded-full ${
                                  sample.status === 'high' ? 'bg-success' :
                                  sample.status === 'medium' ? 'bg-warning' : 'bg-destructive'
                                }`} />
                              </div>

                              <div className="text-xs space-y-1 text-muted-foreground">
                                {sample.advice.slice(0, 2).map((advice, i) => (
                                  <div key={i}>• {advice}</div>
                                ))}
                              </div>

                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full mt-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUseSample(sample);
                                }}
                              >
                                View Full Diagnosis
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p>📸 Tips for best results:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Clear, well-lit photo</li>
                    <li>• Focus on affected leaves/fruit</li>
                    <li>• Avoid blurry images</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Analysis animation */}
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-background/95 flex items-center justify-center z-50"
              >
                <Card className="p-8 text-center space-y-4 max-w-sm mx-4">
                  <div className="relative h-32 w-32 mx-auto">
                    <div className="absolute inset-0 animate-scan border-t-2 border-primary rounded-full" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 text-primary">
                        🌿
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Analyzing Image</h3>
                    <p className="text-sm text-muted-foreground">
                      AI is examining your crop...
                    </p>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3 }}
                    />
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Display all diagnosis cards */}
            <div className="grid gap-4 md:grid-cols-2">
              {diagnosisCards.map((diagnosis, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <img 
                        src={diagnosis.image} 
                        alt={diagnosis.disease}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg">{diagnosis.disease}</h3>
                            <p className="text-xs text-muted-foreground">{diagnosis.scientific}</p>
                          </div>
                          <Badge 
                            variant={diagnosis.status === 'high' ? 'default' : 'secondary'}
                            className="flex items-center gap-1"
                          >
                            {diagnosis.status === 'high' ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <AlertTriangle className="h-3 w-3" />
                            )}
                            {Math.round(diagnosis.confidence * 100)}%
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm font-medium">Treatment Plan:</p>
                          {diagnosis.advice.map((advice, i) => (
                            <p key={i} className="text-xs text-muted-foreground">• {advice}</p>
                          ))}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1"
                            onClick={() => toast({ title: "Saved to history!" })}
                          >
                            Save
                          </Button>
                          <Button 
                            size="sm"
                            className="flex-1"
                            onClick={() => toast({ title: "Opening full report..." })}
                          >
                            View Full Report
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setDiagnosisCards([]);
                setSelectedImage(null);
                setSelectedCrop('');
              }}
              className="w-full"
            >
              Start New Diagnosis
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </main>
    </div>
  );
}
