'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  Gavel,
  MapPin,
  Phone,
  MessageCircle,
  IndianRupee,
  Calendar,
  User,
  Smartphone,
  TrendingUp,
  Eye,
  Timer
} from 'lucide-react';
import { User as UserType } from '@/types';

// Mock listing data with complete tracking information
const mockListingData = {
  id: 'listing_123',
  device: {
    brand: 'Apple',
    model: 'iPhone 14',
    variant: '128GB',
    condition: 'EXCELLENT',
    askingPrice: 65000,
    photos: ['/device-photos/iphone14-1.jpg'],
    imei1: '123456789012345'
  },
  status: 'BIDDING_ACTIVE', // SUBMITTED, UNDER_REVIEW, APPROVED, BIDDING_ACTIVE, BIDDING_ENDED, SOLD, PICKUP_SCHEDULED, VERIFICATION_IN_PROGRESS, COMPLETED, REJECTED
  submittedAt: '2024-12-09T10:30:00Z',
  approvedAt: '2024-12-09T14:15:00Z',
  biddingStartedAt: '2024-12-09T15:00:00Z',
  biddingEndsAt: '2024-12-10T15:00:00Z',
  currentBids: [
    {
      id: 'bid_1',
      amount: 58000,
      vendorName: 'Mobile Mart Kerala',
      placedAt: '2024-12-09T16:30:00Z',
      isHighest: true
    },
    {
      id: 'bid_2',
      amount: 55000,
      vendorName: 'Tech Store Kochi',
      placedAt: '2024-12-09T17:15:00Z',
      isHighest: false
    },
    {
      id: 'bid_3',
      amount: 52000,
      vendorName: 'Phone World',
      placedAt: '2024-12-09T18:00:00Z',
      isHighest: false
    }
  ],
  assignedAgent: {
    name: 'Rajesh Kumar',
    phone: '+919876543210',
    rating: 4.8,
    profileImage: null
  },
  timeline: [
    {
      status: 'SUBMITTED',
      title: 'Listing Submitted',
      description: 'Your device listing has been submitted for review',
      timestamp: '2024-12-09T10:30:00Z',
      completed: true
    },
    {
      status: 'UNDER_REVIEW',
      title: 'Under Admin Review',
      description: 'Our team is reviewing your device details and photos',
      timestamp: '2024-12-09T11:00:00Z',
      completed: true
    },
    {
      status: 'APPROVED',
      title: 'Listing Approved',
      description: 'Your listing has been approved and is now live',
      timestamp: '2024-12-09T14:15:00Z',
      completed: true
    },
    {
      status: 'BIDDING_ACTIVE',
      title: 'Bidding Started',
      description: '24-hour bidding period has begun',
      timestamp: '2024-12-09T15:00:00Z',
      completed: true,
      isActive: true
    },
    {
      status: 'BIDDING_ENDED',
      title: 'Bidding Ends',
      description: 'Bidding period concludes, highest bidder wins',
      timestamp: '2024-12-10T15:00:00Z',
      completed: false
    },
    {
      status: 'PICKUP_SCHEDULED',
      title: 'Pickup Scheduled',
      description: 'Agent will be assigned for device pickup',
      timestamp: null,
      completed: false
    },
    {
      status: 'VERIFICATION_IN_PROGRESS',
      title: 'Device Verification',
      description: 'Agent verifies device condition and details',
      timestamp: null,
      completed: false
    },
    {
      status: 'COMPLETED',
      title: 'Transaction Complete',
      description: 'Payment processed and transaction completed',
      timestamp: null,
      completed: false
    }
  ]
};

