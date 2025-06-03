'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft,
  MapPin,
  Phone,
  MessageCircle,
  Camera,
  Upload,
  CheckCircle,
  AlertTriangle,
  User,
  Smartphone,
  IndianRupee,
  Clock,
  Navigation,
  FileText,
  Star,
  Loader2
} from 'lucide-react';
import { User as UserType, DeviceCondition } from '@/types';
import { OTPVerification } from '@/components/features/OTPVerification';

interface PickupTransaction {
  id: string;
  listing: {
    id: string;
    brand: string;
    model: string;
    variant: string;
    condition: DeviceCondition;
    askingPrice: number;
    imei1: string;
    imei2?: string;
    photos: string[];
    description: string;
  };
  client: {
    id: string;
    name: string;
    whatsappNumber: string;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      landmark?: string;
    };
  };
  vendor: {
    id: string;
    name: string;
    businessName: string;
    whatsappNumber: string;
  };
  winningBid: {
    amount: number;
    placedAt: string;
  };
  status: string;
  scheduledAt: string;
  assignedAt: string;
}

interface Deduction {
  id: string;
  category: 'COSMETIC_DAMAGE' | 'FUNCTIONAL_ISSUE' | 'MISSING_ACCESSORIES' | 'CONDITION_MISMATCH' | 'OTHER';
  description: string;
  amount: number;
  severity: 'MINOR' | 'MODERATE' | 'MAJOR';
}

interface VerificationStep {
  id: string;
  title: string;
  completed: boolean;
  required: boolean;
}

