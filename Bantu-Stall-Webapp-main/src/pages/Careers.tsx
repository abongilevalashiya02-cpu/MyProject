import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Heart, Globe, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const jobListings = [
  {
    id: 1,
    title: 'Travel Experience Designer',
    department: 'Product',
    location: 'Cape Town, South Africa',
    type: 'Full-time',
    description: 'Design and curate unique African travel experiences that connect travelers with authentic local cultures.',
    requirements: ['3+ years in travel industry', 'Experience with African destinations', 'Creative storytelling skills'],
  },
  {
    id: 2,
    title: 'Community Partnership Manager',
    department: 'Partnerships',
    location: 'Remote (Africa)',
    type: 'Full-time',
    description: 'Build and maintain relationships with local communities, service providers, and cultural partners across Africa.',
    requirements: ['5+ years partnership management', 'Multilingual (French/Portuguese preferred)', 'Cross-cultural communication'],
  },
  {
    id: 3,
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Johannesburg or Remote',
    type: 'Full-time',
    description: 'Build beautiful, responsive web applications that showcase African destinations and facilitate bookings.',
    requirements: ['React/TypeScript expertise', 'UI/UX design skills', '3+ years web development'],
  },
  {
    id: 4,
    title: 'Content Creator (Freelance)',
    department: 'Marketing',
    location: 'Various African locations',
    type: 'Contract',
    description: 'Create compelling visual and written content showcasing African travel experiences.',
    requirements: ['Photography/videography skills', 'Travel experience in Africa', 'Social media expertise'],
  },
];

const benefits = [
  {
    icon: Globe,
    title: 'Travel Opportunities',
    description: 'Experience African destinations firsthand as part of your role',
  },
  {
    icon: Users,
    title: 'Diverse Team',
    description: 'Work with colleagues from across the African continent',
  },
  {
    icon: Heart,
    title: 'Purpose-Driven',
    description: 'Make a positive impact on local communities through tourism',
  },
  {
    icon: Award,
    title: 'Growth & Learning',
    description: 'Continuous learning opportunities and career development',
  },
];

const Careers = () => {
  return (
    <>
      <Helmet>
        <title>Careers - Join Our Team | Bantu Stall</title>
        <meta name="description" content="Join Bantu Stall and help connect travelers with authentic African experiences. Explore career opportunities in travel, technology, and community partnerships." />
        <meta name="keywords" content="careers, jobs, African travel, remote work, travel industry, Bantu Stall jobs" />
      </Helmet>

      <Navbar compact />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted pt-16">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Join Our Mission</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Help us connect travelers with authentic African experiences while empowering local communities 
              and preserving cultural heritage across the continent.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                50+ Team Members
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                15+ Countries
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                Remote-First Culture
              </span>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Why Work With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <benefit.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Job Listings */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Open Positions</h2>
            <div className="space-y-6">
              {jobListings.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.type}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{job.department}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{job.description}</p>
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Key Requirements:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <Button asChild>
                      <Link to="/contact">Apply Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Company Culture */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Our Culture</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Remote-First, Africa-Focused</h3>
                  <p className="text-muted-foreground">
                    We believe in the power of distributed teams to bring diverse perspectives 
                    and deep local knowledge to our mission of showcasing Africa's beauty and diversity.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Community Impact</h3>
                  <p className="text-muted-foreground">
                    Every role at Bantu Stall contributes to empowering local communities through 
                    sustainable tourism that preserves culture while creating economic opportunities.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Continuous Learning</h3>
                  <p className="text-muted-foreground">
                    We invest in our team's growth through travel experiences, cultural exchanges, 
                    and professional development opportunities.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Innovation & Excellence</h3>
                  <p className="text-muted-foreground">
                    We encourage creative thinking and innovative approaches to solving challenges 
                    in the travel and tourism industry.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Process */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Application Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    1
                  </div>
                  <h4 className="font-medium">Apply</h4>
                  <p className="text-sm text-muted-foreground">Submit your application through our contact form</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    2
                  </div>
                  <h4 className="font-medium">Review</h4>
                  <p className="text-sm text-muted-foreground">We'll review your application within 1 week</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    3
                  </div>
                  <h4 className="font-medium">Interview</h4>
                  <p className="text-sm text-muted-foreground">Virtual interviews with team members</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    4
                  </div>
                  <h4 className="font-medium">Welcome</h4>
                  <p className="text-sm text-muted-foreground">Join our mission to showcase Africa</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Careers;