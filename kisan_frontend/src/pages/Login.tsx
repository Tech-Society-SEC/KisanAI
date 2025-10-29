import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getProfile } from '@/lib/storage';
import { FloatingMic } from '@/components/FloatingMic';
import { ChatPopup } from '@/components/ChatPopup';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSendOtp = () => {
    if (!mobile) {
      toast({ title: "Please enter mobile number", variant: "destructive" });
      return;
    }
    
    // Mock OTP sending
    toast({ 
      title: "OTP Sent!", 
      description: "Demo OTP: 111111",
    });
    setOtpSent(true);
  };

  const handleLogin = () => {
    if (!otp) {
      toast({ title: "Please enter OTP", variant: "destructive" });
      return;
    }

    // Mock OTP validation
    if (otp !== '111111') {
      toast({ 
        title: "Invalid OTP", 
        description: "Demo OTP is: 111111",
        variant: "destructive" 
      });
      return;
    }

    // Check if user has completed onboarding
    const profile = getProfile();
    
    if (!profile || !profile.name || !profile.state) {
      toast({ 
        title: "Profile Incomplete", 
        description: "Please complete your profile setup",
      });
      navigate('/onboarding');
      return;
    }

    toast({ title: "Login successful!", description: `Welcome back, ${profile.name}!` });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center p-4 relative">
      <FloatingMic 
        onClick={() => setIsChatOpen(true)}
        hasMessages={false}
      />
      
      <ChatPopup
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onImageUpload={() => {}}
      />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-6xl opacity-30"
        >
          🌾
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 right-20 text-5xl opacity-30"
        >
          🌻
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/landing')}
          className="mb-4 hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="p-8 space-y-6 shadow-2xl border-2 hover:border-primary/20 transition-all bg-gradient-to-br from-card via-card to-primary/5">
          {/* Logo */}
          <div className="text-center space-y-2">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl mb-4"
            >
              🌾
            </motion.div>
            <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
            <p className="text-muted-foreground">Login to continue to Kisan+</p>
          </div>

          {!otpSent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter your mobile number"
                  className="text-lg py-6"
                />
              </div>

              <Button 
                onClick={handleSendOtp} 
                className="w-full py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-102"
              >
                Send OTP
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Demo: Any mobile number works. OTP is always 111111
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="text-lg py-6 text-center tracking-widest"
                />
                <p className="text-xs text-muted-foreground text-center">
                  OTP sent to {mobile}
                </p>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleLogin} 
                  className="w-full py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-102"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Login
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                  }}
                  className="w-full hover:bg-muted"
                >
                  Change Mobile Number
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Demo OTP: 111111
              </p>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