export default function TrackListing() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [listing, setListing] = useState(mockListingData);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('cellflip_user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const currentUser: UserType = JSON.parse(userData);
    if (currentUser.role !== 'CLIENT') {
      router.push('/dashboard');
      return;
    }

    setUser(currentUser);
    setIsLoading(false);

    // Calculate time remaining for bidding
    if (listing.status === 'BIDDING_ACTIVE') {
      const updateTimer = () => {
        const now = new Date();
        const endTime = new Date(listing.biddingEndsAt);
        const diff = endTime.getTime() - now.getTime();
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeRemaining(`${hours}h ${minutes}m remaining`);
        } else {
          setTimeRemaining('Bidding ended');
        }
      };

      updateTimer();
      const timer = setInterval(updateTimer, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [router, listing.status, listing.biddingEndsAt]);

  const getProgressPercentage = () => {
    const completedSteps = listing.timeline.filter(step => step.completed).length;
    return (completedSteps / listing.timeline.length) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
      case 'BIDDING_ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'BIDDING_ENDED':
      case 'PICKUP_SCHEDULED':
        return 'bg-yellow-100 text-yellow-800';
      case 'VERIFICATION_IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load listing data.</p>
          <Button onClick={() => router.push('/login')} className="mt-4">
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  const highestBid = listing.currentBids.find(bid => bid.isHighest);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Track Your Listing</h1>
                <p className="text-sm text-gray-500">Listing ID: {listing.id}</p>
              </div>
            </div>
            <Badge variant="default" className={getStatusColor(listing.status)}>
              {listing.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Listing Progress</span>
              <span className="text-sm font-normal text-gray-500">
                {Math.round(getProgressPercentage())}% Complete
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={getProgressPercentage()} className="mb-4" />
            <div className="text-sm text-gray-600">
              Your {listing.device.brand} {listing.device.model} is currently in the{' '}
              <span className="font-medium">{listing.status.replace('_', ' ').toLowerCase()}</span> phase.
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Device Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Device Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>Device Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg">
                      {listing.device.brand} {listing.device.model}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Variant:</span>
                        <span className="ml-2 font-medium">{listing.device.variant}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Condition:</span>
                        <span className="ml-2 font-medium">{listing.device.condition}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Asking Price:</span>
                        <span className="ml-2 font-semibold text-green-600">
                          ₹{listing.device.askingPrice.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">IMEI:</span>
                        <span className="ml-2 font-mono text-xs">{listing.device.imei1}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Bidding Status */}
            {listing.status === 'BIDDING_ACTIVE' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Gavel className="h-5 w-5" />
                      <span>Live Bidding</span>
                    </span>
                    <Badge variant="outline" className="text-red-600 border-red-200">
                      <Timer className="h-3 w-3 mr-1" />
                      {timeRemaining}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Highest Bid */}
                    {highestBid && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-700 font-medium">Highest Bid</p>
                            <p className="text-2xl font-bold text-green-800">
                              ₹{highestBid.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-green-600">by {highestBid.vendorName}</p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                    )}

                    {/* All Bids */}
                    <div>
                      <h4 className="font-medium mb-3">All Bids ({listing.currentBids.length})</h4>
                      <div className="space-y-2">
                        {listing.currentBids.map((bid) => (
                          <div 
                            key={bid.id} 
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              bid.isHighest ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                            }`}
                          >
                            <div>
                              <p className="font-medium">₹{bid.amount.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">{bid.vendorName}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                {new Date(bid.placedAt).toLocaleTimeString()}
                              </p>
                              {bid.isHighest && (
                                <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                                  Highest
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Progress Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {listing.timeline.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {step.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : step.isActive ? (
                          <Clock className="h-5 w-5 text-blue-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${step.completed ? 'text-gray-900' : step.isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                            {step.title}
                          </h4>
                          {step.timestamp && (
                            <span className="text-xs text-gray-500">
                              {new Date(step.timestamp).toLocaleDateString()} {new Date(step.timestamp).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${step.completed ? 'text-gray-600' : step.isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Bids:</span>
                  <Badge variant="secondary">{listing.currentBids.length}</Badge>
                </div>
                {highestBid && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Highest Bid:</span>
                    <span className="font-semibold text-green-600">
                      ₹{highestBid.amount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Listed On:</span>
                  <span className="text-sm">
                    {new Date(listing.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Agent */}
            {listing.assignedAgent && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Assigned Agent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={listing.assignedAgent.profileImage || undefined} />
                      <AvatarFallback>
                        {listing.assignedAgent.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{listing.assignedAgent.name}</h4>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <span className="text-sm font-medium">{listing.assignedAgent.rating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Button variant="outline" className="w-full" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Agent
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View FAQ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 