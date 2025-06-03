'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Shield
} from 'lucide-react';

interface OTPVerificationProps {
  phoneNumber: string;
  purpose: 'TRANSACTION_COMPLETION' | 'USER_VERIFICATION' | 'PAYMENT_CONFIRMATION' | 'VENDOR_RECEIPT_CONFIRMATION';
  transactionId?: string;
  amount?: number;
  onSuccess: (otp: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  phoneNumber,
  purpose,
  transactionId,
  amount,
  onSuccess,
  onCancel,
  isLoading = false
}) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [error, setError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  useEffect(() => {
    // Auto-focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste scenarios
      const pastedCode = value.slice(0, 6);
      const newOtp = [...otp];
      for (let i = 0; i < pastedCode.length && i < 6; i++) {
        newOtp[i] = pastedCode[i];
      }
      setOtp(newOtp);
      
      if (pastedCode.length === 6) {
        handleVerifyOTP(newOtp.join(''));
      }
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerifyOTP(newOtp.join(''));
    }

    setError('');
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpCode: string) => {
    if (otpCode.length !== 6) {
      setError('Please enter a complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // Mock API call - backend will implement actual OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // Mock verification logic
      if (otpCode === '123456') {
        onSuccess(otpCode);
      } else {
        setError('Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      // Mock API call - backend will implement actual OTP resend
      console.log(`Resending OTP to ${phoneNumber} for ${purpose}`);
      
      setTimeLeft(30);
      setIsResendDisabled(true);
      setError('');
      setOtp(['', '', '', '', '', '']);
      
      // Reset focus to first input
      inputRefs.current[0]?.focus();
      
      // Show success message temporarily
      setError('OTP sent successfully!');
      setTimeout(() => setError(''), 3000);
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  const getPurposeTitle = () => {
    switch (purpose) {
      case 'TRANSACTION_COMPLETION':
        return 'Complete Transaction';
      case 'USER_VERIFICATION':
        return 'Verify Your Identity';
      case 'PAYMENT_CONFIRMATION':
        return 'Confirm Payment';
      case 'VENDOR_RECEIPT_CONFIRMATION':
        return 'Confirm Device Receipt';
      default:
        return 'Verify OTP';
    }
  };

  const getPurposeDescription = () => {
    switch (purpose) {
      case 'TRANSACTION_COMPLETION':
        return `Confirm transaction${amount ? ` of ₹${amount.toLocaleString()}` : ''} completion`;
      case 'USER_VERIFICATION':
        return 'Verify your identity to continue';
      case 'PAYMENT_CONFIRMATION':
        return `Confirm payment${amount ? ` of ₹${amount.toLocaleString()}` : ''} authorization`;
      case 'VENDOR_RECEIPT_CONFIRMATION':
        return `Confirm receipt of device${amount ? ` worth ₹${amount.toLocaleString()}` : ''} from agent`;
      default:
        return 'Enter the verification code sent to your phone';
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (phone.length > 6) {
      return `${phone.slice(0, -4).replace(/./g, '*')}${phone.slice(-4)}`;
    }
    return phone;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-xl">{getPurposeTitle()}</CardTitle>
          <CardDescription className="text-center">
            {getPurposeDescription()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Phone Number Display */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              OTP sent to{' '}
              <span className="font-medium">{formatPhoneNumber(phoneNumber)}</span>
            </p>
            <div className="flex items-center justify-center mt-2">
              <MessageCircle className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-xs text-green-600">via WhatsApp</span>
            </div>
          </div>

          {/* Transaction Details (if applicable) */}
          {(purpose === 'TRANSACTION_COMPLETION' || purpose === 'PAYMENT_CONFIRMATION') && amount && (
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-600">Amount</p>
              <p className="text-lg font-semibold text-blue-600">₹{amount.toLocaleString()}</p>
              {transactionId && (
                <p className="text-xs text-gray-500 mt-1">ID: {transactionId}</p>
              )}
            </div>
          )}

          {/* OTP Input Fields */}
          <div className="space-y-4">
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  disabled={isLoading || isVerifying}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant={error.includes('success') ? 'default' : 'destructive'}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Timer and Resend */}
          <div className="text-center space-y-3">
            {isResendDisabled ? (
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>Resend OTP in {timeLeft}s</span>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResendOTP}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Resend OTP
              </Button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading || isVerifying}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleVerifyOTP(otp.join(''))}
              disabled={isLoading || isVerifying || otp.some(digit => digit === '')}
              className="flex-1"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify
                </>
              )}
            </Button>
          </div>

          {/* Security Notice */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              🔒 Your OTP is secure and expires in 10 minutes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerification; 