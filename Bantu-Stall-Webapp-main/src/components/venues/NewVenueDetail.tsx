import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VenueType } from '@/types/venues';
import { getAllVenues } from '@/data/venues';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VenueVideoCard from './VenueVideoCard';
import { 
  ArrowLeft, MapPin, Users, Star, Plane, Building, 
  Leaf, Shield, Award, Clock, DollarSign, Info,
  Phone, Mail, MessageCircle
} from 'lucide-react';

interface NewVenueDetailProps {
  venue?: VenueType;
  isModal?: boolean;
  onClose?: () => void;
}

const NewVenueDetail: React.FC<NewVenueDetailProps> = ({ 
  venue: propVenue, 
  isModal = false, 
  onClose 
}) => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<VenueType | null>(propVenue || null);
  const [selectedLayout, setSelectedLayout] = useState<string>('boardroom');
  const [showIncludedModal, setShowIncludedModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<string>('main-hall');

  useEffect(() => {
    if (!propVenue && venueId) {
      const loadVenues = async () => {
        const allVenues = await getAllVenues();
        const foundVenue = allVenues.find(v => v.id === venueId);
        setVenue(foundVenue || null);
      };
      loadVenues();
    }
    if (!isModal) {
      window.scrollTo(0, 0);
    }
  }, [venueId, propVenue, isModal]);

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Venue not found</h2>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-bantu-orange text-bantu-orange' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const layoutCapacities = {
    boardroom: Math.floor((venue.capacity.max || 50) * 0.6),
    theater: venue.capacity.max || 50,
    classroom: Math.floor((venue.capacity.max || 50) * 0.8),
    'u-shape': Math.floor((venue.capacity.max || 50) * 0.7),
    cocktail: Math.floor((venue.capacity.max || 50) * 1.2)
  };

  const layoutPricing = {
    'half-day': {
      boardroom: 8500,
      theater: 12000,
      classroom: 10000,
      'u-shape': 9500,
      cocktail: 15000
    },
    'full-day': {
      boardroom: 15000,
      theater: 22000,
      classroom: 18000,
      'u-shape': 17000,
      cocktail: 28000
    }
  };

  const content = (
    <div className="w-full">
      {/* Module 1: Immersive Hero & Narrative Hook */}
      <section className="relative h-screen w-full overflow-hidden">
        {venue.videoId ? (
          <VenueVideoCard
            videoId={venue.videoId}
            title={venue.name}
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <img
            src={venue.coverImage}
            alt={venue.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Where Strategy Meets Serenity
            </h1>
            <h2 className="text-xl md:text-2xl mb-6 font-light">
              Your Next Executive Retreat at {venue.name}
            </h2>
            <div className="max-w-2xl mx-auto">
              <p className="text-lg leading-relaxed mb-4">
                Nestled in the heart of {venue.location.area}, {venue.name} offers a perfect blend of 
                sophisticated meeting spaces and tranquil natural surroundings. Founded with the vision 
                of creating meaningful corporate experiences, our venue has hosted countless successful 
                retreats and strategic planning sessions.
              </p>
              <p className="text-lg leading-relaxed">
                Every detail has been thoughtfully curated to foster creativity, collaboration, and 
                breakthrough thinking in an environment that inspires your team to reach new heights.
              </p>
            </div>
          </div>
        </div>
        {!isModal && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 left-4 text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
      </section>

      {/* Module 2: At-a-Glance Dashboard & Amenities */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            <div className="text-center">
              <Building className="h-8 w-8 mx-auto mb-2 text-bantu-orange" />
              <div className="font-semibold">Venue Type</div>
              <div className="text-sm text-muted-foreground">Corporate Retreat</div>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-bantu-orange" />
              <div className="font-semibold">Location</div>
              <div className="text-sm text-muted-foreground">{venue.location.city}</div>
            </div>
            <div className="text-center">
              <Plane className="h-8 w-8 mx-auto mb-2 text-bantu-orange" />
              <div className="font-semibold">Nearest Airport</div>
              <div className="text-sm text-muted-foreground">OR Tambo (45 min)</div>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-bantu-orange" />
              <div className="font-semibold">Event Capacity</div>
              <div className="text-sm text-muted-foreground">Up to {venue.capacity.max}</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {renderStars(venue.bantuRating)}
              </div>
              <div className="font-semibold">Bantu Rating</div>
              <div className="text-sm text-muted-foreground">{venue.bantuRating}/5 Stars</div>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Comprehensive Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Technology</h4>
                  <ul className="space-y-1 text-sm">
                    <li>✓ High-speed Wi-Fi</li>
                    <li>✓ AV Equipment</li>
                    <li>✓ Video Conferencing</li>
                    <li>✓ Smart Screens</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Catering</h4>
                  <ul className="space-y-1 text-sm">
                    <li>✓ On-site Restaurant</li>
                    <li>✓ Coffee Stations</li>
                    <li>✓ Custom Menus</li>
                    <li>✓ Dietary Options</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Logistics</h4>
                  <ul className="space-y-1 text-sm">
                    <li>✓ Ample Parking</li>
                    <li>✓ Shuttle Service</li>
                    <li>✓ Storage Spaces</li>
                    <li>✓ Registration Area</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Support</h4>
                  <ul className="space-y-1 text-sm">
                    <li>✓ Event Coordinator</li>
                    <li>✓ 24/7 Security</li>
                    <li>✓ Technical Support</li>
                    <li>✓ Concierge Service</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Module 3: Dynamic Space & Pricing Calculator */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Interactive Space & Pricing Calculator
          </h2>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Main Conference Hall</CardTitle>
              <p className="text-muted-foreground">
                Our flagship meeting space with floor-to-ceiling windows and natural lighting, 
                perfect for strategic planning and executive sessions.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {Object.entries(layoutCapacities).map(([layout, capacity]) => (
                  <Button
                    key={layout}
                    variant={selectedLayout === layout ? "default" : "outline"}
                    className="flex flex-col h-auto py-3"
                    onClick={() => setSelectedLayout(layout)}
                  >
                    <span className="capitalize font-medium">{layout}</span>
                    <span className="text-xs opacity-70">Max {capacity}</span>
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-background rounded-lg">
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-bantu-orange" />
                  <div className="font-semibold">Max Capacity</div>
                  <div className="text-2xl font-bold text-bantu-orange">
                    {layoutCapacities[selectedLayout as keyof typeof layoutCapacities]}
                  </div>
                </div>
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-bantu-orange" />
                  <div className="font-semibold">Half-Day Hire</div>
                  <div className="text-2xl font-bold text-bantu-orange">
                    R{layoutPricing['half-day'][selectedLayout as keyof typeof layoutPricing['half-day']].toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-bantu-orange" />
                  <div className="font-semibold">Full-Day Hire</div>
                  <div className="text-2xl font-bold text-bantu-orange">
                    R{layoutPricing['full-day'][selectedLayout as keyof typeof layoutPricing['full-day']].toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowIncludedModal(true)}
                >
                  <Info className="mr-2 h-4 w-4" />
                  What's Included?
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Module 4: Curated Experiences & Activities */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Curated Experiences & Activities
          </h2>
          
          <Tabs defaultValue="team-building" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="team-building">Team Building</TabsTrigger>
              <TabsTrigger value="wellness">Wellness</TabsTrigger>
              <TabsTrigger value="outdoor">Outdoor Adventures</TabsTrigger>
            </TabsList>
            
            <TabsContent value="team-building" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Strategic Planning Workshop</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Facilitated sessions designed to align your leadership team and create actionable strategic plans.</p>
                    <div className="mb-4">
                      <strong>Perfect For:</strong>
                      <ul className="list-disc list-inside text-sm mt-2">
                        <li>Quarterly planning sessions</li>
                        <li>Vision alignment workshops</li>
                        <li>Goal setting retreats</li>
                      </ul>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Duration: 4-8 hours</span>
                      <span>Group: 8-25 people</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Leadership Development Program</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Comprehensive leadership training with experiential learning and peer collaboration.</p>
                    <div className="mb-4">
                      <strong>Perfect For:</strong>
                      <ul className="list-disc list-inside text-sm mt-2">
                        <li>Executive development</li>
                        <li>Succession planning</li>
                        <li>Change management</li>
                      </ul>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Duration: 1-3 days</span>
                      <span>Group: 6-20 people</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="wellness" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mindfulness & Meditation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Guided meditation sessions to enhance focus and reduce stress for your team.</p>
                    <div className="mb-4">
                      <strong>Perfect For:</strong>
                      <ul className="list-disc list-inside text-sm mt-2">
                        <li>Stress reduction</li>
                        <li>Focus enhancement</li>
                        <li>Mental clarity</li>
                      </ul>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Duration: 1-2 hours</span>
                      <span>Group: 5-30 people</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="outdoor" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Nature Walk & Reflection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Guided nature walks combined with reflection exercises to inspire creative thinking.</p>
                    <div className="mb-4">
                      <strong>Perfect For:</strong>
                      <ul className="list-disc list-inside text-sm mt-2">
                        <li>Creative brainstorming</li>
                        <li>Problem solving</li>
                        <li>Team bonding</li>
                      </ul>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Duration: 2-3 hours</span>
                      <span>Group: 6-25 people</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Module 5: ESG Commitment */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            The Conscientious Choice
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="mr-2 h-5 w-5 text-green-600" />
                  Environmental
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Our commitment to sustainability extends beyond compliance to genuine environmental stewardship.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• 85% waste composted on-site</li>
                  <li>• Solar-powered conference facilities</li>
                  <li>• Locally-sourced organic catering</li>
                  <li>• Water conservation systems</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-600" />
                  Social
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  We actively contribute to local community development and fair employment practices.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• 70% local staff employment</li>
                  <li>• Skills development programs</li>
                  <li>• Community garden project</li>
                  <li>• Fair trade partnerships</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-purple-600" />
                  Governance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Transparent operations and ethical business practices guide all our decisions.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• B-Corp certified operations</li>
                  <li>• Transparent pricing policy</li>
                  <li>• Regular impact reporting</li>
                  <li>• Ethical supplier standards</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center space-x-8">
            <Badge variant="secondary" className="px-4 py-2">
              <Award className="mr-2 h-4 w-4" />
              Green Key Certified
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Leaf className="mr-2 h-4 w-4" />
              LEED Gold
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="mr-2 h-4 w-4" />
              B-Corp Certified
            </Badge>
          </div>
        </div>
      </section>

      {/* Module 6: Trust & Call-to-Action */}
      <section className="py-16 px-4 bg-bantu-orange text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            Ready to Transform Your Next Corporate Retreat?
          </h2>
          
          <div className="mb-12 max-w-4xl mx-auto">
            <blockquote className="text-xl italic mb-4">
              "The strategic planning session at {venue.name} was transformational for our leadership team. 
              The environment fostered the kind of deep thinking and collaboration that's impossible in our 
              usual office setting."
            </blockquote>
            <cite className="font-semibold">
              — Sarah Johnson, CEO, TechForward Solutions
            </cite>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">24-Hour Response</h3>
              <p className="text-sm opacity-90">Get your custom quotation within one business day</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Guaranteed Excellence</h3>
              <p className="text-sm opacity-90">100% satisfaction guarantee on all our services</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Expert Curation</h3>
              <p className="text-sm opacity-90">Hand-selected venues by retreat specialists</p>
            </div>
          </div>
          
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-bantu-orange hover:text-bantu-orange/90 font-semibold px-8 py-4 text-lg"
          >
            Get A Quotation - Response in 24 Hours
          </Button>
          
          <div className="mt-8 flex justify-center space-x-8 text-sm">
            <div className="flex items-center">
              <Phone className="mr-2 h-4 w-4" />
              {venue.contact.phone}
            </div>
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              {venue.contact.email}
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Modal */}
      <Dialog open={showIncludedModal} onOpenChange={setShowIncludedModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What's Included in Your Hire</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Standard Inclusions:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Professional AV setup and technical support</li>
                <li>• High-speed Wi-Fi throughout the venue</li>
                <li>• Climate control and natural lighting</li>
                <li>• Coffee, tea, and water stations</li>
                <li>• Flipchart stands and stationery</li>
                <li>• Dedicated event coordinator</li>
                <li>• Secure parking facilities</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Additional Services Available:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Catering packages (breakfast, lunch, dinner)</li>
                <li>• Team building activities</li>
                <li>• Professional photography</li>
                <li>• Transportation arrangements</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  if (isModal) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{venue.name}</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return content;
};

export default NewVenueDetail;