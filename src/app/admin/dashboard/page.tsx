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
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Package, 
  Eye,
  LogOut,
  Settings,
  Bell,
  ShieldCheck,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Smartphone,
  IndianRupee,
  Timer,
  Gavel,
  UserCheck,
  AlertTriangle,
  Activity,
  BarChart3
} from 'lucide-react';
import { User as UserType } from '@/types';

// Mock data for admin dashboard
const mockAdminData = {
  stats: {
    totalUsers: 1250,
    activeListings: 45,
    pendingApprovals: 8,
    totalTransactions: 456,
    totalRevenue: 2850000,
    platformFee: 142500
  },
  pendingListings: [
    {
      id: 'listing_1',
      clientName: 'John Doe',
      clientPhone: '+919876543210',
      brand: 'Apple',
      model: 'iPhone 14',
      variant: '128GB',
      condition: 'EXCELLENT',
      askingPrice: 65000,
      photos: ['/device-photos/iphone14-1.jpg'],
      submittedAt: '2024-12-10T10:30:00Z',
      imei1: '123456789012345',
      location: 'Kochi, Kerala'
    },
    {
      id: 'listing_2',
      clientName: 'Priya Nair',
      clientPhone: '+919876543211',
      brand: 'Samsung',
      model: 'Galaxy S23',
      variant: '256GB',
      condition: 'GOOD',
      askingPrice: 45000,
      photos: ['/device-photos/galaxy-s23-1.jpg'],
      submittedAt: '2024-12-10T11:15:00Z',
      imei1: '123456789012346',
      location: 'Thiruvananthapuram, Kerala'
    }
  ],
  pendingUsers: [
    {
      id: 'user_1',
      name: 'Rajesh Kumar',
      phone: '+919876543212',
      role: 'VENDOR',
      businessName: 'Mobile World Kerala',
      submittedAt: '2024-12-09T14:20:00Z',
      documents: ['pan_card.jpg', 'business_license.pdf']
    },
    {
      id: 'user_2',
      name: 'Suresh Agent',
      phone: '+919876543213',
      role: 'AGENT',
      businessName: 'Tech Pickup Services',
      submittedAt: '2024-12-09T16:45:00Z',
      documents: ['id_proof.jpg', 'vehicle_registration.pdf']
    }
  ],
  recentTransactions: [
    {
      id: 'txn_1',
      device: 'iPhone 13 128GB',
      client: 'John Doe',
      vendor: 'Mobile Mart',
      agent: 'Rajesh Agent',
      amount: 45000,
      status: 'COMPLETED',
      completedAt: '2024-12-09T18:30:00Z'
    },
    {
      id: 'txn_2',
      device: 'Samsung Galaxy S22',
      client: 'Priya Nair',
      vendor: 'Tech Store',
      agent: 'Suresh Agent',
      amount: 38000,
      status: 'IN_PROGRESS',
      createdAt: '2024-12-10T09:15:00Z'
    }
  ]
};

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'users' | 'transactions'>('overview');
  const [rejectionComments, setRejectionComments] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('cellflip_user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const currentUser: UserType = JSON.parse(userData);
    if (currentUser.role !== 'ADMIN') {
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

  const handleApproveListing = async (listingId: string) => {
    // Mock API call - backend will implement actual approval
    console.log(`Approving listing ${listingId}`);
    alert('Listing approved successfully! Vendors will be notified.');
  };

  const handleRejectListing = async (listingId: string) => {
    const comments = rejectionComments[listingId];
    if (!comments?.trim()) {
      alert('Please provide rejection comments');
      return;
    }

    // Mock API call - backend will implement actual rejection
    console.log(`Rejecting listing ${listingId} with comments: ${comments}`);
    alert('Listing rejected. Client will be notified via WhatsApp.');
    setRejectionComments(prev => ({ ...prev, [listingId]: '' }));
  };

  const handleApproveUser = async (userId: string) => {
    // Mock API call - backend will implement actual user approval
    console.log(`Approving user ${userId}`);
    alert('User approved successfully!');
  };

  const handleRejectUser = async (userId: string) => {
    // Mock API call - backend will implement actual user rejection
    console.log(`Rejecting user ${userId}`);
    alert('User application rejected.');
  };

  const handleAssignAgent = async (transactionId: string, agentId: string) => {
    // Mock API call - backend will implement agent assignment
    console.log(`Assigning agent ${agentId} to transaction ${transactionId}`);
    alert('Agent assigned successfully!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Cellflip Platform Management</p>
              </div>
              <Badge variant="default" className="bg-purple-100 text-purple-800">
                <ShieldCheck className="mr-1 h-3 w-3" />
                Administrator
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
            Monitor platform activity and manage approvals.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAdminData.stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">All registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{mockAdminData.stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAdminData.stats.totalTransactions}</div>
              <p className="text-xs text-muted-foreground">Completed deals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{mockAdminData.stats.platformFee.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Commission earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'listings', label: 'Pending Listings', icon: Package },
            { id: 'users', label: 'User Approvals', icon: UserCheck },
            { id: 'transactions', label: 'Transactions', icon: Activity }
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Platform management shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" onClick={() => setActiveTab('listings')}>
                  <Package className="h-4 w-4 mr-2" />
                  Review Pending Listings ({mockAdminData.pendingListings.length})
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('users')}>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Approve New Users ({mockAdminData.pendingUsers.length})
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('transactions')}>
                  <Activity className="h-4 w-4 mr-2" />
                  Monitor Transactions
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
                <CardDescription>System status and metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Listings</span>
                  <Badge variant="default">{mockAdminData.stats.activeListings}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">System Status</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-medium">&lt; 200ms</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pending Listings Tab */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Pending Listing Approvals</h3>
              <Badge variant="secondary">{mockAdminData.pendingListings.length} pending</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockAdminData.pendingListings.map((listing) => (
                <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{listing.brand} {listing.model}</CardTitle>
                        <CardDescription>{listing.variant} • {listing.condition}</CardDescription>
                      </div>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Device Photo */}
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="h-12 w-12 text-gray-400" />
                    </div>

                    {/* Client Info */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Client:</span>
                        <span className="font-medium">{listing.clientName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="font-medium">{listing.clientPhone}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Asking Price:</span>
                        <span className="font-semibold text-lg">₹{listing.askingPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">IMEI:</span>
                        <span className="font-mono text-sm">{listing.imei1}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Location:</span>
                        <span className="text-sm">📍 {listing.location}</span>
                      </div>
                    </div>

                    {/* Rejection Comments */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Rejection Comments (if rejecting):
                      </label>
                      <Textarea
                        placeholder="Provide reason for rejection..."
                        value={rejectionComments[listing.id] || ''}
                        onChange={(e) => setRejectionComments(prev => ({
                          ...prev,
                          [listing.id]: e.target.value
                        }))}
                        className="min-h-20"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-3 border-t">
                      <Button 
                        onClick={() => handleApproveListing(listing.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleRejectListing(listing.id)}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* User Approvals Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Pending User Approvals</h3>
              <Badge variant="secondary">{mockAdminData.pendingUsers.length} pending</Badge>
            </div>

            <div className="space-y-4">
              {mockAdminData.pendingUsers.map((pendingUser) => (
                <Card key={pendingUser.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {pendingUser.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{pendingUser.name}</h4>
                            <p className="text-sm text-gray-600">{pendingUser.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Role: <Badge variant="outline">{pendingUser.role}</Badge></span>
                          <span>Business: {pendingUser.businessName}</span>
                          <span>Applied: {new Date(pendingUser.submittedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Documents:</span>
                          {pendingUser.documents.map((doc, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Button 
                          onClick={() => handleApproveUser(pendingUser.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => handleRejectUser(pendingUser.id)}
                          size="sm"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {mockAdminData.recentTransactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h4 className="font-semibold">{transaction.device}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Client: {transaction.client}</span>
                          <span>Vendor: {transaction.vendor}</span>
                          <span>Agent: {transaction.agent}</span>
                          <span>Amount: ₹{transaction.amount.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={transaction.status === 'COMPLETED' ? 'default' : 'secondary'}
                          className={transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {transaction.status}
                        </Badge>
                        {transaction.status === 'IN_PROGRESS' && (
                          <Button variant="outline" size="sm">
                            Assign Agent
                          </Button>
                        )}
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