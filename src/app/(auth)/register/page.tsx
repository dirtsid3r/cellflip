'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  User, 
  Store, 
  Truck, 
  MapPin, 
  ArrowRight, 
  CheckCircle,
  Smartphone
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TestAuthService } from '@/lib/test-auth';

type RegistrationStep = 'role' | 'details' | 'verification' | 'welcome';
type UserRole = 'CLIENT' | 'VENDOR' | 'AGENT';

const roleOptions = [
  {
    id: 'CLIENT' as const,
    title: 'Individual Seller',
    description: 'Sell your mobile devices through transparent bidding',
    icon: User,
    benefits: ['Get fair market price', 'Zero listing fees', 'Doorstep pickup'],
    color: 'bg-primary/10 border-primary/20 text-primary'
  },
  {
    id: 'VENDOR' as const,
    title: 'Business Buyer', 
    description: 'Purchase devices from verified sellers across Kerala',
    icon: Store,
    benefits: ['Access quality inventory', 'Transparent pricing', 'Verified devices'],
    color: 'bg-success/10 border-success/20 text-success'
  },
  {
    id: 'AGENT' as const,
    title: 'Pickup Agent',
    description: 'Earn by facilitating device verification and pickup',
    icon: Truck,
    benefits: ['Flexible schedule', 'Good earnings', 'Kerala-wide opportunities'],
    color: 'bg-dark/10 border-dark/20 text-dark'
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
};

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<RegistrationStep>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    businessName: '', // for vendors
    city: 'Thiruvananthapuram' // default Kerala city
  });
  const [verificationId, setVerificationId] = useState('');
  const [otp, setOtp] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('details');
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setIsLoading(true);
    try {
      // Register the user
      const response = await TestAuthService.registerUser({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        role: selectedRole,
        email: formData.email
      });

      if (response.success) {
        // Send OTP for verification
        const otpResponse = await TestAuthService.loginWithWhatsApp(formData.phoneNumber);
        if (otpResponse.success && otpResponse.data) {
          setVerificationId(otpResponse.data.verificationId);
          setStep('verification');
        }
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await TestAuthService.verifyWhatsAppOTP(
        verificationId, 
        otp, 
        formData.phoneNumber
      );

      if (response.success) {
        // Store user data
        localStorage.setItem('cellflip_user', JSON.stringify(response.data!.user));
        localStorage.setItem('cellflip_auth_token', response.data!.token);
        setStep('welcome');
        
        // Redirect to appropriate dashboard after 3 seconds
        setTimeout(() => {
          const dashboardMap = {
            'CLIENT': '/dashboard',
            'VENDOR': '/vendor/dashboard', 
            'AGENT': '/agent/dashboard'
          };
          router.push(dashboardMap[selectedRole!]);
        }, 3000);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      alert('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <motion.div {...fadeInUp}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Smartphone className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-display-md font-bold">
          Join Cellflip
        </CardTitle>
        <CardDescription className="text-body">
          Choose how you want to use Kerala's premier mobile resale platform
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {roleOptions.map((role, index) => {
          const IconComponent = role.icon;
          return (
            <motion.button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className="w-full p-6 rounded-xl border-2 border-border hover:border-primary/30 bg-background hover:bg-primary/5 transition-all duration-200 text-left group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${role.color}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {role.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {role.benefits.map((benefit, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </motion.button>
          );
        })}
        
        <div className="pt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Login here
            </Link>
          </p>
        </div>
      </CardContent>
    </motion.div>
  );

  const renderDetailsForm = () => (
    <motion.div {...fadeInUp}>
      <CardHeader className="text-center">
        <CardTitle className="text-display-md font-bold">
          Your Details
        </CardTitle>
        <CardDescription>
          {selectedRole === 'CLIENT' && 'Tell us about yourself to get started'}
          {selectedRole === 'VENDOR' && 'Set up your business profile'}
          {selectedRole === 'AGENT' && 'Complete your agent profile'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleDetailsSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter your full name"
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">WhatsApp Number</Label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-muted-foreground text-sm">+91</span>
              </div>
              <Input
                id="phone"
                type="tel"
                value={formData.phoneNumber.replace('+91', '')}
                onChange={(e) => setFormData({...formData, phoneNumber: `+91${e.target.value.replace(/\D/g, '')}`})}
                placeholder="9876543210"
                className="pl-12"
                maxLength={10}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="your.email@example.com"
              className="mt-1"
            />
          </div>

          {selectedRole === 'VENDOR' && (
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                placeholder="Your business name"
                className="mt-1"
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              placeholder="Your city in Kerala"
              className="mt-1"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep('role')} 
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Creating Account...' : 'Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </motion.div>
  );

  const renderVerification = () => (
    <motion.div {...fadeInUp}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
          <MessageCircle className="h-6 w-6 text-success" />
        </div>
        <CardTitle className="text-display-md font-bold">
          Verify Your Number
        </CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to {formData.phoneNumber}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleOTPVerification} className="space-y-4">
          <div>
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="mt-1 text-center text-lg tracking-widest"
              maxLength={6}
              required
            />
            <p className="text-sm text-muted-foreground mt-2">
              For testing, use: <code className="bg-muted px-2 py-1 rounded">123456</code>
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || otp.length !== 6}
            className="w-full"
          >
            {isLoading ? 'Verifying...' : 'Verify & Complete Registration'}
          </Button>
        </form>
      </CardContent>
    </motion.div>
  );

  const renderWelcome = () => (
    <motion.div {...fadeInUp}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
          <CheckCircle className="h-6 w-6 text-success" />
        </div>
        <CardTitle className="text-display-md font-bold">
          Welcome to Cellflip!
        </CardTitle>
        <CardDescription>
          Your account has been created successfully
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">You're signed up as:</p>
          <Badge variant="secondary" className="text-sm">
            {selectedRole === 'CLIENT' && 'Individual Seller'}
            {selectedRole === 'VENDOR' && 'Business Buyer'}
            {selectedRole === 'AGENT' && 'Pickup Agent'}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Redirecting to your dashboard...
        </p>
      </CardContent>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-lg shadow-soft">
        {step === 'role' && renderRoleSelection()}
        {step === 'details' && renderDetailsForm()}
        {step === 'verification' && renderVerification()}
        {step === 'welcome' && renderWelcome()}
      </Card>
    </div>
  );
} 