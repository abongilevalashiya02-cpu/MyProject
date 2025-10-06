
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Plus, Edit2, Eye, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock data for draft packages
const draftPackages = [
  {
    id: 1,
    name: 'Safari Getaway',
    destination: 'Tanzania',
    dates: 'Aug 15-22',
    status: 'Draft',
    travelers: 4
  },
  {
    id: 2,
    name: 'Morocco Flavors',
    destination: 'Marrakech',
    dates: 'Sep 01-07',
    status: 'Saved',
    travelers: 2
  },
  {
    id: 3,
    name: 'Cape Town Adventure',
    destination: 'South Africa',
    dates: 'Oct 10-17',
    status: 'Published',
    travelers: 6
  }
];

// Mock data for suggestion items
const suggestionItems = {
  tours: [
    { id: 1, name: 'Walking Tour (History)', price: 45, category: 'Tour' },
    { id: 2, name: 'Wine Tasting Experience', price: 75, category: 'Tour' },
    { id: 3, name: 'Street Art Discovery', price: 30, category: 'Tour' }
  ],
  dining: [
    { id: 4, name: 'Restaurant A (Views)', price: 60, category: 'Dining' },
    { id: 5, name: 'Cafe B (Local Favorite)', price: 25, category: 'Dining' },
    { id: 6, name: 'Fine Dining Experience', price: 120, category: 'Dining' }
  ],
  transfers: [
    { id: 7, name: 'Airport Pickup', price: 35, category: 'Transfer' },
    { id: 8, name: 'Private Car Service', price: 80, category: 'Transfer' },
    { id: 9, name: 'Guided City Transport', price: 50, category: 'Transfer' }
  ],
};

