'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Smartphone, 
  Camera, 
  FileText, 
  CreditCard, 
  MapPin, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Upload
} from 'lucide-react';
import { User, DeviceCondition } from '@/types';

interface DeviceListingForm {
  // Step 1: Basic Info
  brand: string;
  model: string;
  variant: string;
  
  // Step 2: Condition
  condition: DeviceCondition;
  description: string;
  
  // Step 3: Pricing
  askingPrice: number;
  
  // Step 4: Photos
  photos: File[];
  photoUrls: string[];
  
  // Step 5: IMEI
  imei1: string;
  imei2: string;
  
  // Step 6: Warranty
  hasWarranty: boolean;
  warrantyExpiresAt?: Date;
  warrantyDocument?: File;
  
  // Step 7: Bill
  billImage?: File;
  
  // Step 8: Personal Details
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  email: string;
  
  // Step 9: Bank Details
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName: string;
  
  // Step 10: Pickup Address
  pickupAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  
  // Step 11: Terms
  acceptedTerms: boolean;
}

const STEPS = [
  { id: 1, title: 'Device Info', icon: Smartphone, description: 'Brand, model & variant' },
  { id: 2, title: 'Condition', icon: CheckCircle, description: 'Device condition assessment' },
  { id: 3, title: 'Pricing', icon: CreditCard, description: 'Expected selling price' },
  { id: 4, title: 'Photos', icon: Camera, description: '4 required photos' },
  { id: 5, title: 'IMEI', icon: FileText, description: 'Device identification' },
  { id: 6, title: 'Warranty', icon: FileText, description: 'Warranty information' },
  { id: 7, title: 'Bill', icon: FileText, description: 'Purchase receipt (optional)' },
  { id: 8, title: 'Personal', icon: CheckCircle, description: 'Contact details' },
  { id: 9, title: 'Bank Details', icon: CreditCard, description: 'Payment information' },
  { id: 10, title: 'Pickup', icon: MapPin, description: 'Collection address' },
  { id: 11, title: 'Terms', icon: FileText, description: 'Terms & conditions' },
  { id: 12, title: 'Review', icon: CheckCircle, description: 'Final review' }
];

const BRANDS = ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Vivo', 'Nothing', 'Google'];
const CONDITIONS: { value: DeviceCondition; label: string; description: string }[] = [
  { value: 'EXCELLENT', label: 'Excellent', description: 'Like new, no visible wear' },
  { value: 'GOOD', label: 'Good', description: 'Minor scratches, fully functional' },
  { value: 'FAIR', label: 'Fair', description: 'Visible wear, all features work' },
  { value: 'POOR', label: 'Poor', description: 'Heavy wear, may have issues' }
];

