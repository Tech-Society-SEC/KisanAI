import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveProfile } from '@/lib/storage';
import { UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { CropSelectModal } from '@/components/CropSelectModal';
import { FloatingMic } from '@/components/FloatingMic';
import { ChatPopup } from '@/components/ChatPopup';

const STATES = ['Karnataka', 'Maharashtra', 'Tamil Nadu', 'Kerala', 'Punjab', 'Haryana'];
const CROPS = ['Rice', 'Wheat', 'Tomato', 'Potato', 'Onion', 'Sugarcane', 'Cotton', 'Maize'];
const LANGUAGES = ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Marathi'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    mobile: '',
    village: '',
    district: '',
    state: '',
    landSize: '',
    mainCrops: [],
    language: 'English',
    useDemoData: true
  });

  const handleCropToggle = (crop: string) => {
    if (crop === 'Other') {
      setIsCropModalOpen(true);
      return;
    }
    setFormData(prev => ({
      ...prev,
      mainCrops: prev.mainCrops?.includes(crop)
        ? prev.mainCrops.filter(c => c !== crop)
        : [...(prev.mainCrops || []), crop]
    }));
  };

  const handleSendOtp = () => {
    if (!formData.mobile) {
      toast({ title: "Please enter mobile number", variant: "destructive" });
      return;
    }
    toast({ 
      title: "OTP Sent!", 
      description: "Demo OTP: 111111",
    });
    setOtpSent(true);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.mobile) {
        toast({ title: "Please fill all fields", variant: "destructive" });
        return;
      }
      if (!otpSent) {
        toast({ title: "Please send OTP first", variant: "destructive" });
        return;
      }
      if (otp !== '111111') {
        toast({ 
          title: "Invalid OTP", 
          description: "Demo OTP is: 111111",
          variant: "destructive" 
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.state || !formData.district) {
        toast({ title: "Please select location", variant: "destructive" });
        return;
      }
      setStep(3);
    } else {
      if (!formData.mainCrops || formData.mainCrops.length === 0) {
        toast({ title: "Please select at least one crop", variant: "destructive" });
        return;
      }
      
      saveProfile(formData as UserProfile);
      toast({ title: "Profile saved!", description: "Welcome to Kisan+" });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <FloatingMic 
        onClick={() => setIsChatOpen(true)}
        hasMessages={false}
      />
      
      <ChatPopup
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onImageUpload={() => {}}
      />

      <CropSelectModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        selectedCrops={formData.mainCrops || []}
        onCropsChange={(crops) => setFormData(prev => ({ ...prev, mainCrops: crops }))}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 space-y-6 shadow-2xl border-2 hover:border-primary/20 transition-all bg-gradient-to-br from-card via-card to-primary/5">
          {/* Logo & title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-primary">Kisan+</h1>
            <p className="text-muted-foreground">Your Farming Assistant</p>
          </div>

          {/* Progress */}
          <div className="flex gap-2">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={e => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                    placeholder="Enter mobile number"
                    className="flex-1"
                    disabled={otpSent}
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleSendOtp}
                    disabled={otpSent || !formData.mobile}
                  >
                    {otpSent ? 'Sent' : 'Send OTP'}
                  </Button>
                </div>
              </div>

              {otpSent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="text-center tracking-widest"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Demo OTP: 111111
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  value={formData.state}
                  onValueChange={val => setFormData(prev => ({ ...prev, state: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={e => setFormData(prev => ({ ...prev, district: e.target.value }))}
                  placeholder="Enter district"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="village">Village</Label>
                <Input
                  id="village"
                  value={formData.village}
                  onChange={e => setFormData(prev => ({ ...prev, village: e.target.value }))}
                  placeholder="Enter village"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="land">Land Size (acres)</Label>
                <Input
                  id="land"
                  value={formData.landSize}
                  onChange={e => setFormData(prev => ({ ...prev, landSize: e.target.value }))}
                  placeholder="e.g., 2.5"
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Crops & Language */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Main Crops (select multiple)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CROPS.map(crop => (
                    <label
                      key={crop}
                      className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-muted"
                    >
                      <Checkbox
                        checked={formData.mainCrops?.includes(crop)}
                        onCheckedChange={() => handleCropToggle(crop)}
                      />
                      <span className="text-sm">{crop}</span>
                    </label>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCropModalOpen(true)}
                    className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-muted border-dashed border-primary/50 hover:border-primary transition-colors"
                  >
                    <span className="text-sm font-medium text-primary">+ Other</span>
                  </button>
                </div>
                {formData.mainCrops && formData.mainCrops.length > CROPS.length && (
                  <p className="text-xs text-muted-foreground">
                    {formData.mainCrops.length - CROPS.length} additional crop{formData.mainCrops.length - CROPS.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Preferred Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={val => setFormData(prev => ({ ...prev, language: val }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1"
            >
              {step === 3 ? 'Get Started' : 'Next'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