const PackageBuilder = () => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [selectedSuggestionTab, setSelectedSuggestionTab] = useState('tours');
  const [itineraryDays, setItineraryDays] = useState<string[]>(['Day 1', 'Day 2', 'Day 3']);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  const handleStartBuild = () => {
    if (destination.trim() && startDate && endDate) {
      setIsBuilding(true);
    }
  };
  
  const handleAddItem = (itemId: number) => {
    setSelectedItems((prev) => [...prev, itemId]);
  };
  
  const handleAddDay = () => {
    setItineraryDays((prev) => [...prev, `Day ${prev.length + 1}`]);
  };

  const getTotalSelectedItemsPrice = () => {
    const allItems = [...suggestionItems.tours, ...suggestionItems.dining, ...suggestionItems.transfers];
    return selectedItems.reduce((total, id) => {
      const item = allItems.find(item => item.id === id);
      return total + (item?.price || 0);
    }, 0);
  };
  
  return (
    <div className="space-y-6">
      {!isBuilding ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Start Building a Custom Package</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">1. Where are they going?</Label>
              <Input 
                placeholder="Enter Destination (City, Region, Country)" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-base font-medium">2. When are they traveling?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input 
                    type="date" 
                    placeholder="Start Date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Input 
                    type="date" 
                    placeholder="End Date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-base font-medium">3. How many travelers?</Label>
              <Input 
                type="number" 
                min={1} 
                max={20} 
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value) || 2)}
                className="max-w-xs"
              />
            </div>
            
            <Button 
              className="mt-6" 
              size="lg"
              onClick={handleStartBuild}
              disabled={!destination.trim() || !startDate || !endDate}
            >
              Find Services & Start Building
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div>
          <Card className="mb-6">
            <CardHeader className="pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">
                  Building: {destination} Trip | {startDate} to {endDate} | {travelers} Travelers
                </CardTitle>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Edit2 className="w-4 h-4" /> Edit Package Name
              </Button>
            </CardHeader>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel - Itinerary & Cost */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Itinerary & Cost</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Itinerary</h3>
                  </div>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-md">
                    {itineraryDays.map((day, index) => (
                      <div key={index} className="flex flex-col space-y-2 p-3 bg-white border rounded-md">
                        <div className="font-medium">{day}</div>
                        {index === 0 && (
                          <div className="text-sm text-slate-600">Arrival Transfer, Hotel Check-in</div>
                        )}
                        {index > 0 && (
                          <div className="text-sm text-slate-500 border border-dashed border-slate-200 rounded p-2 flex justify-center items-center">
                            <Button variant="ghost" size="sm" className="h-6">
                              <Plus className="h-3 w-3 mr-1" /> Add Activity
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" onClick={handleAddDay}>
                      <Plus className="mr-1 h-4 w-4" /> Add Day
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Package Cost</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Flights</span>
                      <span>$800</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accommodation</span>
                      <span>$1,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Services/Tours</span>
                      <span>${getTotalSelectedItemsPrice()}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${2000 + getTotalSelectedItemsPrice()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Commission:</span>
                      <Input className="w-24 h-8" defaultValue="15%" />
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2">
                      <span>Total Price</span>
                      <span>${Math.round((2000 + getTotalSelectedItemsPrice()) * 1.15)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button variant="outline">Save Draft</Button>
                  <Button variant="outline">Preview Itinerary</Button>
                  <Button variant="outline">Generate Quote</Button>
                  <Button>Publish</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Right Panel - Add Components & Services */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Available for {destination}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="suggestions">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                    <TabsTrigger value="flights">Flights</TabsTrigger>
                    <TabsTrigger value="hotels">Hotels</TabsTrigger>
                    <TabsTrigger value="activities">Activities</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="suggestions" className="space-y-4">
                    <Tabs value={selectedSuggestionTab} onValueChange={setSelectedSuggestionTab}>
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="tours">Tours</TabsTrigger>
                        <TabsTrigger value="dining">Dining</TabsTrigger>
                        <TabsTrigger value="transfers">Transfers</TabsTrigger>
                      </TabsList>
                      
                      {/* Tours Tab */}
                      <TabsContent value="tours" className="space-y-4">
                        <p className="text-sm text-muted-foreground">Based on your destination & dates:</p>
                        <h4 className="font-medium">Top Tours & Activities:</h4>
                        <div className="space-y-2">
                          {suggestionItems.tours.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 border rounded-md bg-white">
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-muted-foreground">${item.price} per person</div>
                              </div>
                              <Button 
                                size="sm" 
                                variant={selectedItems.includes(item.id) ? "default" : "outline"}
                                onClick={() => handleAddItem(item.id)}
                                disabled={selectedItems.includes(item.id)}
                              >
                                {selectedItems.includes(item.id) ? "Added" : "+ Add"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      {/* Dining Tab */}
                      <TabsContent value="dining" className="space-y-4">
                        <p className="text-sm text-muted-foreground">Based on your destination & dates:</p>
                        <h4 className="font-medium">Recommended Dining:</h4>
                        <div className="space-y-2">
                          {suggestionItems.dining.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 border rounded-md bg-white">
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-muted-foreground">~${item.price} per person</div>
                              </div>
                              <Button 
                                size="sm" 
                                variant={selectedItems.includes(item.id) ? "default" : "outline"}
                                onClick={() => handleAddItem(item.id)}
                                disabled={selectedItems.includes(item.id)}
                              >
                                {selectedItems.includes(item.id) ? "Added" : "+ Add"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      {/* Transfers Tab */}
                      <TabsContent value="transfers" className="space-y-4">
                        <p className="text-sm text-muted-foreground">Based on your destination & dates:</p>
                        <h4 className="font-medium">Essential Transfers:</h4>
                        <div className="space-y-2">
                          {suggestionItems.transfers.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 border rounded-md bg-white">
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-muted-foreground">${item.price} total</div>
                              </div>
                              <Button 
                                size="sm" 
                                variant={selectedItems.includes(item.id) ? "default" : "outline"}
                                onClick={() => handleAddItem(item.id)}
                                disabled={selectedItems.includes(item.id)}
                              >
                                {selectedItems.includes(item.id) ? "Added" : "+ Add"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <p className="text-sm text-muted-foreground italic">Switch tabs above to browse all options</p>
                  </TabsContent>
                  
                  <TabsContent value="flights">
                    <div className="p-4 text-center">
                      <p>Flight booking feature coming soon</p>
                      <p className="text-sm text-muted-foreground mt-2">Browse flights for your package</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="hotels">
                    <div className="p-4 text-center">
                      <p>Hotel booking feature coming soon</p>
                      <p className="text-sm text-muted-foreground mt-2">Browse accommodations for your package</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="activities">
                    <div className="p-4 text-center">
                      <p>Activities feature coming soon</p>
                      <p className="text-sm text-muted-foreground mt-2">Browse activities and experiences</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* Saved Packages Section */}
      {!isBuilding && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Your Custom Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input className="max-w-md" placeholder="Search packages..." />
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Package Name</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {draftPackages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-medium">{pkg.name}</TableCell>
                        <TableCell>{pkg.destination}</TableCell>
                        <TableCell>{pkg.dates}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              pkg.status === 'Published' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : pkg.status === 'Saved' 
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                                : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                            }
                          >
                            {pkg.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PackageBuilder;
