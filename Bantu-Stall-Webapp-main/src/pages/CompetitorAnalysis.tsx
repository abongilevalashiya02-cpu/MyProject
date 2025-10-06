
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const competitorData = [
  {
    platform: "Bantu Stall",
    focus: "Curated retreats blending business, wellness, culture, and networking",
    corporateRetreat: "✅ Yes – central offering",
    culturalImmersion: "✅ Yes – integrated into every retreat",
    wellness: "✅ Included selectively",
    speakerEvents: "✅ Golden Ticket & TEDx ecosystem",
    rewardSystem: "✅ Culture Tokens / Stamps",
    gigpreneurFocused: "✅ Core model"
  },
  {
    platform: "Retreats Africa",
    focus: "Wellness retreats (yoga, healing)",
    corporateRetreat: "❌ No",
    culturalImmersion: "⚠️ Some",
    wellness: "✅ Core offering",
    speakerEvents: "❌ No",
    rewardSystem: "❌ No",
    gigpreneurFocused: "❌ No"
  },
  {
    platform: "Timbuktu Travel",
    focus: "Custom luxury travel (including some retreats)",
    corporateRetreat: "⚠️ Occasionally",
    culturalImmersion: "⚠️ Tourist-style",
    wellness: "⚠️ Luxury wellness available",
    speakerEvents: "❌ No",
    rewardSystem: "❌ No",
    gigpreneurFocused: "❌ No"
  },
  {
    platform: "Africology",
    focus: "African-inspired spa & wellness",
    corporateRetreat: "❌ No",
    culturalImmersion: "✅ African-themed wellness",
    wellness: "✅ Main offering",
    speakerEvents: "❌ No",
    rewardSystem: "❌ No",
    gigpreneurFocused: "❌ No"
  },
  {
    platform: "Soul Traveller",
    focus: "Afro-spiritual & diasporic wellness retreats",
    corporateRetreat: "❌ No",
    culturalImmersion: "✅ Deep cultural/spiritual focus",
    wellness: "✅ Core theme",
    speakerEvents: "❌ No",
    rewardSystem: "❌ No",
    gigpreneurFocused: "❌ No"
  },
  {
    platform: "Airbnb Experiences",
    focus: "Gig-based local experiences (some usable for retreats)",
    corporateRetreat: "⚠️ Possible, not curated",
    culturalImmersion: "⚠️ Depends on host",
    wellness: "⚠️ Varies widely",
    speakerEvents: "❌ No",
    rewardSystem: "❌ No",
    gigpreneurFocused: "✅ Partially"
  },
  {
    platform: "Afristay/LekkeSlaap",
    focus: "Venue listings for events & retreats",
    corporateRetreat: "⚠️ Venue only",
    culturalImmersion: "⚠️ Venue-dependent",
    wellness: "❌ Not included",
    speakerEvents: "❌ No",
    rewardSystem: "❌ No",
    gigpreneurFocused: "❌ No"
  }
];

const getStatusBadge = (status: string) => {
  if (status.includes("✅")) {
    return <Badge className="bg-green-100 text-green-800 border-green-300">{status}</Badge>;
  } else if (status.includes("⚠️")) {
    return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">{status}</Badge>;
  } else if (status.includes("❌")) {
    return <Badge className="bg-red-100 text-red-800 border-red-300">{status}</Badge>;
  }
  return <Badge variant="outline">{status}</Badge>;
};

const CompetitorAnalysis = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-bantu-orange to-bantu-yellow">
          <div className="container mx-auto px-6">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Competitor Analysis
              </h1>
              <p className="text-xl max-w-3xl mx-auto">
                Understanding the African retreat and travel landscape to position Bantu Stall strategically
              </p>
            </div>
          </div>
        </section>

        {/* Analysis Overview */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-6 text-center">Market Position Analysis</h2>
              <p className="text-lg text-gray-600 text-center mb-8">
                Comprehensive comparison of African retreat platforms highlighting Bantu Stall's unique value proposition
              </p>
            </div>

            {/* Key Insights Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="text-bantu-orange">Unique Positioning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Bantu Stall is the only platform focusing specifically on corporate retreats with integrated cultural immersion and speaker opportunities.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-bantu-orange">Innovation Leader</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our Culture Tokens reward system and Golden Ticket ecosystem are unmatched in the African retreat space.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-bantu-orange">Gigpreneur Focus</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Core gigpreneur model differentiates us from traditional travel agencies and venue listing platforms.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Competition Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>African Retreat Platforms Comparison Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold">Platform</TableHead>
                        <TableHead className="font-bold">Focus</TableHead>
                        <TableHead className="font-bold">Corporate/Team Retreats</TableHead>
                        <TableHead className="font-bold">Cultural Immersion</TableHead>
                        <TableHead className="font-bold">Wellness & Mindfulness</TableHead>
                        <TableHead className="font-bold">Speaker & Event Opportunities</TableHead>
                        <TableHead className="font-bold">Reward System</TableHead>
                        <TableHead className="font-bold">Gigpreneur-Focused</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {competitorData.map((competitor, index) => (
                        <TableRow key={index} className={competitor.platform === "Bantu Stall" ? "bg-bantu-orange/5" : ""}>
                          <TableCell className="font-medium">
                            {competitor.platform === "Bantu Stall" ? (
                              <Badge className="bg-bantu-orange text-white">{competitor.platform}</Badge>
                            ) : (
                              competitor.platform
                            )}
                          </TableCell>
                          <TableCell className="max-w-xs">{competitor.focus}</TableCell>
                          <TableCell>{getStatusBadge(competitor.corporateRetreat)}</TableCell>
                          <TableCell>{getStatusBadge(competitor.culturalImmersion)}</TableCell>
                          <TableCell>{getStatusBadge(competitor.wellness)}</TableCell>
                          <TableCell>{getStatusBadge(competitor.speakerEvents)}</TableCell>
                          <TableCell>{getStatusBadge(competitor.rewardSystem)}</TableCell>
                          <TableCell>{getStatusBadge(competitor.gigpreneurFocused)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Competitive Advantages */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6 text-center">Bantu Stall's Competitive Advantages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-bantu-orange">Market Gap Leadership</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Only platform specifically targeting corporate retreats in Africa</li>
                      <li>• Unique blend of business, wellness, and cultural immersion</li>
                      <li>• TEDx ecosystem integration for thought leadership</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-bantu-orange">Innovation & Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Culture Tokens gamification system</li>
                      <li>• Golden Ticket speaker opportunities</li>
                      <li>• Gigpreneur empowerment model</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CompetitorAnalysis;