export default function DeviceListingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<DeviceListingForm>({
    brand: '',
    model: '',
    variant: '',
    condition: 'EXCELLENT',
    description: '',
    askingPrice: 0,
    photos: [],
    photoUrls: [],
    imei1: '',
    imei2: '',
    hasWarranty: false,
    firstName: '',
    lastName: '',
    whatsappNumber: '',
    email: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    bankName: '',
    pickupAddress: {
      street: '',
      city: '',
      state: 'Kerala',
      pincode: ''
    },
    acceptedTerms: false
  });

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('cellflip_user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const currentUser: User = JSON.parse(userData);
    if (currentUser.role !== 'CLIENT') {
      router.push('/dashboard');
      return;
    }

    setUser(currentUser);
    
    // Pre-fill user data
    setFormData(prev => ({
      ...prev,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      whatsappNumber: currentUser.whatsappNumber,
      email: currentUser.email || ''
    }));
  }, [router]);

  const updateFormData = (updates: Partial<DeviceListingForm>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setErrors({});
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Device Info
        if (!formData.brand) newErrors.brand = 'Brand is required';
        if (!formData.model) newErrors.model = 'Model is required';
        if (!formData.variant) newErrors.variant = 'Variant is required';
        break;
      
      case 2: // Condition
        if (!formData.condition) newErrors.condition = 'Condition is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        break;
      
      case 3: // Pricing
        if (!formData.askingPrice || formData.askingPrice <= 0) {
          newErrors.askingPrice = 'Valid asking price is required';
        }
        break;
      
      case 4: // Photos
        if (formData.photos.length < 4) {
          newErrors.photos = 'All 4 photos are required (front, back, top, bottom)';
        }
        break;
      
      case 5: // IMEI
        if (!formData.imei1 || formData.imei1.length !== 15) {
          newErrors.imei1 = 'Valid 15-digit IMEI 1 is required';
        }
        break;

      case 8: // Personal Details
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.whatsappNumber.trim()) newErrors.whatsappNumber = 'WhatsApp number is required';
        break;

      case 9: // Bank Details
        if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
        if (!formData.ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required';
        if (!formData.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
        if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
        break;

      case 10: // Pickup Address
        if (!formData.pickupAddress.street.trim()) newErrors.street = 'Street address is required';
        if (!formData.pickupAddress.city.trim()) newErrors.city = 'City is required';
        if (!formData.pickupAddress.pincode || formData.pickupAddress.pincode.length !== 6) {
          newErrors.pincode = 'Valid 6-digit pincode is required';
        }
        break;

      case 11: // Terms
        if (!formData.acceptedTerms) newErrors.acceptedTerms = 'You must accept the terms and conditions';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitListing = async () => {
    // Final validation
    if (!validateStep(11) || !formData.acceptedTerms) {
      setErrors({ acceptedTerms: 'You must accept the terms and conditions' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual API integration
      const listingData = {
        ...formData,
        userId: user?.id,
        status: 'PENDING_APPROVAL',
        createdAt: new Date().toISOString(),
        photos: formData.photos.map((_, index) => ({
          url: formData.photoUrls[index],
          type: ['FRONT', 'BACK', 'TOP', 'BOTTOM'][index] || 'OTHER'
        }))
      };

      console.log('Submitting listing:', listingData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page or back to dashboard
      router.push('/dashboard?listing_submitted=true');
      
    } catch (error) {
      console.error('Error submitting listing:', error);
      setErrors({ submit: 'Failed to submit listing. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (files: FileList | null, field: string) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    
    if (field === 'photos') {
      // Handle multiple photo uploads
      const newPhotos = [...formData.photos, ...fileArray].slice(0, 4);
      const newUrls = newPhotos.map(file => URL.createObjectURL(file));
      updateFormData({ photos: newPhotos, photoUrls: newUrls });
    } else {
      // Handle single file uploads
      updateFormData({ [field]: fileArray[0] });
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const currentStepInfo = STEPS[currentStep - 1];
  const StepIcon = currentStepInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">List Your Device</h1>
                <p className="text-sm text-gray-500">Step {currentStep} of {STEPS.length}</p>
              </div>
            </div>
            <Badge variant="outline">
              {Math.round(progress)}% Complete
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Steps Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {STEPS.map((step) => {
                  const Icon = step.icon;
                  const isCompleted = currentStep > step.id;
                  const isCurrent = currentStep === step.id;
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                        isCurrent
                          ? 'bg-blue-50 border border-blue-200'
                          : isCompleted
                          ? 'bg-green-50'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          isCurrent
                            ? 'bg-blue-500 text-white'
                            : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          isCurrent ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-600'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Step Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white">
                    <StepIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{currentStepInfo.title}</CardTitle>
                    <CardDescription>{currentStepInfo.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Step 1: Device Basic Info */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="brand">Brand *</Label>
                        <Select value={formData.brand} onValueChange={(value) => updateFormData({ brand: value })}>
                          <SelectTrigger className={errors.brand ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent>
                            {BRANDS.map((brand) => (
                              <SelectItem key={brand} value={brand}>
                                {brand}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.brand && <p className="text-sm text-red-600">{errors.brand}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="model">Model *</Label>
                        <Input
                          id="model"
                          placeholder="e.g., iPhone 14"
                          value={formData.model}
                          onChange={(e) => updateFormData({ model: e.target.value })}
                          className={errors.model ? 'border-red-500' : ''}
                        />
                        {errors.model && <p className="text-sm text-red-600">{errors.model}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="variant">Variant/Storage *</Label>
                      <Input
                        id="variant"
                        placeholder="e.g., 128GB, 256GB, Pro Max"
                        value={formData.variant}
                        onChange={(e) => updateFormData({ variant: e.target.value })}
                        className={errors.variant ? 'border-red-500' : ''}
                      />
                      {errors.variant && <p className="text-sm text-red-600">{errors.variant}</p>}
                    </div>
                  </div>
                )}

                {/* Step 2: Device Condition */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label>Device Condition *</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {CONDITIONS.map((cond) => (
                          <div
                            key={cond.value}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              formData.condition === cond.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => updateFormData({ condition: cond.value })}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-4 h-4 rounded-full border-2 ${
                                  formData.condition === cond.value
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-300'
                                }`}
                              />
                              <div>
                                <p className="font-medium">{cond.label}</p>
                                <p className="text-sm text-gray-500">{cond.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {errors.condition && <p className="text-sm text-red-600">{errors.condition}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Detailed Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your device condition, any issues, accessories included, etc."
                        value={formData.description}
                        onChange={(e) => updateFormData({ description: e.target.value })}
                        className={errors.description ? 'border-red-500' : ''}
                        rows={4}
                      />
                      {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                    </div>
                  </div>
                )}

                {/* Step 3: Pricing */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="askingPrice">Expected Selling Price *</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <Input
                          id="askingPrice"
                          type="number"
                          placeholder="25000"
                          value={formData.askingPrice || ''}
                          onChange={(e) => updateFormData({ askingPrice: parseInt(e.target.value) || 0 })}
                          className={`pl-8 ${errors.askingPrice ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.askingPrice && <p className="text-sm text-red-600">{errors.askingPrice}</p>}
                      <p className="text-sm text-gray-500">
                        This will be your asking price. Vendors can bid up to or above this amount.
                      </p>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>How bidding works:</strong> If vendors bid your asking price or higher, 
                        bidding closes immediately. Otherwise, it runs for 24 hours and highest bid wins.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Step 4: Photo Upload */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Device Photos * (4 required)</Label>
                      <p className="text-sm text-gray-600">
                        Upload clear photos from all angles: Front, Back, Top, Bottom
                      </p>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">
                          Click to upload or drag and drop
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e.target.files, 'photos')}
                          className="hidden"
                          id="photo-upload"
                        />
                        <Button variant="outline" asChild>
                          <label htmlFor="photo-upload" className="cursor-pointer">
                            Choose Photos
                          </label>
                        </Button>
                      </div>

                      {formData.photoUrls.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          {formData.photoUrls.map((url, index) => (
                            <div key={index} className="relative">
                              <img
                                src={url}
                                alt={`Device photo ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                              <Badge
                                variant="secondary"
                                className="absolute top-2 left-2 text-xs"
                              >
                                Photo {index + 1}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {errors.photos && <p className="text-sm text-red-600">{errors.photos}</p>}
                    </div>
                  </div>
                )}

                {/* Step 5: IMEI */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="imei1">IMEI 1 *</Label>
                      <Input
                        id="imei1"
                        placeholder="123456789012345"
                        maxLength={15}
                        value={formData.imei1}
                        onChange={(e) => updateFormData({ imei1: e.target.value.replace(/\D/g, '') })}
                        className={errors.imei1 ? 'border-red-500' : ''}
                      />
                      {errors.imei1 && <p className="text-sm text-red-600">{errors.imei1}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imei2">IMEI 2 (if dual SIM)</Label>
                      <Input
                        id="imei2"
                        placeholder="123456789012345"
                        maxLength={15}
                        value={formData.imei2}
                        onChange={(e) => updateFormData({ imei2: e.target.value.replace(/\D/g, '') })}
                      />
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Find IMEI:</strong> Go to Settings → About Phone → IMEI, 
                        or dial *#06# to display IMEI numbers.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Step 6: Warranty */}
                {currentStep === 6 && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label>Warranty Status</Label>
                      <div className="flex space-x-4">
                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            formData.hasWarranty
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => updateFormData({ hasWarranty: true })}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                formData.hasWarranty
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}
                            />
                            <span className="font-medium">Under Warranty</span>
                          </div>
                        </div>
                        
                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            !formData.hasWarranty
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => updateFormData({ hasWarranty: false })}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                !formData.hasWarranty
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}
                            />
                            <span className="font-medium">Out of Warranty</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {formData.hasWarranty && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="warrantyExpiry">Warranty Expiry Date</Label>
                          <Input
                            id="warrantyExpiry"
                            type="date"
                            value={formData.warrantyExpiresAt?.toISOString().split('T')[0] || ''}
                            onChange={(e) => updateFormData({ warrantyExpiresAt: new Date(e.target.value) })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="warrantyDoc">Warranty Document (Optional)</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-2">Upload warranty card or receipt</p>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) => handleFileUpload(e.target.files, 'warrantyDocument')}
                              className="hidden"
                              id="warranty-upload"
                            />
                            <Button variant="outline" size="sm" asChild>
                              <label htmlFor="warranty-upload" className="cursor-pointer">
                                Choose File
                              </label>
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Step 7: Bill Upload */}
                {currentStep === 7 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Purchase Bill (Optional)</Label>
                      <p className="text-sm text-gray-600">
                        Upload your purchase bill or invoice to increase buyer confidence and get better prices.
                      </p>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">
                          Upload bill, invoice, or receipt
                        </p>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileUpload(e.target.files, 'billImage')}
                          className="hidden"
                          id="bill-upload"
                        />
                        <Button variant="outline" asChild>
                          <label htmlFor="bill-upload" className="cursor-pointer">
                            Choose File
                          </label>
                        </Button>
                      </div>

                      {formData.billImage && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-700">Bill uploaded: {formData.billImage.name}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 8: Personal Details */}
                {currentStep === 8 && (
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        These details are pre-filled from your account. Update if needed.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => updateFormData({ firstName: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => updateFormData({ lastName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                        <Input
                          id="whatsappNumber"
                          value={formData.whatsappNumber}
                          onChange={(e) => updateFormData({ whatsappNumber: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData({ email: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 9: Bank Details */}
                {currentStep === 9 && (
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Bank details are required for payment processing. All information is encrypted and secure.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number *</Label>
                        <Input
                          id="accountNumber"
                          placeholder="1234567890123456"
                          value={formData.accountNumber}
                          onChange={(e) => updateFormData({ accountNumber: e.target.value })}
                          className={errors.accountNumber ? 'border-red-500' : ''}
                        />
                        {errors.accountNumber && <p className="text-sm text-red-600">{errors.accountNumber}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ifscCode">IFSC Code *</Label>
                        <Input
                          id="ifscCode"
                          placeholder="SBIN0001234"
                          value={formData.ifscCode}
                          onChange={(e) => updateFormData({ ifscCode: e.target.value.toUpperCase() })}
                          className={errors.ifscCode ? 'border-red-500' : ''}
                        />
                        {errors.ifscCode && <p className="text-sm text-red-600">{errors.ifscCode}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                        <Input
                          id="accountHolderName"
                          placeholder="Full name as per bank records"
                          value={formData.accountHolderName}
                          onChange={(e) => updateFormData({ accountHolderName: e.target.value })}
                          className={errors.accountHolderName ? 'border-red-500' : ''}
                        />
                        {errors.accountHolderName && <p className="text-sm text-red-600">{errors.accountHolderName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name *</Label>
                        <Input
                          id="bankName"
                          placeholder="e.g., State Bank of India"
                          value={formData.bankName}
                          onChange={(e) => updateFormData({ bankName: e.target.value })}
                          className={errors.bankName ? 'border-red-500' : ''}
                        />
                        {errors.bankName && <p className="text-sm text-red-600">{errors.bankName}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 10: Pickup Address */}
                {currentStep === 10 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address *</Label>
                      <Textarea
                        id="street"
                        placeholder="House/Building number, Street name, Area"
                        value={formData.pickupAddress.street}
                        onChange={(e) => updateFormData({ 
                          pickupAddress: { ...formData.pickupAddress, street: e.target.value }
                        })}
                        className={errors.street ? 'border-red-500' : ''}
                        rows={2}
                      />
                      {errors.street && <p className="text-sm text-red-600">{errors.street}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          placeholder="e.g., Kochi"
                          value={formData.pickupAddress.city}
                          onChange={(e) => updateFormData({ 
                            pickupAddress: { ...formData.pickupAddress, city: e.target.value }
                          })}
                          className={errors.city ? 'border-red-500' : ''}
                        />
                        {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          placeholder="682001"
                          maxLength={6}
                          value={formData.pickupAddress.pincode}
                          onChange={(e) => updateFormData({ 
                            pickupAddress: { ...formData.pickupAddress, pincode: e.target.value.replace(/\D/g, '') }
                          })}
                          className={errors.pincode ? 'border-red-500' : ''}
                        />
                        {errors.pincode && <p className="text-sm text-red-600">{errors.pincode}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="landmark">Landmark (Optional)</Label>
                      <Input
                        id="landmark"
                        placeholder="Near bus stop, metro station, etc."
                        value={formData.pickupAddress.landmark || ''}
                        onChange={(e) => updateFormData({ 
                          pickupAddress: { ...formData.pickupAddress, landmark: e.target.value }
                        })}
                      />
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Our pickup agent will contact you to schedule a convenient time for device collection.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Step 11: Terms & Conditions */}
                {currentStep === 11 && (
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Terms & Conditions</h3>
                      
                      <div className="text-sm text-gray-600 space-y-2">
                        <p>• I confirm that all information provided is accurate</p>
                        <p>• I understand Cellflip&apos;s terms and conditions</p>
                        <p>• I authorize agent verification at pickup location</p>
                        <p>• I agree to pricing adjustments based on actual condition</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        checked={formData.acceptedTerms}
                        onChange={(e) => updateFormData({ acceptedTerms: e.target.checked })}
                        className="mt-1"
                      />
                      <Label htmlFor="acceptTerms" className="text-sm cursor-pointer">
                        I have read and agree to the Terms & Conditions, Privacy Policy, and understand the pricing structure. *
                      </Label>
                    </div>
                    
                    {errors.acceptedTerms && <p className="text-sm text-red-600">{errors.acceptedTerms}</p>}
                  </div>
                )}

                {/* Step 12: Review & Submit */}
                {currentStep === 12 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Review Your Listing</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Device Details */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-md">Device Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Brand:</span>
                            <span className="font-medium">{formData.brand}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Model:</span>
                            <span className="font-medium">{formData.model}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Variant:</span>
                            <span className="font-medium">{formData.variant}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Condition:</span>
                            <span className="font-medium">{formData.condition}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Asking Price:</span>
                            <span className="font-medium text-green-600">₹{formData.askingPrice?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">IMEI 1:</span>
                            <span className="font-medium">{formData.imei1}</span>
                          </div>
                          {formData.imei2 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">IMEI 2:</span>
                              <span className="font-medium">{formData.imei2}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Contact & Payment */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-md">Contact & Payment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">WhatsApp:</span>
                            <span className="font-medium">{formData.whatsappNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bank:</span>
                            <span className="font-medium">{formData.bankName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Account:</span>
                            <span className="font-medium">***{formData.accountNumber.slice(-4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pickup City:</span>
                            <span className="font-medium">{formData.pickupAddress.city}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Photos:</span>
                            <span className="font-medium">{formData.photos.length} uploaded</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Photos Preview */}
                    {formData.photoUrls.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Device Photos</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {formData.photoUrls.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`Device photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Ready to submit!</strong> Your device will be listed for bidding once our team reviews and approves it.
                        You&apos;ll receive confirmation via WhatsApp within 2 hours.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep === STEPS.length ? (
                    <Button 
                      onClick={submitListing} 
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Listing
                          <CheckCircle className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button onClick={nextStep}>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>

                {errors.submit && (
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-600">
                      {errors.submit}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 