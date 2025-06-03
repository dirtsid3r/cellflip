'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Smartphone, 
  Plus, 
  TrendingUp, 
  Package, 
  Eye,
  LogOut,
  Settings,
  Bell,
  Loader2,
  CheckCircle,
  Timer
} from 'lucide-react';
import { User } from '@/types';
import { apiService } from '@/lib/api';

interface DashboardData {
  stats: {
    totalListings: number;
    activeListings: number;
    completedTransactions: number;
    totalEarnings: number;
  };
  recentDevices: Array<{
    id: string;
    brand: string;
    model: string;
    variant: string;
    condition: string;
    askingPrice: number;
    status: string;
  }>;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showListingSuccess, setShowListingSuccess] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('cellflip_auth_token');
      const userData = localStorage.getItem('cellflip_user');
      
      if (!token || !userData) {
        router.push('/login');
        return;
      }

      const currentUser: User = JSON.parse(userData);
      setUser(currentUser);

      // Redirect to role-specific dashboards
      if (currentUser.role === 'VENDOR') {
        router.push('/vendor/dashboard');
        return;
      } else if (currentUser.role === 'ADMIN') {
        router.push('/admin/dashboard');
        return;
      } else if (currentUser.role === 'AGENT') {
        router.push('/agent/dashboard');
        return;
      }

      // For CLIENT role, continue with existing dashboard
      if (currentUser.role !== 'CLIENT') {
        router.push('/login');
        return;
      }

      const dashboardResponse = await apiService.getDashboardData(currentUser.id);
      if (dashboardResponse.success && dashboardResponse.data) {
        setDashboardData(dashboardResponse.data);
      }
    } catch (error) {
      console.error('Dashboard initialization failed:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check for listing submission success
    if (searchParams.get('listing_submitted') === 'true') {
      setShowListingSuccess(true);
      // Clear the URL parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem('cellflip_auth_token');
    localStorage.removeItem('cellflip_user');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Smartphone className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Cellflip Dashboard</h1>
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
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success Alert */}
          {showListingSuccess && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>Listing submitted successfully!</strong> Your device has been submitted for review. 
                You&apos;ll receive confirmation via WhatsApp within 2 hours. Once approved, bidding will begin automatically.
              </AlertDescription>
            </Alert>
          )}

          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600">
              Track your device sales and discover new opportunities
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Listings
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.stats.totalListings}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total devices you&apos;ve listed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Listings
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.stats.activeListings}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently active listings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Transactions
                </CardTitle>
                <Smartphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.stats.completedTransactions}
                </div>
                <p className="text-xs text-muted-foreground">
                  Successfully completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Earnings
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{dashboardData?.stats.totalEarnings.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  From all transactions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  What would you like to do today?
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => router.push('/client/list-device')}
                >
                  <Plus className="h-6 w-6 mb-2" />
                  List a Device
                </Button>
                <Button 
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => router.push('/client/devices')}
                >
                  <Eye className="h-6 w-6 mb-2" />
                  View My Listings
                </Button>
                <Button 
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => router.push('/client/bids')}
                >
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Check Bids
                </Button>
                <Button 
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => router.push('/client/profile')}
                >
                  <Settings className="h-6 w-6 mb-2" />
                  Profile Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Status</span>
                  <Badge variant={user.isApproved ? 'default' : 'destructive'}>
                    {user.isApproved ? 'APPROVED' : 'PENDING'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">User Type</span>
                  <Badge variant="outline">
                    {user.role}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Devices</CardTitle>
                <CardDescription>
                  Your latest device listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData?.recentDevices && dashboardData.recentDevices.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentDevices.slice(0, 3).map((device) => (
                      <div key={device.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">
                            {device.brand} {device.model}
                          </p>
                          <p className="text-sm text-gray-500">
                            {device.variant} • {device.condition}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{device.askingPrice.toLocaleString()}</p>
                          <Badge variant={device.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {device.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Smartphone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No devices listed yet</p>
                    <Button onClick={() => router.push('/client/list-device')}>
                      <Plus className="h-4 w-4 mr-2" />
                      List Your First Device
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No recent activity</p>
                    <p className="text-sm text-gray-400">
                      Activity will appear here when you start listing devices
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CustomerDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
} 