export default function AgentPickupPage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params.transactionId as string;
  
  const [user, setUser] = useState<UserType | null>(null);
  const [transaction, setTransaction] = useState<PickupTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Verification data
  const [customerIdVerified, setCustomerIdVerified] = useState(false);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [idType, setIdType] = useState<'AADHAAR' | 'PAN' | 'DRIVING_LICENSE'>('AADHAAR');
  const [idNumber, setIdNumber] = useState('');
  
  // Device inspection
  const [devicePhotos, setDevicePhotos] = useState<File[]>([]);
  const [billPhoto, setBillPhoto] = useState<File | null>(null);
  const [packagingPhoto, setPackagingPhoto] = useState<File | null>(null);
  const [actualCondition, setActualCondition] = useState<DeviceCondition>('EXCELLENT');
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [functionalIssues, setFunctionalIssues] = useState<string[]>([]);
  const [physicalIssues, setPhysicalIssues] = useState<string[]>([]);
  const [accessoriesIncluded, setAccessoriesIncluded] = useState<string[]>([]);
  const [batteryHealth, setBatteryHealth] = useState<number>(100);
  
  // Deductions and final offer
  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [finalOffer, setFinalOffer] = useState<number>(0);
  const [showOTPModal, setShowOTPModal] = useState(false);
  
  // Mock transaction data
  const mockTransaction: PickupTransaction = {
    id: transactionId,
    listing: {
      id: 'listing_123',
      brand: 'Apple',
      model: 'iPhone 14',
      variant: '128GB',
      condition: 'EXCELLENT',
      askingPrice: 65000,
      imei1: '123456789012345',
      imei2: '123456789012346',
      photos: ['/device-photos/iphone14-1.jpg'],
      description: 'Excellent condition iPhone 14, barely used for 6 months. Original bill and warranty available.'
    },
    client: {
      id: 'client_123',
      name: 'Rajesh Kumar',
      whatsappNumber: '+919876543210',
      address: {
        street: 'TC 15/2890, Pattoor Road, Near Medical College',
        city: 'Thiruvananthapuram',
        state: 'Kerala',
        pincode: '695011',
        landmark: 'Opposite Sree Chitra Hospital'
      }
    },
    vendor: {
      id: 'vendor_123',
      name: 'Suresh Menon',
      businessName: 'Mobile Palace Thrissur',
      whatsappNumber: '+919876543211'
    },
    winningBid: {
      amount: 58000,
      placedAt: '2024-12-09T16:30:00Z'
    },
    status: 'AGENT_ASSIGNED',
    scheduledAt: '2024-12-10T14:00:00Z',
    assignedAt: '2024-12-10T10:00:00Z'
  };

  const verificationSteps: VerificationStep[] = [
    { id: 'navigation', title: 'Navigate to Customer', completed: false, required: true },
    { id: 'identity', title: 'Verify Customer Identity', completed: false, required: true },
    { id: 'inspection', title: 'Inspect Device', completed: false, required: true },
    { id: 'photos', title: 'Take Verification Photos', completed: false, required: true },
    { id: 'assessment', title: 'Condition Assessment', completed: false, required: true },
    { id: 'deductions', title: 'Calculate Deductions', completed: false, required: false },
    { id: 'offer', title: 'Generate Final Offer', completed: false, required: true },
    { id: 'acceptance', title: 'Customer Acceptance', completed: false, required: true }
  ];

  useEffect(() => {
    const initializePickup = async () => {
      try {
        // Check authentication
        const userData = localStorage.getItem('cellflip_user');
        if (!userData) {
          router.push('/login');
          return;
        }

        const currentUser: UserType = JSON.parse(userData);
        if (currentUser.role !== 'AGENT') {
          router.push('/dashboard');
          return;
        }

        setUser(currentUser);
        
        // In real implementation, fetch transaction data from API
        // const response = await apiService.getAgentTransaction(transactionId);
        setTransaction(mockTransaction);
        setFinalOffer(mockTransaction.winningBid.amount); // Initial offer equals winning bid
        
      } catch (error) {
        console.error('Failed to initialize pickup:', error);
        router.push('/agent/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    initializePickup();
  }, [transactionId, router]);

  const handleFileUpload = (files: FileList | null, type: 'id' | 'device' | 'bill' | 'packaging') => {
    if (!files) return;
    
    const file = files[0];
    
    switch (type) {
      case 'id':
        setIdDocument(file);
        break;
      case 'device':
        setDevicePhotos(prev => [...prev, ...Array.from(files)].slice(0, 4));
        break;
      case 'bill':
        setBillPhoto(file);
        break;
      case 'packaging':
        setPackagingPhoto(file);
        break;
    }
  };

  const calculateDeductions = () => {
    const newDeductions: Deduction[] = [];
    let totalDeduction = 0;

    // Condition mismatch deduction
    if (actualCondition !== transaction?.listing.condition) {
      const conditionDeduction = {
        id: 'condition_mismatch',
        category: 'CONDITION_MISMATCH' as const,
        description: `Actual condition is ${actualCondition}, listed as ${transaction?.listing.condition}`,
        amount: transaction?.winningBid.amount ? transaction.winningBid.amount * 0.1 : 0,
        severity: 'MODERATE' as const
      };
      newDeductions.push(conditionDeduction);
      totalDeduction += conditionDeduction.amount;
    }

    // Functional issues deductions
    functionalIssues.forEach((issue, index) => {
      const deduction = {
        id: `functional_${index}`,
        category: 'FUNCTIONAL_ISSUE' as const,
        description: issue,
        amount: transaction?.winningBid.amount ? transaction.winningBid.amount * 0.05 : 0,
        severity: 'MAJOR' as const
      };
      newDeductions.push(deduction);
      totalDeduction += deduction.amount;
    });

    // Physical issues deductions
    physicalIssues.forEach((issue, index) => {
      const deduction = {
        id: `physical_${index}`,
        category: 'COSMETIC_DAMAGE' as const,
        description: issue,
        amount: transaction?.winningBid.amount ? transaction.winningBid.amount * 0.03 : 0,
        severity: 'MINOR' as const
      };
      newDeductions.push(deduction);
      totalDeduction += deduction.amount;
    });

    // Missing accessories deductions
    if (accessoriesIncluded.length < 2) {
      const deduction = {
        id: 'missing_accessories',
        category: 'MISSING_ACCESSORIES' as const,
        description: 'Missing original accessories (charger, box)',
        amount: transaction?.winningBid.amount ? transaction.winningBid.amount * 0.05 : 0,
        severity: 'MODERATE' as const
      };
      newDeductions.push(deduction);
      totalDeduction += deduction.amount;
    }

    // Battery health deduction
    if (batteryHealth < 80) {
      const deduction = {
        id: 'battery_health',
        category: 'FUNCTIONAL_ISSUE' as const,
        description: `Battery health is ${batteryHealth}%`,
        amount: transaction?.winningBid.amount ? transaction.winningBid.amount * 0.08 : 0,
        severity: 'MAJOR' as const
      };
      newDeductions.push(deduction);
      totalDeduction += deduction.amount;
    }

    setDeductions(newDeductions);
    const newFinalOffer = (transaction?.winningBid.amount || 0) - totalDeduction;
    setFinalOffer(Math.max(newFinalOffer, 0));
  };

  const handleCompleteVerification = async () => {
    setIsSubmitting(true);
    
    try {
      // Calculate final deductions
      calculateDeductions();
      
      // Mock API call to complete verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Verification completed:', {
        transactionId,
        customerIdVerified,
        idType,
        idNumber,
        actualCondition,
        inspectionNotes,
        functionalIssues,
        physicalIssues,
        accessoriesIncluded,
        batteryHealth,
        deductions,
        finalOffer,
        verificationPhotos: devicePhotos.length,
        billPhoto: !!billPhoto,
        packagingPhoto: !!packagingPhoto
      });
      
      // Show OTP modal for customer acceptance
      setShowOTPModal(true);
      
    } catch (error) {
      console.error('Verification failed:', error);
      alert('Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomerOTPSuccess = async (otp: string) => {
    try {
      // Mock API call to confirm customer acceptance
      console.log('Customer accepted final offer with OTP:', otp);
      
      // Navigate to delivery workflow
      router.push(`/agent/delivery/${transactionId}`);
      
    } catch (error) {
      console.error('OTP verification failed:', error);
      alert('OTP verification failed. Please try again.');
    }
  };

  const openNavigation = () => {
    if (!transaction) return;
    
    const address = transaction.client.address;
    const query = encodeURIComponent(`${address.street}, ${address.city}, ${address.state} ${address.pincode}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading pickup details...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Transaction not found.</p>
          <Button onClick={() => router.push('/agent/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const progress = (currentStep / 8) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push('/agent/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Device Pickup & Verification</h1>
                <p className="text-sm text-gray-500">Transaction ID: {transactionId}</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Step {currentStep} of 8
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Transaction Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Device Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Device Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-12 w-12 text-gray-400" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Device:</span>
                    <span className="font-medium">{transaction.listing.brand} {transaction.listing.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Variant:</span>
                    <span className="font-medium">{transaction.listing.variant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Listed Condition:</span>
                    <Badge variant="outline">{transaction.listing.condition}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Winning Bid:</span>
                    <span className="font-semibold text-green-600">₹{transaction.winningBid.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IMEI 1:</span>
                    <span className="font-mono text-xs">{transaction.listing.imei1}</span>
                  </div>
                  {transaction.listing.imei2 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">IMEI 2:</span>
                      <span className="font-mono text-xs">{transaction.listing.imei2}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.client.name}</p>
                    <p className="text-sm text-gray-600">{transaction.client.whatsappNumber}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="text-sm">
                      <p>{transaction.client.address.street}</p>
                      <p>{transaction.client.address.city}, {transaction.client.address.state} {transaction.client.address.pincode}</p>
                      {transaction.client.address.landmark && (
                        <p className="text-gray-600">Near: {transaction.client.address.landmark}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={openNavigation}>
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigate
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Verification Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Verification Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {verificationSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        index + 1 < currentStep 
                          ? 'bg-green-500 text-white' 
                          : index + 1 === currentStep
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {index + 1 < currentStep ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <span className="text-xs">{index + 1}</span>
                        )}
                      </div>
                      <span className={`text-sm ${
                        index + 1 === currentStep ? 'font-medium text-blue-600' : 
                        index + 1 < currentStep ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Verification Steps */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && 'Customer Identity Verification'}
                  {currentStep === 2 && 'Device Inspection'}
                  {currentStep === 3 && 'Verification Photos'}
                  {currentStep === 4 && 'Condition Assessment'}
                  {currentStep === 5 && 'Deduction Calculation'}
                  {currentStep === 6 && 'Final Offer Generation'}
                  {currentStep === 7 && 'Customer Acceptance'}
                  {currentStep === 8 && 'Pickup Completion'}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && 'Verify customer identity and document details'}
                  {currentStep === 2 && 'Inspect device condition and functionality'}
                  {currentStep === 3 && 'Take verification photos of device and documents'}
                  {currentStep === 4 && 'Assess actual device condition'}
                  {currentStep === 5 && 'Calculate any price deductions'}
                  {currentStep === 6 && 'Generate final offer based on inspection'}
                  {currentStep === 7 && 'Get customer acceptance via OTP'}
                  {currentStep === 8 && 'Complete pickup and proceed to delivery'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Step 1: Identity Verification */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="idType">ID Document Type</Label>
                        <Select value={idType} onValueChange={(value: any) => setIdType(value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AADHAAR">Aadhaar Card</SelectItem>
                            <SelectItem value="PAN">PAN Card</SelectItem>
                            <SelectItem value="DRIVING_LICENSE">Driving License</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="idNumber">ID Number</Label>
                        <Input
                          id="idNumber"
                          placeholder="Enter ID number"
                          value={idNumber}
                          onChange={(e) => setIdNumber(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="idUpload">Upload ID Document Photo</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-600 mb-2">Take a clear photo of the ID document</p>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => handleFileUpload(e.target.files, 'id')}
                            className="hidden"
                            id="id-upload"
                          />
                          <Button variant="outline" asChild>
                            <label htmlFor="id-upload" className="cursor-pointer">
                              <Upload className="h-4 w-4 mr-2" />
                              {idDocument ? 'Change Photo' : 'Take Photo'}
                            </label>
                          </Button>
                          {idDocument && (
                            <p className="text-sm text-green-600 mt-2">✓ ID document captured</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="verified"
                          checked={customerIdVerified}
                          onCheckedChange={(checked) => setCustomerIdVerified(!!checked)}
                        />
                        <Label htmlFor="verified" className="text-sm">
                          I have verified the customer's identity matches the provided document
                        </Label>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setCurrentStep(2)}
                      disabled={!customerIdVerified || !idDocument || !idNumber}
                      className="w-full"
                    >
                      Continue to Device Inspection
                    </Button>
                  </div>
                )}

                {/* Step 2: Device Inspection */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Functional Check</Label>
                        <div className="space-y-2 mt-2">
                          {['Display working', 'Touch responsive', 'Buttons functional', 'Camera working', 'Speaker/mic clear', 'Charging port working', 'WiFi/Bluetooth working'].map((item) => (
                            <div key={item} className="flex items-center space-x-2">
                              <Checkbox
                                id={item}
                                checked={!functionalIssues.includes(item)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFunctionalIssues(prev => prev.filter(issue => issue !== item));
                                  } else {
                                    setFunctionalIssues(prev => [...prev, item]);
                                  }
                                }}
                              />
                              <Label htmlFor={item} className="text-sm">{item}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Physical Condition</Label>
                        <div className="space-y-2 mt-2">
                          {['Screen scratches', 'Body scratches', 'Dents/cracks', 'Camera lens damage', 'Port damage', 'Button wear'].map((item) => (
                            <div key={item} className="flex items-center space-x-2">
                              <Checkbox
                                id={item}
                                checked={physicalIssues.includes(item)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setPhysicalIssues(prev => [...prev, item]);
                                  } else {
                                    setPhysicalIssues(prev => prev.filter(issue => issue !== item));
                                  }
                                }}
                              />
                              <Label htmlFor={item} className="text-sm">{item}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Accessories Included</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {['Original Box', 'Charger', 'Cable', 'Earphones', 'Documentation'].map((item) => (
                          <div key={item} className="flex items-center space-x-2">
                            <Checkbox
                              id={item}
                              checked={accessoriesIncluded.includes(item)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setAccessoriesIncluded(prev => [...prev, item]);
                                } else {
                                  setAccessoriesIncluded(prev => prev.filter(acc => acc !== item));
                                }
                              }}
                            />
                            <Label htmlFor={item} className="text-sm">{item}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="battery">Battery Health (%)</Label>
                      <Input
                        id="battery"
                        type="number"
                        min="0"
                        max="100"
                        value={batteryHealth}
                        onChange={(e) => setBatteryHealth(parseInt(e.target.value) || 0)}
                        placeholder="Enter battery health percentage"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Inspection Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any additional notes about device condition..."
                        value={inspectionNotes}
                        onChange={(e) => setInspectionNotes(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button onClick={() => setCurrentStep(3)} className="w-full">
                      Continue to Photo Verification
                    </Button>
                  </div>
                )}

                {/* Step 3: Verification Photos */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label>Device Photos (Required: Front, Back, Screen On, Damage Areas)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">Take 4 verification photos of the device</p>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          multiple
                          onChange={(e) => handleFileUpload(e.target.files, 'device')}
                          className="hidden"
                          id="device-photos"
                        />
                        <Button variant="outline" asChild>
                          <label htmlFor="device-photos" className="cursor-pointer">
                            <Camera className="h-4 w-4 mr-2" />
                            Take Device Photos
                          </label>
                        </Button>
                        {devicePhotos.length > 0 && (
                          <p className="text-sm text-green-600 mt-2">✓ {devicePhotos.length} photos captured</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Bill/Receipt Photo</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleFileUpload(e.target.files, 'bill')}
                          className="hidden"
                          id="bill-photo"
                        />
                        <Button variant="outline" size="sm" asChild>
                          <label htmlFor="bill-photo" className="cursor-pointer">
                            <FileText className="h-4 w-4 mr-2" />
                            {billPhoto ? 'Bill Captured ✓' : 'Capture Bill'}
                          </label>
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Packaging Photo</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleFileUpload(e.target.files, 'packaging')}
                          className="hidden"
                          id="packaging-photo"
                        />
                        <Button variant="outline" size="sm" asChild>
                          <label htmlFor="packaging-photo" className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            {packagingPhoto ? 'Packaging Captured ✓' : 'Capture Packaging'}
                          </label>
                        </Button>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setCurrentStep(4)}
                      disabled={devicePhotos.length < 4}
                      className="w-full"
                    >
                      Continue to Assessment
                    </Button>
                  </div>
                )}

                {/* Step 4: Condition Assessment */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <Label>Actual Device Condition</Label>
                      <Select value={actualCondition} onValueChange={(value: any) => setActualCondition(value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select actual condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EXCELLENT">Excellent - Like new</SelectItem>
                          <SelectItem value="GOOD">Good - Minor wear</SelectItem>
                          <SelectItem value="FAIR">Fair - Visible wear</SelectItem>
                          <SelectItem value="POOR">Poor - Significant issues</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {actualCondition !== transaction.listing.condition && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Condition Mismatch:</strong> Listed as {transaction.listing.condition}, 
                          but actual condition is {actualCondition}. This may result in price deduction.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button onClick={() => setCurrentStep(5)} className="w-full">
                      Calculate Deductions
                    </Button>
                  </div>
                )}

                {/* Step 5: Deduction Calculation */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <Button onClick={calculateDeductions} className="w-full mb-4">
                      Calculate Deductions
                    </Button>

                    {deductions.length > 0 ? (
                      <div className="space-y-4">
                        <h3 className="font-medium">Price Deductions</h3>
                        {deductions.map((deduction) => (
                          <div key={deduction.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{deduction.description}</p>
                              <p className="text-xs text-gray-600">{deduction.category} - {deduction.severity}</p>
                            </div>
                            <span className="text-red-600 font-semibold">-₹{deduction.amount.toLocaleString()}</span>
                          </div>
                        ))}
                        
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center text-lg font-semibold">
                            <span>Total Deductions:</span>
                            <span className="text-red-600">-₹{deductions.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                        <p className="text-green-600 font-medium">No deductions required!</p>
                        <p className="text-sm text-gray-600">Device condition matches listing description.</p>
                      </div>
                    )}

                    <Button onClick={() => setCurrentStep(6)} className="w-full">
                      Generate Final Offer
                    </Button>
                  </div>
                )}

                {/* Step 6: Final Offer */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg text-center">
                      <h3 className="text-lg font-semibold mb-4">Final Offer Calculation</h3>
                      
                      <div className="space-y-3 text-left max-w-sm mx-auto">
                        <div className="flex justify-between">
                          <span>Winning Bid Amount:</span>
                          <span className="font-semibold">₹{transaction.winningBid.amount.toLocaleString()}</span>
                        </div>
                        
                        {deductions.length > 0 && (
                          <div className="flex justify-between text-red-600">
                            <span>Total Deductions:</span>
                            <span className="font-semibold">-₹{deductions.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</span>
                          </div>
                        )}
                        
                        <div className="border-t pt-3 flex justify-between text-xl font-bold text-green-600">
                          <span>Final Offer:</span>
                          <span>₹{finalOffer.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        This final offer will be sent to the customer via WhatsApp. 
                        Once accepted, payment will be processed automatically.
                      </AlertDescription>
                    </Alert>

                    <Button 
                      onClick={handleCompleteVerification}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Send Final Offer to Customer'
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* OTP Modal */}
      {showOTPModal && (
        <OTPVerification
          phoneNumber={transaction.client.whatsappNumber}
          purpose="TRANSACTION_COMPLETION"
          transactionId={transactionId}
          amount={finalOffer}
          onSuccess={handleCustomerOTPSuccess}
          onCancel={() => setShowOTPModal(false)}
        />
      )}
    </div>
  );
} 