'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Star,
  User,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Calendar,
  Truck
} from 'lucide-react';

interface Transaction {
  id: string;
  listing: {
    id: string;
    brand: string;
    model: string;
    variant: string;
    condition: string;
    askingPrice: number;
    photos: string[];
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
    winningBid: number;
  };
  status: string;
  approvedAt: string;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
}

interface Agent {
  id: string;
  name: string;
  whatsappNumber: string;
  email: string;
  rating: number;
  totalPickups: number;
  activePickups: number;
  location: {
    city: string;
    state: string;
  };
  availability: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  distance?: number; // km from pickup location
  estimatedTime?: number; // minutes to reach
}

interface AgentAssignmentProps {
  transaction: Transaction;
  onAssignmentComplete: (agentId: string, scheduledTime: string) => void;
  onCancel: () => void;
}

export const AdminAgentAssignment: React.FC<AgentAssignmentProps> = ({
  transaction,
  onAssignmentComplete,
  onCancel
}) => {
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'NORMAL' | 'LOW'>(transaction.priority);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);

  // Mock agents data
  const mockAgents: Agent[] = [
    {
      id: 'agent_1',
      name: 'Priya Nair',
      whatsappNumber: '+919876543210',
      email: 'priya.nair@cellflip.com',
      rating: 4.9,
      totalPickups: 156,
      activePickups: 2,
      location: { city: 'Thiruvananthapuram', state: 'Kerala' },
      availability: 'AVAILABLE',
      distance: 5.2,
      estimatedTime: 25
    },
    {
      id: 'agent_2',
      name: 'Rahul Kumar',
      whatsappNumber: '+919876543211',
      email: 'rahul.kumar@cellflip.com',
      rating: 4.7,
      totalPickups: 134,
      activePickups: 3,
      location: { city: 'Thiruvananthapuram', state: 'Kerala' },
      availability: 'AVAILABLE',
      distance: 8.1,
      estimatedTime: 35
    },
    {
      id: 'agent_3',
      name: 'Anjali Menon',
      whatsappNumber: '+919876543212',
      email: 'anjali.menon@cellflip.com',
      rating: 4.8,
      totalPickups: 89,
      activePickups: 1,
      location: { city: 'Kochi', state: 'Kerala' },
      availability: 'BUSY',
      distance: 45.3,
      estimatedTime: 90
    },
    {
      id: 'agent_4',
      name: 'Suresh Pillai',
      whatsappNumber: '+919876543213',
      email: 'suresh.pillai@cellflip.com',
      rating: 4.6,
      totalPickups: 201,
      activePickups: 4,
      location: { city: 'Thiruvananthapuram', state: 'Kerala' },
      availability: 'AVAILABLE',
      distance: 12.8,
      estimatedTime: 40
    }
  ];

  useEffect(() => {
    const loadAvailableAgents = async () => {
      try {
        // Mock API call to get available agents near pickup location
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Filter and sort agents by availability and distance
        const filteredAgents = mockAgents
          .filter(agent => agent.location.city === transaction.client.address.city)
          .sort((a, b) => {
            // Prioritize available agents first
            if (a.availability === 'AVAILABLE' && b.availability !== 'AVAILABLE') return -1;
            if (b.availability === 'AVAILABLE' && a.availability !== 'AVAILABLE') return 1;
            
            // Then sort by distance
            return (a.distance || 0) - (b.distance || 0);
          });
          
        setAvailableAgents(filteredAgents.length > 0 ? filteredAgents : mockAgents);
      } catch (error) {
        console.error('Failed to load agents:', error);
        setAvailableAgents(mockAgents);
      } finally {
        setIsLoading(false);
      }
    };

    loadAvailableAgents();
  }, [transaction]);

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  const handleAssignment = async () => {
    if (!selectedAgent || !scheduledDate || !scheduledTime) {
      alert('Please select an agent and schedule time');
      return;
    }

    setIsAssigning(true);

    try {
      const scheduledDateTime = `${scheduledDate}T${scheduledTime}:00.000Z`;
      
      // Mock API call to assign agent
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Agent assignment:', {
        transactionId: transaction.id,
        agentId: selectedAgent.id,
        scheduledDateTime,
        priority,
        notes
      });

      onAssignmentComplete(selectedAgent.id, scheduledDateTime);
    } catch (error) {
      console.error('Assignment failed:', error);
      alert('Assignment failed. Please try again.');
    } finally {
      setIsAssigning(false);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'BUSY': return 'bg-orange-100 text-orange-800';
      case 'OFFLINE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'NORMAL': return 'bg-blue-100 text-blue-800';
      case 'LOW': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get minimum schedule time (current time + 2 hours)
  const getMinScheduleDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 2);
    return now.toISOString().slice(0, 16);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-4xl">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading available agents...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Assign Agent for Pickup</CardTitle>
              <CardDescription>
                Select an agent and schedule pickup for {transaction.listing.brand} {transaction.listing.model}
              </CardDescription>
            </div>
            <Badge className={getPriorityColor(priority)}>
              {priority} Priority
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Transaction Details */}
            <div className="space-y-6">
              {/* Transaction Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transaction Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      <span className="text-gray-600">Condition:</span>
                      <Badge variant="outline">{transaction.listing.condition}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Winning Bid:</span>
                      <span className="font-semibold text-green-600">₹{transaction.vendor.winningBid.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pickup Location</CardTitle>
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
                          <p className="text-gray-600">Landmark: {transaction.client.address.landmark}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assignment Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assignment Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HIGH">High Priority</SelectItem>
                        <SelectItem value="NORMAL">Normal Priority</SelectItem>
                        <SelectItem value="LOW">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Pickup Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Pickup Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Assignment Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any special instructions for the agent..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Agent Selection */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Available Agents</h3>
                
                {availableAgents.length === 0 ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      No agents available in {transaction.client.address.city}. 
                      Showing agents from nearby areas.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {availableAgents.map((agent) => (
                      <Card
                        key={agent.id}
                        className={`cursor-pointer transition-colors ${
                          selectedAgent?.id === agent.id
                            ? 'ring-2 ring-blue-500 bg-blue-50'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleAgentSelect(agent)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={`/agents/${agent.id}.jpg`} />
                              <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium truncate">{agent.name}</h4>
                                <Badge className={getAvailabilityColor(agent.availability)}>
                                  {agent.availability}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-xs text-gray-600 mb-2">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span>{agent.rating}</span>
                                </div>
                                <span>{agent.totalPickups} pickups</span>
                                <span>{agent.activePickups} active</span>
                              </div>

                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3 text-gray-400" />
                                  <span className="text-gray-600">{agent.location.city}</span>
                                </div>
                                
                                {agent.distance && (
                                  <div className="flex items-center space-x-3">
                                    <span className="text-gray-600">{agent.distance} km</span>
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3 text-gray-400" />
                                      <span className="text-gray-600">{agent.estimatedTime}m</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {agent.availability === 'BUSY' && (
                                <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                  Currently handling {agent.activePickups} active pickup{agent.activePickups !== 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Agent Summary */}
              {selectedAgent && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span>Selected Agent</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={`/agents/${selectedAgent.id}.jpg`} />
                        <AvatarFallback>{selectedAgent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedAgent.name}</p>
                        <p className="text-sm text-gray-600">{selectedAgent.whatsappNumber}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Rating:</span>
                        <span className="ml-2 font-medium">{selectedAgent.rating}/5.0</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Experience:</span>
                        <span className="ml-2 font-medium">{selectedAgent.totalPickups} pickups</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Distance:</span>
                        <span className="ml-2 font-medium">{selectedAgent.distance} km</span>
                      </div>
                      <div>
                        <span className="text-gray-600">ETA:</span>
                        <span className="ml-2 font-medium">{selectedAgent.estimatedTime} minutes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssignment}
              disabled={!selectedAgent || !scheduledDate || !scheduledTime || isAssigning}
            >
              {isAssigning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <Truck className="h-4 w-4 mr-2" />
                  Assign Agent
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 