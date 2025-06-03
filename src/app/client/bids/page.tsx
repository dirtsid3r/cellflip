'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  TrendingUp,
  Clock,
  CheckCircle,
  Eye,
  MessageCircle,
  Timer
} from 'lucide-react';
import { User } from '@/types';

interface Bid {
  id: string;
  deviceId: string;
  device: {
    brand: string;
    model: string;
    variant: string;
    askingPrice: number;
    photo: string;
  };
  vendor: {
    id: string;
    name: string;
    businessName: string;
    rating: number;
    profileImage?: string;
  };
  amount: number;
  status: 'ACTIVE' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  message?: string;
  createdAt: string;
  expiresAt?: string;
}

export default function ClientBidsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock bids data
  const mockBids: Bid[] = [
    {
      id: '1',
      deviceId: '1',
      device: {
        brand: 'Apple',
        model: 'iPhone 14',
        variant: '128GB',
        askingPrice: 55000,
        photo: '/api/placeholder/100/100'
      },
      vendor: {
        id: 'v1',
        name: 'Rajesh Kumar',
        businessName: 'TechMobiles Kochi',
        rating: 4.8,
        profileImage: '/api/placeholder/40/40'
      },
      amount: 52000,
      status: 'ACTIVE',
      message: 'Great condition phone! Ready to pick up immediately.',
      createdAt: '2024-01-20T10:30:00Z',
      expiresAt: '2024-01-21T10:30:00Z'
    },
    {
      id: '2',
      deviceId: '1',
      device: {
        brand: 'Apple',
        model: 'iPhone 14',
        variant: '128GB',
        askingPrice: 55000,
        photo: '/api/placeholder/100/100'
      },
      vendor: {
        id: 'v2',
        name: 'Suresh Menon',
        businessName: 'Mobile Palace Thrissur',
        rating: 4.6,
        profileImage: '/api/placeholder/40/40'
      },
      amount: 50000,
      status: 'ACTIVE',
      message: 'Can collect today itself if deal is confirmed.',
      createdAt: '2024-01-20T09:15:00Z',
      expiresAt: '2024-01-21T09:15:00Z'
    },
    {
      id: '3',
      deviceId: '2',
      device: {
        brand: 'Samsung',
        model: 'Galaxy S23',
        variant: '256GB',
        askingPrice: 45000,
        photo: '/api/placeholder/100/100'
      },
      vendor: {
        id: 'v3',
        name: 'Arun Nair',
        businessName: 'Smart Devices Kerala',
        rating: 4.9,
        profileImage: '/api/placeholder/40/40'
      },
      amount: 42000,
      status: 'ACCEPTED',
      message: 'Excellent deal! Thank you for choosing us.',
      createdAt: '2024-01-19T14:20:00Z'
    },
    {
      id: '4',
      deviceId: '1',
      device: {
        brand: 'Apple',
        model: 'iPhone 14',
        variant: '128GB',
        askingPrice: 55000,
        photo: '/api/placeholder/100/100'
      },
      vendor: {
        id: 'v4',
        name: 'Vinod Thomas',
        businessName: 'Phone Hub Ernakulam',
        rating: 4.3,
        profileImage: '/api/placeholder/40/40'
      },
      amount: 48000,
      status: 'EXPIRED',
      message: 'Good condition, ready for immediate pickup.',
      createdAt: '2024-01-18T16:45:00Z',
      expiresAt: '2024-01-19T16:45:00Z'
    }
  ];

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
    setBids(mockBids);
    setIsLoading(false);
  }, [router]);

  const getStatusBadge = (status: Bid['status']) => {
    const statusConfig = {
      'ACTIVE': { variant: 'default' as const, label: 'Active', color: 'bg-blue-100 text-blue-800' },
      'ACCEPTED': { variant: 'default' as const, label: 'Accepted', color: 'bg-green-100 text-green-800' },
      'REJECTED': { variant: 'destructive' as const, label: 'Rejected', color: 'bg-red-100 text-red-800' },
      'EXPIRED': { variant: 'secondary' as const, label: 'Expired', color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getTimeRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null;
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const handleAcceptBid = (bidId: string) => {
    setBids(prev => prev.map(bid => 
      bid.id === bidId ? { ...bid, status: 'ACCEPTED' as const } : bid
    ));
    // Here you would call the API to accept the bid
  };

  const handleRejectBid = (bidId: string) => {
    setBids(prev => prev.map(bid => 
      bid.id === bidId ? { ...bid, status: 'REJECTED' as const } : bid
    ));
    // Here you would call the API to reject the bid
  };

  const activeBids = bids.filter(bid => bid.status === 'ACTIVE');
  const completedBids = bids.filter(bid => ['ACCEPTED', 'REJECTED', 'EXPIRED'].includes(bid.status));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bids...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Device Bids</h1>
              <p className="text-sm text-gray-500">Manage bids on your devices</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBids.length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting your response
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Highest Bid</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{activeBids.length > 0 ? Math.max(...activeBids.map(b => b.amount)).toLocaleString() : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Current highest offer
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bids.length}</div>
              <p className="text-xs text-muted-foreground">
                All time bids received
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Bids */}
        {activeBids.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Bids</h2>
            <div className="space-y-4">
              {activeBids.map((bid) => (
                <Card key={bid.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Device Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
                        <img
                          src={bid.device.photo}
                          alt={`${bid.device.brand} ${bid.device.model}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {bid.device.brand} {bid.device.model} {bid.device.variant}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Asking Price: ₹{bid.device.askingPrice.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              ₹{bid.amount.toLocaleString()}
                            </div>
                            {getStatusBadge(bid.status)}
                          </div>
                        </div>

                        {/* Vendor Info */}
                        <div className="flex items-center space-x-3 mt-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={bid.vendor.profileImage} alt={bid.vendor.name} />
                            <AvatarFallback>
                              {bid.vendor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{bid.vendor.name}</p>
                            <p className="text-sm text-gray-500">{bid.vendor.businessName}</p>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-yellow-500">★</span>
                              <span className="text-sm text-gray-600">{bid.vendor.rating}</span>
                            </div>
                          </div>
                        </div>

                        {/* Message */}
                        {bid.message && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <MessageCircle className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-700">{bid.message}</p>
                            </div>
                          </div>
                        )}

                        {/* Time and Actions */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Bid placed: {new Date(bid.createdAt).toLocaleDateString()}</span>
                            {bid.expiresAt && (
                              <div className="flex items-center space-x-1">
                                <Timer className="h-4 w-4" />
                                <span className="text-orange-600 font-medium">
                                  {getTimeRemaining(bid.expiresAt)}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {bid.status === 'ACTIVE' && (
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectBid(bid.id)}
                              >
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleAcceptBid(bid.id)}
                              >
                                Accept Bid
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Completed Bids */}
        {completedBids.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bid History</h2>
            <div className="space-y-4">
              {completedBids.map((bid) => (
                <Card key={bid.id} className="overflow-hidden opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Device Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                        <img
                          src={bid.device.photo}
                          alt={`${bid.device.brand} ${bid.device.model}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">
                              {bid.device.brand} {bid.device.model} {bid.device.variant}
                            </h3>
                            <p className="text-sm text-gray-500">{bid.vendor.businessName}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">₹{bid.amount.toLocaleString()}</div>
                            {getStatusBadge(bid.status)}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          {new Date(bid.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {bids.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bids yet</h3>
            <p className="text-gray-500 mb-6">
              Bids will appear here once vendors start bidding on your devices.
            </p>
            <Button onClick={() => router.push('/client/list-device')}>
              List a Device
            </Button>
          </div>
        )}
      </main>
    </div>
  );
} 