'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Smartphone, 
  Plus, 
  Search,
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
  Timer,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { User } from '@/types';

interface Device {
  id: string;
  brand: string;
  model: string;
  variant: string;
  condition: string;
  askingPrice: number;
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'BIDDING' | 'SOLD' | 'REJECTED';
  createdAt: string;
  photos: string[];
  bidsCount: number;
  highestBid?: number;
}

export default function ClientDevicesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock devices data
  const mockDevices: Device[] = [
    {
      id: '1',
      brand: 'Apple',
      model: 'iPhone 14',
      variant: '128GB',
      condition: 'EXCELLENT',
      askingPrice: 55000,
      status: 'ACTIVE',
      createdAt: '2024-01-15',
      photos: ['/api/placeholder/300/200'],
      bidsCount: 3,
      highestBid: 52000
    },
    {
      id: '2',
      brand: 'Samsung',
      model: 'Galaxy S23',
      variant: '256GB',
      condition: 'GOOD',
      askingPrice: 45000,
      status: 'BIDDING',
      createdAt: '2024-01-10',
      photos: ['/api/placeholder/300/200'],
      bidsCount: 5,
      highestBid: 42000
    },
    {
      id: '3',
      brand: 'OnePlus',
      model: '11 Pro',
      variant: '512GB',
      condition: 'EXCELLENT',
      askingPrice: 38000,
      status: 'SOLD',
      createdAt: '2024-01-05',
      photos: ['/api/placeholder/300/200'],
      bidsCount: 7,
      highestBid: 38000
    },
    {
      id: '4',
      brand: 'Xiaomi',
      model: '13 Pro',
      variant: '256GB',
      condition: 'FAIR',
      askingPrice: 32000,
      status: 'PENDING_APPROVAL',
      createdAt: '2024-01-20',
      photos: ['/api/placeholder/300/200'],
      bidsCount: 0
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
    setDevices(mockDevices);
    setIsLoading(false);
  }, [router]);

  const getStatusBadge = (status: Device['status']) => {
    const statusConfig = {
      'PENDING_APPROVAL': { variant: 'secondary' as const, label: 'Pending Review' },
      'ACTIVE': { variant: 'default' as const, label: 'Active' },
      'BIDDING': { variant: 'default' as const, label: 'Bidding Active' },
      'SOLD': { variant: 'destructive' as const, label: 'Sold' },
      'REJECTED': { variant: 'destructive' as const, label: 'Rejected' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: Device['status']) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return <Timer className="h-4 w-4" />;
      case 'ACTIVE':
      case 'BIDDING':
        return <CheckCircle className="h-4 w-4" />;
      case 'SOLD':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Timer className="h-4 w-4" />;
    }
  };

  const filteredDevices = devices.filter(device =>
    device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.variant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your devices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">My Devices</h1>
                <p className="text-sm text-gray-500">Manage your device listings</p>
              </div>
            </div>
            <Button onClick={() => router.push('/client/list-device')}>
              <Plus className="h-4 w-4 mr-2" />
              List New Device
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search devices by brand, model, or variant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Devices Grid */}
        {filteredDevices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDevices.map((device) => (
              <Card key={device.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  {device.photos[0] ? (
                    <img
                      src={device.photos[0]}
                      alt={`${device.brand} ${device.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Smartphone className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    {getStatusBadge(device.status)}
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {device.brand} {device.model}
                      </CardTitle>
                      <CardDescription>
                        {device.variant} • {device.condition}
                      </CardDescription>
                    </div>
                    {getStatusIcon(device.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Asking Price:</span>
                    <span className="font-semibold text-lg text-green-600">
                      ₹{device.askingPrice.toLocaleString()}
                    </span>
                  </div>
                  
                  {device.highestBid && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Highest Bid:</span>
                      <span className="font-medium text-blue-600">
                        ₹{device.highestBid.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bids:</span>
                    <span className="font-medium">
                      {device.bidsCount} {device.bidsCount === 1 ? 'bid' : 'bids'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Listed:</span>
                    <span className="text-sm">
                      {new Date(device.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push(`/client/devices/${device.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {(device.status === 'PENDING_APPROVAL' || device.status === 'ACTIVE') && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/client/devices/${device.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Smartphone className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No devices found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'No devices match your search criteria.' : "You haven't listed any devices yet."}
            </p>
            <Button onClick={() => router.push('/client/list-device')}>
              <Plus className="h-4 w-4 mr-2" />
              List Your First Device
            </Button>
          </div>
        )}
      </main>
    </div>
  );
} 