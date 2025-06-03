'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Package,
  Phone,
  MessageCircle,
  Camera,
  LogOut,
  Settings,
  Bell,
  Navigation,
  Star,
  AlertTriangle,
  Eye,
  Smartphone,
  IndianRupee,
  User,
  Calendar,
  Activity,
  Route
} from 'lucide-react';
import { User as UserType } from '@/types';

// Mock data for agent dashboard
const mockAgentData = {
  stats: {
    totalPickups: 123,
    completedToday: 5,
    pendingPickups: 3,
    totalEarnings: 45600,
    averageRating: 4.8,
    completionRate: 96
  },
  assignedPickups: [
    {
      id: 'pickup_1',
      listingId: 'listing_123',
      device: 'iPhone 14 128GB',
      clientName: 'John Doe',
      clientPhone: '+919876543210',
      address: '123 Marine Drive, Kochi, Kerala 682001',
      scheduledTime: '2024-12-10T14:00:00Z',
      status: 'SCHEDULED',
      winningBid: 58000,
      vendorName: 'Mobile Mart Kerala',
      estimatedDistance: '5.2 km',
      priority: 'HIGH'
    },
    {
      id: 'pickup_2',
      listingId: 'listing_124',
      device: 'Samsung Galaxy S23 256GB',
      clientName: 'Priya Nair',
      clientPhone: '+919876543211',
      address: '456 MG Road, Thiruvananthapuram, Kerala 695001',
      scheduledTime: '2024-12-10T16:30:00Z',
      status: 'PENDING_CONFIRMATION',
      winningBid: 42000,
      vendorName: 'Tech Store',
      estimatedDistance: '12.8 km',
      priority: 'NORMAL'
    },
    {
      id: 'pickup_3',
      listingId: 'listing_125',
      device: 'OnePlus 11 Pro 256GB',
      clientName: 'Ravi Kumar',
      clientPhone: '+919876543212',
      address: '789 Fort Road, Kannur, Kerala 670001',
      scheduledTime: '2024-12-11T10:00:00Z',
      status: 'IN_PROGRESS',
      winningBid: 36500,
      vendorName: 'Phone World',
      estimatedDistance: '45.2 km',
      priority: 'NORMAL'
    }
  ],
  completedPickups: [
    {
      id: 'pickup_4',
      device: 'iPhone 13 128GB',
      clientName: 'Suresh Kumar',
      completedAt: '2024-12-09T18:30:00Z',
      earnings: 450,
      rating: 5
    },
    {
      id: 'pickup_5',
      device: 'Samsung Galaxy S22',
      clientName: 'Meera Nair',
      completedAt: '2024-12-09T15:45:00Z',
      earnings: 400,
      rating: 4
    }
  ]
};

