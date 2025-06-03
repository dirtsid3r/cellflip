'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft,
  MapPin,
  Phone,
  MessageCircle,
  Camera,
  CheckCircle,
  Clock,
  User,
  Smartphone,
  Building,
  Navigation,
  Star,
  IndianRupee,
  Truck,
  Package,
  FileText,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { User as UserType } from '@/types';
import { OTPVerification } from '@/components/features/OTPVerification';

interface DeliveryTransaction {
  id: string;
  listing: {
    id: string;
    brand: string;
    model: string;
    variant: string;
    finalCondition: string;
    inspectionPhotos: string[];
    finalOffer: number;
    deductions: number;
    originalBid: number;
  };
  client: {
    id: string;
    name: string;
    whatsappNumber: string;
  };
  vendor: {
    id: string;
    name: string;
    businessName: string;
    whatsappNumber: string;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      landmark?: string;
    };
    rating: number;
    totalPurchases: number;
  };
  agent: {
    id: string;
    name: string;
    earnings: number;
    commission: number;
  };
  status: string;
  pickupCompletedAt: string;
  estimatedDeliveryTime: string;
}

interface DeliveryStep {
  id: string;
  title: string;
  completed: boolean;
  timestamp?: string;
}

export default function AgentDeliveryPage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params.transactionId as string;
  
  const [user, setUser] = useState<UserType | null>(null);
  const [transaction, setTransaction] = useState<DeliveryTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delivery verification
  const [vendorIdVerified, setVendorIdVerified] = useState(false);
  const [vendorIdPhoto, setVendorIdPhoto] = useState<File | null>(null);
  const [handoverPhoto, setHandoverPhoto] = useState<File | null>(null);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [showVendorOTPModal, setShowVendorOTPModal] = useState(false);
  const [showClientOTPModal, setShowClientOTPModal] = useState(false);
  
  // Mock transaction data
  const mockTransaction: DeliveryTransaction = {
    id: transactionId,
    listing: {
      id: 'listing_123',
      brand: 'Apple',
      model: 'iPhone 14',
      variant: '128GB',
      finalCondition: 'EXCELLENT',
      inspectionPhotos: ['/inspection/front.jpg', '/inspection/back.jpg'],
      finalOffer: 58000,
      deductions: 0,
      originalBid: 58000
    },
    client: {
      id: 'client_123',
      name: 'Rajesh Kumar',
      whatsappNumber: '+919876543210'
    },
    vendor: {
      id: 'vendor_123',
      name: 'Suresh Menon',
      businessName: 'Mobile Palace Thrissur',
      whatsappNumber: '+919876543211',
      address: {
        street: 'Shop No. 45, Swaraj Round, Round South',
        city: 'Thrissur',
        state: 'Kerala',
        pincode: '680001',
        landmark: 'Near State Bank of India'
      },
      rating: 4.8,
      totalPurchases: 142
    },
    agent: {
      id: 'agent_123',
      name: 'Priya Nair',
      earnings: 45600,
      commission: 2900 // 5% of transaction
    },
    status: 'PICKUP_COMPLETED',
    pickupCompletedAt: '2024-12-10T16:30:00Z',
    estimatedDeliveryTime: '2024-12-10T18:00:00Z'
  };

  const deliverySteps: DeliveryStep[] = [
    { id: 'navigation', title: 'Navigate to Vendor', completed: false },
    { id: 'verification', title: 'Verify Vendor Identity', completed: false },
    { id: 'handover', title: 'Device Handover', completed: false },
    { id: 'receipt', title: 'Vendor Receipt Confirmation', completed: false },
    { id: 'payment', title: 'Process Payments', completed: false },
    { id: 'completion', title: 'Transaction Completion', completed: false }
  ];

  useEffect(() => {
    const initializeDelivery = async () => {
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
        // const response = await apiService.getAgentDelivery(transactionId);
        setTransaction(mockTransaction);
        
      } catch (error) {
        console.error('Failed to initialize delivery:', error);
        router.push('/agent/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    initializeDelivery();
  }, [transactionId, router]);

  const handleFileUpload = (file: File | null, type: 'vendorId' | 'handover') => {
    if (!file) return;
    
    switch (type) {
      case 'vendorId':
        setVendorIdPhoto(file);
        break;
      case 'handover':
        setHandoverPhoto(file);
        break;
    }
  };

  const openVendorNavigation = () => {
    if (!transaction) return;
    
    const address = transaction.vendor.address;
    const query = encodeURIComponent(`${address.street}, ${address.city}, ${address.state} ${address.pincode}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
  };

  const handleCompleteDelivery = async () => {
    setIsSubmitting(true);
    
    try {
      // Mock API call to complete delivery
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Delivery completed:', {
        transactionId,
        vendorIdVerified,
        deliveryNotes,
        handoverPhoto: !!handoverPhoto,
        vendorIdPhoto: !!vendorIdPhoto
      });
      
      // Show vendor OTP modal first
      setShowVendorOTPModal(true);
      
    } catch (error) {
      console.error('Delivery failed:', error);
      alert('Delivery failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVendorOTPSuccess = async (otp: string) => {
    try {
      console.log('Vendor confirmed receipt with OTP:', otp);
      setShowVendorOTPModal(false);
      
      // Show client OTP modal for final confirmation
      setShowClientOTPModal(true);
      
    } catch (error) {
      console.error('Vendor OTP verification failed:', error);
      alert('Vendor OTP verification failed. Please try again.');
    }
  };

  const handleClientOTPSuccess = async (otp: string) => {
    try {
      console.log('Client confirmed transaction completion with OTP:', otp);
      
      // Process final payments and complete transaction
      await processPayments();
      
      // Navigate to completion page
      router.push(`/agent/transaction-complete/${transactionId}`);
      
    } catch (error) {
      console.error('Client OTP verification failed:', error);
      alert('Client OTP verification failed. Please try again.');
    }
  };

  const processPayments = async () => {
    console.log('Processing payments:', {
      vendorPayment: transaction?.listing.finalOffer,
      clientPayment: transaction?.listing.finalOffer,
      agentCommission: transaction?.agent.commission,
      platformFee: (transaction?.listing.finalOffer || 0) * 0.02
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PICKUP_COMPLETED': return 'bg-blue-500 text-white';
      case 'IN_TRANSIT': return 'bg-orange-500 text-white';
      case 'DELIVERED': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading delivery details...</p>
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

  const progress = (currentStep / 6) * 100;

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
                <h1 className="text-xl font-semibold text-gray-900">Device Delivery to Vendor</h1>
                <p className="text-sm text-gray-500">Transaction ID: {transactionId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className={getStatusColor(transaction.status)}>
                {transaction.status.replace('_', ' ')}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Step {currentStep} of 6
              </Badge>
            </div>
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
          {/* Left Column - Transaction & Vendor Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Device Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Device Summary</CardTitle>
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
                    <span className="text-gray-600">Condition:</span>
                    <Badge variant="outline">{transaction.listing.finalCondition}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Bid:</span>
                    <span className="text-gray-600">₹{transaction.listing.originalBid.toLocaleString()}</span>
                  </div>
                  {transaction.listing.deductions > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deductions:</span>
                      <span className="text-red-600">-₹{transaction.listing.deductions.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900">Final Amount:</span>
                    <span className="text-green-600">₹{transaction.listing.finalOffer.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vendor Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.vendor.businessName}</p>
                    <p className="text-sm text-gray-600">{transaction.vendor.name}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">{transaction.vendor.rating} ({transaction.vendor.totalPurchases} purchases)</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="text-sm">
                      <p>{transaction.vendor.address.street}</p>
                      <p>{transaction.vendor.address.city}, {transaction.vendor.address.state} {transaction.vendor.address.pincode}</p>
                      {transaction.vendor.address.landmark && (
                        <p className="text-gray-600">Landmark: {transaction.vendor.address.landmark}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={openVendorNavigation}>
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

            {/* Delivery Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivery Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deliverySteps.map((step, index) => (
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

            {/* Earnings Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Earnings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Commission (5%):</span>
                  <span className="font-semibold text-green-600">₹{transaction.agent.commission.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Earnings:</span>
                  <span className="font-bold text-green-700">₹{transaction.agent.earnings.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Delivery Steps */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && 'Navigate to Vendor Location'}
                  {currentStep === 2 && 'Verify Vendor Identity'}
                  {currentStep === 3 && 'Device Handover'}
                  {currentStep === 4 && 'Vendor Receipt Confirmation'}
                  {currentStep === 5 && 'Process Payments'}
                  {currentStep === 6 && 'Complete Transaction'}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && 'Navigate to the vendor location for device delivery'}
                  {currentStep === 2 && 'Verify vendor identity before device handover'}
                  {currentStep === 3 && 'Hand over the device and take confirmation photos'}
                  {currentStep === 4 && 'Get vendor confirmation via OTP'}
                  {currentStep === 5 && 'Process payments to all parties'}
                  {currentStep === 6 && 'Complete the transaction and update status'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Step 1: Navigation */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <Navigation className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">Navigate to Vendor</h3>
                          <p className="text-sm text-gray-600">Estimated travel time: 25 minutes</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <p><strong>Destination:</strong> {transaction.vendor.businessName}</p>
                        <p><strong>Address:</strong> {transaction.vendor.address.street}, {transaction.vendor.address.city}</p>
                        <p><strong>Contact:</strong> {transaction.vendor.whatsappNumber}</p>
                      </div>

                      <Button onClick={openVendorNavigation} className="w-full mt-4">
                        <Navigation className="h-4 w-4 mr-2" />
                        Open in Maps
                      </Button>
                    </div>

                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        Please reach the vendor location by {new Date(transaction.estimatedDeliveryTime).toLocaleTimeString()}. 
                        Notify the vendor 15 minutes before arrival.
                      </AlertDescription>
                    </Alert>

                    <Button onClick={() => setCurrentStep(2)} className="w-full">
                      I&apos;ve Reached the Vendor Location
                    </Button>
                  </div>
                )}

                {/* Step 2: Vendor Verification */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="vendorVerification">Vendor Identity Verification</Label>
                        <p className="text-sm text-gray-600 mb-4">
                          Verify vendor identity by checking ID and business registration
                        </p>
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-600 mb-2">Take photo of vendor ID document</p>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => handleFileUpload(e.target.files?.[0] || null, 'vendorId')}
                            className="hidden"
                            id="vendor-id-upload"
                          />
                          <Button variant="outline" asChild>
                            <label htmlFor="vendor-id-upload" className="cursor-pointer">
                              <Camera className="h-4 w-4 mr-2" />
                              {vendorIdPhoto ? 'ID Captured ✓' : 'Capture Vendor ID'}
                            </label>
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="vendorVerified"
                          checked={vendorIdVerified}
                          onChange={(e) => setVendorIdVerified(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="vendorVerified" className="text-sm">
                          I have verified the vendor&apos;s identity matches {transaction.vendor.name}
                        </Label>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setCurrentStep(3)}
                      disabled={!vendorIdVerified || !vendorIdPhoto}
                      className="w-full"
                    >
                      Continue to Device Handover
                    </Button>
                  </div>
                )}

                {/* Step 3: Device Handover */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Device Handover Documentation</Label>
                        <p className="text-sm text-gray-600 mb-4">
                          Take photos of device handover and get vendor acknowledgment
                        </p>
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-600 mb-2">Take photo of device being handed over to vendor</p>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => handleFileUpload(e.target.files?.[0] || null, 'handover')}
                            className="hidden"
                            id="handover-upload"
                          />
                          <Button variant="outline" asChild>
                            <label htmlFor="handover-upload" className="cursor-pointer">
                              <Camera className="h-4 w-4 mr-2" />
                              {handoverPhoto ? 'Handover Documented ✓' : 'Document Handover'}
                            </label>
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="deliveryNotes">Delivery Notes</Label>
                        <Textarea
                          id="deliveryNotes"
                          placeholder="Add any notes about the delivery process..."
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">Device Inspection Summary</span>
                      </div>
                      <div className="text-sm text-green-700">
                        <p>✓ Device condition verified as {transaction.listing.finalCondition}</p>
                        <p>✓ All inspection photos captured during pickup</p>
                        <p>✓ Final offer: ₹{transaction.listing.finalOffer.toLocaleString()}</p>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setCurrentStep(4)}
                      disabled={!handoverPhoto}
                      className="w-full"
                    >
                      Continue to Vendor Confirmation
                    </Button>
                  </div>
                )}

                {/* Step 4: Vendor Receipt Confirmation */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg text-center">
                      <h3 className="text-lg font-semibold mb-4">Ready for Vendor Confirmation</h3>
                      
                      <div className="space-y-3 text-left max-w-sm mx-auto">
                        <div className="flex justify-between">
                          <span>Device:</span>
                          <span className="font-medium">{transaction.listing.brand} {transaction.listing.model}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Condition:</span>
                          <span className="font-medium">{transaction.listing.finalCondition}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-green-600">
                          <span>Amount to Pay:</span>
                          <span>₹{transaction.listing.finalOffer.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        The vendor will receive an OTP to confirm device receipt. 
                        Once confirmed, payment will be processed automatically.
                      </AlertDescription>
                    </Alert>

                    <Button 
                      onClick={handleCompleteDelivery}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Request Vendor Confirmation'
                      )}
                    </Button>
                  </div>
                )}

                {/* Step 5: Process Payments */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IndianRupee className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Processing Payments</h3>
                      <p className="text-gray-600">All payments are being processed automatically...</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Client Payment</span>
                        <span className="font-semibold text-green-600">₹{transaction.listing.finalOffer.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Agent Commission</span>
                        <span className="font-semibold text-blue-600">₹{transaction.agent.commission.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Platform Fee (2%)</span>
                        <span className="font-semibold text-gray-600">₹{((transaction.listing.finalOffer || 0) * 0.02).toLocaleString()}</span>
                      </div>
                    </div>

                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Payments will be credited to respective accounts within 24 hours.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Vendor OTP Modal */}
      {showVendorOTPModal && (
        <OTPVerification
          phoneNumber={transaction.vendor.whatsappNumber}
          purpose="VENDOR_RECEIPT_CONFIRMATION"
          transactionId={transactionId}
          amount={transaction.listing.finalOffer}
          onSuccess={handleVendorOTPSuccess}
          onCancel={() => setShowVendorOTPModal(false)}
        />
      )}

      {/* Client OTP Modal */}
      {showClientOTPModal && (
        <OTPVerification
          phoneNumber={transaction.client.whatsappNumber}
          purpose="TRANSACTION_COMPLETION"
          transactionId={transactionId}
          amount={transaction.listing.finalOffer}
          onSuccess={handleClientOTPSuccess}
          onCancel={() => setShowClientOTPModal(false)}
        />
      )}
    </div>
  );
} 