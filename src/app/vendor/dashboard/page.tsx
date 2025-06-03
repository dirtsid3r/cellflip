'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ShoppingCart, 
  TrendingUp, 
  Star, 
  Package, 
  Eye,
  LogOut,
  Settings,
  Bell,
  Building,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Smartphone,
  IndianRupee,
  Timer,
  Gavel
} from 'lucide-react';
import { User, DeviceListing } from '@/types';

// Mock data for vendor dashboard
const mockVendorData = {
  stats: {
    totalBids: 45,
    activeBids: 8,
    wonBids: 12,
    totalSpent: 580000,
    averageDiscount: 15,
    successRate: 27
  },
  availableListings: [
    {
      id: 'listing_1',
      brand: 'Apple',
      model: 'iPhone 14',
      variant: '128GB',
      condition: 'EXCELLENT',
      askingPrice: 65000,
      photos: ['/device-photos/iphone14-1.jpg'],
      timeRemaining: '18h 30m',
      currentHighestBid: 58000,
      bidCount: 3,
      location: 'Kochi, Kerala'
    },
    {
      id: 'listing_2',
      brand: 'Samsung',
      model: 'Galaxy S23',
      variant: '256GB',
      condition: 'GOOD',
      askingPrice: 45000,
      photos: ['/device-photos/galaxy-s23-1.jpg'],
      timeRemaining: '6h 15m',
      currentHighestBid: 42000,
      bidCount: 7,
      location: 'Thiruvananthapuram, Kerala'
    },
    {
      id: 'listing_3',
      brand: 'OnePlus',
      model: '11 Pro',
      variant: '256GB',
      condition: 'EXCELLENT',
      askingPrice: 38000,
      photos: ['/device-photos/oneplus-11-1.jpg'],
      timeRemaining: '2h 45m',
      currentHighestBid: 36500,
      bidCount: 5,
      location: 'Kochi, Kerala'
    }
  ],
  activeBids: [
    {
      id: 'bid_1',
      listingId: 'listing_1',
      device: 'iPhone 14 128GB',
      myBid: 58000,
      currentHighest: 58000,
      status: 'HIGHEST',
      timeRemaining: '18h 30m'
    },
    {
      id: 'bid_2',
      listingId: 'listing_2',
      device: 'Galaxy S23 256GB',
      myBid: 41000,
      currentHighest: 42000,
      status: 'OUTBID',
      timeRemaining: '6h 15m'
    }
  ]
};

export default function VendorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'bids' | 'history'>('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [bidAmounts, setBidAmounts] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('cellflip_user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const currentUser: User = JSON.parse(userData);
    if (currentUser.role !== 'VENDOR') {
      router.push('/dashboard');
      return;
    }

    setUser(currentUser);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cellflip_auth_token');
    localStorage.removeItem('cellflip_user');
    router.push('/login');
  };

  const handlePlaceBid = async (listingId: string) => {
    const amount = bidAmounts[listingId];
    if (!amount) return;

    // Mock API call - backend will implement actual bidding
    console.log(`Placing bid of ₹${amount} on listing ${listingId}`);
    
    // Simulate API success
    alert(`Bid of ₹${amount} placed successfully!`);
    setBidAmounts(prev => ({ ...prev, [listingId]: '' }));
  };

  const handleViewDetails = (listingId: string) => {
    router.push(`/vendor/listing/${listingId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load dashboard data.</p>
          <Button onClick={() => router.push('/login')} className="mt-4">
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  const businessName = user.businessInfo?.businessName || `${user.firstName} ${user.lastName}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Vendor Dashboard</h1>
                <p className="text-sm text-gray-500">{businessName}</p>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="mr-1 h-3 w-3" />
                Verified Vendor
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profileImage} alt={user.firstName} />
                  <AvatarFallback>
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName}!
          </h2>
          <p className="text-gray-600">
            Browse new listings and manage your bidding activity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
              <Gavel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockVendorData.stats.totalBids}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockVendorData.stats.activeBids}</div>
              <p className="text-xs text-muted-foreground">Currently bidding</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockVendorData.stats.successRate}%</div>
              <p className="text-xs text-muted-foreground">Winning bids</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{mockVendorData.stats.totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total investment</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
            { id: 'bids', label: 'My Bids', icon: Gavel },
            { id: 'history', label: 'History', icon: Clock }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center space-x-2"
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filter Listings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by brand, model..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="samsung">Samsung</SelectItem>
                    <SelectItem value="oneplus">OnePlus</SelectItem>
                    <SelectItem value="xiaomi">Xiaomi</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Available Listings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockVendorData.availableListings.map((listing) => (
                <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{listing.brand} {listing.model}</CardTitle>
                        <CardDescription>{listing.variant} • {listing.condition}</CardDescription>
                      </div>
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        <Clock className="h-3 w-3 mr-1" />
                        {listing.timeRemaining}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Device Photo */}
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="h-12 w-12 text-gray-400" />
                    </div>

                    {/* Pricing Info */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Asking Price:</span>
                        <span className="font-semibold text-lg">₹{listing.askingPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Highest Bid:</span>
                        <span className="font-medium text-green-600">₹{listing.currentHighestBid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Bids:</span>
                        <Badge variant="secondary">{listing.bidCount}</Badge>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="text-sm text-gray-500">📍 {listing.location}</div>

                    {/* Bidding Interface */}
                    <div className="space-y-3 pt-3 border-t">
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="Enter bid amount"
                          value={bidAmounts[listing.id] || ''}
                          onChange={(e) => setBidAmounts(prev => ({
                            ...prev,
                            [listing.id]: e.target.value
                          }))}
                          className="flex-1"
                        />
                        <Button 
                          onClick={() => handlePlaceBid(listing.id)}
                          disabled={!bidAmounts[listing.id]}
                          size="sm"
                        >
                          <Gavel className="h-4 w-4 mr-1" />
                          Bid
                        </Button>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleViewDetails(listing.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* My Bids Tab */}
        {activeTab === 'bids' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Bids</CardTitle>
                <CardDescription>Track your current bidding activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockVendorData.activeBids.map((bid) => (
                    <div key={bid.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{bid.device}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Your Bid: ₹{bid.myBid.toLocaleString()}</span>
                          <span>Current Highest: ₹{bid.currentHighest.toLocaleString()}</span>
                          <span>Time Left: {bid.timeRemaining}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={bid.status === 'HIGHEST' ? 'default' : 'destructive'}
                          className={bid.status === 'HIGHEST' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {bid.status === 'HIGHEST' ? 'Leading' : 'Outbid'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Increase Bid
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bidding History</CardTitle>
                <CardDescription>Your past bidding activity and purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No bidding history yet</p>
                  <p className="text-sm text-gray-400">Start bidding to see your history here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
} 