export default function AgentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pickups' | 'verification' | 'history'>('pickups');
  const [verificationNotes, setVerificationNotes] = useState<Record<string, string>>({});

  useEffect(() => {
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
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cellflip_auth_token');
    localStorage.removeItem('cellflip_user');
    router.push('/login');
  };

  const handleAcceptPickup = async (pickupId: string) => {
    // Mock API call - backend will implement actual pickup acceptance
    console.log(`Accepting pickup ${pickupId}`);
    alert('Pickup accepted! Client will be notified.');
  };

  const handleStartPickup = async (pickupId: string) => {
    // Mock API call - backend will implement pickup start
    console.log(`Starting pickup ${pickupId}`);
    alert('Pickup started! Navigate to client location.');
  };

  const handleCompleteVerification = async (pickupId: string) => {
    const notes = verificationNotes[pickupId];
    if (!notes?.trim()) {
      alert('Please provide verification notes');
      return;
    }

    // Mock API call - backend will implement verification completion
    console.log(`Completing verification for ${pickupId} with notes: ${notes}`);
    alert('Device verified successfully! Transaction will be processed.');
    setVerificationNotes(prev => ({ ...prev, [pickupId]: '' }));
  };

  const handleRejectDevice = async (pickupId: string) => {
    const notes = verificationNotes[pickupId];
    if (!notes?.trim()) {
      alert('Please provide rejection reason');
      return;
    }

    // Mock API call - backend will implement device rejection
    console.log(`Rejecting device for ${pickupId} with reason: ${notes}`);
    alert('Device rejected. Client and vendor will be notified.');
    setVerificationNotes(prev => ({ ...prev, [pickupId]: '' }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING_CONFIRMATION':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'NORMAL':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading agent dashboard...</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-orange-600 to-red-600 text-white">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Agent Dashboard</h1>
                <p className="text-sm text-gray-500">Pickup & Verification Services</p>
              </div>
              <Badge variant="default" className="bg-orange-100 text-orange-800">
                <CheckCircle className="mr-1 h-3 w-3" />
                Verified Agent
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
            Manage your pickup assignments and device verifications.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pickups</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAgentData.stats.totalPickups}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Pickups</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{mockAgentData.stats.pendingPickups}</div>
              <p className="text-xs text-muted-foreground">Requires action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAgentData.stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">Out of 5 stars</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{mockAgentData.stats.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'pickups', label: 'Active Pickups', icon: Truck },
            { id: 'verification', label: 'Device Verification', icon: CheckCircle },
            { id: 'history', label: 'History', icon: Activity }
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

        {/* Active Pickups Tab */}
        {activeTab === 'pickups' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Assigned Pickups</h3>
              <Badge variant="secondary">{mockAgentData.assignedPickups.length} active</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockAgentData.assignedPickups.map((pickup) => (
                <Card key={pickup.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{pickup.device}</CardTitle>
                        <CardDescription>Client: {pickup.clientName}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant="outline" className={getStatusColor(pickup.status)}>
                          {pickup.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(pickup.priority)}>
                          {pickup.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Pickup Details */}
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Pickup Address</p>
                          <p className="text-sm text-gray-600">{pickup.address}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Scheduled Time</p>
                          <p className="text-sm text-gray-600">
                            {new Date(pickup.scheduledTime).toLocaleDateString()} at{' '}
                            {new Date(pickup.scheduledTime).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Route className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Distance</p>
                          <p className="text-sm text-gray-600">{pickup.estimatedDistance}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Winning Bid:</span>
                          <span className="ml-2 font-semibold text-green-600">
                            ₹{pickup.winningBid.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Vendor:</span>
                          <span className="ml-2 font-medium">{pickup.vendorName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex space-x-2 pt-3 border-t">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Client
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2">
                      {pickup.status === 'PENDING_CONFIRMATION' && (
                        <Button 
                          onClick={() => handleAcceptPickup(pickup.id)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept Pickup
                        </Button>
                      )}
                      
                      {pickup.status === 'SCHEDULED' && (
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleStartPickup(pickup.id)}
                            className="flex-1"
                          >
                            <Navigation className="h-4 w-4 mr-2" />
                            Start Pickup
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <MapPin className="h-4 w-4 mr-2" />
                            Navigate
                          </Button>
                        </div>
                      )}

                      {pickup.status === 'IN_PROGRESS' && (
                        <Button variant="outline" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Device Verification Tab */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Device Verification</h3>
              <Badge variant="secondary">Devices collected and ready for verification</Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Verification Checklist</CardTitle>
                <CardDescription>Complete device verification before confirming transaction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Mock device for verification */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Smartphone className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">iPhone 14 128GB</h4>
                        <p className="text-gray-600">Client: John Doe</p>
                        <p className="text-gray-600">Expected Condition: EXCELLENT</p>
                        <p className="text-green-600 font-medium">Winning Bid: ₹58,000</p>
                      </div>
                    </div>

                    {/* Verification Steps */}
                    <div className="space-y-4">
                      <h5 className="font-medium">Verification Steps:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Physical condition matches listing</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">IMEI verification completed</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Device functionality test</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Battery health check</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Accessories verification</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Photos uploaded</span>
                          </div>
                        </div>
                      </div>

                      {/* Verification Notes */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Verification Notes:
                        </label>
                        <Textarea
                          placeholder="Enter verification details, any issues found, or confirmation notes..."
                          value={verificationNotes['verification_1'] || ''}
                          onChange={(e) => setVerificationNotes(prev => ({
                            ...prev,
                            ['verification_1']: e.target.value
                          }))}
                          className="min-h-24"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3 pt-4 border-t">
                        <Button 
                          onClick={() => handleCompleteVerification('verification_1')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve & Complete Transaction
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => handleRejectDevice('verification_1')}
                          className="flex-1"
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Reject Device
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Completed Pickups</h3>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {mockAgentData.completedPickups.map((pickup) => (
                <Card key={pickup.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{pickup.device}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Client: {pickup.clientName}</span>
                          <span>Completed: {new Date(pickup.completedAt).toLocaleDateString()}</span>
                          <span>Earnings: ₹{pickup.earnings}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium">{pickup.rating}</span>
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        </div>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 