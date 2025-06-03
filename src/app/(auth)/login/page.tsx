'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, AlertCircle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { apiService } from '@/lib/api';
import { User } from '@/types';

interface FormError {
  field: string;
  message: string;
}

interface WhatsAppState {
  verificationId?: string;
  step: 'phone' | 'otp';
}

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormError[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  // WhatsApp login state
  const [whatsAppState, setWhatsAppState] = useState<WhatsAppState>({
    step: 'phone'
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  /**
   * Clear all errors and messages
   */
  const clearMessages = () => {
    setErrors([]);
    setSuccessMessage('');
  };

  /**
   * Add error message
   */
  const addError = (field: string, message: string) => {
    setErrors(prev => [...prev.filter(e => e.field !== field), { field, message }]);
  };

  /**
   * Get field-specific error
   */
  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  /**
   * Handle WhatsApp phone number submission
   */
  const handleWhatsAppPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!phoneNumber) {
      addError('phone', 'Phone number is required');
      return;
    }

    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length !== 10) {
      addError('phone', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);

    try {
      // Store phone number for test auth (add +91 prefix)
      const normalizedPhone = `+91${cleanNumber}`;
      apiService.storeLoginPhone(normalizedPhone);
      
      const response = await apiService.loginWithWhatsApp(normalizedPhone);
      
      if (response.success && response.data) {
        setWhatsAppState({
          verificationId: response.data.verificationId,
          step: 'otp'
        });
        setSuccessMessage('Verification code sent to your WhatsApp!');
      } else {
        addError('phone', response.message || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('WhatsApp login error:', error);
      addError('general', 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle WhatsApp OTP verification
   */
  const handleWhatsAppOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!otp) {
      addError('otp', 'Verification code is required');
      return;
    }
    if (otp.length !== 6) {
      addError('otp', 'Please enter a 6-digit verification code');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiService.verifyWhatsAppOTP(whatsAppState.verificationId!, otp);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store authentication data
        localStorage.setItem('cellflip_auth_token', token);
        localStorage.setItem('cellflip_user', JSON.stringify(user));
        
        setSuccessMessage('WhatsApp login successful! Redirecting...');
        
        // Redirect based on user role
        setTimeout(() => {
          switch (user.role) {
            case 'AGENT':
              router.push('/agent/dashboard');
              break;
            case 'VENDOR':
              router.push('/vendor/dashboard');
              break;
            case 'ADMIN':
              router.push('/admin/dashboard');
              break;
            default:
              router.push('/dashboard');
          }
        }, 1500);
        
      } else {
        addError('otp', response.message || 'Invalid verification code');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      addError('general', 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Reset WhatsApp flow to start over
   */
  const resetWhatsAppFlow = () => {
    setWhatsAppState({ step: 'phone' });
    setPhoneNumber('');
    setOtp('');
    clearMessages();
  };

  /**
   * Handle phone number input - only allow digits, max 10
   */
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-green-600 text-white">
              <MessageCircle className="h-6 w-6" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome to Cellflip</h2>
          <p className="mt-2 text-gray-600">
            Sign in with your WhatsApp number to continue
          </p>
        </div>

        {/* Error Messages */}
        {errors.some(e => e.field === 'general') && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {getFieldError('general')}
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* WhatsApp Login Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">
                {whatsAppState.step === 'phone' ? 'Enter Phone Number' : 'Verify OTP'}
              </CardTitle>
              {whatsAppState.step === 'otp' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetWhatsAppFlow}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
            </div>
            <CardDescription>
              {whatsAppState.step === 'phone' 
                ? 'We&apos;ll send a verification code to your WhatsApp'
                : `Enter the 6-digit code sent to +91${phoneNumber}`
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {whatsAppState.step === 'phone' ? (
              <form onSubmit={handleWhatsAppPhone} className="space-y-4">
                <div>
                  <Label htmlFor="phoneNumber">WhatsApp Number</Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">+91</span>
                    </div>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      placeholder="9876543210"
                      maxLength={10}
                      className={`pl-12 ${getFieldError('phone') ? 'border-red-300' : ''}`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {getFieldError('phone') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleWhatsAppOTP} className="space-y-4">
                <div>
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    className={`text-center text-lg tracking-widest ${getFieldError('otp') ? 'border-red-300' : ''}`}
                    disabled={isSubmitting}
                  />
                  {getFieldError('otp') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('otp')}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  disabled={isSubmitting || otp.length !== 6}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Verify & Sign In
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => handleWhatsAppPhone({ preventDefault: () => {} } as React.FormEvent)}
                    disabled={isSubmitting}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Didn&apos;t receive the code? Resend
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Registration Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link 
              href="/register" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Role Info */}
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">Signing up as:</p>
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="text-xs">Client (Sell Device)</Badge>
            <Badge variant="outline" className="text-xs">Vendor (Buy Device)</Badge>
            <Badge variant="outline" className="text-xs">Agent (Verify Device)</Badge>
          </div>
          <p className="text-xs text-gray-400">
            Role can be changed after registration
          </p>
        </div>
      </div>
    </div>
  );
} 